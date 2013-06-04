module.exports = function(grunt) {
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
          'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.4'
          ]
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
  grunt.registerTask('default', ['jasmine:app:build', 'jshint', 'connect', 'watch']);
};