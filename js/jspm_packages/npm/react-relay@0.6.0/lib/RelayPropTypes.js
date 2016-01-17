/* */ 
'use strict';
var _require = require('react');
var PropTypes = _require.PropTypes;
var isRelayContainer = require('./isRelayContainer');
var sprintf = require('fbjs/lib/sprintf');
var RelayPropTypes = {
  Container: function Container(props, propName, componentName) {
    var component = props[propName];
    if (component == null) {
      return new Error(sprintf('Required prop `%s` was not specified in `%s`.', propName, componentName));
    } else if (!isRelayContainer(component)) {
      return new Error(sprintf('Invalid prop `%s` supplied to `%s`, expected a RelayContainer.', propName, componentName));
    }
    return null;
  },
  QueryConfig: PropTypes.shape({
    name: PropTypes.string.isRequired,
    params: PropTypes.object.isRequired,
    queries: PropTypes.object.isRequired,
    uri: PropTypes.object
  })
};
module.exports = RelayPropTypes;
