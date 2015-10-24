/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('clean:bower', function() {
  return gulp.src(config.srcDir + '/bower_components')
    .pipe($.clean());
});

gulp.task('clean', ['clean:bower']);
