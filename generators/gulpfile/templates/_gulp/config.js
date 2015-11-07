/*jshint node:true */
'use strict';

var srcDir = './html';
var jsDir = srcDir + '/js';
var jsFiles = [jsDir + '/*.js', '!' + jsDir + '/*.min.js'];
var babelFiles = [jsDir + '/*.jsx'];
var cssDir = srcDir + '/css';
var cssFiles = [cssDir + '/*.css', '!' + cssDir + '/*.min.css'];
var imageFiles = ['raw_images/**/*'];

module.exports = {
  srcDir: srcDir,
  jsDir: jsDir,
  cssDir: cssDir,
  files: {
    js: jsFiles,
    babel: babelFiles,
    css: cssFiles,
    images: imageFiles
  },
  bower: {
    dist: srcDir + '/bower_components',
    bundleName: 'vendor',
    excludeFromBundle: []
  },
  bowerPath: './bower.json'
};
