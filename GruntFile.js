module.exports = function configure(grunt) {
    require('load-grunt-tasks')(grunt);

    var jsAppFiles = '_src/app/**/*.js';
    var otherFiles = [
        '_src/app/**/*.html',
        '_src/app/**/*.styl',
        '_src/index.html',
        '_src/ChangeLog.html'
    ];
    var gruntFile = 'GruntFile.js';
    var jsFiles = [
        jsAppFiles,
        gruntFile,
        'profiles/**/*.js'
    ];
    var bumpFiles = [
        'package.json',
        'bower.json',
        '_src/app/package.json',
        '_src/app/config.js'
    ];
    var deployFiles = [
        '**',
        '!**/*.uncompressed.js',
        '!**/*consoleStripped.js',
        '!**/bootstrap/less/**',
        '!**/bootstrap/test-infra/**',
        '!**/tests/**',
        '!build-report.txt',
        '!components-jasmine/**',
        '!favico.js/**',
        '!jasmine-favicon-reporter/**',
        '!jasmine-jsreporter/**',
        '!stubmodule/**',
        '!util/**'
    ];
    var deployDir = 'atlas';
    var secrets;

    try {
        secrets = grunt.file.readJSON('secrets.json');
    } catch (e) {
        // swallow for build server

        // still print a message so you can catch bad syntax in the secrets file.
        grunt.log.write(e);

        secrets = {
            stage: {
                host: '',
                username: '',
                password: ''
            },
            prod: {
                host: '',
                username: '',
                password: ''
            }
        };
    }

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: false,
                presets: ['es2015-without-strict']
            },
            src: {
                files: [{
                    expand: true,
                    cwd: '_src',
                    src: ['**/*.js'],
                    dest: 'src'
                }]
            }
        },
        bump: {
            options: {
                files: bumpFiles,
                commitFiles: bumpFiles.concat('src/ChangeLog.html'),
                push: false
            }
        },
        clean: {
            build: ['dist'],
            deploy: ['deploy'],
            src: ['src/app']
        },
        compress: {
            main: {
                options: {
                    archive: 'deploy/deploy.zip'
                },
                files: [{
                    src: deployFiles,
                    dest: './',
                    cwd: 'dist/',
                    expand: true
                }]
            }
        },
        connect: {
            uses_defaults: { // eslint-disable-line camelcase
            }
        },
        copy: {
            dist: {
                src: 'src/ChangeLog.html',
                dest: 'dist/ChangeLog.html'
            },
            src: {
                expand: true,
                cwd: '_src',
                src: ['**/*.html', '**/*.css', '**/*.png', '**/*.jpg', 'secrets.json', 'app/packages.json'],
                dest: 'src'
            }
        },
        dojo: {
            prod: {
                options: {
                    // You can also specify options to be used in all your tasks
                    profiles: ['src/profiles/prod.build.profile.js', 'src/profiles/build.profile.js']
                }
            },
            stage: {
                options: {
                    // You can also specify options to be used in all your tasks
                    profiles: ['src/profiles/stage.build.profile.js', 'src/profiles/build.profile.js']
                }
            },
            options: {
                // You can also specify options to be used in all your tasks
                // Path to dojo.js file in dojo source
                dojo: 'src/dojo/dojo.js',
                // Optional: Utility to bootstrap (Default: 'build')
                load: 'build',
                releaseDir: '../dist',
                // Optional: Module to require for the build (Default: nothing)
                requires: ['src/app/packages.js', 'src/app/run.js'],
                basePath: './src'
            }
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            main: {
                src: jsFiles
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 3
                },
                files: [{
                    expand: true,
                    cwd: '_src/',
                    // exclude tests because some images in dojox throw errors
                    src: ['**/*.{png,jpg,gif}', '!**/tests/**/*.*'],
                    dest: '_src/'
                }]
            }
        },
        jasmine: {
            main: {
                options: {
                    specs: ['src/app/**/Spec*.js'],
                    vendor: [
                        'src/jasmine-favicon-reporter/vendor/favico.js',
                        'src/jasmine-favicon-reporter/jasmine-favicon-reporter.js',
                        'src/jasmine-jsreporter/jasmine-jsreporter.js',
                        'src/app/tests/jasmineTestBootstrap.js',
                        'src/dojo/dojo.js',
                        'src/app/packages.js',
                        'src/app/tests/jsReporterSanitizer.js',
                        'src/app/tests/jasmineAMDErrorChecking.js',
                        'src/jquery/dist/jquery.js'
                    ],
                    host: 'http://localhost:8000',
                    keepRunner: true
                }
            }
        },
        parallel: {
            options: {
                grunt: true
            },
            assets: {
                tasks: ['eslint', 'stylus', 'babel', 'jasmine:main:build']
            },
            buildAssets: {
                tasks: ['eslint', 'clean:build', 'newer:imagemin:main', 'stylus']
            }
        },
        processhtml: {
            options: {},
            main: {
                files: {
                    'dist/index.html': ['src/index.html'],
                    'dist/user_admin.html': ['src/user_admin.html']
                }
            }
        },
        secrets: secrets,
        sftp: {
            stage: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.stage.host %>',
                    username: '<%= secrets.stage.username %>',
                    password: '<%= secrets.stage.password %>'
                }
            },
            prod: {
                files: {
                    './': 'deploy/deploy.zip'
                },
                options: {
                    host: '<%= secrets.prod.host %>',
                    username: '<%= secrets.prod.username %>',
                    password: '<%= secrets.prod.password %>'
                }
            },
            options: {
                path: './wwwroot/' + deployDir + '/',
                srcBasePath: 'deploy/',
                showProgress: true
            }
        },
        sshexec: {
            stage: {
                command: ['cd wwwroot/' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.stage.host %>',
                    username: '<%= secrets.stage.username %>',
                    password: '<%= secrets.stage.password %>'
                }
            },
            prod: {
                command: ['cd wwwroot/' + deployDir, 'unzip -oq deploy.zip', 'rm deploy.zip'].join(';'),
                options: {
                    host: '<%= secrets.prod.host %>',
                    username: '<%= secrets.prod.username %>',
                    password: '<%= secrets.prod.password %>'
                }
            }
        },
        stylint: {
            src: ['_src/**/*.styl']
        },
        stylus: {
            main: {
                options: {
                    compress: false,
                    'resolve url': true
                },
                files: [{
                    expand: true,
                    cwd: '_src/',
                    src: ['app/**/*.styl'],
                    dest: 'src/',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            options: {
                preserveComments: false,
                sourceMap: true,
                compress: {
                    drop_console: true, // eslint-disable-line camelcase
                    passes: 2,
                    dead_code: true // eslint-disable-line camelcase
                }
            },
            stage: {
                options: {
                    compress: {
                        drop_console: false // eslint-disable-line camelcase
                    }
                },
                src: ['dist/dojo/dojo.js'],
                dest: 'dist/dojo/dojo.js'
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: '**/*.js',
                    dest: 'dist'
                }]
            }
        },
        watch: {
            src: {
                files: jsFiles.concat(otherFiles),
                options: { livereload: true },
                tasks: ['eslint', 'stylint', 'stylus', 'babel', 'copy:src']
            }
        }
    });

    grunt.registerTask('default', [
        'clean:src',
        'parallel:assets',
        'copy:src',
        'connect',
        'watch'
    ]);
    grunt.registerTask('build-prod', [
        'clean:src',
        'parallel:buildAssets',
        'copy:src',
        'dojo:prod',
        'uglify:prod',
        'copy:main',
        'processhtml:main'
    ]);
    grunt.registerTask('deploy-prod', [
        'clean:deploy',
        'compress:main',
        'sftp:prod',
        'sshexec:prod'
    ]);
    grunt.registerTask('build-stage', [
        'clean:src',
        'parallel:buildAssets',
        'copy:src',
        'dojo:stage',
        'uglify:stage',
        'copy:main',
        'processhtml:main'
    ]);
    grunt.registerTask('deploy-stage', [
        'clean:deploy',
        'compress:main',
        'sftp:stage',
        'sshexec:stage'
    ]);
    grunt.registerTask('test', [
        'clean:src',
        'parallel:assets',
        'copy:src',
        'connect',
        'jasmine'
    ]);
    grunt.registerTask('travis', [
        'eslint',
        'test',
        'build-prod'
    ]);
};
