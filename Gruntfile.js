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
    var pageName = grunt.option('page') || grunt.file.readJSON('p.json').page;

    grunt.initConfig({

        page : pageName,

        watch: {
            template: {
                files: ['js/pp/tpl/**/*.html'],
                tasks: ['tpl']
            },
            compass: {
                files: [
                    'css/{,*/}*.css',
                    'css/{,*/}*.{scss,sass}'
                ],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '{.tmp,./}/css/{,*/}*.css',
                    //'{.tmp,./}/js/{,*/}*.js',
                    'js/**/*.js',
                    'image/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    //'views/{,*/}*.vm',
                    //'json/**/*.json'
                ]
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
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, '.'),
                            restSupport.rester({'context': '/json'})//支持post
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'build')
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
        compass: {
            options: {
                sassDir: 'css',
                cssDir: '.tmp/css',
                generatedImagesDir: '.tmp/image/sprites',
                imagesDir: 'image',
                javascriptsDir: 'js',
                fontsDir: 'css/fonts',
                //importPath: 'components',
                httpImagesPath: '/image',
                httpGeneratedImagesPath: '/image/sprites',
                relativeAssets: true,
                outputStyle: 'compressed',
                noLineComments: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        uglify: {
            files: {
                cwd: 'build',
                src: ['js/**/*.js', '!ueditor/'],
                dest: 'build/',
                expand: true,
                flatten: false
            }
        },
        transport: {
            options : {
                paths : [
                    'js/pp'
                ],
                debug: false,
                alias : {
                    'api/bridge/launch': 'api/bridge/launch',
                    'jQuery': 'lib/jquery-1.9.1.min',
                    'tmpl': 'lib/jquery.tmpl',
                    'jQCookie': 'lib/jquery.cookie.min',
                    'underscore': 'lib/underscore-1.5.2.min',
                    'blocksit': 'lib/blocksit/blocksit.min',
                    'fancybox': 'lib/jquery.fancybox.pack',
                    'uploadify': 'lib/jquery.uploadify',
                    'reminderBar': 'module/reminder-bar',
                    'EC': 'module/event-center',
                    'Backbone': 'lib/Backbone.js',
                    'common': 'page/common.js'
                }
            },
            dist : {
                files : [
                    {
                        cwd : 'js/pp',
                        expand : true,
                        src: ['module/**/*.js', 'lib/**/*.js', 'page/**/*.js', 'tpl/**/*.js', '!ueditor/'],
                        dest: 'build/js/pp'
                    }
                ]
            }
        },

        concat: {
            page: {
                options: {
                    include: 'relative'
                },
                files : [
                    {
                        //src : ['<%= srcBase %>/<%= pageBase %>/<%= page %>/mods/*.js', '<%= srcBase %>/<%= pageBase %>/<%= page %>/index.js'],
                        expand : true,
                        cwd : 'build/js/pp/',
                        src : 'page/<%= page %>/index.js',
                        dest : 'build/js/pp/'
                    }
                ]
            }
        },

        rev: {
            dist: {
                files: {
                    src: [
                        'build/js/{,*/}*.js',
                        'build/css/{,*/}*.css',
                        'build/image/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        'build/css/fonts/*'
                    ]
                }
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'image',
                        src: '{,*/}*.{png,jpg,jpeg}',
                        dest: 'build/image'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'image',
                        src: '{,*/}*.svg',
                        dest: 'build/image'
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                files: {
                    'build/css/pp/pstyle.css': [
                        '.tmp/css/pp/pstyle.css'
                    ],
                    'build/css/pubweb.css': [
                        '.tmp/css/pubweb.css'
                    ],
                    'build/css/index.css': [
                        '.tmp/css/index.css'
                    ],
                }
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: './',
                        dest: 'build',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess',
                            'image/{,*/}*.*',
                            'css/fonts/*.{eot,svg,ttf,woff}',
                            //'js/{,*/}*.js',
                            'js/**/*.*',
                            '!ueditor/'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'js/pp/tpl',
                        dest: 'build/js/pp/tpl',
                        src: [
                            '**/tempalte.js'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/image',
                        dest: 'build/image',
                        src: [
                            'sprites/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/css',
                        dest: 'build/css',
                        src: [
                            '**/*.css'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'css/iconfont',
                        dest: 'build/css/iconfont',
                        src: [
                            '**/*.*'
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

    // TModJS 模板预编译工具Task，编译制定Page路面的 模板文件
    grunt.registerTask('tpl', function(target){

        // 配置
        var options = {
                output: './build',
                charset: 'utf-8',
                debug: false // 此字段不会保存在配置中
            }
        ,   path = './js/pp/tpl/' + pageName
        ;

        // 初始化 TmodJS
        // path {String}    模板目录
        // options {Object} 选项
        TmodJS.init(path, options);

        // 监听编译过程的事件
        // 支持的事件有：compile、change、load、compileError、combo
        //TmodJS.on('compile', function (data) {console.log(data)});

        // 监控模板修改
        // modJS.watch();
        // 编译模板
        // file {String} 参数可选，无则编译整个模板目录，否则编译指定的模板文件
        // recursion {Boolean} 若为 false 则不编译依赖的模板
        TmodJS.compile();//file, recursion);

        // 获取用户配置
        //TmodJS.getUserConfig();

        // 保存用户设置到模板目录 package.json 文件中
        TmodJS.saveUserConfig();

    })

    grunt.registerTask('build', [
        'concat',
        'copy',
        'transport',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};
