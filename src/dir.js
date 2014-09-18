
/**
 * Directory Utility Module
 */

var path 	= require('path');
var lodash 	= require('lodash');
var glob 	= require('glob-all');
var fs      = require('fs-extra');

module.exports = {
	fileList:fileList,
	clean: clean
};

/**
 * Get file list based on source directory and ignore list
 */
function fileList(sourceDir, ignoreList, callback) {

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
function clean(dirPath) {

    var files = glob.sync(['**/*'], {
        cwd: dirPath,
    });

    lodash.forEach(files, function(file) {

        var filePath = path.resolve(dirPath, file);

        if (fs.existsSync(filePath)) {
            fs.removeSync(filePath);
        }

    });

}