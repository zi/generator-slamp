/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var wiredep = require('wiredep').stream;
var config = require('../config');

gulp.task('wiredep', function() {
  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.debug({title: 'debug: wiredep'}))
    .pipe(wiredep({
      ignorePath: '../',
      overrides: {
        bootstrap: {
          main: [
              'dist/css/bootstrap.css',
              'dist/js/bootstrap.js'
          ]
        }
      },
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(gulp.dest(config.srcDir));
});

gulp.task('wiredepCopy', ['clean:bower'], function() {
  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.assets({cwd: '../', js: 'js', css: 'css'}))
    .pipe($.rename(function(path) {
      path.dirname = config.srcDir + '/' + path.dirname;
    }))
    .pipe($.debug({title: 'debug: wiredepCopy'}))
    .pipe(gulp.dest(config.srcDir));
});

gulp.task('bower', ['wiredep'], function() {
  return gulp.start('wiredepCopy');
});
