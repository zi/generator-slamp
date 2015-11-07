/*jshint node:true */
'use strict';

const srcDir = './html';
const jsDir = srcDir + '/js';
const jsFiles = [jsDir + '/*.js', '!' + jsDir + '/*.min.js'];
const babelFiles = [jsDir + '/*.jsx'];
const cssDir = srcDir + '/css';
const cssFiles = [cssDir + '/*.css', '!' + cssDir + '/*.min.css'];
const imageFiles = ['raw_images/**/*'];
const bowerJsonPath = './bower.json';

const getBowerConfig = () => {
  const fs = require('fs');
  return JSON.parse(fs.readFileSync(bowerJsonPath, 'utf8'));
};

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
    baseDir: srcDir,
    destinationDir: srcDir + '/bower_components',
    bundleName: 'vendor',
    excludeFromBundle: [],
    getBowerConfig: getBowerConfig,
    addRootSlash: false
  }
};
