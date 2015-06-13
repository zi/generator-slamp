  'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('page', {type: 'string', required: false});
    this.option('withConfig', {
      desc: 'run after config',
      type: Boolean,
      default: false
    });
  },

  initializing: function() {
    if (!this.config.get('siteDir') && !this.options.withConfig) {
      this.composeWith('slamp:config');
    }
  },

  prompting: function() {
    var done = this.async(),
      generator = this,
      prompts;

    prompts = [
      {
        type: 'input',
        name: 'page',
        message: 'Name of the page (without extension):',
        when: function() {
          return !generator.page;
        }
      }
    ];

    this.prompt(prompts, function(answers) {
      if (answers.page) {
        this.page = answers.page;
      }
      done();
    }.bind(this));
  },

  writing: function() {

    this.siteDir = this.config.get('siteDir');

    this.fs.copyTpl(
      this.templatePath('_page.php'),
      this.destinationPath(this.siteDir + '/controllers/' + this.page +
        '.php'),
      {page: this.page}
    );
    this.fs.copyTpl(
      this.templatePath('_page.template.php'),
      this.destinationPath(this.siteDir + '/templates/' + this.page +
        '.page.php'),
      {page: this.page}
    );
    this.fs.copyTpl(
      this.templatePath('_page.js'),
      this.destinationPath(this.siteDir + '/js/' + this.page + '.js'),
      {page: this.page}
    );
  }
});
