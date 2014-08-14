
/**
 * Parser utility for @situs-* syntax
 */
var fs 			= require('fs');
var path        = require('path');
var jsonlint 	= require('json-lint');
var print 		= require('./print.js');

module.exports = {
    stripData: stripData,
    insertString: insertString,
	includeFile: includeFile,
	getData: getData
};


/**
 * Strip all @situs-data syntax on string
 */
function stripData(string) {
    var regex = new RegExp(/\@situs\-data\(([\s\S]*?)\)\n?/g);
    return string.replace(regex, '');
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
 * Parse @situs-include on a string
 */
function includeFile(filePath, string, callback) {

    var regex       = new RegExp(/\@situs\-include\(([\s\S]*?)\)/g);
    var capture     = regex.exec(string);

    if (!capture) {
        return callback(null, string);
    }

    // Check include file
    var includePath = path.resolve(path.dirname(filePath), capture[1]);

    if (!fs.existsSync(includePath)) {
        return callback(
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
        return includeFile(filePath, string, callback);
    }
    
    return callback(null, string);
}

/**
 * Parse @situs-data and return the data object
 */
function getData(string, callback) {

    var defaultData = {content: {}, error: null};
    var regex       = new RegExp(/\@situs\-data\(([\s\S]*?)\)/g);
    var capture     = regex.exec(string);

    if (!capture) {
        return callback(null, {});
    }

    // Check situs-data json format
    var lint = jsonlint(capture[1], {comments:false});

    if (lint.error) {
        return callback(lint.error, {});
    }

    return callback(null, JSON.parse(capture[1]));
}