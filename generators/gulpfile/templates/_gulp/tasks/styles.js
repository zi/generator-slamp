/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('styles', function() {
  return gulp.src(config.files.css)
    .pipe($.newer({dest: config.cssDir, ext: '.min.css'}))
    .pipe($.debug({title: 'debug: styles'}))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.cssDir));
});
