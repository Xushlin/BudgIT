module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            scripts: {
                src: ['Scripts/angular.min.js', 'Scripts/angular-ui-router.js', 'Scripts/jquery-2.2.0.min.js',
                    'Scripts/bootstrap.js', 'Scripts/ui-bootstrap-tpls-1.2.4.js',
                    'Scripts/ng-tags-input.js', 'Scripts/underscore.min.js',
                    'Scripts/bootstrap-colorpicker-module.js',
                    'Scripts/angular-local-storage.min.js',
                    'Scripts/ng-file-upload/angular-file-upload.min.js',
                    'Scripts/ng-file-upload/angular-file-upload-shim.min.js'],
                dest: 'dist/js/scripts.js'
            },
            app: {
                src: ['Client/app/app.js'],
                dest: 'dist/js/app.js'
            },
            services: {
                src: ['Client/app/Services/*.js', 'Client/app/Filters/*.js', 'Client/app/Directives/*.js'],
                dest: 'dist/js/services.js'
            },
            routes: {
                src: ['Client/app/Routes/*.js', 'Client/app/Routes/**/*.js', 'Client/app/Routes/**/**/*.js'],
                dest: 'dist/js/routes.js'
            },
            css: {
                src: ['Content/*.css'],
                dest: 'dist/css/builtCss.css'
            }

        },
        less: {
            development: {
                files: {
                    'dist/css/built.css': 'Client/app/app.less'
                }
            }
        },
        watch: {
            scripts: {
                files: ['Scripts/angular.min.js', 'Scripts/angular-ui-router.js', 'Scripts/jquery-2.2.0.min.js', 'Scripts/bootstrap.js', 'Scripts/ui-bootstrap-tpls-1.2.4.js', 'Scripts/ng-tags-input.js', 'Scripts/underscore.min.js', 'Scripts/bootstrap-colorpicker-module.js', 'Scripts/angular-local-storage.min.js'],
                tasks: 'concat:scripts'
            },
            app: {
                files: ['Client/app/app.js'],
                tasks: 'concat:app'
            },
            services: {
                files: ['Client/app/Services/*.js', 'Client/app/Filters/*.js', 'Client/app/Directives/*.js'],
                tasks: 'concat:services'
            },
            routes: {
                files: ['Client/app/Routes/*.js', 'Client/app/Routes/**/*.js', 'Client/app/Routes/**/**/*.js'],
                tasks: 'concat:routes'
            },
            css: {
                files: ['Content/*.css'],
                tasks: 'concat:css'
            },
            styles:{
                files: ['Client/app/*.less'],
                tasks: 'less'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['concat', 'less', 'watch']);

};