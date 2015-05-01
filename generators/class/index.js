'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var shell = require('shelljs');

module.exports = yeoman.generators.Base.extend({

    initializing: function () {
        this.slampdeskDir = this.config.get('slampdeskDir');
        this.classesDir = this.config.get('classesDir');
        if (!this.slampdeskDir || !this.classesDir) {
            this.log("You have to run 'yo slamp' first!");
            process.exit(1);
        }
    },

    prompting: function () {
        var done = this.async(),
            prompts;

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the flawless ' + chalk.red('Slamp') + ' generator!'
        ));

        prompts = [
            {
                type: 'input',
                name: 'tableName',
                message: 'Name of the table:'
            },
            {
                type: 'input',
                name: 'className',
                message: 'Name of the class:'
            },
            {
                type: 'input',
                name: 'namespace',
                message: 'Namespace of the new class:',
                default: 'SlampSite\\Generated',
                store: true
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },

    writing: {
        app: function () {
            shell.exec('php ' + this.slampdeskDir + '/slamp-cli.php' +
                        ' --action create' +
                        ' --name ' + this.props.className +
                        ' --table ' + this.props.tableName +
                        ' --classesDir "' + this.classesDir + '"' +
                        ' --namespace "' + this.props.namespace + '"');
        }
    }
});
