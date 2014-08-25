
/**
 * Test for Configuration module
 */

var path    = require('path');
var assert  = require('assert');
var utils   = require('./utils.js');

var config  = require('../src/config.js');

describe('Config Module: ', function() {

    beforeEach(function(done) {

        // Clear situs global
        delete process.env.SITUS;

        utils.createContainer(function() {
            return done();
        });
    });

    afterEach(function(done) {

        // Clear situs global
        delete process.env.SITUS;

        utils.clearContainer(function() {
            return done();
        });
    });

    describe('config.read() test', function() {

        it('should return default configuration if situs.json is not exist', function(done) {
            
            var filePath = path.resolve(process.cwd(), './situs.json');

            var defaultConfig = {
                'source': './',
                'destination': './situs',
                'ignore': [
                    'node_modules/**/*',
                    'situs.json',
                    'situs/**/*'
                ],
                'markdown': false,
                'port': 4000,
                'noConfig': true,
                'global': {}
            };

            config.read(filePath, function(err) {
                assert.equal(err, undefined);
                assert.deepEqual(process.env.SITUS, JSON.stringify(defaultConfig));
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
                'ignore': [
                    'node_modules/**/*',
                ],
                'markdown': false,
                'port': 8080,
                'noConfig': false,
                'global': {}
            };

            utils.createFile('./situs.json', JSON.stringify(configData));

            var filePath = path.resolve(process.cwd(), './situs.json');

            config.read(filePath, function(err) {

                configData.ignore.push('_docs/**/*');
                configData.ignore.push('situs.json');

                assert.equal(err, undefined);
                assert.deepEqual(process.env.SITUS, JSON.stringify(configData));

                done();
            });
        });

    });

    describe('config.get() test', function() {

        it('should return null if process.env.SITUS is not exist', function() {

            assert.equal(null, config.get('source'));

        });

        it('should return false if parameter is not exist', function() {

            process.env.SITUS = JSON.stringify({destination: './situs'});
            assert.equal(false, config.get('source'));

        });

        it('should return correct value if parameter exist', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});
            assert.equal('./situs', config.get('source'));

        });

    });

});