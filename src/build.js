
/**
 * Build Module
 */

var path 		= require('path');
var config 		= require('./config.js');
var print 		= require('./print.js');
var compiler 	= require('./compiler.js');

module.exports = {
	start: start
};

function start() {

    if (config.get('noConfig')) {
        print.noConfigJson();
    }

    compiler.build(function(err) {

        if (err) {
            return print.errorBuild(err);
        }

        return print.successBuild();
    });

}