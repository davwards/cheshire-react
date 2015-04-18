var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');

var watcherOptions = watchify.args;
watcherOptions.entries = ['./js/cheshire.js'];
var builder = watchify(browserify(watcherOptions));

gulp.task('js', bundle);
builder.on('update', bundle);
builder.on('log', gutil.log);

gulp.task('default', ['js']);

function bundle() {
  return builder.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/'));
}
