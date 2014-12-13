var del = require('del'),
    gulp = require('gulp'),
    gJasmine = require('gulp-jasmine'),
    gRename = require('gulp-rename'),
    gUglify = require('gulp-uglify'),
    jsdom = require('jsdom'),
    jquery = require('jquery')(jsdom.jsdom().parentWindow),
    EventEmitter = require('./js/EventEmitter.js');

gulp.task('clean', function() {
    del('dist/*.js', {
        force: true
    });
});

gulp.task('test', function () {
    global.$ = jquery;
    global.EventEmitter = EventEmitter;
    gulp.src('./test/**/*.spec.js')
        .pipe(gJasmine());
});

gulp.task('build', ['clean', 'test'], function() {
    gulp.src('js/*.js')
        .pipe(gUglify({
            compress: {},
            mangle: true
        }))
        .pipe(gRename('EventEmitter.min.js'))
        .pipe(gulp.dest('./dist'));
});
