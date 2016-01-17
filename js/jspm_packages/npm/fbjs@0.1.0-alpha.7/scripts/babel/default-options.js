/* */ 
'use strict';
var babelPluginModules = require('./rewrite-modules');
module.exports = {
  nonStandard: true,
  blacklist: ['spec.functionName'],
  loose: ['es6.classes'],
  stage: 1,
  plugins: [babelPluginModules],
  _moduleMap: {
    'core-js/library/es6/map': 'core-js/library/es6/map',
    'promise': 'promise',
    'whatwg-fetch': 'whatwg-fetch'
  }
};
