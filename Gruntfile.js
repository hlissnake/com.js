// Generated on 2013-10-14 using generator-website 0.1.0
'use strict';
var LIVERELOAD_PORT = 35728;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
//支持post start
var fs = require('fs');
var restSupport = require('connect-rest');
restSupport.post({
    path: '/**/*.json'
}, function(req, content, next) {
    fs.readFile('.' + req.headers.originalUrl, 'utf8', function(err, result) {
        var json = JSON.parse(result);
        next(null, json);
    })
});
//支持post end
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


// ATC 模板预编译工具
var TmodJS = require('tmodjs');

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // page that you want to build.

    grunt.initConfig({

        watch: {
            build: {
                files: [
                    'src/**/*.js'
                ],
                tasks: ['transport','concat','uglify:com']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    //'{.tmp,./}/js/{,*/}*.js',
                    'src/**/*.js'
                    //'views/{,*/}*.vm',
                    //'json/**/*.json'
                ],
                tasks: ['transport','concat','uglify:com']
            }
        },
        connect: {
            options: {
                port: 9877,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'build'),
                            mountFolder(connect, 'demo'),
                            mountFolder(connect, 'src'),
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            'build/*',
                            '!build/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'js/{,*/}*.js'
            ]
        },
        uglify: {
            com : {
                files: [{
                    cwd: 'build',
                    src: ['com.js', '!*-min.js'],
                    dest: 'build/',
                    expand: true,
                    flatten: false
                }]
            },
            demo : {
                files: [{
                    cwd: 'demo',
                    src: ['**/*.js', '!**/*-min.js'],
                    dest: 'demo/',
                    expand: true,
                    ext: '-min.js'
                }]
            }
        },
        transport: {
            options : {
                paths : [
                    'src'
                ],
                debug: false,
                alias : {
                }
            },
            dist : {
                files : [
                    {
                        cwd : 'src',
                        expand : true,
                        src: ['com/**.js'],
                        dest: 'build/'
                    }
                ]
            }
        },

        concat: {
            page: {
                options: {
                    include: 'all'
                },
                files : [
                    {
                        //src : ['<%= srcBase %>/<%= pageBase %>/<%= page %>/mods/*.js', '<%= srcBase %>/<%= pageBase %>/<%= page %>/index.js'],
                        src : 'build/com/**.js',
                        dest : 'build/com.js'
                    }
                ]
            }
        },

        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/pp/tpl',
                        dest: 'build/js/pp/tpl',
                        src: [
                            '**/tempalte.js'
                        ]
                    }
                ]
            }
        },
        concurrent: {
            server: [
                'compass:server'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin'
            ]
        }
    });

    grunt.registerTask('server', [
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('build', [
        'transport',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
