
/**
 * Configuration module
 */
var fs = require('fs');
var lodash = require('lodash');
var jsonlint = require('json-lint');

module.exports = {
	read: read
};

var defaultConfig = {
	'source_dir': './',
	'compiled_dir': './@situs',
	'ignore': [
		'node_modules/**/*',
		'[@]situs/**/*'
	],
	'global': {}
};

function read(path, callback) {

	fs.exists(path, function (exists) {

		if (!exists) {
			return callback(null, defaultConfig);
		}

		fs.readFile(path, 'utf8', function (error, data) {

			if (error) {
				return callback(error);
			}

			var lint = jsonlint(data, {comments:false});

			if (lint.error) {
				var error = 'Syntax error on situs.json:'+lint.line+'.\n'+lint.error;
				return callback(error);
			}

			var obj = lodash.extend(defaultConfig, JSON.parse(data));

			return callback(null, obj);
		});

	});
}