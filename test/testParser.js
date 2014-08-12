
/**
 * Test for Parser module
 */

var assert  = require('assert');
var utils   = require('./utils.js');

var parser  = require('../src/parser.js');

describe('Parser module:', function() {

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

    describe('stripData() test', function() {

        it ('should remove @situs-data from string', function() {

            var string = 'hello @situs-data({"hello": "world"})';
            assert.equal('hello ', parser.stripData(string));

        });

    });

    describe('insertString() test', function() {

        it('should insert string in a string', function() {

            var string = 'hello world';
            assert.equal('hello my awesome world', parser.insertString(string, ' my awesome', 5));

        });

    });

    describe('include() test', function() {

        it('should return error if included file not found', function(done) {

            var string = '@situs-include(./header.html)';

            utils.createFile('./index.html', string);

            parser.includeFile('./index.html', string, function(err, string) {
                assert.notEqual(err, null);
                done();
            });

        });

        it('should return a string for include single file', function(done) {

            var string = '@situs-include(./header.html)';

            utils.createFile('./header.html', '<head></head>');
            utils.createFile('./index.html', string);

            parser.includeFile('./index.html', string, function(err, string) {
                assert.equal(err, null);
                assert.equal(string, '<head></head>');
                done();
            });

        });

        it('should return a string for include multiple file (recursive)', function(done) {

            var string = '@situs-include(./header.html) @situs-include(./header.html)';

            utils.createFile('./header.html', '<head></head>');
            utils.createFile('./index.html', string);

            parser.includeFile('./index.html', string, function(err, string) {
                assert.equal(err, null);
                assert.equal(string, '<head></head> <head></head>');
                done();
            });

        });

    });

    describe('data() test', function() {

        it('should return empty data if @situs-data() not found', function(done) {

            var string = 'hello world';

            parser.getData(string, function(err, result) {
                assert.equal(err, null);
                assert.deepEqual(result, {});
                done();
            });

        });

        it('should return error if @situs-data is not well formatted', function(done) {
            
            var string = 'hello world @situs-data({"hello": )';

            parser.getData(string, function(err, result) {
                assert.notEqual(err, null);
                assert.deepEqual(result, {});
                done();
            });

        });

        it('should return data if @situs-data contain JSON string', function(done) {
            
            var string = 'hello world @situs-data({"hello": "world"})';

            parser.getData(string, function(err, result) {
                assert.equal(err, null);
                assert.deepEqual(result, {hello: 'world'});
                done();
            });

        });
    });
});