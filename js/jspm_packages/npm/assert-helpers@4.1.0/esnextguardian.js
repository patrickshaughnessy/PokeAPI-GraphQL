/* */ 
'use strict';
module.exports = require('esnextguardian')(require('path').join(__dirname, 'esnext', 'lib', 'index.js'), require('path').join(__dirname, 'es5', 'lib', 'index.js'), require);
