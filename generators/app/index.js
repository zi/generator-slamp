'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var camelize = require('camelize');

var writeGruntConfig = function () {

    this.gruntfile.loadNpmTasks([
        'grunt-wiredep',
        'grunt-wiredep-copy',
        'grunt-contrib-watch',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-newer'
    ]);

    this.gruntfile.insertConfig("wiredepCopy", JSON.stringify({
        dev: {
            options: {
                src: this.destinationRoot(),
                dest: this.destinationPath(this.siteDir)
            }
        }
    }));
    this.gruntfile.insertConfig("wiredep", JSON.stringify({
        dev: {
            src: [this.siteDir + '/default.page.php'],
            ignorePath: '../'
        },
        prod: {
            src: [this.siteDir + '/default.page.php'],
            ignorePath: '../',
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
                cwd: this.siteDir + '/js',
                src: ['*.js', '!*.min.js'],
                dest: this.siteDir + '/js/min',
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
                cwd: this.siteDir + '/css',
                src: ['*.css', '!*.min.css'],
                dest: this.siteDir + '/css/min',
                ext: '.min.css'
            }]
        }
    }));
    this.gruntfile.insertConfig("watch", JSON.stringify({
        bower: {
            files: ['bower_components/*'],
            tasks: ['bower']
        },
        js: {
            files: [this.siteDir + '/js/*.js'],
            tasks: ['newer:uglify']
        },
        css: {
            files: [this.siteDir + '/css/*.css'],
            tasks: ['newer:cssmin']
        }
    }));
    this.gruntfile.registerTask('default', ['bower']);
    this.gruntfile.registerTask('bower', ['wiredepCopy:dev', 'wiredep:dev']);
};

var getProjectName = function () {
    var name = camelize(this.determineAppname());
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return name;
};

module.exports = yeoman.generators.Base.extend({

    initializing: function () {
        this.pkg = require('../../package.json');
    },

    prompting: {
        askForConfig: function () {
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
                    default: function (answers) {
                        return answers.siteDir + '/slampdesk';
                    },
                    store: true
                }
            ];

            this.prompt(prompts, function (props) {
                this.projectName = props.projectName;
                this.siteDir = props.siteDir;
                this.slampdeskDir = props.slampdeskDir;
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
        this.config.set('siteDir', this.siteDir);
        this.config.set('slampdeskDir', this.slampdeskDir);
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
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );

            writeGruntConfig.call(this);
        },
        app: function () {

            this.fs.copyTpl(
                this.templatePath('_default.php'),
                this.destinationPath(this.siteDir + '/default.php'),
                {projectName : this.projectName}
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
                this.destinationPath(this.siteDir + '/classes/' + this.projectName + 'Site.php'),
                {projectName : this.projectName}
            );
            mkdirp(this.destinationPath(this.siteDir + '/classes'));
            mkdirp(this.destinationPath(this.siteDir + '/controllers'));
            mkdirp(this.destinationPath(this.siteDir + '/templates'));
            mkdirp(this.destinationPath(this.siteDir + '/js'));
            mkdirp(this.destinationPath(this.siteDir + '/css'));
            mkdirp(this.destinationPath(this.siteDir + '/images'));
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
            'grunt-wiredep-copy',
            'grunt-contrib-uglify',
            'grunt-contrib-cssmin',
            'grunt-newer'
        ], {'saveDev': true});
    }
});
