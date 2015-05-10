'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var camelize = require('camelize');

var getProjectName = function() {
  var name = camelize(this.determineAppname());
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
};

module.exports = yeoman.generators.Base.extend({

  initializing: function() {
    this.pkg = require('../../package.json');
  },

  prompting: {
    askForConfig: function() {
      var done = this.async(),
        prompts,
        projectName = getProjectName.call(this);

      this.log(projectName);
      // Have Yeoman greet the user.
      this.log(yosay(
        'Welcome to the flawless ' + chalk.red('Slamp') + ' generator!'
      ));

      prompts = [
        {
          name: 'projectName',
          message: 'What\'s the name of your project?',
          default: projectName
        },
        {
          name: 'siteDir',
          message: 'Site directory:',
          default: 'www',
          store: true
        },
        {
          name: 'slampdeskDir',
          message: 'SlampDesk directory:',
          default: function(answers) {
            return answers.siteDir + '/slampdesk';
          },
          store: true
        }
      ];

      this.prompt(prompts, function(props) {
        this.projectName = props.projectName;
        this.siteDir = props.siteDir;
        this.slampdeskDir = props.slampdeskDir;
        done();
      }.bind(this));
    }
  },

  configuring: function() {
    this.config.set('projectName', this.projectName);
    this.config.set('siteDir', this.siteDir);
    this.config.set('slampdeskDir', this.slampdeskDir);
  }
});
