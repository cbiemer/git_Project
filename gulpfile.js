var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
    gulp.src('src/ladda/ladda-themeless.min.css')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/ladda/ladda.jquery.min.js')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/ladda/ladda.min.css')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/ladda/ladda.min.js')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/ladda/spin.min.js')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/ladda/demo.css')
      .pipe(gulp.dest('dist/ladda'));
    gulp.src('src/Images/*')
      .pipe(gulp.dest('dist/Images'));
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});