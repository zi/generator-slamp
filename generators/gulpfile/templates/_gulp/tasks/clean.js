/*jshint node:true */
'use strict';

var gulp = require('gulp');
var config = require('../config');
var rimraf = require('rimraf');

gulp.task('clean:bower', function(cb) {
  rimraf(config.srcDir + '/bower_components', cb);
});

gulp.task('clean', ['clean:bower']);
