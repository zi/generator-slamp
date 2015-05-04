'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../../package.json');
    },

    prompting: {
        askForConfig: function () {
            var done = this.async(),
                prompts,
                generator = this;

            // Have Yeoman greet the user.
            this.log(yosay(
                'Welcome to the flawless ' + chalk.red('Slamp') + ' generator!'
            ));

            prompts = [
                {
                    name: 'projectName',
                    message: 'What\'s the name of your project?',
                    default: function () {
                        return generator.config.get('projectName') || 'Slamp';
                    }
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
                            name: 'Bootstrap',
                            value: 'bootstrap'
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
        tools: function () {
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
            this.fs.copy(
                this.templatePath('Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );
        },
        app: function () {
            this.fs.copyTpl(
                this.templatePath('_default.php'),
                this.destinationPath('default.php'),
                {
                    projectName : this.projectName,
                    classesDir: this.classesDir
                }
            );
            this.fs.copy(
                this.templatePath('_default.page.php'),
                this.destinationPath('default.page.php')
            );
            this.fs.copy(
                this.templatePath('css/style.css'),
                this.destinationPath('css/style.css')
            );
            this.fs.copyTpl(
                this.templatePath('classes/_Site.php'),
                this.destinationPath('classes/' + this.projectName + 'Site.php'),
                {
                    projectName : this.projectName
                }
            );
            mkdirp(this.destinationPath('include'));
            mkdirp(this.destinationPath('templates'));
            mkdirp(this.destinationPath('js'));
            mkdirp(this.destinationPath('images'));
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
        this.npmInstall([
            'grunt-contrib-watch',
            'grunt-wiredep'
        ], {'saveDev': true});
    }
});
