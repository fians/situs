
/**
 * Server utility module
 */

var path        = require('path');
var nstatic     = require('node-static');
var chokidar    = require('chokidar');

var config      = require('./config.js');
var print       = require('./print.js');
var compiler    = require('./compiler.js');

//
// Create a node-static server instance to serve the './public' folder
//

module.exports = {
    start: start
};

function start() {

    var configFile = path.resolve(process.cwd(), './situs.json');

    config.read(configFile, function(err, configData) {

        var sourceDir   = path.resolve(process.cwd(), configData.source);
        var destDir     = path.resolve(process.cwd(), configData.destination);
        var fileServer  = new nstatic.Server(destDir, {cache: false});

        // Start server
        require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                fileServer.serve(request, response);
            }).resume();
        }).listen(configData.port);

        print.startServer(configData.port);

        // Watch change
        var watcher = chokidar.watch(sourceDir, {ignoreInitial: true});
        var fsWatch = null;

        watcher.on('all', function(event, obj) {

            if (event === 'error') {
                throw err;
            }

            if (obj.replace(destDir, '').indexOf(sourceDir) !== -1 && (!fsWatch)) {
                
                // Catch only one event
                fsWatch = setTimeout(function() {
                    compiler.build(configData, function(err) {

                        if (err) {
                            print.errorBuild(err);
                        } else {
                            print.successBuild();
                        }

                        fsWatch = null;
                    });
                }, 10);
            }
           
        });

    });
}

