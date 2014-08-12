
/**
 * Configuration module
 */
var path        = require('path');
var fs          = require('fs');
var lodash      = require('lodash');
var jsonlint    = require('json-lint');

module.exports = {
    read: read
};

var defaultConfig = {
    'source_dir': './',
    'compiled_dir': './situs',
    'ignore': [
        'node_modules/**/*'
    ],
    'global': {}
};

function read(filePath, callback) {

    fs.exists(filePath, function (exists) {

        if (!exists) {
            // Add compiled dir in ignore list
            defaultConfig.ignore.push('!situs/**/*');

            return callback(null, defaultConfig);
        }

        fs.readFile(filePath, 'utf8', function (error, data) {

            if (error) {
                return callback(error);
            }

            var lint = jsonlint(data, {comments:false});

            if (lint.error) {
                error = 'Syntax error on situs.json:'+lint.line+'.\n'+lint.error;
                return callback(error);
            }

            var obj = lodash.extend(defaultConfig, JSON.parse(data));

            // Add compiled dir in ignore list
            obj.ignore.push('!'+path.normalize(obj.compiled_dir)+'/**/*');

            return callback(null, obj);
        });

    });
}