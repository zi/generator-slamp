/*global describe, before, it */

'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('slamp:app', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../generators/app'))
            // .withOptions({ skipInstall: true })
            .withPrompts({
                slampdeskDir: 'slampdesk',
                classesDir: 'classes'
            })
            .on('end', done);
    });

    it('save config', function () {
        var configFile = '.yo-rc.json';
        assert.file([
            configFile
        ]);
        assert.fileContent(configFile, /"slampdeskDir": "slampdesk"/);
        assert.fileContent(configFile, /"classesDir": "classes"/);
    });
});


describe('slamp:app empty prompt', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../generators/app'))
            // .withOptions({ skipInstall: true })
            .withPrompts({
                slampdeskDir: '',
                classesDir: ''
            })
            .on('end', done);
    });

    it('save config', function () {
        var configFile = '.yo-rc.json';
        assert.file([
            configFile
        ]);
        assert.fileContent(configFile, /"slampdeskDir": "slampdesk"/);
        assert.fileContent(configFile, /"classesDir": "classes"/);
    });
});
