module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        wiredep: {
            install: {
                src: ['default.page.php']
            }
        },

        watch: {
            files: ['bower_components/*'],
            tasks: ['wiredep']
        }
    });

    grunt.registerTask('default', ['wiredep']);
    grunt.registerTask('watch', ['watch']);

    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
