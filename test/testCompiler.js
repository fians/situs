
/**
 * Test for compiler module
 */

var lodash  = require('lodash');
var path    = require('path');
var assert  = require('assert');
var utils   = require('./utils.js');

var compiler = require('../src/compiler.js');


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

describe('Compiler Module:', function() {

    beforeEach(function(done) {
        utils.createContainer(function() {

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

            return done();
        });
    });

    afterEach(function(done) {
        utils.clearContainer(function() {
            return done();
        });
    });

    describe('getFileList() test', function() {

        it('should return list of file based on source dir', function(done) {

            compiler.getFileList('./', [], function(files) {
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

            compiler.getFileList('./', ['./level-1/**/*'], function(files) {
                assert.deepEqual(files, [
                    'three.html',
                    'zero.html'
                ]);
                done();
            });

        });

    });

});