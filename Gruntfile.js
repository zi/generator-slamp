module.exports = function(grunt) {
  'use strict';

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'babel/register'
      },
      test: {
        src: ['test/**/*.es6']
      }
    }
  });

  grunt.registerTask('test', 'mochaTest');

};
