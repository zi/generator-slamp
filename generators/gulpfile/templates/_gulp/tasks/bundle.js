/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');

gulp.task('bundle', function() {

  var assets = $.useref.assets();

  return gulp.src(config.srcDir + '/default.page.php')
      .pipe(assets)
      .pipe($.if('*.js', $.uglify()))
      // .pipe($.if('*.css', $.minifyCss()))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe(gulp.dest('dist'));
});
