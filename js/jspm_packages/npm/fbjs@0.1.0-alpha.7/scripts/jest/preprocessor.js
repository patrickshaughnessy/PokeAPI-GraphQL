/* */ 
(function(process) {
  var assign = require('object-assign');
  var babel = require('babel');
  var babelDefaultOptions = require('../babel/default-options');
  var babelOpts = babelDefaultOptions;
  module.exports = {process: function(src, path) {
      if (!path.match(/\/node_modules\//) && !path.match(/\/third_party\//)) {
        return babel.transform(src, assign({filename: path}, babelOpts)).code;
      }
      return src;
    }};
})(require('process'));
