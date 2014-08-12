
/**
 * Compiler utility
 */

var colors      = require('colors');
var fs          = require('fs-extra');
var path        = require('path');
var glob        = require('glob-all');
var lodash      = require('lodash');
var handlebars  = require('handlebars');
var async       = require('async');
var mkdirp      = require('mkdirp');

var config      = require('./config.js');
var parser      = require('./parser.js');
var print       = require('./print.js');

module.exports = {
    build: build
};

/**
 * Build site
 */
function build(callback) {

    var configFile = process.cwd()+'/situs.json';

    config.read(configFile, function(error, data) {

        if (error) {
            return printError(error);
        }

        getFileList(data['source_dir'], data['ignore'], function(files) {

            async.each(files, function(file, callback) {
                render(data, file, function(err) {
                    return callback(err);
                });
            }, function(err) {

                if (err) {
                    print.error(error);
                }

                console.log('build success');
            });

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
        patterns.push('!'+item);
    });

    // Glob the files
    var files = glob.sync(patterns, {
        cwd: path.resolve(process.cwd(), sourceDir),
    });

    // Filter file only
    files = lodash.filter(files, function(item) {
        var filePath = path.resolve(process.cwd(), item);
        return fs.lstatSync(filePath).isFile();
    });

    return callback(files);
}

/**
 * Process file by parse all @situs syntax,
 * render data, and save file to compiled directory
 */
function render(data, file, callback) {

    // Get full path dan file content
    var filePath = path.resolve(process.cwd(), file);

    fs.readFile(filePath, {encoding: 'utf8'}, function(err, string) {

        if (err) {
            return print.error(err);
        }

        // Check ignore files
        if (string.indexOf('@situs-ignore()') !== -1) {
            return callback();
        }

        // Parse @situs-include()
        string = parser.include(filePath, string);

        // Parse @situs-data()
        var localData = parser.data(string);

        // If error found
        if (localData.error) {
            return print.error(
                '@situs-data syntax error:\n' +
                localData.error +
                '\n' +
                'at ' + filePath
            );
        }

        // Render data
        var templateData = lodash.extend(data.global, localData.content);

        var template = handlebars.compile(string);
        string = template(templateData);

        // Strip all @situs-data from string
        string = parser.stripData(string);

        // Save file
        var savePath = path.resolve(
            process.cwd(), 
            (data['compiled_dir']+'/'+file)
        );

        fs.outputFile(savePath, string, function(err) {
            if (err) {
                return print.error(err);
            }

            return callback();
        });

    });

}