
/**
 * Main module
 */

var minimist    = require('minimist');
var path        = require('path');

var print       = require('./print.js');
var build       = require('./build.js');
var server      = require('./server.js');
var config      = require('./config.js');

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
        return trigger('build');
    case 'server':
        return trigger('server');
    case 'help':
        return print.help();
    default:
        print.errorConsole(command);
        print.help();
}

/**
 * Trigger command specified by console argument
 */
function trigger(command) {

    var configFile = path.resolve(process.cwd(), './situs.json');

    config.read(configFile, function(error, configData) {

        // Parse console option to overide situs.json
        config.parseOption(argv);

        if (command === 'build') {

            if (error) {
                return print.errorBuild(error);
            }

            return build.start();
        }

        if (command === 'server') {
            return server.start();
        }

        return false;
    });

}