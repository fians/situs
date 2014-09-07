
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
                'permalink': false,
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
                'permalink': false,
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

    describe('config.data() test', function() {

        it('should return null if process.env.SITUS is not exist', function() {

            assert.equal(null, config.data('source'));

        });

        it('should return false if key is not exist', function() {

            process.env.SITUS = JSON.stringify({destination: './situs'});
            assert.equal(false, config.data('source'));

        });

        it('should return correct value if key exist', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});
            assert.equal('./situs', config.data('source'));

        });

        it('should set new config data if value exist', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});
            config.data('source', './new-situs');
            assert.equal('./new-situs', config.data('source'));

        });

    });

    describe('config.parseOption() test', function() {

        it('should not overide config if key not valid', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});

            config.parseOption({hello: 'world'});

            assert.equal(false, config.data('hello'));

        });

        it('should overide config string value', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});

            config.parseOption({source: './situs-new'});

            assert.equal('./situs-new', config.data('source'));
            
        });

        it('should overide config boolean value', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});

            config.parseOption({markdown: true});

            assert.equal(true, config.data('markdown'));

        });

        it('should overide config array value (ignore-list)', function() {

            process.env.SITUS = JSON.stringify({source: './situs'});

            config.parseOption({'ignore': '"./hello","./world"'});

            assert.deepEqual(config.data('ignore'), [
                './hello',
                './world'
            ]);

        });
    });

});