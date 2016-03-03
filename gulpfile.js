var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var concat = require('gulp-concat');

gulp.task('css', function () {
  return gulp.src('./browser/css/*.css')
    .pipe(concatCss("styles.css"))
    .pipe(gulp.dest('./src/css/'));
});

gulp.task('scripts', function() {
  return gulp.src('./browser/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./src/js/'));
});

gulp.task('default', ['css', 'scripts']);