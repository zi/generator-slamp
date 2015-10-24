/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('babel', function() {
  return gulp.src(config.files.babel)
    .pipe($.newer({dest: config.jsDir, ext: '.js'}))
    .pipe($.debug({title: 'debug: babel'}))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', $.notify.onError({
      message: 'Error: <%= error.message %>',
      sound: false
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe($.rename({extname: '.js'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.jsDir));
});
