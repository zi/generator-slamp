/*jshint node:true */
'use strict';

//npm install --save-dev gulp gulp-babel wiredep gulp-load-plugins gulp-newer gulp-debug gulp-sourcemaps gulp-uglify gulp-rename gulp-minify-css gulp-if gulp-cache gulp-autoprefixer gulp-cssnano gulp-imagemin gulp-assets gulp-clean

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({camelize: true});
var wiredep = require('wiredep').stream;

var config = {
  srcDir: './html'
};
var jsDir = config.srcDir + '/js';
var jsFiles = [jsDir + '/*.js', '!' + jsDir + '/*.min.js'];
var babelFiles = [jsDir + '/*.jsx'];
var cssDir = config.srcDir + '/css';
var cssFiles = [cssDir + '/*.css', '!' + cssDir + '/*.min.css'];
var imageFiles = ['raw_images/**/*'];

gulp.task('wiredep:dev', function() {
  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.debug({title: 'debug: wiredep:dev'}))
    .pipe(wiredep({
      ignorePath: '..',
      overrides: {
        bootstrap: {
          main: [
              'dist/css/bootstrap.css',
              'dist/js/bootstrap.js'
          ]
        }
      }
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(gulp.dest(config.srcDir));
});

gulp.task('wiredep:prod', function() {
  return gulp.src(config.srcDir + '/default.page.php')
    .pipe($.debug({title: 'debug: wiredep:prod'}))
    .pipe(wiredep({
      ignorePath: '..',
      overrides: {
        jquery: {'main': 'dist/jquery.min.js'},
        bootstrap: {
          main: [
              'dist/css/bootstrap.min.css',
              'dist/js/bootstrap.min.js'
          ]
        },
        angular: {'main': 'angular.min.js'},
        react: {'main': 'react.min.js'}
      }
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe(gulp.dest(config.srcDir));
});

gulp.task('wiredepCopy', ['clean:bower'], function() {
  return gulp.src(config.srcDir + '/default.php')
    .pipe($.assets({cwd: '../', js: 'js', css: 'css'}))
    .pipe($.rename(function(path) {
      path.dirname = config.srcDir + '/' + path.dirname;
    }))
    .pipe($.debug({title: 'debug: wiredepCopy'}))
    .pipe(gulp.dest(config.srcDir));
});

gulp.task('bower:prod', ['wiredep:prod'], function() {
  return gulp.start('wiredepCopy');
});
gulp.task('bower:dev', ['wiredep:dev'], function() {
  return gulp.start('wiredepCopy');
});
gulp.task('clean:bower', function() {
  return gulp.src(config.srcDir + '/bower_components')
    .pipe($.clean());
});

gulp.task('scripts', function() {
  return gulp.src(jsFiles)
    .pipe($.newer({dest: jsDir, ext: '.min.js'}))
    .pipe($.debug({title: 'debug: scripts'}))
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify({compress: {'drop_console': true}}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(jsDir));
});

gulp.task('babel', function() {
  return gulp.src(babelFiles)
    .pipe($.newer({dest: jsDir, ext: '.js'}))
    .pipe($.debug({title: 'debug: babel'}))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', $.notify.onError({
      message: 'Error: <%= error.message %>',
      sound: false
    }))
    .on('error', function(e) {
      console.log('>>> ERROR', e);
      this.emit('end');
    })
    .pipe($.rename({extname: '.js'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(jsDir));
});

gulp.task('styles', function() {
  return gulp.src(cssFiles)
    .pipe($.newer({dest: cssDir, ext: '.min.css'}))
    .pipe($.debug({title: 'debug: styles'}))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(cssDir));
});

gulp.task('images', function() {
  return gulp.src(imageFiles)
    .pipe($.debug({title: 'debug: images'}))
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{cleanupIDs: false}] // don't remove IDs from SVGs, they are often used as hooks for embedding and styling
    }))
    .on('error', function(err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest(config.srcDir + '/images'));
});

gulp.task('compress', ['scripts', 'styles', 'images']);
gulp.task('default', ['compress', 'bower:prod']);

gulp.task('watch', function() {
  gulp.watch(cssFiles, ['styles']);
  gulp.watch(jsFiles, ['scripts']);
  gulp.watch(babelFiles, ['babel']);
  gulp.watch(imageFiles, ['images']);
});
