/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

const notifier = $.notify.onError({
  message: 'Error: <%= error.message %>',
  sound: false
});

gulp.task('babel', function() {
  return gulp.src(config.files.babel)
    .pipe($.plumber({errorHandler: notifier}))
    .pipe($.newer({dest: config.jsDir, ext: '.js'}))
    .pipe($.debug({title: 'debug: babel'}))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.rename({extname: '.js'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.jsDir));
});
