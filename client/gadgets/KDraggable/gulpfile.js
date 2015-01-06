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

(function () {
    'use strict';

    var del = require('del'),
        gulp = require('gulp'),
        gJshint = require('gulp-jshint'),
        gMinifyCSS = require('gulp-minify-css'),
        gRename = require('gulp-rename'),
        gSass = require('gulp-sass'),
        gUglify = require('gulp-uglify'),
        gWebserver = require('gulp-webserver'),
        rimraf = require('rimraf');

    gulp.task('build-minified-css', ['clean-dist'], function () {

        return gulp.src(['./scss/*.scss', './scss/**/*.scss'])
            .pipe(gSass())
            .pipe(gMinifyCSS())
            .pipe(gRename('k-draggable.min.css'))
            .pipe(gulp.dest('./dist/css'));
    });

    gulp.task('build-uglified-js', ['clean-dist'], function () {

        gulp.src('scripts/*.js')
            .pipe(gUglify({
                compress: {}
            }))
            .pipe(gRename('k-draggable.min.js'))
            .pipe(gulp.dest('./dist/js'));
    });

    gulp.task('clean-dist', function () {

        del.sync('./dist', {
            force: true
        });
    });

    gulp.task('clean-assets-css', function () {

        del.sync('./assets/*.css', {
            force: true
        });
    });

    gulp.task('compile-sass-to-css', ['clean-assets-css'], function () {

        return gulp.src(['./scss/*.scss', './scss/**/*.scss'])
            .pipe(gSass())
            .pipe(gulp.dest('./assets'));
    });

    gulp.task('copy-js', ['clean-dist'], function () {

        gulp.src('scripts/*.js')
            .pipe(gRename('k-draggable.js'))
            .pipe(gulp.dest('./dist/js'));
    });

    gulp.task('copy-css', ['clean-dist', 'compile-sass-to-css'], function () {

        gulp.src('./assets/*.css')
            .pipe(gulp.dest('./dist/css'));
    });

    gulp.task('default', ['dist']);

    gulp.task('dist', ['clean-dist', 'copy-js', 'build-uglified-js', 'copy-css', 'build-minified-css']);

    gulp.task('jshint', function () {

        return gulp.src('./scripts/*.js')
            .pipe(gJshint())
            .pipe(gJshint.reporter('gulp-jshint-html-reporter', {
                filename: __dirname + '/jshint-report_' + Date.now() + '.html'
            }));
    });

    gulp.task('serve-dev', ['compile-sass-to-css', 'watch-sass'], function () {

        gulp.src('.')
            .pipe(gWebserver({
                directoryListing: false,
                fallback: 'demo/index.html',
                livereload: {
                    enable: true,
                    port: 8889
                },
                open: true,
                port: 8888
            }));
    });

    gulp.task('watch-sass', function () {

        gulp.watch('./scss/*.scss', ['compile-sass-to-css']);
    });

}());