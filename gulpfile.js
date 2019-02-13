const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('clean', () => del(['build/*']));

gulp.task('make-service', () => {
  return gulp
    .src('server/**/*')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('make-public', () => {
  return gulp
    .src('public/**/*')
    .pipe(gulp.dest('build/public'));
});

gulp.task('default', gulp.series(
  'clean',
  'make-service',
  'make-public',
));
