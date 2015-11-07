/*jshint node:true */
'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({camelize: true});
const config = require('../config');

const notifier = $.notify.onError({
  message: 'Error: <%= error.message %>',
  sound: false
});

gulp.task('styles', function() {
  return gulp.src(config.files.css)
    .pipe($.plumber({errorHandler: notifier}))
    .pipe($.newer({dest: config.cssDir, ext: '.min.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 2 versions', 'ie >= 8']}))
    .pipe($.debug({title: 'debug: styles'}))
    .pipe(gulp.dest(config.cssDir))
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.cssDir));
});
