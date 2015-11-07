'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({

  prompting: {
    askForJsLibraries: function() {
      var done = this.async();
      this.prompt([
        {
          type: 'checkbox',
          name: 'jsLibraries',
          message: 'Choose your javascript libraries:',
          choices: [
            {
              name: 'jQuery',
              value: 'jquery',
              checked: true
            },
            {
              name: 'Bootstrap',
              value: 'bootstrap'
            },
            {
              name: 'Angular',
              value: 'angular'
            },
            {
              name: 'React',
              value: 'react'
            },
            {
              name: 'Modernizr',
              value: 'modernizr'
            }
          ],
          store: true
        }
      ], function(props) {
        this.jsLibraries = props.jsLibraries;
        done();
      }.bind(this));
    },
    askForTwig: function() {
      var done = this.async();
      this.prompt([
        {
          type: 'confirm',
          name: 'useTwig',
          message: 'Are you using Twig in this project?',
          default: false,
          store: true
        }
      ], function(props) {
        this.useTwig = props.useTwig;
        done();
      }.bind(this));
    }
  },

  writing: {
    tools: function() {
      this.projectName = this.config.get('projectName');
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {projectName: this.projectName}
      );
    }
  },

  install: function() {
    this.bowerInstall(this.jsLibraries, {save: true});
    if (this.useTwig) {
      this.spawnCommand('composer', ['require', 'twig/twig']);
    }
  }
});
