/*global describe, before, it */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('slamp:gruntfile', () => {

  before((done) => {

    helpers.run(path.join(__dirname, '../generators/gruntfile'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({siteDir: 'www'})
      .withGenerators([path.join(__dirname, '../generators/config')])
      .on('end', done);
  });

  it('save Gruntfile', () => {
    var gruntfile = 'Gruntfile.js';
    assert.file(gruntfile);
  });

});
