/*jshint node:true */
'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({camelize: true});
const config = require('../config');
const mainBowerFiles = require('main-bower-files');
const lazypipe = require('lazypipe');
const rimraf = require('rimraf');

const outputDir = config.bower.dist;
const bundleName = config.bower.bundleName;

gulp.task('bower:clean', function(cb) {
  rimraf(outputDir, cb);
});

gulp.task('bower:bundles', ['bower:clean'], function() {

  const concatJs = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.concat, bundleName + '.js')
    .pipe($.uglify, {compress: {'drop_console': true}})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write, '.')
    .pipe(gulp.dest, outputDir);

  const concatCss = lazypipe()
    .pipe($.sourcemaps.init)
    .pipe($.less)
    .pipe($.concat, bundleName + '.css')
    .pipe($.autoprefixer, {browsers: ['last 2 versions']})
    .pipe($.minifyCss, {compatibility: 'ie8'})
    .pipe($.rev)
    .pipe($.rename, {suffix: '.min'})
    .pipe($.sourcemaps.write, '.')
    .pipe(gulp.dest, outputDir);

  let options = {
    overrides: {}
  };
  for (let pkg of config.bower.excludeFromBundle) {
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
  const fs = require('fs');
  const json = JSON.parse(fs.readFileSync(config.bowerPath, 'utf8'));
  for (let pkg in json.dependencies) {
    if (config.bower.excludeFromBundle.indexOf(pkg) === -1) {
      options.overrides[pkg] = {ignore: true};
    }
  }

  return gulp.src(mainBowerFiles(options))
    .pipe($.debug({title: 'other files'}))
    .pipe(gulp.dest(outputDir));
});

gulp.task('bower', ['bower:bundles', 'bower:others'], function() {
  const dist = outputDir.replace(config.srcDir + '/', '');
  const sources = gulp.src(
      [dist + bundleName + '-*.js', dist + bundleName + '-*.css'],
      {read: false, cwd: config.srcDir}
    )
    .pipe($.debug({title: 'files to inject'}));

  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.inject(sources, {name: 'vendor'}))
    .pipe(gulp.dest(config.srcDir));
});
