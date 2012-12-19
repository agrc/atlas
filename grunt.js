module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'YOUR_NAME; Licensed MIT */'
    },
    watch: {
      files: ['src/app/**/*.js'],
      tasks: 'jasmine'
    },
    jasmine: {
      src: ['src/app/tests/jasmineTestBootstrap.js',
        'src/dojo/dojo.js',
        'src/app/run.js'],
      specs: ['src/app/tests/spec/*.js']
    },
    lint: {
      files: ['src/app/**/*.js']
      // options: {jshintrc: '.jshintrc'} not until 0.4 grunt
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch');
  grunt.loadNpmTasks('grunt-jasmine-runner');
};