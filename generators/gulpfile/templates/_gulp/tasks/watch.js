/*jshint node:true */
'use strict';

var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', function() {
  gulp.watch(config.files.css, ['styles']);
  gulp.watch(config.files.js, ['scripts']);
  gulp.watch(config.files.babel, ['babel']);
  gulp.watch(config.files.images, ['images']);
  gulp.watch('bower.json', ['bower']);
});
