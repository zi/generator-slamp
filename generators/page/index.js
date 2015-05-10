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
    this.siteDir = this.config.get('siteDir');
  },

  prompting: function() {
    var done = this.async(),
      generator = this,
      prompts;

    prompts = [
      {
        name: 'siteDir',
        message: 'Site\'s directory:',
        default: 'www',
        store: true,
        when: function() {
          return !generator.options.withConfig && !generator.siteDir;
        }
      },
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
      if (answers.siteDir) {
        this.siteDir = answers.siteDir;
      }
      done();
    }.bind(this));
  },

  configuring: function() {
    if (this.siteDir) {
      this.config.set('siteDir', this.siteDir);
    }
  },

  writing: function() {

    if (!this.siteDir && !(this.siteDir = this.config.get('siteDir'))) {
      this.log('Site\'s dir configuration is missing');
      process.exit(1);
    }

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
