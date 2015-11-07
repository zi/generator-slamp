/*jshint node:true */
'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({camelize: true});
const config = require('../config').bower;
const mainBowerFiles = require('main-bower-files');
const lazypipe = require('lazypipe');
const rimraf = require('rimraf');

gulp.task('bower:clean', function(cb) {
  rimraf(config.destinationDir, cb);
});

gulp.task('bower:bundles', ['bower:clean'], function() {

  const concatJs = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.concat, config.bundleName + '.js')
    .pipe($.uglify, {compress: {'drop_console': true}})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write, '.')
    .pipe(gulp.dest, config.destinationDir);

  const concatCss = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.less)
    .pipe($.concat, config.bundleName + '.css')
    .pipe($.autoprefixer, {browsers: ['last 2 versions']})
    .pipe($.minifyCss, {compatibility: 'ie8'})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write, '.')
    .pipe(gulp.dest, config.destinationDir);

  let options = {
    overrides: {}
  };
  for (let pkg of config.excludeFromBundle) {
    options.overrides[pkg] = {ignore: true};
  }

  return gulp.src(mainBowerFiles(options))
      .pipe($.debug({title: 'src files'}))
      .pipe($.if('*.js', concatJs()))
      .pipe($.if(['*.css', '*.less'], concatCss()))
      .pipe($.debug({title: 'result files'}));
});

gulp.task('bower:others', ['bower:clean'], function() {
  const options = {
    overrides: {}
  };
  for (let pkg in config.getBowerConfig().dependencies) {
    if (config.excludeFromBundle.indexOf(pkg) === -1) {
      options.overrides[pkg] = {ignore: true};
    }
  }

  return gulp.src(mainBowerFiles(options))
    .pipe($.debug({title: 'other files'}))
    .pipe(gulp.dest(config.destinationDir));
});

gulp.task('bower', ['bower:bundles', 'bower:others'], function() {
  const bundleName = config.destinationDir + '/' + config.bundleName;
  const sources = gulp.src(
      [bundleName + '-*.js', bundleName + '-*.css'],
      {read: false}
    )
    .pipe($.debug({title: 'files to inject'}));

  return gulp.src(config.baseDir + '/default.page.php')
    .pipe($.inject(sources, {
      name: 'vendor',
      relative: true,
      addRootSlash: config.addRootSlash
    }))
    .pipe(gulp.dest(config.baseDir));
});
