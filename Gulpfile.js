var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var del = require('del');

var paths = {
  appScript: ['./src/app.jsx']
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('scripts', function() {
  return browserify(paths.appScript)
    .transform(reactify)
    .bundle()
    .pipe(source('all.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['scripts'], function() {
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['clean', 'build']);
