/* */ 
(function(process) {
  'use strict';
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var GraphQLFragmentPointer = require('./GraphQLFragmentPointer');
  var React = require('react');
  var RelayPropTypes = require('./RelayPropTypes');
  var RelayStore = require('./RelayStore');
  var RelayStoreData = require('./RelayStoreData');
  var StaticContainer = require('react-static-container');
  var getRelayQueries = require('./getRelayQueries');
  var invariant = require('fbjs/lib/invariant');
  var mapObject = require('fbjs/lib/mapObject');
  var PropTypes = React.PropTypes;
  var RelayRenderer = (function(_React$Component) {
    _inherits(RelayRenderer, _React$Component);
    function RelayRenderer(props, context) {
      _classCallCheck(this, RelayRenderer);
      _React$Component.call(this, props, context);
      this.mounted = true;
      this.state = this._runQueries(this.props);
    }
    RelayRenderer.prototype.getChildContext = function getChildContext() {
      return {route: this.props.queryConfig};
    };
    RelayRenderer.prototype._runQueries = function _runQueries(_ref) {
      var _this = this;
      var Component = _ref.Component;
      var forceFetch = _ref.forceFetch;
      var queryConfig = _ref.queryConfig;
      var querySet = getRelayQueries(Component, queryConfig);
      var onReadyStateChange = function onReadyStateChange(readyState) {
        if (!_this.mounted) {
          _this._handleReadyStateChange(_extends({}, readyState, {mounted: false}));
          return;
        }
        var _state = _this.state;
        var pendingRequest = _state.pendingRequest;
        var props = _state.renderArgs.props;
        if (request !== pendingRequest) {
          return;
        }
        if (readyState.aborted || readyState.done || readyState.error) {
          pendingRequest = null;
        }
        if (readyState.ready && !props) {
          props = _extends({}, queryConfig.params, mapObject(querySet, createFragmentPointerForRoot));
        }
        _this.setState({
          activeComponent: Component,
          activeQueryConfig: queryConfig,
          pendingRequest: pendingRequest,
          readyState: _extends({}, readyState, {mounted: true}),
          renderArgs: {
            done: readyState.done,
            error: readyState.error,
            props: props,
            retry: _this.state.renderArgs.retry,
            stale: readyState.stale
          }
        });
      };
      var request = forceFetch ? RelayStore.forceFetch(querySet, onReadyStateChange) : RelayStore.primeCache(querySet, onReadyStateChange);
      return {
        activeComponent: this.state ? this.state.activeComponent : null,
        activeQueryConfig: this.state ? this.state.activeQueryConfig : null,
        pendingRequest: request,
        readyState: null,
        renderArgs: {
          done: false,
          error: null,
          props: null,
          retry: this._retry.bind(this),
          stale: false
        }
      };
    };
    RelayRenderer.prototype._shouldUpdate = function _shouldUpdate() {
      var _state2 = this.state;
      var activeComponent = _state2.activeComponent;
      var activeQueryConfig = _state2.activeQueryConfig;
      return (!activeComponent || this.props.Component === activeComponent) && (!activeQueryConfig || this.props.queryConfig === activeQueryConfig);
    };
    RelayRenderer.prototype._retry = function _retry() {
      var readyState = this.state.readyState;
      !(readyState && readyState.error) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayRenderer: You tried to call `retry`, but the last request did ' + 'not fail. You can only call this when the last request has failed.') : invariant(false) : undefined;
      this.setState(this._runQueries(this.props));
    };
    RelayRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
      if (nextProps.Component !== this.props.Component || nextProps.queryConfig !== this.props.queryConfig || nextProps.forceFetch && !this.props.forceFetch) {
        if (this.state.pendingRequest) {
          this.state.pendingRequest.abort();
        }
        this.setState(this._runQueries(nextProps));
      }
    };
    RelayRenderer.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
      var readyState = this.state.readyState;
      if (readyState) {
        if (!prevState || readyState !== prevState.readyState) {
          this._handleReadyStateChange(readyState);
        }
      }
    };
    RelayRenderer.prototype._handleReadyStateChange = function _handleReadyStateChange(readyState) {
      var onReadyStateChange = this.props.onReadyStateChange;
      if (onReadyStateChange) {
        onReadyStateChange(readyState);
      }
    };
    RelayRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
      if (this.state.pendingRequest) {
        this.state.pendingRequest.abort();
      }
      this.mounted = false;
    };
    RelayRenderer.prototype.render = function render() {
      var children = undefined;
      var shouldUpdate = this._shouldUpdate();
      if (shouldUpdate) {
        var _props = this.props;
        var _Component = _props.Component;
        var _render = _props.render;
        var _renderArgs = this.state.renderArgs;
        if (_render) {
          children = _render(_renderArgs);
        } else if (_renderArgs.props) {
          children = React.createElement(_Component, _renderArgs.props);
        }
      }
      if (children === undefined) {
        children = null;
        shouldUpdate = false;
      }
      return React.createElement(StaticContainer, {shouldUpdate: shouldUpdate}, children);
    };
    return RelayRenderer;
  })(React.Component);
  function createFragmentPointerForRoot(query) {
    return query ? GraphQLFragmentPointer.createForRoot(RelayStoreData.getDefaultInstance().getQueuedStore(), query) : null;
  }
  RelayRenderer.propTypes = {
    Component: RelayPropTypes.Container,
    forceFetch: PropTypes.bool,
    onReadyStateChange: PropTypes.func,
    queryConfig: RelayPropTypes.QueryConfig.isRequired,
    render: PropTypes.func
  };
  RelayRenderer.childContextTypes = {route: RelayPropTypes.QueryConfig.isRequired};
  module.exports = RelayRenderer;
})(require('process'));
