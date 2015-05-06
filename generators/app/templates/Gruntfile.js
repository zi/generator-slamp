module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({

        wiredep: {
            install: {
                src: ['default.page.php']
            }
        },

        uglify: {
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
        },

        cssmin: {
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
        },

        watch: {
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
        }
    });

    grunt.registerTask('default', ['wiredep, uglify, cssmin']);
    grunt.registerTask('watch', ['watch']);

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};