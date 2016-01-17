/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var QueryBuilder = require('./QueryBuilder');
  var forEachObject = require('fbjs/lib/forEachObject');
  var invariant = require('fbjs/lib/invariant');
  var warning = require('fbjs/lib/warning');
  var RelayFragmentReference = (function() {
    RelayFragmentReference.createForContainer = function createForContainer(fragmentGetter, initialVariables, variableMapping, prepareVariables) {
      var reference = new RelayFragmentReference(fragmentGetter, initialVariables, variableMapping, prepareVariables);
      reference._isContainerFragment = true;
      return reference;
    };
    function RelayFragmentReference(fragmentGetter, initialVariables, variableMapping, prepareVariables) {
      _classCallCheck(this, RelayFragmentReference);
      this._initialVariables = initialVariables || {};
      this._fragment = undefined;
      this._fragmentGetter = fragmentGetter;
      this._isContainerFragment = false;
      this._isDeferred = false;
      this._isTypeConditional = false;
      this._variableMapping = variableMapping;
      this._prepareVariables = prepareVariables;
    }
    RelayFragmentReference.prototype.defer = function defer() {
      this._isDeferred = true;
      return this;
    };
    RelayFragmentReference.prototype.conditionOnType = function conditionOnType() {
      this._isTypeConditional = true;
      return this;
    };
    RelayFragmentReference.prototype['if'] = function _if(value) {
      var callVariable = QueryBuilder.getCallVariable(value);
      !callVariable ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `if()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
      this._addCondition(function(variables) {
        return !!variables[callVariable.callVariableName];
      });
      return this;
    };
    RelayFragmentReference.prototype.unless = function unless(value) {
      var callVariable = QueryBuilder.getCallVariable(value);
      !callVariable ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `unless()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
      this._addCondition(function(variables) {
        return !variables[callVariable.callVariableName];
      });
      return this;
    };
    RelayFragmentReference.prototype._getFragment = function _getFragment() {
      var fragment = this._fragment;
      if (fragment == null) {
        fragment = this._fragmentGetter();
        this._fragment = fragment;
      }
      return fragment;
    };
    RelayFragmentReference.prototype.getFragment = function getFragment(variables) {
      var conditions = this._conditions;
      if (conditions && !conditions.every(function(cb) {
        return cb(variables);
      })) {
        return null;
      }
      return this._getFragment();
    };
    RelayFragmentReference.prototype.getVariables = function getVariables(route, variables) {
      var _this = this;
      var innerVariables = _extends({}, this._initialVariables);
      var variableMapping = this._variableMapping;
      if (variableMapping) {
        forEachObject(variableMapping, function(value, name) {
          var callVariable = QueryBuilder.getCallVariable(value);
          if (callVariable) {
            value = variables[callVariable.callVariableName];
          }
          if (value === undefined) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'RelayFragmentReference: Variable `%s` is undefined in fragment ' + '`%s`.', name, _this._getFragment().name) : undefined;
          } else {
            innerVariables[name] = value;
          }
        });
      }
      var prepareVariables = this._prepareVariables;
      if (prepareVariables) {
        innerVariables = prepareVariables(innerVariables, route);
      }
      return innerVariables;
    };
    RelayFragmentReference.prototype.isContainerFragment = function isContainerFragment() {
      return this._isContainerFragment;
    };
    RelayFragmentReference.prototype.isDeferred = function isDeferred() {
      return this._isDeferred;
    };
    RelayFragmentReference.prototype.isTypeConditional = function isTypeConditional() {
      return this._isTypeConditional;
    };
    RelayFragmentReference.prototype._addCondition = function _addCondition(condition) {
      var conditions = this._conditions;
      if (!conditions) {
        conditions = [];
        this._conditions = conditions;
      }
      conditions.push(condition);
    };
    return RelayFragmentReference;
  })();
  module.exports = RelayFragmentReference;
})(require('process'));
