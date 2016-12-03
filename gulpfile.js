var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./gulp-tasks');

gulp.task('serve:before', ['default','watch']);

gulp.task('default', ['sass', 'templatecache']);
