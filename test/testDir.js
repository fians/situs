
/**
 * Test for directory utility module
 */

var lodash  = require('lodash');
var path    = require('path');
var fs      = require('fs-extra');
var assert  = require('assert');
var utils   = require('./utils.js');

var dir = require('../src/dir.js');


/**
 * Test directory structure
 * /container
 *   - zero.html
 *   - three.html
 *   /level-1
 *     - one.html
 *     /level-2
 *       - two.html
 */
function createFiles() {
    // Create fake directory and files
    var listFile = [
        './zero.html',
        './three.html',
        './level-1/one.html',
        './level-1/level-2/two.html'
    ];

    lodash.forEach(listFile, function(file) {
        utils.createFile(file, 'test');
    });
}

describe('Compiler Module:', function() {

    beforeEach(function(done) {
        utils.createContainer(function() {
            return done();
        });
    });

    afterEach(function(done) {
        utils.clearContainer(function() {
            return done();
        });
    });

    describe('fileList() test', function() {

        it('should return list of file based on source dir', function(done) {

            createFiles();

            dir.fileList('./', [], function(files) {
                assert.deepEqual(files, [
                    'level-1/level-2/two.html',
                    'level-1/one.html',
                    'three.html',
                    'zero.html'
                ]);
                done();
            });

        });

        it('should return list of file based on source dir and also ignore list', function(done) {

            createFiles();

            dir.fileList('./', ['./level-1/**/*'], function(files) {
                assert.deepEqual(files, [
                    'three.html',
                    'zero.html'
                ]);
                done();
            });

        });

    });

    describe('clean() test', function() {

        it('should be clean all files inside the folder', function() {

            createFiles();
            var dirPath = process.cwd();

            dir.clean(dirPath);
            
            assert.deepEqual([], fs.readdirSync(dirPath));
        });

    });

});