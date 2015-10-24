/*jshint node:true */
'use strict';

//gulp require-dir gulp-babel wiredep gulp-load-plugins gulp-newer gulp-debug
//gulp-sourcemaps gulp-uglify gulp-rename gulp-minify-css gulp-if gulp-cache
//gulp-autoprefixer gulp-cssnano gulp-imagemin gulp-assets gulp-clean

var gulp = require('gulp');

gulp.task('default', ['scripts', 'styles', 'images', 'bower']);
