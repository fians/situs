
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

        var sourceDir   = path.resolve(process.cwd(), config.get('source'));
        var destDir     = path.resolve(process.cwd(), config.get('destination'));
        var fileServer  = new nstatic.Server(destDir, {cache: false});

        // Start server
        require('http').createServer(function (request, response) {
            request.addListener('end', function () {
                fileServer.serve(request, response);
            }).resume();
        }).listen(config.get('port'));

        print.startServer(config.get('port'));

        // Watch change
        var watcher = chokidar.watch(sourceDir);
        var fsWatch = null;

        watcher.on('all', function(event, obj) {

            if (obj.replace(destDir, '').indexOf(sourceDir) !== -1 && (!fsWatch)) {
                
                fsWatch = setTimeout(function() {
                    return compiler.build(configData, function(err) {
                        
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

        // Make sure watching still run even there is error
        process.on('uncaughtException', function(err) {
            fsWatch = true;
        });

    });
}

