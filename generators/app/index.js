'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

var writeGruntConfig = function () {

    this.gruntfile.insertConfig("wiredep", JSON.stringify({
        dev: {
            src: ['default.page.php']
        },
        prod: {
            src: ['default.page.php'],
            overrides: {
                jquery: {
                    main: 'dist/jquery.min.js'
                },
                bootstrap: {
                    main: [
                        'dist/css/bootstrap.min.css',
                        'dist/js/bootstrap.min.js'
                    ]
                },
                angular: {
                    main: 'angular.min.js'
                },
                react: {
                    main: 'react.min.js'
                }
            }
        }
    }));
    this.gruntfile.insertConfig("uglify", JSON.stringify({
        dist: {
            options: {
                sourceMap: true,
                compress: {
                    drop_console: true
                }
            },
            files: [{
                expand: true,
                cwd: 'js',
                src: ['*.js', '!*.min.js'],
                dest: 'js/min',
                ext: '.min.js'
            }]
        }
    }));
    this.gruntfile.insertConfig("cssmin", JSON.stringify({
        dist: {
            options: {
                sourceMap: true
            },
            files: [{
                expand: true,
                cwd: 'css',
                src: ['*.css', '!*.min.css'],
                dest: 'css/min',
                ext: '.min.css'
            }]
        }
    }));
    this.gruntfile.insertConfig("watch", JSON.stringify({
        bower: {
            files: ['bower_components/*'],
            tasks: ['wiredep']
        },
        js: {
            files: ['js/*.js'],
            tasks: ['uglify']
        },
        css: {
            files: ['css/*.css'],
            tasks: ['cssmin']
        }
    }));
    this.gruntfile.registerTask('default', ['wiredep:prod', 'uglify', 'cssmin']);

    this.gruntfile.loadNpmTasks('grunt-wiredep');
    this.gruntfile.loadNpmTasks('grunt-contrib-watch');
    this.gruntfile.loadNpmTasks('grunt-contrib-uglify');
    this.gruntfile.loadNpmTasks('grunt-contrib-cssmin');
};

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
                    default: false,
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

            writeGruntConfig.call(this);
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
            this.fs.copy(
                this.templatePath('js/default.js'),
                this.destinationPath('js/default.js')
            );
            this.fs.copyTpl(
                this.templatePath('classes/_Site.php'),
                this.destinationPath('classes/' + this.projectName + 'Site.php'),
                {
                    projectName : this.projectName
                }
            );
            mkdirp(this.destinationPath('classes'));
            mkdirp(this.destinationPath('controllers'));
            mkdirp(this.destinationPath('templates'));
            mkdirp(this.destinationPath('js'));
            mkdirp(this.destinationPath('css'));
            mkdirp(this.destinationPath('images'));
        }
    },

    install: function () {
        this.bowerInstall(this.jsLibraries, {save: true});
        if (this.useTwig) {
            this.spawnCommand('composer', ['require', 'twig/twig']);
        }
        this.npmInstall([
            'grunt-contrib-watch',
            'grunt-wiredep',
            'grunt-contrib-uglify',
            'grunt-contrib-cssmin'
        ], {'saveDev': true});
    }
});
