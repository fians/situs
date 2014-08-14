
/**
 * Print utility to console
 */
var colors = require('colors');

module.exports = {

    noConfigJson: function() {

        var str = '\nsitus.json is not found in source directory, default config will be used.'.yellow;
        console.log(str);
    },

	errorBuild: function(content) {

        var str = 
            '\n' + 
            'Build Failed!'.red + 
            '\n' + 
            content + 
            '\n';

        console.log(str);
    },

    successBuild: function() {

        var str = 
            '\n' + 
            'Build Success!'.green + 
            '\n' + 
            Date() + 
            '\n';

        console.log(str);
    },

    startServer: function(port) {

        var str = 
            '\n' + 
            'Server started!'.green + 
            '\n' + 
            'A development server run at http://localhost:' + port + '/' +
            '\n';

        console.log(str);
    },

    help: function() {

        var str = 
        '\n' +
        'Usage: situs <command>' +
        '\n\n' +
        'Commands:' +
        '\n\n' +
        '    -v, --version   Output the version number.' +
        '\n' +
        '    build           Build static files and placed to destination.'+
        '\n' +
        '    server          Run development server, rebuild files if files change.'+
        '\n' +
        '    help            Output usage information.';


        console.log(str);
    },

    errorConsole: function(command) {

        var str = '\nError:'.red+' Command "'+command+'" is not exist.';
        console.log(str);
    }

};