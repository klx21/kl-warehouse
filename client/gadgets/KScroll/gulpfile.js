'use strict';

var gulp = require('gulp'),
    gJasmine = require('gulp-jasmine'),
    gRename = require('gulp-rename'),
    gUglify = require('gulp-uglify'),
    jsdom = require('jsdom'),
    jquery = require('jquery')(jsdom.jsdom().parentWindow);

gulp.task('build', function() {});