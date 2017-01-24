/**
 * grunt/pipeline.js
 * https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
 */

var cssFilesToInject = [
  'styles/bootstrap-mine.css',
  'styles/style.css',
  'styles/**/*.css'
];

var jsFilesToInject = [
  'js/vendor/sails.io.js',
  'js/vendor/lodash-*.min.js',
  'js/vendor/jquery-*.min.js',
  'js/vendor/moment-*.min.js',

  'js/vendor/fancybox/jquery.fancybox.pack.js',

  'js/helpers.js',
  'js/app.js',
  'js/main.js',

  'js/**/*.js'
];

var templateFilesToInject = [
  'templates/**/*.html'
];

// Default path for public folder (see documentation for more information)
var tmpPath = '.tmp/public/';

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(cssPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (cssPath[0] === '!') {
    return require('path').join('!.tmp/public/', cssPath.substr(1));
  }
  return require('path').join('.tmp/public/', cssPath);
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(jsPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (jsPath[0] === '!') {
    return require('path').join('!.tmp/public/', jsPath.substr(1));
  }
  return require('path').join('.tmp/public/', jsPath);
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(tplPath) {
  // If we're ignoring the file, make sure the ! is at the beginning of the path
  if (tplPath[0] === '!') {
    return require('path').join('!assets/', tplPath.substr(1));
  }
  return require('path').join('assets/',tplPath);
});
