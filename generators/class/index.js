'use strict';
var yeoman = require('yeoman-generator');
var shell = require('shelljs');

module.exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('classname', {type: 'string', required: false});
    this.option('table', {
      desc: 'Name of the table',
      alias: 't',
      type: 'string'
    });
    this.option('nspace', {
      desc: 'Namespace of the new class',
      alias: 'n',
      type: 'string'
    });
    if (this.options.table) {
      this.table = this.options.table;
    }
    if (this.options.nspace) {
      this.namespace = this.options.nspace;
    }
  },

  initializing: function() {
    this.slampdeskDir = this.config.get('slampdeskDir');
    this.siteDir = this.config.get('siteDir');
    if (!this.slampdeskDir || !this.siteDir) {
      this.composeWith('slamp:config');
    }
  },

  prompting: function() {
    var done = this.async(),
        prompts,
        generator = this;

    prompts = [
      {
        type: 'input',
        name: 'table',
        message: 'Name of the table:',
        when: function() {
          return !generator.table;
        }
      },
      {
        type: 'input',
        name: 'classname',
        message: 'Name of the class:',
        when: function() {
          return !generator.classname;
        }
      },
      {
        type: 'input',
        name: 'namespace',
        message: 'Namespace of the new class:',
        default: function() {
          return (generator.config.get('projectName') || 'Slamp') +
              '\\Generated';
        },
        when: function() {
          return !generator.namespace;
        }
      }
    ];

    this.prompt(prompts, function(props) {
      if (!this.classname) {
        this.classname = props.classname;
      }
      if (!this.table) {
        this.table = props.table;
      }
      if (!this.namespace) {
        this.namespace = props.namespace;
      }
      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      this.slampdeskDir = this.config.get('slampdeskDir');
      this.siteDir = this.config.get('siteDir');
      shell.exec('php ' + this.slampdeskDir + '/slamp-cli.php' +
        ' --action create' +
        ' --name ' + this.classname +
        ' --table ' + this.table +
        ' --classesDir "' + this.siteDir + '/classes"' +
        ' --namespace "' + this.namespace + '"');
    }
  }
});
