/* */ 
'use strict';
var _extends = require('babel-runtime/helpers/extends')['default'];
var RelayDefaultNetworkLayer = require('./RelayDefaultNetworkLayer');
var RelayPublic = require('./RelayPublic');
RelayPublic.injectNetworkLayer(new RelayDefaultNetworkLayer('/graphql'));
module.exports = _extends({}, RelayPublic, {DefaultNetworkLayer: RelayDefaultNetworkLayer});
