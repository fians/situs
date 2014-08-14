
/**
 * Main module
 */

var minimist    = require('minimist');
var path        = require('path');

var print       = require('../src/print.js');
var compiler    = require('../src/compiler.js');
var server      = require('../src/server.js');

var argv = minimist(process.argv.slice(2));

// Print version
if (argv.hasOwnProperty('v') || argv.hasOwnProperty('version')) {
    var data = require(path.resolve(__dirname, '../package.json'));
    console.log('v'+data.version);
    process.exit();
}

// Execute command
var command = argv._[0];

if (command === undefined) {
    command = '';
}

switch(command) {
    case 'build':
        return compiler.generate();
    case 'server':
        return server.start();
    case 'help':
        return print.help();
    default:
        print.errorConsole(command);
        print.help();
}