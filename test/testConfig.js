
/**
 * Test for Configuration module
 */

var path    = require('path');
var assert  = require('assert');
var utils   = require('./utils.js');

var config  = require('../src/config.js');

describe('Config Module: ', function() {

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

    describe('config.read() test', function() {

        it('should return default configuration if situs.json is not exist', function(done) {
            
            var filePath = path.resolve(process.cwd(), './situs.json');

            config.read(filePath, function(err, data) {

                assert.equal(err, null);
                assert.deepEqual(data, {
                    'source': './',
                    'destination': './situs',
                    'port': 4000,
                    'noConfig': true,
                    'ignore': [
                        'node_modules/**/*',
                        'situs/**/*'
                    ],
                    'global': {}
                });

                done();
            });

        });

        it('should return error if situs.json syntax is wrong', function(done) {

            utils.createFile('./situs.json', '{{');

            var filePath = path.resolve(process.cwd(), './situs.json');

            config.read(filePath, function(err, data) {
                assert.notEqual(err, null);
                done();
            });
        });

        it('should return config object if situs.json successfully parsed', function(done) {

            var configData = {
                'source': './',
                'destination': './_docs',
                'port': 8080,
                'noConfig': false,
                'ignore': [
                    'node_modules/**/*'
                ],
                'global': {}
            };

            utils.createFile('./situs.json', JSON.stringify(configData));

            var filePath = path.resolve(process.cwd(), './situs.json');

            config.read(filePath, function(err, data) {

                configData.ignore.push('!_docs/**/*');

                assert.equal(err, null);
                assert.deepEqual(data, configData);

                done();
            });
        });

    });

});