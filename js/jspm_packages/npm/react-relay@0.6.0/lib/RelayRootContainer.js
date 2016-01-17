/* */ 
'use strict';
var React = require('react');
var RelayPropTypes = require('./RelayPropTypes');
var RelayRenderer = require('./RelayRenderer');
var PropTypes = React.PropTypes;
function RelayRootContainer(_ref) {
  var Component = _ref.Component;
  var forceFetch = _ref.forceFetch;
  var onReadyStateChange = _ref.onReadyStateChange;
  var renderFailure = _ref.renderFailure;
  var renderFetched = _ref.renderFetched;
  var renderLoading = _ref.renderLoading;
  var route = _ref.route;
  return React.createElement(RelayRenderer, {
    Component: Component,
    forceFetch: forceFetch,
    onReadyStateChange: onReadyStateChange,
    queryConfig: route,
    render: function(_ref2) {
      var done = _ref2.done;
      var error = _ref2.error;
      var props = _ref2.props;
      var retry = _ref2.retry;
      var stale = _ref2.stale;
      if (error) {
        if (renderFailure) {
          return renderFailure(error, retry);
        }
      } else if (props) {
        if (renderFetched) {
          return renderFetched(props, {
            done: done,
            stale: stale
          });
        } else {
          return React.createElement(Component, props);
        }
      } else {
        if (renderLoading) {
          return renderLoading();
        }
      }
      return undefined;
    }
  });
}
RelayRootContainer.propTypes = {
  Component: RelayPropTypes.Container,
  forceFetch: PropTypes.bool,
  onReadyStateChange: PropTypes.func,
  renderFailure: PropTypes.func,
  renderFetched: PropTypes.func,
  renderLoading: PropTypes.func,
  route: RelayPropTypes.QueryConfig.isRequired
};
RelayRootContainer.childContextTypes = {route: RelayPropTypes.QueryConfig.isRequired};
module.exports = RelayRootContainer;
