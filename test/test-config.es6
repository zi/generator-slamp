/*global describe, before, it */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('slamp:config', () => {

  describe('with standard prompts', () => {
    before((done) => {
      helpers.run(path.join(__dirname, '../generators/config'))
        .inDir(path.join(__dirname, './tmp'))
        .withPrompts({
          projectName: 'Test',
          slampdeskDir: 'www/slampdesk',
          siteDir: 'www'
        })
        .on('end', done);
    });

    it('save config', () => {
      var configFile = '.yo-rc.json';
      assert.file([configFile]);
      assert.fileContent(configFile, /"projectName": "Test"/);
      assert.fileContent(configFile, /"slampdeskDir": "www\/slampdesk"/);
      assert.fileContent(configFile, /"siteDir": "www"/);
    });
  });

});
