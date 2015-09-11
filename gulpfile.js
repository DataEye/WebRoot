// gulp-racpack
var gulp = require('gulp')
var trac = require('gulp-trac')
var rename = require('gulp-rename')

gulp.task('transformSingleFileComponent', function() {
  return gulp.src('assets/components/*.html')
    .pipe(trac({moduleFormat: 'amd'}))
    .pipe(rename(function(filename) {filename.extname = '.js'}))
    .pipe(gulp.dest('assets/js/components/'))
})

gulp.task('default', ['transformSingleFileComponent'])
