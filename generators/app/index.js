'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({

  initializing: function() {
    this.pkg = require('../../package.json');
    this.composeWith('slamp:config');
    this.composeWith('slamp:libraries', {args: ['--withConfig']});
    this.composeWith('slamp:gruntfile', {args: ['--withConfig']});
    this.composeWith('slamp:gulpfile', {args: ['--withConfig']});
    this.composeWith('slamp:page', {args: ['static', '--withConfig']});
  },

  writing: {
    scaffold: function() {

      this.siteDir = this.config.get('siteDir');
      this.projectName = this.config.get('projectName');

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {projectName: this.projectName}
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('jscsrc'),
        this.destinationPath('.jscsrc')
      );

      this.fs.copyTpl(
        this.templatePath('_default.php'),
        this.destinationPath(this.siteDir + '/default.php'),
          {projectName: this.projectName}
      );
      this.fs.copy(
        this.templatePath('_default.page.php'),
        this.destinationPath(this.siteDir + '/default.page.php')
      );
      this.fs.copy(
        this.templatePath('htaccess'),
        this.destinationPath(this.siteDir + '/.htaccess')
      );
      this.fs.copy(
        this.templatePath('_404.php'),
        this.destinationPath(this.siteDir + '/404.php')
      );
      this.fs.copy(
        this.templatePath('css/style.css'),
        this.destinationPath(this.siteDir + '/css/style.css')
      );
      this.fs.copy(
        this.templatePath('js/default.js'),
        this.destinationPath(this.siteDir + '/js/default.js')
      );
      this.fs.copyTpl(
        this.templatePath('classes/_Site.php'),
        this.destinationPath(this.siteDir + '/classes/' + this.projectName +
          'Site.php'),
        {projectName: this.projectName}
      );

      mkdirp(this.destinationPath(this.siteDir + '/classes'));
      mkdirp(this.destinationPath(this.siteDir + '/controllers'));
      mkdirp(this.destinationPath(this.siteDir + '/templates'));
      mkdirp(this.destinationPath(this.siteDir + '/js'));
      mkdirp(this.destinationPath(this.siteDir + '/css'));
      mkdirp(this.destinationPath(this.siteDir + '/images'));
    }
  }
});
