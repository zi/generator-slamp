'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../../package.json');
    },

    prompting: {
        askForConfig: function () {
            var done = this.async(),
                prompts;

            // Have Yeoman greet the user.
            this.log(yosay(
                'Welcome to the flawless ' + chalk.red('Slamp') + ' generator!'
            ));

            prompts = [
                {
                    name: 'projectName',
                    message: 'What\'s the name of your project?',
                    default: 'SlampSite',
                    store: true
                },
                {
                    name: 'slampdeskDir',
                    message: 'SlampDesk directory:',
                    default: 'slampdesk',
                    store: true
                },
                {
                    name: 'classesDir',
                    message: 'Classes directory:',
                    default: 'classes',
                    store: true
                }
            ];

            this.prompt(prompts, function (props) {
                this.projectName = props.projectName;
                this.slampdeskDir = props.slampdeskDir;
                this.classesDir = props.classesDir;
                done();
            }.bind(this));
        },
        askForJsLibraries: function () {
            var done = this.async();
            this.prompt([
                {
                    type: 'checkbox',
                    name: 'jsLibraries',
                    message: 'Which javascript libraries would you like to use?',
                    choices: [
                        {
                            name: 'jQuery',
                            value: 'jquery',
                            checked: true
                        },
                        {
                            name: 'Angular',
                            value: 'angular'
                        }
                    ],
                    store: true
                }
            ], function (props) {
                this.jsLibraries = props.jsLibraries;
                done();
            }.bind(this));
        },
        askForTwig: function () {
            var done = this.async();
            this.prompt([
                {
                    type: 'confirm',
                    name: 'useTwig',
                    message: 'Would you like to use Twig in this project?',
                    default: true,
                    store: true
                }
            ], function (props) {
                this.useTwig = props.useTwig;
                done();
            }.bind(this));
        }
    },

    configuring: function () {
        this.config.set('projectName', this.projectName);
        this.config.set('slampdeskDir', this.slampdeskDir);
        this.config.set('classesDir', this.classesDir);
    },

    writing: {
        app: function () {
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                { projectName : this.projectName }
            );
            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                { projectName : this.projectName }
            );
        },

        // projectfiles: function () {
        //     this.fs.copy(
        //         this.templatePath('editorconfig'),
        //         this.destinationPath('.editorconfig')
        //     );
        //     this.fs.copy(
        //         this.templatePath('jshintrc'),
        //         this.destinationPath('.jshintrc')
        //     );
        // }
    },

    install: function () {
        this.bowerInstall(this.jsLibraries, {save: true});
        if (this.useTwig) {
            this.spawnCommand('composer', ['require', 'twig/twig']);
        }
    }
});
