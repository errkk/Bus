/* global module:false */
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-requirejs');

    grunt.initConfig({

        watch: {
            files: [
                'app/static/less/*.less',
                'app/static/less/modules/*.less'
            ],
            tasks: ['less']
        },

        less: {
            compile: {
                options: {
                    paths: ["less"]
                },
                files: {
                    "app/static/css/main.css": "app/static/less/main.less"
                }
            }
        },

        requirejs: {
            dir: 'app/static/js/build',
            appDir: 'app/static/js',
            mainConfigFile: 'app/static/js/config.js',
            baseUrl: './',
            optimize: 'uglify',
            modules: [
                {name: "app"},
            ]
        },

        // Configuration
        // -------------
        // js linting options
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                eqnull: true,
                browser: true,
                nomen: false
            },
            globals: {
                console: true,
                require: true,
                define: true,
                $: true
            }
        },

        casperjs: {
            files: ['jstest/tests/**/*.js']
        }

    });

    grunt.registerTask('launch', 'watch');
    grunt.registerTask('build', 'requirejs less');

};
