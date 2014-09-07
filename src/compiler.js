
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
    build: build
};

/**
 * Building static site
 */
function build(callback) {
    
    // Clean destination directory
    dir.clean(path.resolve(process.cwd(), config.data('destination')));
    
    dir.fileList(config.data('source'), config.data('ignore'), function(files) {
        
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
    var filePath    = path.resolve(process.cwd(), config.data('source')+'/'+file);
    
    // Prevent parse file other than html and markdown
    if (!parser.isHtml(filePath) && !parser.isMarkdown(filePath)) {
        
        var destPath = path.resolve(process.cwd(), config.data('destination')+'/'+file);
        
        return fs.copy(filePath, destPath, function(err) {
            callback(err);
        });
    }

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
        if (config.data('markdown') && parser.isMarkdown(filePath)) {

            // Convert string
            string = marked(string, {sanitize: false});
        }

        // Parse @situs-include()
        parser.includeFile(filePath, string, function(err, string) {
            
            if (err) {
                return callback(err);
            }

            // Render data
            var templateData = lodash.extend(config.data('global'), localData.content);
            
            try {
                var template = handlebars.compile(string);
                string = template(templateData);
            } catch(e) {
                return callback(e+'\nat '+filePath);
            }

            /**
             * Convert to html file
             */
            if (config.data('markdown') && parser.isMarkdown(filePath)) {
                var fileExt = path.extname(filePath).toLowerCase();
                file = path.basename(file, fileExt) + '.html';
            }

            /**
             * Convert file to permalinks if allowed
             */
            if (
                config.data('permalink') && 
                parser.isHtml(filePath) && 
                file.indexOf('index.html') === -1
            ) {
                file = file.replace('.html', '') + '/index.html';
            }

            // Save file
            var savePath = path.resolve(
                process.cwd(), 
                (config.data('destination')+'/'+file)
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