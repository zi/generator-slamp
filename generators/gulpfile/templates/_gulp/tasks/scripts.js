/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('scripts', function() {
  return gulp.src(config.files.js)
    .pipe($.newer({dest: config.jsDir, ext: '.min.js'}))
    .pipe($.debug({title: 'debug: scripts'}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify({compress: {'drop_console': true}}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.jsDir));
});
