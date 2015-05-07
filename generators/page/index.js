'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var shell = require('shelljs');

module.exports = yeoman.generators.Base.extend({

    initializing: function () {
        if (!this.config.get('projectName')) {
            this.log("You have to run 'yo slamp' first!");
            process.exit(1);
        }
        this.siteDir = this.config.get('siteDir');
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
                name: 'page',
                message: 'Name of the page (without extension):'
            }
        ];

        this.prompt(prompts, function (props) {
            this.page = props.page;
            done();
        }.bind(this));
    },

    writing: function () {
        this.fs.copyTpl(
            this.templatePath('_page.php'),
            this.destinationPath(this.siteDir + '/controllers/' + this.page + '.php'),
            { page : this.page }
        );
        this.fs.copyTpl(
            this.templatePath('_page.template.php'),
            this.destinationPath(this.siteDir + '/templates/' + this.page + '.page.php'),
            { page : this.page }
        );
        this.fs.copyTpl(
            this.templatePath('_page.js'),
            this.destinationPath(this.siteDir + '/js/' + this.page + '.js'),
            { page : this.page }
        );
    }
});
