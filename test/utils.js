
/** 
 * Test utility tools
 */

var path    = require('path');
var fs      = require('fs-extra');

var containerDir = path.resolve(__dirname, './container');

module.exports = {

    createContainer: function(callback) {
        fs.ensureDir(containerDir, function(err) {
            if (err) { throw err; }
            process.chdir(containerDir);
            return callback();
        });
    },

    createFile: function(filePath, content) {
        return fs.outputFileSync(path.resolve(containerDir, filePath), content);
    },

    clearContainer: function(callback) {
        process.chdir(__dirname);
        fs.remove(containerDir, function(err) {
            if (err) { throw err; }
            return callback();
        });
    }

};