var gulp = require('gulp')
var trac = require('gulp-trac')
var rename = require('gulp-rename')
var optimize = require('gulp-requirejs-optimize')

gulp.task('transformSingleFileComponent', function() {
  return gulp.src('assets/components/*.html')
    .pipe(trac({moduleFormat: 'amd'}))
    .pipe(rename(function(filename) {filename.extname = '.js'}))
    .pipe(gulp.dest('assets/js/components/'))
})

gulp.task('amdOptimize', ['transformSingleFileComponent'], function() {
  return gulp.src("assets/js/*.js")
    // Traces all modules and outputs them in the correct order.
    .pipe(amdOptimize("main"))
    .pipe(gulp.dest("assets-build/js"))
})

gulp.task('default', ['amdOptimize'])
