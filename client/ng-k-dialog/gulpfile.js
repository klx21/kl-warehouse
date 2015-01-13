/**
 * Created by huanli<klx211@gmail.com> on 12/29/14.
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

var gulp = require('gulp'),
    gSass = require('gulp-sass'),
    gWebserver = require('gulp-webserver');

gulp.task('default', [], function () {
});

gulp.task('compile-sass-to-css', function () {
    return gulp.src(['./scss/*.scss', './scss/**/*.scss'])
        .pipe(gSass())
        .pipe(gulp.dest('./assets'));
});

gulp.task('serve-dev', ['compile-sass-to-css', 'watch-sass'], function () {
    gulp.src(['.', './demo'])
        .pipe(gWebserver({
            directoryListing: false,
            fallback: 'index.html',
            livereload: {
                enable: true,
                port: 7778
            },
            open: true,
            port: 7777
        }));
});

gulp.task('watch-sass', function () {
    gulp.watch('./scss/*.scss', ['compile-sass-to-css']);
});

