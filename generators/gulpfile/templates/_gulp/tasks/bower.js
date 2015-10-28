/*jshint node:true */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var config = require('../config');
var mainBowerFiles = require('main-bower-files');
var lazypipe = require('lazypipe');

gulp.task('bower:clean', function() {
  var jsFiles = config.jsDir + '/vendor-*.min.js';
  var cssFiles = config.cssDir + '/vendor-*.min.css';
  return gulp.src([jsFiles, cssFiles], {read: false})
    .pipe($.rimraf());
});

gulp.task('bower:bundles', function() {

  var concatJs = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.concat, 'vendor.js')
    .pipe($.uglify, {compress: {'drop_console': true}})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write)
    .pipe(gulp.dest, config.jsDir);

  var concatCss = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.less)
    .pipe($.concat, 'vendor.css')
    .pipe($.autoprefixer, {browsers: ['last 2 versions']})
    .pipe($.minifyCss, {compatibility: 'ie8'})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write)
    .pipe(gulp.dest, config.cssDir);

  return gulp.src(mainBowerFiles())
      .pipe($.debug({title: 'src files'}))
      .pipe($.if('*.js', concatJs()))
      .pipe($.if(['*.css', '*.less'], concatCss()))
      .pipe($.debug({title: 'result files'}));
});

gulp.task('bower', ['bower:bundles'], function() {
  var sources = gulp.src(
      [config.jsDir + '/vendor-*.js', config.cssDir + '/vendor-*.css'],
      {read: false}
    )
    .pipe($.debug({title: 'files to inject'}));

  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.inject(sources, {name: 'vendor'}))
    .pipe(gulp.dest(config.srcDir));
});
