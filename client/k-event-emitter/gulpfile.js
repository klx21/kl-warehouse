/**
 * Created by huanli<klx211@gmail.com> on 11/17/14.
 *
 * Variable prefixes' meanings:
 * -------------------------------------------------------------------------
 * --- The prefix of a variable's name reveals the type of data it holds ---
 * -------------------------------------------------------------------------
 *
 * a: Array
 * b: Boolean
 * d: DOM
 * f: Function
 * l: List(an array-like object)
 * n: Number
 * o: Object
 * r: Regular expression
 * s: String
 * x: More than one type
 *  : Special case or NOT my code
 *
 * *** These prefixes can be concatenated to indicate that the variable can
 *         hold the specified types of data ***
 */

'use strict';

require('./lib/object-assign.js');

var del = require('del'),
    gulp = require('gulp'),
    gJasmine = require('gulp-jasmine'),
    gRename = require('gulp-rename'),
    gUglify = require('gulp-uglify'),
    KEventEmitter = require('./js/k-event-emitter.js');

gulp.task('clean', function () {

    del('dist/*.js', {
        force: true
    });
});

gulp.task('test', function () {

    global.KEventEmitter = KEventEmitter;

    return gulp.src('./test/**/*.spec.js')
        .pipe(gJasmine());
});

gulp.task('copy-js', ['clean'], function() {

    gulp.src('./js/*.js')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['clean', 'test'], function () {

    return gulp.src('js/*.js')
        .pipe(gUglify({
            compress: {},
            mangle: true
        }))
        .pipe(gRename('k-event-emitter.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['test', 'copy-js', 'build']);