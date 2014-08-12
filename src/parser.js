
/**
 * Parser utility for @situs-* syntax
 */
var fs 			= require('fs');
var path        = require('path');
var jsonlint 	= require('json-lint');
var print 		= require('./print.js');

module.exports = {
	include: include,
	insertString: insertString,
	data: data,
	stripData: stripData,
};

/**
 * Parse @situs-include on a string
 */
function include(filePath, string) {

    var regex       = new RegExp(/\@situs\-include\(([\s\S]*?)\)/g);
    var capture     = regex.exec(string);

    // Check include file
    var includePath = path.resolve(path.dirname(filePath), capture[1]);

    if (!fs.existsSync(includePath)) {
        return print.error(
            '@situs-include error:\n' +
            capture[1]+' is not exist' +
            '\n' +
            'at ' + filePath
        );
    }

    // Remove current @situs-include
    string = 
        string.slice(0, capture.index) + 
        string.slice(capture.index + capture[0].length);

    // Get file content
    var includeString = fs.readFileSync(includePath, {encoding: 'utf8'});

    // Remove @situs-ignore
    includeString = includeString
                    .replace('@situs-ignore()\n', '')
                    .replace('@situs-ignore()', '');

    // Insert file
    string = insertString(string, includeString, capture.index);

    // Recursive to find another @site-include
    if (string.match(regex)) {
        return include(filePath, string);
    }
    
    return string;
}

/**
 * Insert a string based on its character index
 */
function insertString(mainString, insertedString, index) {
    return [
        mainString.slice(0, index), 
        insertedString, 
        mainString.slice(index)
    ].join('');
}

/**
 * Parse @situs-data and return the data object
 */
function data(string) {

    var defaultData = {content: {}, error: null};
    var regex       = new RegExp(/\@situs\-data\(([\s\S]*?)\)/g);
    var capture     = regex.exec(string);

    if (!capture) {
        return defaultData;
    }

    // Check situs-data json format
    var lint = jsonlint(capture[1], {comments:false});

    if (lint.error) {
        defaultData.error = lint.error;
        return defaultData;
    }

    defaultData.content = JSON.parse(capture[1]);
    return defaultData;
}

/**
 * Strip all @situs-data syntax on string
 */
function stripData(string) {
    var regex = new RegExp(/\@situs\-data\(([\s\S]*?)\)\n?/g);
    return string.replace(regex, '');
}