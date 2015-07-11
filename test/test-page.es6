/*global describe, before, it */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('slamp:page', function() {

  before((done) => {

    helpers.run(path.join(__dirname, '../generators/page'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({
        siteDir: 'www',
        page: 'prova'
      })
      .withGenerators([path.join(__dirname, '../generators/config')])
      .on('end', done);
  });

  it('create files', function() {
    assert.file([
      'www/controllers/prova.php',
      'www/templates/prova.page.php',
      'www/js/prova.js'
    ]);
  });

});
