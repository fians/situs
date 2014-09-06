
/**
 * Compiler utility
 */

var fs          = require('fs-extra');
var path        = require('path');
var lodash      = require('lodash');
var async       = require('async');
var marked      = require('marked');

var config      = require('./config.js');
var handlebars  = require('./handlebars.js');
var parser      = require('./parser.js');
var print       = require('./print.js');
var dir         = require('./dir.js');

module.exports = {
    build: build,
    getFileList: getFileList
};

/**
 * Building static site
 */
function build(callback) {
    
    // Clean destination directory
    dir.clean(path.resolve(process.cwd(), config.get('destination')));
    
    dir.fileList(config.get('source'), config.get('ignore'), function(files) {
        
        async.each(files, function(file, callback) {
            render(file, function(err) {
                return callback(err);
            });
        }, function(err) {
            return callback(err);
        });

    });

}

/**
 * Process file by parse all @situs syntax,
 * render data, and save file to compiled directory
 */
function render(file, callback) {
    
    // Get full path dan file content
    var filePath    = path.resolve(process.cwd(), config.get('source')+'/'+file);
    var fileExt     = path.extname(filePath).toLowerCase();

    // Detect markdown file
    var markdownExt = ['.markdown', '.mdown', '.mkdn', '.mkd', '.md'];

    fs.readFile(filePath, {encoding: 'utf8'}, function(err, string) {
        
        if (err) {
            return callback(err);
        }

        // Check ignore files
        if (string.indexOf('@situs-ignore()') !== -1) {
            return callback();
        }

        // Parse @situs-data()
        var localData = parser.getData(string);
                
        // If error found
        if (err) {
            return callback('@situs-data syntax error:\n' + err + '\n at ' + filePath);
        }

        // Strip all @situs-data from string
        string = parser.stripData(string);

        /**
         * Parse markdown file
         */
        if (config.get('markdown') && (markdownExt.indexOf(fileExt) !== -1)) {

            // Convert string
            string = marked(string, {sanitize: false});
        }

        // Parse @situs-include()
        parser.includeFile(filePath, string, function(err, string) {
            
            if (err) {
                return callback(err);
            }

            // Render data
            var templateData = lodash.extend(config.get('global'), localData.content);
            
            try {
                var template = handlebars.compile(string);
                string = template(templateData);
            } catch(e) {
                return callback(e+'\nat '+filePath);
            }

            /**
             * Convert to html file
             */
            if (config.get('markdown') && (markdownExt.indexOf(fileExt) !== -1)) {
                file = path.basename(file, fileExt) + '.html';
            }

            /**
             * Convert file to permalinks if allowed
             */
            if (
                config.get('permalink') && 
                path.extname(file) === '.html' && 
                file.indexOf('index.html') === -1
            ) {
                file = file.replace('.html', '') + '/index.html';
            }

            // Save file
            var savePath = path.resolve(
                process.cwd(), 
                (config.get('destination')+'/'+file)
            );

            fs.outputFile(savePath, string, function(err) {
                if (err) {
                    return callback(err);
                }

                return callback();
            });

        });

    });

}