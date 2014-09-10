var gulp = require('gulp');
var gReact = require('gulp-react');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');

var paths = {
  scripts: ['src/**/*.js']
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(gReact({harmony: true}))
    .pipe(gulp.dest('build/js'));
});

gulp.task('build', ['scripts'], function() {
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['clean', 'build']);
