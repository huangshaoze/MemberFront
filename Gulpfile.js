var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');


var del = require('del');
var minifyInline = require('gulp-minify-inline');
var minifyHtml = require('gulp-minify-html');
var size = require('gulp-size');
var gutil = require('gulp-util');


function __task(name) {
    return gulp.src('api/' + name + '/views/**.*')
        .pipe(minifyInline())
        .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
    }))
        .pipe(gulp.dest('views/' + name))
        .pipe(size({
        title: 'views/' + name + '/',
        showFiles: true
    }))
}

gulp.task('default', function () {
    gutil.log(gutil.colors.bgRed("请输入初始化项目名称"));
});
var apiDir = path.join(__dirname, 'api');
var list = require('./lib/scanFolder')(apiDir);
_.each(list.folders, function (file, index) {
    (function (file) {
        if (/\\views/g.test(file)) {
            var arr = file.split('\\');
            var name = arr[arr.length - 2];
            gulp.task(name, function () {
                gutil.log(gutil.colors.blue(name + " 项目开始启动"));
                del(path.join('views', name));
                gutil.log(gutil.colors.blue(name + '  [VIEW]  删除成功'));
                __task(name);
                gulp.watch('api/' + name + '/views/**.*', function (event) {
                    __task(name);
                });
            });
        }
    })(file);
});
