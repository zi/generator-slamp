/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('assert');

describe('slamp:libraries', function() {
  beforeEach(function(done) {
    this.bowerInstallCalls = [];

    helpers.testDirectory(path.join(__dirname, 'tmp'), (err) => {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('slamp:libraries', [
        path.join(__dirname, '../generators/libraries')
      ]);

      // Mock bower install and track the function calls.
      this.app.bowerInstall = (...args) => {
        this.bowerInstallCalls.push(args);
      };

      done();
    });
  });

  it('installs jQuery', function(done) {
    helpers.mockPrompt(this.app, {
      jsLibraries: ['jquery']
    });

    this.app.run(() => {
      assert.equal(this.bowerInstallCalls[0][0], 'jquery');
      done();
    });
  });

  it('installs jQuery and Bootstrap', function(done) {
    helpers.mockPrompt(this.app, {
      jsLibraries: ['jquery', 'bootstrap']
    });

    this.app.run(() => {
      assert.deepEqual(this.bowerInstallCalls[0][0], ['jquery', 'bootstrap']);
      done();
    });
  });

});
