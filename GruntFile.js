module.exports = function(grunt) {
    var jsFiles = 'src/app/**/*.js';
    var otherFiles = [
        'src/app/**/*.html',
        'src/app/**/*.css',
        'src/index.html'
    ];
    var gruntFile = 'GruntFile.js';
    var internFile = 'tests/intern.js';
    var packageFile = 'package.json';
    var jshintFiles = [jsFiles, gruntFile, internFile, packageFile];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            // for embedded map projects...
            // app: {
            //   src: ['src/EmbeddedMapLoader.js'],
            //   options: {
            //     specs: ['src/app/tests/spec/*.js']
            //   }
            // }

            // for regular apps...
            app: {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/tests/spec/*.js'],
                    vendor: [
                        'src/app/tests/jasmineTestBootstrap.js',
                        'http://js.arcgis.com/3.6/'
                    ]
                }
            }
        },
        jshint: {
            files: jshintFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            jshint: {
                files: jshintFiles,
                tasks: ['jshint']
            },
            src: {
                files: jshintFiles.concat(otherFiles),
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            uses_defaults: {}
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task.
    grunt.registerTask('default', ['jasmine:app:build', 'jshint', 'connect', 'watch']);
};