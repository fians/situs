
/**
 * Configuration module
 */
var path        = require('path');
var fs          = require('fs');
var lodash      = require('lodash');
var jsonlint    = require('json-lint');

var print       = require('./print.js');

module.exports = {
    read: read,
    data: data
};

function read(filePath, callback) {

    var defaultConfig = {
        'source': './',
        'destination': './situs',
        'ignore': [
            'node_modules/**/*',
            'situs.json'
        ],
        'markdown': false,
        'permalink': false,
        'port': 4000,
        'noConfig': false,
        'global': {}
    };

    fs.exists(filePath, function (exists) {

        if (!exists) {

            // Add compiled dir in ignore list
            defaultConfig.ignore.push('situs/**/*');
            defaultConfig.noConfig = true;

            // Set environment
            process.env.SITUS = JSON.stringify(defaultConfig);

            return callback();
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

            var obj = lodash.extend({}, defaultConfig, JSON.parse(data));

            // Merge ignore list
            obj.ignore.push(path.normalize(obj.destination)+'/**/*');
            obj.ignore = lodash.union(obj.ignore, defaultConfig.ignore);

            // Set environment
            process.env.SITUS = JSON.stringify(obj);

            return callback();
        });

    });
}


/**
 * Utility to get or set configuration data
 */
function data(key, value) {

    if (!process.env.hasOwnProperty('SITUS')) {
        return null;
    }

    var config = JSON.parse(process.env.SITUS);

    // If there is no value being set
    // return current config value
    if (value === undefined) {

        if (!(config.hasOwnProperty(key))) {
            return false;
        }

        return config[key];

    }

    // Overwrite new data
    config[key] = value;
    process.env.SITUS = JSON.stringify(config);

}