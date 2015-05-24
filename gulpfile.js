var gulp = require('gulp');

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');

var watcherOptions = watchify.args;
watcherOptions.entries = ['./js/cheshire.js'];
var builder = watchify(browserify(watcherOptions));

function bundle() {
  return builder.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/'));
}

gulp.task('js', bundle);
builder.on('update', bundle);
builder.on('log', gutil.log);

gulp.task('sass', function() {
  return sass('scss/main.scss')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.watch('scss/*.scss', ['sass']);

gulp.task('default', ['js', 'sass', 'html']);
