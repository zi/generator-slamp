/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('images', function() {
  return gulp.src(config.files.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}] // don't remove IDs from SVGs, they are often used as hooks for embedding and styling
    }))
    .pipe($.debug({title: 'debug: images'}))
    .on('error', function(err) {
      console.log(err);
      this.end();
    })
    .pipe(gulp.dest(config.srcDir + '/images'));
});
