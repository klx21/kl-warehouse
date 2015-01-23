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
        gAT = require('gulp-angular-templatecache'),
        gAutoprefixer = require('gulp-autoprefixer'),
        gConcat = require('gulp-concat'),
        gConcatCss = require('gulp-concat-css'),
        gIf = require('gulp-if'),
        gJshint = require('gulp-jshint'),
        gMinifyCSS = require('gulp-minify-css'),
        gSass = require('gulp-sass'),
        gUglify = require('gulp-uglify'),
        gUtil = require('gulp-util'),
        gWebserver = require('gulp-webserver'),
        rimraf = require('rimraf');

    gulp.task('build-dev-css', [
        'clean-assets-css'
    ], function () {

        return buildCss('k-dialog.css');
    });

    gulp.task('build-dev-js', [
        'clean-dist'
    ], function () {

        return buildJs('k-dialog.js');
    });

    gulp.task('build-dist-css', [
        'clean-assets-css'
    ], function () {

        return buildCss('k-dialog.min.css', true);
    });

    gulp.task('build-dist-js', [
        'clean-dist'
    ], function () {

        return buildJs('k-dialog.min.js', true);
    });

    gulp.task('clean-assets-css', function (cb) {

        del('./assets/*.css', function () {

            cb();
        });
    });

    gulp.task('clean-dist', function (cb) {

        del('./dist', function () {

            cb();
        });
    });

    gulp.task('copy-assets', [
        'copy-css',
        'copy-images'
    ]);

    gulp.task('copy-css', [
        'clean-dist',
        'build-dev-css',
        'build-dist-css'
    ], function () {

        return gulp
            .src('./assets/*.css')
            .pipe(gulp.dest('./dist/assets'));
    });

    gulp.task('copy-images', [
        'clean-dist'
    ], function () {

        return gulp
            .src('./assets/images/*.png')
            .pipe(gulp.dest('./dist/assets/images'));
    });

    gulp.task('default', ['dist']);

    gulp.task('dist', [
        'clean-dist',
        'build-dev-js',
        'build-dist-js',
        'copy-assets'
    ]);

    gulp.task('jshint', function () {

        return gulp
            .src('./scripts/*.js')
            .pipe(gJshint())
            .pipe(gJshint.reporter('gulp-jshint-html-reporter', {
                filename: __dirname + '/jshint-report_' + Date.now() + '.html'
            }));
    });

    gulp.task('serve-src', [
        'build-dev-css',
        'watch-sass'
    ], function () {

        gulp
            .src([
                '.',
                './demo'
            ])
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

        return gulp.watch('./scss/*.scss', [
            'build-dev-css'
        ]);
    });

    function buildJs(sFilename, bUglify) {

        return gulp
            .src([
                './scripts/*.js',
                './templates/*.tpl.html'
            ])
            .pipe(gIf('*.tpl.html', gAT('templates.js', {
                module: 'kl.dialog',
                root: '../templates/'
            })))
            .pipe(gConcat(sFilename))
            .pipe(bUglify ?
                gUglify({
                    compress: {}
                }) :
                gUtil.noop())
            .pipe(gulp.dest('./dist/js'));
    }

    function buildCss(sFilename, bMinify) {

        return gulp
            .src([
                './scss/*.scss',
                './scss/**/*.scss'
            ])
            .pipe(gSass())
            .pipe(gAutoprefixer())
            .pipe(bMinify ?
                gMinifyCSS() :
                gUtil.noop())
            .pipe(gConcatCss(sFilename))
            .pipe(gulp.dest('./assets'));
    }

}());
