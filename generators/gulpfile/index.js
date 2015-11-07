'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.option('withConfig', {
      desc: 'compose with config',
      type: Boolean,
      default: false
    });
  },

  check: function() {
    return this.config.get('buildSystem') === 'gulp';
  },

  initializing: function() {
    if (!this.config.get('siteDir') && !this.options.withConfig) {
      this.composeWith('slamp:config');
    }
  },

  writing: {
    scaffold: function() {

      if (!this.check()) { return; }

      this.siteDir = this.config.get('siteDir');
      this.projectName = this.config.get('projectName');

      this.fs.copy(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );

      this.fs.copy(
        this.templatePath('_gulp'),
        this.destinationPath('gulp')
      );
    }
  },

  install: function() {

    if (!this.check()) { return; }

    this.npmInstall([
      'gulp',
      'gulp-babel',
      'gulp-load-plugins',
      'gulp-newer',
      'gulp-debug',
      'gulp-sourcemaps',
      'gulp-uglify',
      'gulp-rename',
      'gulp-minify-css',
      'gulp-if',
      'gulp-cache',
      'gulp-autoprefixer',
      'gulp-cssnano',
      'gulp-imagemin',
      'gulp-assets',
      'gulp-notify',
      'gulp-concat',
      'gulp-inject',
      'gulp-less',
      'gulp-rev',
      'gulp-rimraf',
      'rimraf',
      'require-dir',
      'lazypipe',
      'main-bower-files'
    ], {'saveDev': true});
  }
});
