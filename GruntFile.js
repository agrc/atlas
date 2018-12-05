module.exports = function configure(grunt) {
  require('load-grunt-tasks')(grunt);

  var deployFiles = ['**'];
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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      main: ['deploy']
    },
    compress: {
      main: {
        options: {
          archive: 'deploy/deploy.zip'
        },
        files: [{
          src: deployFiles,
          dest: './',
          cwd: 'build/',
          expand: true
        }]
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
    }
  });

  grunt.registerTask('deploy-prod', [
    'clean:main',
    'compress:main',
    'sftp:prod',
    'sshexec:prod'
  ]);
};
