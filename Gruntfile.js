require('park-ranger')();

module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    rsync: {
      options: {
        args: ['-v --rsync-path="mkdir -p ' + process.env.HOIST_DEST_DIR + ' && rsync"'],
        host: process.env.HOIST_DEST_USER + '@' + process.env.HOIST_DEST_HOST,
        recursive: true
      },
      app: {
        options: {
          src: './dist/',
          dest: process.env.HOIST_DEST_DIR
        }
      }
    }
  });

  grunt.registerTask('deploy', 'Deploy app', [
    'rsync:app',
    'hoist-restart-systemd'
  ]);
};
