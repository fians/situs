module.exports = function(grunt) {
    grunt.initConfig({
        
        // Test
        jshint: {
            
            files: [
                'gruntfile.js', 
                'src/*.js',
                'test/*.js',
            ],
            
            options: {
                globals: {
                    console: true
                }
            }
        },

        // Node.js test
		mochaTest: {
			test: {
				options: {
					reporter: 'dot'
				},
				src: ['test/*.js']
			}
		}

    });
    
    // Load module
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    
    // Create grunt task
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};