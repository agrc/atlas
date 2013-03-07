module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      app: {
        src: ['src/app/tests/jasmineTestBootstrap.js',
          'src/dojo/dojo.js',
          'src/app/run.js'],
        options: {
          specs: ['src/app/tests/spec/*.js']
        }
      }
    },
    jshint: {
      files: ['src/app/**/*.js'],
      options: {jshintrc: '.jshintrc'}
    },
    watch: {
      files: ['src/app/**/*.js'],
      tasks: ['jasmine:app:build', 'jshint']
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
  grunt.registerTask('default', ['connect', 'watch']);
};