/* jshint camelcase: false */
module.exports = function(grunt) {
    var jsFiles = 'src/app/**/*.js';
    var otherFiles = [
        'src/app/**/*.html',
        'src/app/**/*.css',
        'src/index.html',
        'src/ChangeLog.html'
    ];
    var gruntFile = 'GruntFile.js';
    var internFile = 'tests/intern.js';
    var jshintFiles = [jsFiles, gruntFile, internFile, 'src/matchers/**/*.js'];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            app: {
                src: ['src/app/run.js'],
                options: {
                    specs: ['src/app/**/Spec*.js', 'src/matchers/**/Spec*.js'],
                    vendor: [
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js'
                    ],
                    host: 'http://localhost:8000'
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
                tasks: ['jshint', 'jasmine:app:build']
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
        },
        dojo: {
            prod: {
                options: {
                    profiles: ['profiles/prod.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            stage: {
                options: {
                    profiles: ['profiles/stage.build.profile.js', 'profiles/build.profile.js'] // Profile for build
                }
            },
            options: {
                dojo: 'src/dojo/dojo.js', // Path to dojo.js file in dojo source
                releaseDir: '../dist',
                require: 'src/app/run.js', // Optional: Module to require for the build (Default: nothing)
                basePath: './src'
            }
        },
        imagemin: { // Task
            dynamic: { // Another target
                options: { // Target options
                    optimizationLevel: 3
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'src/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/' // Destination path prefix
                }]
            }
        },
        copy: {
            main: {
                src: 'src/ChangeLog.html',
                dest: 'dist/ChangeLog.html'
            }
        },
        processhtml: {
            options: {},
            dist: {
                files: {
                    'dist/index.html': ['src/index.html']
                }
            }
        },
        clean: ['dist']
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-dojo');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', ['jasmine:app:build', 'jshint', 'connect', 'watch']);

    grunt.registerTask('travis', ['jshint', 'connect', 'jasmine:app']);

    grunt.registerTask('build',
        ['clean', 'dojo:prod', 'newer:imagemin:dynamic', 'copy', 'processhtml:dist']);
    grunt.registerTask('stage-build',
        ['clean', 'dojo:stage', 'newer:imagemin:dynamic', 'copy', 'processhtml:dist']);
};