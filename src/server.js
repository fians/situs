
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

    var sourceDir   = path.resolve(process.cwd(), config.data('source'));
    var destDir     = path.resolve(process.cwd(), config.data('destination'));
    var fileServer  = new nstatic.Server(destDir, {cache: false});

    // Start server
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(config.data('port'));

    print.startServer(config.data('port'));

    // Watch change
    var watcher = chokidar.watch(sourceDir, {ignored: function(filePath) {
        return filePath.replace(destDir, '').indexOf(sourceDir) === -1;
    }});
    
    var fsWatch = false;

    watcher.on('all', function(event, obj) {

        if (obj.replace(destDir, '').indexOf(sourceDir) !== -1 && (!fsWatch)) {
            
            fsWatch = setTimeout(function() {

                compiler.build(function(err) {
                    
                    if (err) {
                        print.errorBuild(err);
                    } else {
                        print.successBuild();
                    }

                    fsWatch = false;
                });
            }, 10);
        }
       
    });

    // Make sure watching still run even there is error
    process.on('uncaughtException', function(err) {
        fsWatch = false;
    });
    
}