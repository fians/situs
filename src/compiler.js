
/**
 * Compiler utility
 */

var colors      = require('colors');
var fs          = require('fs-extra');
var path        = require('path');
var glob        = require('glob-all');
var lodash      = require('lodash');
var async       = require('async');
var marked      = require('marked');

var config      = require('./config.js');
var handlebars  = require('./handlebars.js');
var parser      = require('./parser.js');
var print       = require('./print.js');

module.exports = {
    generate: generate,
    build: build,
    getFileList: getFileList
};

/**
 * Build site (main function)
 */
function generate() {

    var configFile = path.resolve(process.cwd(), './situs.json');

    config.read(configFile, function(error, data) {

        if (error) {
            return print.errorBuild(error);
        }

        if (data.noConfig) {
            print.noConfigJson();
        }

        build(data, function(err) {

            if (err) {
                return print.errorBuild(error);
            }

            return print.successBuild();
        });

    });

}

/**
 * Building static site
 */
function build(data, callback) {
    
    // Clean destination directory
    cleanDirectory(path.resolve(process.cwd(), data.destination));
    
    getFileList(data.source, data.ignore, function(files) {
        
        async.each(files, function(file, callback) {
            render(data, file, function(err) {
                return callback(err);
            });
        }, function(err) {
            return callback(err);
        });

    });

}

/**
 * Get file list based on source directory and ignore list
 */
function getFileList(sourceDir, ignoreList, callback) {

    // Set pattern
    var patterns = ['**/*.*'];

    lodash.forEach(ignoreList, function(item) {
        patterns.push('!'+path.normalize(item));
    });

    // Glob the files
    var files = glob.sync(patterns, {
        cwd: path.resolve(process.cwd(), sourceDir),
    });

    // Filter file only
    files = lodash.filter(files, function(item) {
        var filePath = path.resolve(process.cwd(), sourceDir+'/'+item);

        if (!fs.existsSync(filePath)) {
            return false;
        }

        return fs.lstatSync(filePath).isFile();
    });

    return callback(files);
}

/**
 * Clean all files in directory
 */
function cleanDirectory(dirPath) {

    var files = glob.sync(['**/*'], {
        cwd: dirPath,
    });

    lodash.forEach(files, function(file) {
        fs.removeSync(path.resolve(dirPath, file));
    });

}

/**
 * Process file by parse all @situs syntax,
 * render data, and save file to compiled directory
 */
function render(data, file, callback) {
    
    // Get full path dan file content
    var filePath    = path.resolve(process.cwd(), data.source+'/'+file);
    var fileExt     = path.extname(filePath).toLowerCase();

    // Detect markdown file
    var isMarkdown  = false;
    var markdownExt = ['markdown', 'mdown', 'mkdn', 'mkd', 'md'];

    if (markdownExt.indexOf(fileExt) !== -1) {
        isMarkdown = true;
    }

    fs.readFile(filePath, {encoding: 'utf8'}, function(err, string) {
        
        if (err) {
            return callback(err);
        }

        // Check ignore files
        if (string.indexOf('@situs-ignore()') !== -1) {
            return callback();
        }

        // Parse @situs-include()
        parser.includeFile(filePath, string, function(err, string) {
            
            if (err) {
                return callback(err);
            }

            // Parse @situs-data()
            parser.getData(string, function(err, localData) {
                
                // If error found
                if (err) {
                    return callback('@situs-data syntax error:\n' + err + '\n at ' + filePath);
                }

                // Render data
                var templateData = lodash.extend(data.global, localData.content);

                try {
                    var template = handlebars.compile(string);
                    string = template(templateData);
                } catch(e) {
                    return callback(e+'\nat '+filePath);
                }

                // Strip all @situs-data from string
                string = parser.stripData(string);
                
                /**
                 * Parse markdown file
                 */
                if (data.markdown && isMarkdown) {

                    // Convert string
                    string = marked(string, {sanitize: false});

                    // Convert to html file
                    file = path.basename(file, fileExt) + '.html';

                }

                // Save file
                var savePath = path.resolve(
                    process.cwd(), 
                    (data.destination+'/'+file)
                );

                fs.outputFile(savePath, string, function(err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback();
                });

            });

        });

    });

}