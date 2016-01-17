/* */ 
"format cjs";
(function(process) {
  (function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
      module.exports = factory(require('React'), require('ReactDOM'));
    else if (typeof define === 'function' && define.amd)
      define(["React", "ReactDOM"], factory);
    else if (typeof exports === 'object')
      exports["Relay"] = factory(require('React'), require('ReactDOM'));
    else
      root["Relay"] = factory(root["React"], root["ReactDOM"]);
  })(this, function(__WEBPACK_EXTERNAL_MODULE_33__, __WEBPACK_EXTERNAL_MODULE_264__) {
    return (function(modules) {
      var installedModules = {};
      function __webpack_require__(moduleId) {
        if (installedModules[moduleId])
          return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
          exports: {},
          id: moduleId,
          loaded: false
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = true;
        return module.exports;
      }
      __webpack_require__.m = modules;
      __webpack_require__.c = installedModules;
      __webpack_require__.p = "";
      return __webpack_require__(0);
    })((function(modules) {
      for (var i in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, i)) {
          switch (typeof modules[i]) {
            case "function":
              break;
            case "object":
              modules[i] = (function(_m) {
                var args = _m.slice(1),
                    fn = modules[_m[0]];
                return function(a, b, c) {
                  fn.apply(this, [a, b, c].concat(args));
                };
              }(modules[i]));
              break;
            default:
              modules[i] = modules[modules[i]];
              break;
          }
        }
      }
      return modules;
    }([function(module, exports, __webpack_require__) {
      'use strict';
      var _extends = __webpack_require__(8)['default'];
      var RelayDefaultNetworkLayer = __webpack_require__(134);
      var RelayPublic = __webpack_require__(146);
      RelayPublic.injectNetworkLayer(new RelayDefaultNetworkLayer('/graphql'));
      module.exports = _extends({}, RelayPublic, {DefaultNetworkLayer: RelayDefaultNetworkLayer});
    }, function(module, exports) {
      "use strict";
      exports["default"] = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      function invariant(condition, format, a, b, c, d, e, f) {
        if (true) {
          if (format === undefined) {
            throw new Error('invariant requires an error message argument');
          }
        }
        if (!condition) {
          var error;
          if (format === undefined) {
            error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
          } else {
            var args = [a, b, c, d, e, f];
            var argIndex = 0;
            error = new Error(format.replace(/%s/g, function() {
              return args[argIndex++];
            }));
            error.name = 'Invariant Violation';
          }
          error.framesToPop = 1;
          throw error;
        }
      }
      module.exports = invariant;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _inherits = __webpack_require__(5)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _Object$freeze = __webpack_require__(41)['default'];
      var QueryBuilder = __webpack_require__(17);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayFragmentReference = __webpack_require__(34);
      var RelayMetaRoute = __webpack_require__(22);
      var RelayProfiler = __webpack_require__(4);
      var RelayRouteFragment = __webpack_require__(84);
      var areEqual = __webpack_require__(106);
      var callsFromGraphQL = __webpack_require__(52);
      var callsToGraphQL = __webpack_require__(85);
      var generateRQLFieldAlias = __webpack_require__(168);
      var getWeakIdForObject = __webpack_require__(169);
      var invariant = __webpack_require__(2);
      var printRelayQueryCall = __webpack_require__(40);
      var shallowEqual = __webpack_require__(72);
      var stableStringify = __webpack_require__(92);
      var IF = 'if';
      var UNLESS = 'unless';
      var TRUE = 'true';
      var FALSE = 'false';
      var SKIP = 'skip';
      var INCLUDE = 'include';
      var QUERY_ID_PREFIX = 'q';
      var REF_PARAM_PREFIX = 'ref_';
      var _nextQueryID = 0;
      var DEFAULT_FRAGMENT_METADATA = {
        isDeferred: false,
        isContainerFragment: false,
        isTypeConditional: false
      };
      var EMPTY_DIRECTIVES = [];
      var EMPTY_CALLS = [];
      if (true) {
        _Object$freeze(EMPTY_CALLS);
        _Object$freeze(EMPTY_DIRECTIVES);
      }
      var RelayQueryNode = (function() {
        RelayQueryNode.create = function create(concreteNode, route, variables) {
          var node = createNode(concreteNode, route, variables);
          !(node instanceof RelayQueryNode) ? true ? invariant(false, 'RelayQueryNode.create(): ' + 'Expected a GraphQL fragment, mutation, or query.') : invariant(false) : undefined;
          return node;
        };
        function RelayQueryNode(concreteNode, route, variables) {
          _classCallCheck(this, RelayQueryNode);
          !(this.constructor.name !== 'RelayQueryNode') ? true ? invariant(false, 'RelayQueryNode: Abstract class cannot be instantiated.') : invariant(false) : undefined;
          this.__concreteNode__ = concreteNode;
          this.__route__ = route;
          this.__variables__ = variables;
          this.__calls__ = null;
          this.__children__ = null;
          this.__fieldMap__ = null;
          this.__hasDeferredDescendant__ = null;
          this.__hasValidatedConnectionCalls__ = null;
          this.__serializationKey__ = null;
          this.__storageKey__ = null;
          this.__isConcreteNodeCached__ = false;
        }
        RelayQueryNode.prototype.isGenerated = function isGenerated() {
          return false;
        };
        RelayQueryNode.prototype.isRefQueryDependency = function isRefQueryDependency() {
          return false;
        };
        RelayQueryNode.prototype.isScalar = function isScalar() {
          return false;
        };
        RelayQueryNode.prototype.clone = function clone(children) {
          if (this.isScalar()) {
            !(children.length === 0) ? true ? invariant(false, 'RelayQueryNode: Cannot add children to scalar field `%s`.', this instanceof RelayQueryField ? this.getSchemaName() : null) : invariant(false) : undefined;
            return this;
          }
          var prevChildren = this.getChildren();
          var nextChildren = cloneChildren(prevChildren, children);
          if (!nextChildren.length) {
            return null;
          } else if (nextChildren === prevChildren) {
            return this;
          }
          var clone = RelayQueryNode.create(this.__concreteNode__, this.__route__, this.__variables__);
          clone.__children__ = nextChildren;
          clone.__calls__ = this.__calls__;
          clone.__serializationKey__ = this.__serializationKey__;
          clone.__storageKey__ = this.__storageKey__;
          return clone;
        };
        RelayQueryNode.prototype.getChildren = function getChildren() {
          var _this = this;
          var children = this.__children__;
          if (!children) {
            (function() {
              var nextChildren = [];
              var concreteChildren = _this.__concreteNode__.children;
              if (concreteChildren) {
                concreteChildren.forEach(function(concreteChild) {
                  if (concreteChild == null) {
                    return;
                  }
                  var node = createNode(concreteChild, _this.__route__, _this.__variables__);
                  if (node && node.isIncluded()) {
                    nextChildren.push(node);
                  }
                });
              }
              _this.__children__ = nextChildren;
              children = nextChildren;
            })();
          }
          return children;
        };
        RelayQueryNode.prototype.isIncluded = function isIncluded() {
          if (!this.__concreteNode__.directives) {
            return true;
          }
          return this.getDirectives().every(function(directive) {
            if (directive.name === SKIP) {
              return !directive.arguments.some(function(arg) {
                return arg.name === IF && !!arg.value;
              });
            } else if (directive.name === INCLUDE) {
              return !directive.arguments.some(function(arg) {
                return arg.name === IF && !arg.value;
              });
            }
            return true;
          });
        };
        RelayQueryNode.prototype.getDirectives = function getDirectives() {
          var _this2 = this;
          var concreteDirectives = this.__concreteNode__.directives;
          if (concreteDirectives) {
            return this.__concreteNode__.directives.map(function(directive) {
              return {
                name: directive.name,
                arguments: callsFromGraphQL(directive.arguments, _this2.__variables__)
              };
            });
          }
          return EMPTY_DIRECTIVES;
        };
        RelayQueryNode.prototype.getField = function getField(field) {
          return this.getFieldByStorageKey(field.getStorageKey());
        };
        RelayQueryNode.prototype.getFieldByStorageKey = function getFieldByStorageKey(storageKey) {
          var fieldMap = this.__fieldMap__;
          if (!fieldMap) {
            fieldMap = {};
            var child;
            var children = this.getChildren();
            for (var ii = 0; ii < children.length; ii++) {
              child = children[ii];
              if (child instanceof RelayQueryField) {
                fieldMap[child.getStorageKey()] = child;
              }
            }
            this.__fieldMap__ = fieldMap;
          }
          return fieldMap[storageKey];
        };
        RelayQueryNode.prototype.getType = function getType() {
          return this.__concreteNode__.type;
        };
        RelayQueryNode.prototype.getRoute = function getRoute() {
          return this.__route__;
        };
        RelayQueryNode.prototype.getVariables = function getVariables() {
          return this.__variables__;
        };
        RelayQueryNode.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
          var hasDeferredDescendant = this.__hasDeferredDescendant__;
          if (hasDeferredDescendant == null) {
            hasDeferredDescendant = !this.isScalar() && this.getChildren().some(function(child) {
              return child.hasDeferredDescendant();
            });
            this.__hasDeferredDescendant__ = hasDeferredDescendant;
          }
          return hasDeferredDescendant;
        };
        RelayQueryNode.prototype.isAbstract = function isAbstract() {
          throw new Error('RelayQueryNode: Abstract function cannot be called.');
        };
        RelayQueryNode.prototype.isRequisite = function isRequisite() {
          return false;
        };
        RelayQueryNode.prototype.equals = function equals(that) {
          var thisChildren = this.getChildren();
          var thatChildren = that.getChildren();
          return thisChildren === thatChildren || thisChildren.length === thatChildren.length && thisChildren.every(function(c, ii) {
            return c.equals(thatChildren[ii]);
          });
        };
        RelayQueryNode.prototype.isEquivalent = function isEquivalent(that) {
          return this.__concreteNode__ === that.__concreteNode__ && this.__route__ === that.__route__ && shallowEqual(this.__variables__, that.__variables__);
        };
        RelayQueryNode.prototype.createNode = function createNode(concreteNode) {
          return RelayQueryNode.create(concreteNode, this.__route__, this.__variables__);
        };
        RelayQueryNode.prototype.getConcreteQueryNode = function getConcreteQueryNode(onCacheMiss) {
          if (!this.__isConcreteNodeCached__) {
            this.__concreteNode__ = onCacheMiss();
            this.__isConcreteNodeCached__ = true;
          }
          return this.__concreteNode__;
        };
        return RelayQueryNode;
      })();
      var RelayQueryRoot = (function(_RelayQueryNode) {
        _inherits(RelayQueryRoot, _RelayQueryNode);
        RelayQueryRoot.build = function build(name, fieldName, value, children, metadata, type) {
          var nextChildren = children ? children.filter(function(child) {
            return !!child;
          }) : [];
          var batchCallVariable = QueryBuilder.getBatchCallVariable(value);
          var identifyingArgValue = undefined;
          if (batchCallVariable) {
            identifyingArgValue = batchCallVariable;
          } else if (Array.isArray(value)) {
            identifyingArgValue = value.map(QueryBuilder.createCallValue);
          } else if (value) {
            identifyingArgValue = QueryBuilder.createCallValue(value);
          }
          var concreteRoot = QueryBuilder.createQuery({
            fieldName: fieldName,
            identifyingArgValue: identifyingArgValue,
            metadata: metadata,
            name: name,
            type: type
          });
          var root = new RelayQueryRoot(concreteRoot, RelayMetaRoute.get('$RelayQuery'), {});
          root.__children__ = nextChildren;
          return root;
        };
        RelayQueryRoot.create = function create(concreteNode, route, variables) {
          var query = QueryBuilder.getQuery(concreteNode);
          !query ? true ? invariant(false, 'RelayQueryRoot.create(): Expected a GraphQL `query { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
          return new RelayQueryRoot(query, route, variables);
        };
        function RelayQueryRoot(concreteNode, route, variables) {
          _classCallCheck(this, RelayQueryRoot);
          _RelayQueryNode.call(this, concreteNode, route, variables);
          this.__batchCall__ = undefined;
          this.__deferredFragmentNames__ = undefined;
          this.__id__ = undefined;
          this.__identifyingArg__ = undefined;
          this.__storageKey__ = undefined;
          this.getID();
        }
        RelayQueryRoot.prototype.getName = function getName() {
          var name = this.__concreteNode__.name;
          if (!name) {
            name = this.getID();
            this.__concreteNode__.name = name;
          }
          return name;
        };
        RelayQueryRoot.prototype.getID = function getID() {
          var id = this.__id__;
          if (id == null) {
            id = QUERY_ID_PREFIX + _nextQueryID++;
            this.__id__ = id;
          }
          return id;
        };
        RelayQueryRoot.prototype.getBatchCall = function getBatchCall() {
          var batchCall = this.__batchCall__;
          if (batchCall === undefined) {
            var concreteCalls = this.__concreteNode__.calls;
            if (concreteCalls) {
              var callArg = concreteCalls[0] && concreteCalls[0].value;
              if (callArg != null && !Array.isArray(callArg) && callArg.kind === 'BatchCallVariable') {
                batchCall = {
                  refParamName: REF_PARAM_PREFIX + callArg.sourceQueryID,
                  sourceQueryID: callArg.sourceQueryID,
                  sourceQueryPath: callArg.jsonPath
                };
              }
            }
            batchCall = batchCall || null;
            this.__batchCall__ = batchCall;
          }
          return batchCall;
        };
        RelayQueryRoot.prototype.getCallsWithValues = function getCallsWithValues() {
          var calls = this.__calls__;
          if (!calls) {
            var concreteCalls = this.__concreteNode__.calls;
            if (concreteCalls) {
              calls = callsFromGraphQL(concreteCalls, this.__variables__);
            } else {
              calls = EMPTY_CALLS;
            }
            this.__calls__ = calls;
          }
          return calls;
        };
        RelayQueryRoot.prototype.getFieldName = function getFieldName() {
          return this.__concreteNode__.fieldName;
        };
        RelayQueryRoot.prototype.getIdentifyingArg = function getIdentifyingArg() {
          var _this3 = this;
          var identifyingArg = this.__identifyingArg__;
          if (!identifyingArg) {
            (function() {
              var metadata = _this3.__concreteNode__.metadata;
              var identifyingArgName = metadata.identifyingArgName;
              if (identifyingArgName != null) {
                identifyingArg = _this3.getCallsWithValues().find(function(c) {
                  return c.name === identifyingArgName;
                });
                if (identifyingArg && metadata.identifyingArgType != null) {
                  identifyingArg.type = metadata.identifyingArgType;
                }
                _this3.__identifyingArg__ = identifyingArg;
              }
            })();
          }
          return identifyingArg;
        };
        RelayQueryRoot.prototype.getStorageKey = function getStorageKey() {
          var _this4 = this;
          var storageKey = this.__storageKey__;
          if (!storageKey) {
            (function() {
              var args = _this4.getCallsWithValues();
              var identifyingArg = _this4.getIdentifyingArg();
              if (identifyingArg) {
                args = args.filter(function(arg) {
                  return arg !== identifyingArg;
                });
              }
              var field = RelayQueryField.build({
                fieldName: _this4.getFieldName(),
                calls: args,
                type: _this4.getType()
              });
              storageKey = field.getStorageKey();
              _this4.__storageKey__ = storageKey;
            })();
          }
          return storageKey;
        };
        RelayQueryRoot.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
          return this.isDeferred() || _RelayQueryNode.prototype.hasDeferredDescendant.call(this);
        };
        RelayQueryRoot.prototype.isAbstract = function isAbstract() {
          return !!this.__concreteNode__.metadata.isAbstract;
        };
        RelayQueryRoot.prototype.isDeferred = function isDeferred() {
          return !!this.__concreteNode__.isDeferred;
        };
        RelayQueryRoot.prototype.isPlural = function isPlural() {
          return !!this.__concreteNode__.metadata.isPlural;
        };
        RelayQueryRoot.prototype.getDeferredFragmentNames = function getDeferredFragmentNames() {
          var fragmentNames = this.__deferredFragmentNames__;
          if (!fragmentNames) {
            fragmentNames = {};
            getDeferredFragmentNamesForField(this, fragmentNames);
            this.__deferredFragmentNames__ = fragmentNames;
          }
          return fragmentNames;
        };
        RelayQueryRoot.prototype.equals = function equals(that) {
          if (this === that) {
            return true;
          }
          if (!(that instanceof RelayQueryRoot)) {
            return false;
          }
          if (!areEqual(this.getBatchCall(), that.getBatchCall())) {
            return false;
          }
          if (this.getFieldName() !== that.getFieldName() || !areEqual(this.getCallsWithValues(), that.getCallsWithValues())) {
            return false;
          }
          return _RelayQueryNode.prototype.equals.call(this, that);
        };
        return RelayQueryRoot;
      })(RelayQueryNode);
      var RelayQueryOperation = (function(_RelayQueryNode2) {
        _inherits(RelayQueryOperation, _RelayQueryNode2);
        function RelayQueryOperation(concreteNode, route, variables) {
          _classCallCheck(this, RelayQueryOperation);
          _RelayQueryNode2.call(this, concreteNode, route, variables);
          !(this.constructor.name !== 'RelayQueryOperation') ? true ? invariant(false, 'RelayQueryOperation: Abstract class cannot be instantiated.') : invariant(false) : undefined;
        }
        RelayQueryOperation.prototype.getName = function getName() {
          return this.__concreteNode__.name;
        };
        RelayQueryOperation.prototype.getResponseType = function getResponseType() {
          return this.__concreteNode__.responseType;
        };
        RelayQueryOperation.prototype.getType = function getType() {
          return this.getResponseType();
        };
        RelayQueryOperation.prototype.getInputType = function getInputType() {
          var inputType = this.__concreteNode__.metadata.inputType;
          !inputType ? true ? invariant(false, 'RelayQuery: Expected operation `%s` to be annotated with the type of ' + 'its argument. Either the babel transform was configured incorrectly, ' + 'or the schema failed to define an argument for this mutation.', this.getCall().name) : invariant(false) : undefined;
          return inputType;
        };
        RelayQueryOperation.prototype.getCall = function getCall() {
          var calls = this.__calls__;
          if (!calls) {
            var concreteCalls = this.__concreteNode__.calls;
            if (concreteCalls) {
              calls = callsFromGraphQL(concreteCalls, this.__variables__);
            } else {
              calls = EMPTY_CALLS;
            }
            this.__calls__ = calls;
          }
          return calls[0];
        };
        RelayQueryOperation.prototype.getCallVariableName = function getCallVariableName() {
          if (!this.__callVariableName__) {
            var concreteCalls = this.__concreteNode__.calls;
            var callVariable = concreteCalls && QueryBuilder.getCallVariable(concreteCalls[0].value);
            !callVariable ? true ? invariant(false, 'RelayQuery: Expected mutation to have a single argument.') : invariant(false) : undefined;
            this.__callVariableName__ = callVariable.callVariableName;
          }
          return this.__callVariableName__;
        };
        RelayQueryOperation.prototype.isAbstract = function isAbstract() {
          return false;
        };
        return RelayQueryOperation;
      })(RelayQueryNode);
      var RelayQueryMutation = (function(_RelayQueryOperation) {
        _inherits(RelayQueryMutation, _RelayQueryOperation);
        function RelayQueryMutation() {
          _classCallCheck(this, RelayQueryMutation);
          _RelayQueryOperation.apply(this, arguments);
        }
        RelayQueryMutation.build = function build(name, responseType, callName, callValue, children, metadata) {
          var nextChildren = children ? children.filter(function(child) {
            return !!child;
          }) : [];
          var concreteMutation = QueryBuilder.createMutation({
            calls: [QueryBuilder.createCall(callName, QueryBuilder.createCallVariable('input'))],
            metadata: metadata,
            name: name,
            responseType: responseType
          });
          var mutation = new RelayQueryMutation(concreteMutation, RelayMetaRoute.get('$RelayQuery'), {input: callValue || ''});
          mutation.__children__ = nextChildren;
          return mutation;
        };
        RelayQueryMutation.prototype.equals = function equals(that) {
          if (this === that) {
            return true;
          }
          if (!(that instanceof RelayQueryMutation)) {
            return false;
          }
          if (!areEqual(this.getResponseType(), that.getResponseType())) {
            return false;
          }
          if (!areEqual(this.getCall(), that.getCall())) {
            return false;
          }
          return _RelayQueryOperation.prototype.equals.call(this, that);
        };
        return RelayQueryMutation;
      })(RelayQueryOperation);
      var RelayQuerySubscription = (function(_RelayQueryOperation2) {
        _inherits(RelayQuerySubscription, _RelayQueryOperation2);
        function RelayQuerySubscription() {
          _classCallCheck(this, RelayQuerySubscription);
          _RelayQueryOperation2.apply(this, arguments);
        }
        RelayQuerySubscription.create = function create(concreteNode, route, variables) {
          var subscription = QueryBuilder.getSubscription(concreteNode);
          !subscription ? true ? invariant(false, 'RelayQuerySubscription.create(): ' + 'Expected a GraphQL `subscription { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
          return new RelayQuerySubscription(concreteNode, route, variables);
        };
        RelayQuerySubscription.prototype.getPublishedPayloadType = function getPublishedPayloadType() {
          return this.getResponseType();
        };
        RelayQuerySubscription.prototype.equals = function equals(that) {
          if (this === that) {
            return true;
          }
          if (!(that instanceof RelayQuerySubscription)) {
            return false;
          }
          if (!areEqual(this.getPublishedPayloadType(), that.getPublishedPayloadType())) {
            return false;
          }
          if (!areEqual(this.getCall(), that.getCall())) {
            return false;
          }
          return _RelayQueryOperation2.prototype.equals.call(this, that);
        };
        return RelayQuerySubscription;
      })(RelayQueryOperation);
      var RelayQueryFragment = (function(_RelayQueryNode3) {
        _inherits(RelayQueryFragment, _RelayQueryNode3);
        RelayQueryFragment.build = function build(name, type, children, metadata) {
          var nextChildren = children ? children.filter(function(child) {
            return !!child;
          }) : [];
          var concreteFragment = QueryBuilder.createFragment({
            name: name,
            type: type,
            metadata: metadata
          });
          var fragment = new RelayQueryFragment(concreteFragment, RelayMetaRoute.get('$RelayQuery'), {}, {
            isDeferred: !!(metadata && metadata.isDeferred),
            isContainerFragment: !!(metadata && metadata.isContainerFragment),
            isTypeConditional: !!(metadata && metadata.isTypeConditional)
          });
          fragment.__children__ = nextChildren;
          return fragment;
        };
        RelayQueryFragment.create = function create(concreteNode, route, variables, metadata) {
          var fragment = QueryBuilder.getFragment(concreteNode);
          !fragment ? true ? invariant(false, 'RelayQueryFragment.create(): ' + 'Expected a GraphQL `fragment { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
          return createMemoizedFragment(fragment, route, variables, metadata || DEFAULT_FRAGMENT_METADATA);
        };
        function RelayQueryFragment(concreteNode, route, variables, metadata) {
          _classCallCheck(this, RelayQueryFragment);
          _RelayQueryNode3.call(this, concreteNode, route, variables);
          this.__fragmentID__ = null;
          this.__hash__ = concreteNode.hash || null;
          this.__metadata__ = metadata || DEFAULT_FRAGMENT_METADATA;
        }
        RelayQueryFragment.prototype.getDebugName = function getDebugName() {
          return this.__concreteNode__.name;
        };
        RelayQueryFragment.prototype.getConcreteFragmentHash = function getConcreteFragmentHash() {
          return this.__hash__;
        };
        RelayQueryFragment.prototype.getConcreteFragmentID = function getConcreteFragmentID() {
          return '_RelayQueryFragment' + getWeakIdForObject(this.__concreteNode__);
        };
        RelayQueryFragment.prototype.getFragmentID = function getFragmentID() {
          var fragmentID = this.__fragmentID__;
          if (!fragmentID) {
            fragmentID = generateRQLFieldAlias(this.getConcreteFragmentID() + '.' + this.__route__.name + '.' + stableStringify(this.__variables__));
            this.__fragmentID__ = fragmentID;
          }
          return fragmentID;
        };
        RelayQueryFragment.prototype.isAbstract = function isAbstract() {
          return !!this.__concreteNode__.metadata.isAbstract;
        };
        RelayQueryFragment.prototype.isDeferred = function isDeferred() {
          return this.__metadata__.isDeferred;
        };
        RelayQueryFragment.prototype.isPlural = function isPlural() {
          var metadata = this.__concreteNode__.metadata;
          return !!(metadata.isPlural || metadata.plural);
          ;
        };
        RelayQueryFragment.prototype.cloneAsPlainFragment = function cloneAsPlainFragment() {
          return createMemoizedFragment(this.__concreteNode__, this.__route__, this.__variables__, DEFAULT_FRAGMENT_METADATA);
        };
        RelayQueryFragment.prototype.isContainerFragment = function isContainerFragment() {
          return this.__metadata__.isContainerFragment;
        };
        RelayQueryFragment.prototype.isTypeConditional = function isTypeConditional() {
          return this.__metadata__.isTypeConditional;
        };
        RelayQueryFragment.prototype.hasDeferredDescendant = function hasDeferredDescendant() {
          return this.isDeferred() || _RelayQueryNode3.prototype.hasDeferredDescendant.call(this);
        };
        RelayQueryFragment.prototype.clone = function clone(children) {
          var clone = _RelayQueryNode3.prototype.clone.call(this, children);
          if (clone !== this && clone instanceof RelayQueryFragment) {
            clone.__hash__ = null;
            clone.__metadata__ = _extends({}, this.__metadata__);
          }
          return clone;
        };
        RelayQueryFragment.prototype.equals = function equals(that) {
          if (this === that) {
            return true;
          }
          if (!(that instanceof RelayQueryFragment)) {
            return false;
          }
          if (this.getType() !== that.getType()) {
            return false;
          }
          return _RelayQueryNode3.prototype.equals.call(this, that);
        };
        return RelayQueryFragment;
      })(RelayQueryNode);
      var RelayQueryField = (function(_RelayQueryNode4) {
        _inherits(RelayQueryField, _RelayQueryNode4);
        RelayQueryField.create = function create(concreteNode, route, variables) {
          var field = QueryBuilder.getField(concreteNode);
          !field ? true ? invariant(false, 'RelayQueryField.create(): Expected a GraphQL field, got: %s', concreteNode) : invariant(false) : undefined;
          return new RelayQueryField(field, route, variables);
        };
        RelayQueryField.build = function build(_ref) {
          var alias = _ref.alias;
          var calls = _ref.calls;
          var children = _ref.children;
          var fieldName = _ref.fieldName;
          var metadata = _ref.metadata;
          var type = _ref.type;
          return (function() {
            var nextChildren = children ? children.filter(function(child) {
              return !!child;
            }) : [];
            var concreteField = QueryBuilder.createField({
              alias: alias,
              calls: calls ? callsToGraphQL(calls) : null,
              fieldName: fieldName,
              metadata: metadata,
              type: type
            });
            var field = new RelayQueryField(concreteField, RelayMetaRoute.get('$RelayQuery'), {});
            field.__children__ = nextChildren;
            return field;
          })();
        };
        function RelayQueryField(concreteNode, route, variables) {
          _classCallCheck(this, RelayQueryField);
          _RelayQueryNode4.call(this, concreteNode, route, variables);
          this.__debugName__ = undefined;
          this.__isRefQueryDependency__ = false;
          this.__rangeBehaviorKey__ = undefined;
        }
        RelayQueryField.prototype.isAbstract = function isAbstract() {
          return !!this.__concreteNode__.metadata.isAbstract;
        };
        RelayQueryField.prototype.isFindable = function isFindable() {
          return !!this.__concreteNode__.metadata.isFindable;
        };
        RelayQueryField.prototype.isGenerated = function isGenerated() {
          return !!this.__concreteNode__.metadata.isGenerated;
        };
        RelayQueryField.prototype.isConnection = function isConnection() {
          return !!this.__concreteNode__.metadata.isConnection;
        };
        RelayQueryField.prototype.isPlural = function isPlural() {
          return !!this.__concreteNode__.metadata.isPlural;
        };
        RelayQueryField.prototype.isRefQueryDependency = function isRefQueryDependency() {
          return this.__isRefQueryDependency__;
        };
        RelayQueryField.prototype.isRequisite = function isRequisite() {
          return !!this.__concreteNode__.metadata.isRequisite;
        };
        RelayQueryField.prototype.isScalar = function isScalar() {
          var concreteChildren = this.__concreteNode__.children;
          return (!this.__children__ || this.__children__.length === 0) && (!concreteChildren || concreteChildren.length === 0);
        };
        RelayQueryField.prototype.getDebugName = function getDebugName() {
          var _this5 = this;
          var debugName = this.__debugName__;
          if (!debugName) {
            (function() {
              debugName = _this5.getSchemaName();
              var printedCoreArgs = undefined;
              _this5.getCallsWithValues().forEach(function(arg) {
                if (_this5._isCoreArg(arg)) {
                  printedCoreArgs = printedCoreArgs || [];
                  printedCoreArgs.push(printRelayQueryCall(arg));
                }
              });
              if (printedCoreArgs) {
                debugName += printedCoreArgs.sort().join('');
              }
              _this5.__debugName__ = debugName;
            })();
          }
          return debugName;
        };
        RelayQueryField.prototype.getSchemaName = function getSchemaName() {
          return this.__concreteNode__.fieldName;
        };
        RelayQueryField.prototype.getRangeBehaviorKey = function getRangeBehaviorKey() {
          var _this6 = this;
          !this.isConnection() ? true ? invariant(false, 'RelayQueryField: Range behavior keys are associated exclusively with ' + 'connection fields. `getRangeBehaviorKey()` was called on the ' + 'non-connection field `%s`.', this.getSchemaName()) : invariant(false) : undefined;
          var rangeBehaviorKey = this.__rangeBehaviorKey__;
          if (rangeBehaviorKey == null) {
            (function() {
              var printedCoreArgs = [];
              _this6.getCallsWithValues().forEach(function(arg) {
                if (_this6._isCoreArg(arg)) {
                  printedCoreArgs.push(printRelayQueryCall(arg));
                }
              });
              rangeBehaviorKey = printedCoreArgs.sort().join('').slice(1);
              _this6.__rangeBehaviorKey__ = rangeBehaviorKey;
            })();
          }
          return rangeBehaviorKey;
        };
        RelayQueryField.prototype.getSerializationKey = function getSerializationKey() {
          var serializationKey = this.__serializationKey__;
          if (!serializationKey) {
            serializationKey = generateRQLFieldAlias(this.getSchemaName() + this.getCallsWithValues().map(printRelayQueryCall).sort().join(''));
            this.__serializationKey__ = serializationKey;
          }
          return serializationKey;
        };
        RelayQueryField.prototype.getStorageKey = function getStorageKey() {
          var _this7 = this;
          var storageKey = this.__storageKey__;
          if (!storageKey) {
            (function() {
              storageKey = _this7.getSchemaName();
              var coreArgsObj = undefined;
              _this7.getCallsWithValues().forEach(function(arg) {
                if (_this7._isCoreArg(arg)) {
                  coreArgsObj = coreArgsObj || {};
                  coreArgsObj[arg.name] = arg.value;
                }
              });
              if (coreArgsObj) {
                storageKey += stableStringify(coreArgsObj);
              }
              _this7.__storageKey__ = storageKey;
            })();
          }
          return storageKey;
        };
        RelayQueryField.prototype.getApplicationName = function getApplicationName() {
          var concreteNode = this.__concreteNode__;
          return concreteNode.alias || concreteNode.fieldName;
        };
        RelayQueryField.prototype.getInferredRootCallName = function getInferredRootCallName() {
          return this.__concreteNode__.metadata.inferredRootCallName;
        };
        RelayQueryField.prototype.getInferredPrimaryKey = function getInferredPrimaryKey() {
          return this.__concreteNode__.metadata.inferredPrimaryKey;
        };
        RelayQueryField.prototype.getCallsWithValues = function getCallsWithValues() {
          var calls = this.__calls__;
          if (!calls) {
            var concreteCalls = this.__concreteNode__.calls;
            if (concreteCalls) {
              calls = callsFromGraphQL(concreteCalls, this.__variables__);
            } else {
              calls = EMPTY_CALLS;
            }
            this.__calls__ = calls;
          }
          return calls;
        };
        RelayQueryField.prototype.getCallType = function getCallType(callName) {
          var concreteCalls = this.__concreteNode__.calls;
          var concreteCall = concreteCalls && concreteCalls.filter(function(call) {
            return call.name === callName;
          })[0];
          if (concreteCall) {
            return concreteCall.metadata.type;
          }
        };
        RelayQueryField.prototype.equals = function equals(that) {
          if (this === that) {
            return true;
          }
          if (!(that instanceof RelayQueryField)) {
            return false;
          }
          if (this.getSchemaName() !== that.getSchemaName() || this.getApplicationName() !== that.getApplicationName() || !areEqual(this.getCallsWithValues(), that.getCallsWithValues())) {
            return false;
          }
          return _RelayQueryNode4.prototype.equals.call(this, that);
        };
        RelayQueryField.prototype.cloneAsRefQueryDependency = function cloneAsRefQueryDependency() {
          var field = new RelayQueryField(this.__concreteNode__, this.__route__, this.__variables__);
          field.__children__ = [];
          field.__isRefQueryDependency__ = true;
          return field;
        };
        RelayQueryField.prototype.cloneFieldWithCalls = function cloneFieldWithCalls(children, calls) {
          if (this.isScalar()) {
            !(children.length === 0) ? true ? invariant(false, 'RelayQueryField: Cannot add children to scalar fields.') : invariant(false) : undefined;
          }
          if (areEqual(this.getCallsWithValues(), calls)) {
            var clone = this.clone(children);
            return clone;
          }
          var nextChildren = cloneChildren(this.getChildren(), children);
          if (!nextChildren.length) {
            return null;
          }
          var field = new RelayQueryField(this.__concreteNode__, this.__route__, this.__variables__);
          field.__children__ = nextChildren;
          field.__calls__ = calls;
          return field;
        };
        RelayQueryField.prototype._isCoreArg = function _isCoreArg(arg) {
          return (!(arg.name === IF && String(arg.value) === TRUE) && !(arg.name === UNLESS && String(arg.value) === FALSE) && !(this.isConnection() && RelayConnectionInterface.isConnectionCall(arg)));
        };
        return RelayQueryField;
      })(RelayQueryNode);
      function createNode(_x, _x2, _x3) {
        var _again = true;
        _function: while (_again) {
          var concreteNode = _x,
              route = _x2,
              variables = _x3;
          _again = false;
          !(typeof concreteNode === 'object' && concreteNode !== null) ? true ? invariant(false, 'RelayQueryNode: Expected a GraphQL object created with `Relay.QL`, got' + '`%s`.', concreteNode) : invariant(false) : undefined;
          var kind = concreteNode.kind;
          var type = RelayQueryNode;
          if (kind === 'Field') {
            type = RelayQueryField;
          } else if (kind === 'Fragment') {
            type = RelayQueryFragment;
          } else if (kind === 'FragmentReference') {
            type = RelayQueryFragment;
            var fragment = QueryBuilder.getFragment(concreteNode.fragment);
            if (fragment) {
              return createMemoizedFragment(fragment, route, {}, {
                isDeferred: false,
                isContainerFragment: true,
                isTypeConditional: true
              });
            }
          } else if (kind === 'Query') {
            type = RelayQueryRoot;
          } else if (kind === 'Mutation') {
            type = RelayQueryMutation;
          } else if (kind === 'Subscription') {
            type = RelayQuerySubscription;
          } else if (concreteNode instanceof RelayRouteFragment) {
            var fragment = concreteNode.getFragmentForRoute(route);
            if (fragment) {
              _x = fragment;
              _x2 = route;
              _x3 = variables;
              _again = true;
              kind = type = fragment = fragment = undefined;
              continue _function;
            }
            return null;
          } else if (concreteNode instanceof RelayFragmentReference) {
            var fragment = concreteNode.getFragment(variables);
            var fragmentVariables = concreteNode.getVariables(route, variables);
            if (fragment) {
              return createMemoizedFragment(fragment, route, fragmentVariables, {
                isDeferred: concreteNode.isDeferred(),
                isContainerFragment: concreteNode.isContainerFragment(),
                isTypeConditional: concreteNode.isTypeConditional()
              });
            }
            return null;
          } else {}
          return new type(concreteNode, route, variables);
        }
      }
      function createMemoizedFragment(concreteFragment, route, variables, metadata) {
        var cacheKey = route.name + ':' + stableStringify(variables) + ':' + stableStringify(metadata);
        var fragment = concreteFragment.__cachedFragment__;
        var fragmentCacheKey = concreteFragment.__cacheKey__;
        if (!fragment || fragmentCacheKey !== cacheKey) {
          fragment = new RelayQueryFragment(concreteFragment, route, variables, metadata);
          concreteFragment.__cachedFragment__ = fragment;
          concreteFragment.__cacheKey__ = cacheKey;
        }
        return fragment;
      }
      function cloneChildren(prevChildren, nextChildren) {
        var children = [];
        var isSameChildren = true;
        var prevIndex = 0;
        for (var ii = 0; ii < nextChildren.length; ii++) {
          var child = nextChildren[ii];
          if (child) {
            children.push(child);
            isSameChildren = isSameChildren && child === prevChildren[prevIndex++];
          }
        }
        if (isSameChildren && children.length === prevChildren.length) {
          return prevChildren;
        } else {
          return children;
        }
      }
      function getDeferredFragmentNamesForField(node, fragmentNames) {
        if (node instanceof RelayQueryFragment && node.isDeferred()) {
          var fragmentID = node.getFragmentID();
          fragmentNames[fragmentID] = fragmentID;
          return;
        }
        node.getChildren().forEach(function(child) {
          return getDeferredFragmentNamesForField(child, fragmentNames);
        });
      }
      RelayProfiler.instrumentMethods(RelayQueryNode.prototype, {
        clone: '@RelayQueryNode.prototype.clone',
        equals: '@RelayQueryNode.prototype.equals',
        getChildren: '@RelayQueryNode.prototype.getChildren',
        getDirectives: '@RelayQueryNode.prototype.getDirectives',
        hasDeferredDescendant: '@RelayQueryNode.prototype.hasDeferredDescendant',
        getFieldByStorageKey: '@RelayQueryNode.prototype.getFieldByStorageKey'
      });
      RelayProfiler.instrumentMethods(RelayQueryField.prototype, {
        getStorageKey: '@RelayQueryField.prototype.getStorageKey',
        getSerializationKey: '@RelayQueryField.prototype.getSerializationKey'
      });
      module.exports = {
        Field: RelayQueryField,
        Fragment: RelayQueryFragment,
        Mutation: RelayQueryMutation,
        Node: RelayQueryNode,
        Operation: RelayQueryOperation,
        Root: RelayQueryRoot,
        Subscription: RelayQuerySubscription
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var emptyFunction = __webpack_require__(70);
      var forEachObject = __webpack_require__(9);
      var removeFromArray = __webpack_require__(230);
      var aggregateHandlersByName = {};
      var profileHandlersByName = {'*': []};
      var NOT_INVOKED = {};
      var defaultProfiler = {stop: emptyFunction};
      var shouldInstrument = function shouldInstrument(name) {
        if (true) {
          return true;
        }
        return name.charAt(0) !== '@';
      };
      var RelayProfiler = {
        instrumentMethods: function instrumentMethods(object, names) {
          forEachObject(names, function(name, key) {
            object[key] = RelayProfiler.instrument(name, object[key]);
          });
        },
        instrument: function instrument(name, originalFunction) {
          if (!shouldInstrument(name)) {
            originalFunction.attachHandler = emptyFunction;
            originalFunction.detachHandler = emptyFunction;
            return originalFunction;
          }
          if (!aggregateHandlersByName.hasOwnProperty(name)) {
            aggregateHandlersByName[name] = [];
          }
          var aggregateHandlers = aggregateHandlersByName[name];
          var handlers = [];
          var contexts = [];
          var invokeHandlers = function invokeHandlers() {
            var context = contexts[contexts.length - 1];
            if (context[0]) {
              context[0]--;
              aggregateHandlers[context[0]](name, invokeHandlers);
            } else if (context[1]) {
              context[1]--;
              handlers[context[1]](name, invokeHandlers);
            } else {
              context[4] = originalFunction.apply(context[2], context[3]);
            }
          };
          var instrumentedCallback = function instrumentedCallback() {
            var returnValue = undefined;
            if (aggregateHandlers.length === 0 && handlers.length === 0) {
              returnValue = originalFunction.apply(this, arguments);
            } else {
              contexts.push([aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
              invokeHandlers();
              var context = contexts.pop();
              returnValue = context[4];
              if (returnValue === NOT_INVOKED) {
                throw new Error('RelayProfiler: Handler did not invoke original function.');
              }
            }
            return returnValue;
          };
          instrumentedCallback.attachHandler = function(handler) {
            handlers.push(handler);
          };
          instrumentedCallback.detachHandler = function(handler) {
            removeFromArray(handlers, handler);
          };
          instrumentedCallback.displayName = '(instrumented ' + name + ')';
          return instrumentedCallback;
        },
        attachAggregateHandler: function attachAggregateHandler(name, handler) {
          if (shouldInstrument(name)) {
            if (!aggregateHandlersByName.hasOwnProperty(name)) {
              aggregateHandlersByName[name] = [];
            }
            aggregateHandlersByName[name].push(handler);
          }
        },
        detachAggregateHandler: function detachAggregateHandler(name, handler) {
          if (shouldInstrument(name)) {
            if (aggregateHandlersByName.hasOwnProperty(name)) {
              removeFromArray(aggregateHandlersByName[name], handler);
            }
          }
        },
        profile: function profile(name, state) {
          var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
          var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
          if (hasNamedHandlers || hasCatchAllHandlers) {
            var _ret = (function() {
              var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
              var stopHandlers = undefined;
              for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
                var profileHandler = profileHandlers[ii];
                var stopHandler = profileHandler(name, state);
                stopHandlers = stopHandlers || [];
                stopHandlers.unshift(stopHandler);
              }
              return {v: {stop: function stop() {
                    if (stopHandlers) {
                      stopHandlers.forEach(function(stopHandler) {
                        return stopHandler();
                      });
                    }
                  }}};
            })();
            if (typeof _ret === 'object')
              return _ret.v;
          }
          return defaultProfiler;
        },
        attachProfileHandler: function attachProfileHandler(name, handler) {
          if (shouldInstrument(name)) {
            if (!profileHandlersByName.hasOwnProperty(name)) {
              profileHandlersByName[name] = [];
            }
            profileHandlersByName[name].push(handler);
          }
        },
        detachProfileHandler: function detachProfileHandler(name, handler) {
          if (shouldInstrument(name)) {
            if (profileHandlersByName.hasOwnProperty(name)) {
              removeFromArray(profileHandlersByName[name], handler);
            }
          }
        }
      };
      module.exports = RelayProfiler;
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var _Object$create = __webpack_require__(185)["default"];
      var _Object$setPrototypeOf = __webpack_require__(187)["default"];
      exports["default"] = function(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }
        subClass.prototype = _Object$create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      };
      exports.__esModule = true;
    }, function(module, exports) {
      'use strict';
      var METADATA_KEYS = {
        __dataID__: true,
        __range__: true,
        __resolvedFragmentMap__: true,
        __resolvedFragmentMapGeneration__: true,
        __status__: true
      };
      var GraphQLStoreDataHandler = {
        getID: function getID(node) {
          return node.__dataID__;
        },
        createPointerWithID: function createPointerWithID(dataID) {
          return {__dataID__: dataID};
        },
        isClientID: function isClientID(dataID) {
          return dataID.substring(0, 7) === 'client:';
        },
        isMetadataKey: function isMetadataKey(key) {
          return METADATA_KEYS[key] || false;
        }
      };
      module.exports = GraphQLStoreDataHandler;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(142);
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var _Object$assign = __webpack_require__(57)["default"];
      exports["default"] = _Object$assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      };
      exports.__esModule = true;
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function forEachObject(object, callback, context) {
        for (var name in object) {
          if (hasOwnProperty.call(object, name)) {
            callback.call(context, object[name], name, object);
          }
        }
      }
      module.exports = forEachObject;
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(195),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var emptyFunction = __webpack_require__(70);
      var warning = emptyFunction;
      if (true) {
        warning = function(condition, format) {
          for (var _len = arguments.length,
              args = Array(_len > 2 ? _len - 2 : 0),
              _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }
          if (format === undefined) {
            throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
          }
          if (format.indexOf('Failed Composite propType: ') === 0) {
            return;
          }
          if (!condition) {
            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function() {
              return args[argIndex++];
            });
            if (typeof console !== 'undefined') {
              console.error(message);
            }
            try {
              throw new Error(message);
            } catch (x) {}
          }
        };
      }
      module.exports = warning;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(144);
    }, function(module, exports) {
      var core = module.exports = {version: '1.2.6'};
      if (typeof __e == 'number')
        __e = core;
    }, function(module, exports) {
      var $Object = Object;
      module.exports = {
        create: $Object.create,
        getProto: $Object.getPrototypeOf,
        isEnum: {}.propertyIsEnumerable,
        getDesc: $Object.getOwnPropertyDescriptor,
        setDesc: $Object.defineProperty,
        setDescs: $Object.defineProperties,
        getKeys: $Object.keys,
        getNames: $Object.getOwnPropertyNames,
        getSymbols: $Object.getOwnPropertySymbols,
        each: [].forEach
      };
    }, [282, 209, 213, 64], function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(254);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$freeze = __webpack_require__(41)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayNodeInterface = __webpack_require__(12);
      var invariant = __webpack_require__(2);
      var EMPTY_CALLS = [];
      var EMPTY_CHILDREN = [];
      var EMPTY_DIRECTIVES = [];
      var EMPTY_METADATA = {};
      if (true) {
        _Object$freeze(EMPTY_CALLS);
        _Object$freeze(EMPTY_CHILDREN);
        _Object$freeze(EMPTY_DIRECTIVES);
        _Object$freeze(EMPTY_METADATA);
      }
      var QueryBuilder = {
        createBatchCallVariable: function createBatchCallVariable(sourceQueryID, jsonPath) {
          return {
            kind: 'BatchCallVariable',
            sourceQueryID: sourceQueryID,
            jsonPath: jsonPath
          };
        },
        createCall: function createCall(name, value, type) {
          return {
            kind: 'Call',
            name: name,
            metadata: {type: type || null},
            value: value
          };
        },
        createCallValue: function createCallValue(callValue) {
          return {
            kind: 'CallValue',
            callValue: callValue
          };
        },
        createCallVariable: function createCallVariable(callVariableName) {
          return {
            kind: 'CallVariable',
            callVariableName: callVariableName
          };
        },
        createField: function createField(partialField) {
          var partialMetadata = partialField.metadata || EMPTY_METADATA;
          return {
            alias: partialField.alias,
            calls: partialField.calls || EMPTY_CALLS,
            children: partialField.children || EMPTY_CHILDREN,
            directives: partialField.directives || EMPTY_DIRECTIVES,
            fieldName: partialField.fieldName,
            kind: 'Field',
            metadata: {
              inferredRootCallName: partialMetadata.inferredRootCallName,
              inferredPrimaryKey: partialMetadata.inferredPrimaryKey,
              isConnection: !!partialMetadata.isConnection,
              isFindable: !!partialMetadata.isFindable,
              isGenerated: !!partialMetadata.isGenerated,
              isPlural: !!partialMetadata.isPlural,
              isRequisite: !!partialMetadata.isRequisite,
              isAbstract: !!partialMetadata.isAbstract
            },
            type: partialField.type
          };
        },
        createFragment: function createFragment(partialFragment) {
          var metadata = partialFragment.metadata || EMPTY_METADATA;
          return {
            children: partialFragment.children || EMPTY_CHILDREN,
            directives: partialFragment.directives || EMPTY_DIRECTIVES,
            hash: null,
            kind: 'Fragment',
            metadata: {
              isAbstract: !!metadata.isAbstract,
              plural: !!metadata.plural
            },
            name: partialFragment.name,
            type: partialFragment.type
          };
        },
        createFragmentReference: function createFragmentReference(fragment) {
          return {
            kind: 'FragmentReference',
            fragment: fragment
          };
        },
        createMutation: function createMutation(partialMutation) {
          var metadata = partialMutation.metadata || EMPTY_METADATA;
          return {
            calls: partialMutation.calls || EMPTY_CALLS,
            children: partialMutation.children || EMPTY_CHILDREN,
            directives: partialMutation.directives || EMPTY_DIRECTIVES,
            kind: 'Mutation',
            metadata: {inputType: metadata.inputType},
            name: partialMutation.name,
            responseType: partialMutation.responseType
          };
        },
        createQuery: function createQuery(partialQuery) {
          var metadata = partialQuery.metadata || EMPTY_METADATA;
          var calls = [];
          var identifyingArgName = metadata.identifyingArgName;
          if (identifyingArgName == null && RelayNodeInterface.isNodeRootCall(partialQuery.fieldName)) {
            identifyingArgName = RelayNodeInterface.ID;
          }
          if (identifyingArgName != null) {
            !(partialQuery.identifyingArgValue != null) ? true ? invariant(false, 'QueryBuilder.createQuery(): An argument value is required for ' + 'query `%s(%s: ???)`.', partialQuery.fieldName, identifyingArgName) : invariant(false) : undefined;
            calls = [QueryBuilder.createCall(identifyingArgName, partialQuery.identifyingArgValue)];
          }
          return {
            calls: calls,
            children: partialQuery.children || EMPTY_CHILDREN,
            directives: partialQuery.directives || EMPTY_DIRECTIVES,
            fieldName: partialQuery.fieldName,
            isDeferred: !!(partialQuery.isDeferred || metadata.isDeferred),
            kind: 'Query',
            metadata: {
              identifyingArgName: identifyingArgName,
              identifyingArgType: metadata.identifyingArgType,
              isAbstract: !!metadata.isAbstract,
              isPlural: !!metadata.isPlural
            },
            name: partialQuery.name,
            type: partialQuery.type
          };
        },
        createSubscription: function createSubscription(partialSubscription) {
          var metadata = partialSubscription.metadata || EMPTY_METADATA;
          return {
            calls: partialSubscription.calls || EMPTY_CALLS,
            children: partialSubscription.children || EMPTY_CHILDREN,
            directives: partialSubscription.directives || EMPTY_DIRECTIVES,
            kind: 'Subscription',
            metadata: {inputType: metadata.inputType},
            name: partialSubscription.name,
            responseType: partialSubscription.responseType
          };
        },
        getBatchCallVariable: function getBatchCallVariable(node) {
          if (isConcreteKind(node, 'BatchCallVariable')) {
            return node;
          }
        },
        getCallVariable: function getCallVariable(node) {
          if (isConcreteKind(node, 'CallVariable')) {
            return node;
          }
        },
        getField: function getField(node) {
          if (isConcreteKind(node, 'Field')) {
            return node;
          }
        },
        getFragment: function getFragment(node) {
          if (isConcreteKind(node, 'Fragment')) {
            return node;
          }
        },
        getFragmentReference: function getFragmentReference(node) {
          if (isConcreteKind(node, 'FragmentReference')) {
            return node;
          }
        },
        getMutation: function getMutation(node) {
          if (isConcreteKind(node, 'Mutation')) {
            return node;
          }
        },
        getQuery: function getQuery(node) {
          if (isConcreteKind(node, 'Query')) {
            return node;
          }
        },
        getSubscription: function getSubscription(node) {
          if (isConcreteKind(node, 'Subscription')) {
            return node;
          }
        }
      };
      function isConcreteKind(node, kind) {
        return typeof node === 'object' && node !== null && node.kind === kind;
      }
      module.exports = QueryBuilder;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayQuery = __webpack_require__(3);
      var RelayQueryVisitor = (function() {
        function RelayQueryVisitor() {
          _classCallCheck(this, RelayQueryVisitor);
        }
        RelayQueryVisitor.prototype.visit = function visit(node, nextState) {
          if (node instanceof RelayQuery.Field) {
            return this.visitField(node, nextState);
          } else if (node instanceof RelayQuery.Fragment) {
            return this.visitFragment(node, nextState);
          } else if (node instanceof RelayQuery.Root) {
            return this.visitRoot(node, nextState);
          }
        };
        RelayQueryVisitor.prototype.traverse = function traverse(node, nextState) {
          var _this = this;
          if (!node.isScalar()) {
            node.getChildren().forEach(function(child) {
              return _this.visit(child, nextState);
            });
          }
          return node;
        };
        RelayQueryVisitor.prototype.visitField = function visitField(node, nextState) {
          return this.traverse(node, nextState);
        };
        RelayQueryVisitor.prototype.visitFragment = function visitFragment(node, nextState) {
          return this.traverse(node, nextState);
        };
        RelayQueryVisitor.prototype.visitRoot = function visitRoot(node, nextState) {
          return this.traverse(node, nextState);
        };
        return RelayQueryVisitor;
      })();
      module.exports = RelayQueryVisitor;
    }, 14, [282, 244, 122, 47], function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayQuery = __webpack_require__(3);
      var invariant = __webpack_require__(2);
      var shallowEqual = __webpack_require__(72);
      var GraphQLFragmentPointer = (function() {
        GraphQLFragmentPointer.createForRoot = function createForRoot(store, query) {
          var fragment = getRootFragment(query);
          if (!fragment) {
            return null;
          }
          var concreteFragmentID = fragment.getConcreteFragmentID();
          var storageKey = query.getStorageKey();
          var identifyingArg = query.getIdentifyingArg();
          var identifyingArgValue = identifyingArg && identifyingArg.value || null;
          if (Array.isArray(identifyingArgValue)) {
            var rootFragment = fragment;
            return identifyingArgValue.map(function(singleIdentifyingArgValue) {
              var dataID = store.getDataID(storageKey, singleIdentifyingArgValue);
              if (!dataID) {
                return null;
              }
              var pointer = GraphQLStoreDataHandler.createPointerWithID(dataID);
              pointer[concreteFragmentID] = new GraphQLFragmentPointer([dataID], rootFragment);
              return pointer;
            });
          }
          !(typeof identifyingArgValue === 'string' || identifyingArgValue == null) ? true ? invariant(false, 'GraphQLFragmentPointer: Value for the argument to `%s` on query `%s` ' + 'should be a string, but it was set to `%s`. Check that the value is a ' + 'string.', query.getFieldName(), query.getName(), identifyingArgValue) : invariant(false) : undefined;
          var dataIDOrIDs = store.getDataID(storageKey, identifyingArgValue);
          if (!dataIDOrIDs) {
            return null;
          }
          var result = {};
          var fragmentPointer = new GraphQLFragmentPointer(dataIDOrIDs, fragment);
          result[concreteFragmentID] = fragmentPointer;
          return result;
        };
        function GraphQLFragmentPointer(dataIDOrIDs, fragment) {
          _classCallCheck(this, GraphQLFragmentPointer);
          var isArray = Array.isArray(dataIDOrIDs);
          var isPlural = fragment.isPlural();
          !(isArray === isPlural) ? true ? invariant(false, 'GraphQLFragmentPointer: Wrong plurality, %s supplied with %s fragment.', isArray ? 'array of data IDs' : 'single data ID', isPlural ? 'plural' : 'non-plural') : invariant(false) : undefined;
          this._dataIDOrIDs = dataIDOrIDs;
          this._fragment = fragment;
        }
        GraphQLFragmentPointer.prototype.getDataID = function getDataID() {
          !!Array.isArray(this._dataIDOrIDs) ? true ? invariant(false, 'GraphQLFragmentPointer.getDataID(): Bad call for plural fragment.') : invariant(false) : undefined;
          return this._dataIDOrIDs;
        };
        GraphQLFragmentPointer.prototype.getDataIDs = function getDataIDs() {
          !Array.isArray(this._dataIDOrIDs) ? true ? invariant(false, 'GraphQLFragmentPointer.getDataIDs(): Bad call for non-plural fragment.') : invariant(false) : undefined;
          return this._dataIDOrIDs;
        };
        GraphQLFragmentPointer.prototype.getFragment = function getFragment() {
          return this._fragment;
        };
        GraphQLFragmentPointer.prototype.equals = function equals(that) {
          return shallowEqual(this._dataIDOrIDs, that._dataIDOrIDs) && this._fragment.isEquivalent(that._fragment);
        };
        GraphQLFragmentPointer.prototype.toString = function toString() {
          return 'GraphQLFragmentPointer(ids: ' + JSON.stringify(this._dataIDOrIDs) + ', fragment: `' + this.getFragment().getDebugName() + ', params: ' + JSON.stringify(this._fragment.getVariables()) + ')';
        };
        return GraphQLFragmentPointer;
      })();
      function getRootFragment(query) {
        var batchCall = query.getBatchCall();
        if (batchCall) {
          true ? true ? invariant(false, 'Queries supplied at the root cannot have batch call variables. Query ' + '`%s` has a batch call variable, `%s`.', query.getName(), batchCall.refParamName) : invariant(false) : undefined;
        }
        var fragment;
        query.getChildren().forEach(function(child) {
          if (child instanceof RelayQuery.Fragment) {
            !!fragment ? true ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + '(e.g. `${Component.getFragment(\'...\')}`). Query `%s` contains ' + 'more than one fragment.', query.getName()) : invariant(false) : undefined;
            fragment = child;
          } else if (child instanceof RelayQuery.Field) {
            !child.isGenerated() ? true ? invariant(false, 'Queries supplied at the root should contain exactly one fragment ' + 'and no fields. Query `%s` contains a field, `%s`. If you need to ' + 'fetch fields, declare them in a Relay container.', query.getName(), child.getSchemaName()) : invariant(false) : undefined;
          }
        });
        return fragment;
      }
      module.exports = GraphQLFragmentPointer;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayMetaRoute = (function() {
        function RelayMetaRoute(name) {
          _classCallCheck(this, RelayMetaRoute);
          Object.defineProperty(this, 'name', {
            enumerable: true,
            value: name,
            writable: false
          });
        }
        RelayMetaRoute.get = function get(name) {
          return cache[name] || (cache[name] = new RelayMetaRoute(name));
        };
        return RelayMetaRoute;
      })();
      var cache = {};
      module.exports = RelayMetaRoute;
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var _Array$from = __webpack_require__(93)["default"];
      exports["default"] = function(arr) {
        if (Array.isArray(arr)) {
          for (var i = 0,
              arr2 = Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i];
          return arr2;
        } else {
          return _Array$from(arr);
        }
      };
      exports.__esModule = true;
    }, function(module, exports) {
      module.exports = {};
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(16);
      'use strict';
      var RelayProfiler = __webpack_require__(4);
      var invariant = __webpack_require__(2);
      var injectedNetworkLayer;
      var RelayNetworkLayer = {
        injectNetworkLayer: function injectNetworkLayer(networkLayer) {
          injectedNetworkLayer = networkLayer;
        },
        sendMutation: function sendMutation(mutationRequest) {
          var networkLayer = getCurrentNetworkLayer();
          var promise = networkLayer.sendMutation(mutationRequest);
          if (promise) {
            Promise.resolve(promise).done();
          }
        },
        sendQueries: function sendQueries(queryRequests) {
          var networkLayer = getCurrentNetworkLayer();
          var promise = networkLayer.sendQueries(queryRequests);
          if (promise) {
            Promise.resolve(promise).done();
          }
        },
        supports: function supports() {
          var networkLayer = getCurrentNetworkLayer();
          return networkLayer.supports.apply(networkLayer, arguments);
        }
      };
      function getCurrentNetworkLayer() {
        !injectedNetworkLayer ? true ? invariant(false, 'RelayNetworkLayer: Use `injectNetworkLayer` to configure a network layer.') : invariant(false) : undefined;
        return injectedNetworkLayer;
      }
      RelayProfiler.instrumentMethods(RelayNetworkLayer, {
        sendMutation: 'RelayNetworkLayer.sendMutation',
        sendQueries: 'RelayNetworkLayer.sendQueries'
      });
      module.exports = RelayNetworkLayer;
    }, function(module, exports) {
      'use strict';
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayRecordState = {
        EXISTENT: 'EXISTENT',
        NONEXISTENT: 'NONEXISTENT',
        UNKNOWN: 'UNKNOWN'
      };
      module.exports = RelayRecordState;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var invariant = __webpack_require__(2);
      function forEachRootCallArg(query, callback) {
        !!query.getBatchCall() ? true ? invariant(false, 'forEachRootCallArg(): Cannot iterate over batch call variables.') : invariant(false) : undefined;
        function each(identifyingArgValue, fn) {
          if (Array.isArray(identifyingArgValue)) {
            identifyingArgValue.forEach(function(value) {
              return each(value, fn);
            });
          } else if (identifyingArgValue == null) {
            fn(identifyingArgValue);
          } else {
            !(typeof identifyingArgValue === 'string' || typeof identifyingArgValue === 'number') ? true ? invariant(false, 'Relay: Expected arguments to root field `%s` to each be strings/' + 'numbers, got `%s`.', query.getFieldName(), JSON.stringify(identifyingArgValue)) : invariant(false) : undefined;
            fn('' + identifyingArgValue);
          }
        }
        var identifyingArg = query.getIdentifyingArg();
        var identifyingArgValue = identifyingArg && identifyingArg.value || null;
        each(identifyingArgValue, callback);
      }
      module.exports = forEachRootCallArg;
    }, [269, 64, 13, 61], function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(16);
      var resolvedPromise = Promise.resolve();
      function resolveImmediate(callback) {
        resolvedPromise.then(callback)['catch'](throwNext);
      }
      function throwNext(error) {
        setTimeout(function() {
          throw error;
        }, 0);
      }
      module.exports = resolveImmediate;
    }, [270, 19, 117, 46], 24, function(module, exports, __webpack_require__) {
      'use strict';
      var asap = __webpack_require__(123);
      function noop() {}
      var LAST_ERROR = null;
      var IS_ERROR = {};
      function getThen(obj) {
        try {
          return obj.then;
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      function tryCallOne(fn, a) {
        try {
          return fn(a);
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      function tryCallTwo(fn, a, b) {
        try {
          fn(a, b);
        } catch (ex) {
          LAST_ERROR = ex;
          return IS_ERROR;
        }
      }
      module.exports = Promise;
      function Promise(fn) {
        if (typeof this !== 'object') {
          throw new TypeError('Promises must be constructed via new');
        }
        if (typeof fn !== 'function') {
          throw new TypeError('not a function');
        }
        this._37 = 0;
        this._12 = null;
        this._59 = [];
        if (fn === noop)
          return;
        doResolve(fn, this);
      }
      Promise._99 = noop;
      Promise.prototype.then = function(onFulfilled, onRejected) {
        if (this.constructor !== Promise) {
          return safeThen(this, onFulfilled, onRejected);
        }
        var res = new Promise(noop);
        handle(this, new Handler(onFulfilled, onRejected, res));
        return res;
      };
      function safeThen(self, onFulfilled, onRejected) {
        return new self.constructor(function(resolve, reject) {
          var res = new Promise(noop);
          res.then(resolve, reject);
          handle(self, new Handler(onFulfilled, onRejected, res));
        });
      }
      ;
      function handle(self, deferred) {
        while (self._37 === 3) {
          self = self._12;
        }
        if (self._37 === 0) {
          self._59.push(deferred);
          return;
        }
        asap(function() {
          var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;
          if (cb === null) {
            if (self._37 === 1) {
              resolve(deferred.promise, self._12);
            } else {
              reject(deferred.promise, self._12);
            }
            return;
          }
          var ret = tryCallOne(cb, self._12);
          if (ret === IS_ERROR) {
            reject(deferred.promise, LAST_ERROR);
          } else {
            resolve(deferred.promise, ret);
          }
        });
      }
      function resolve(self, newValue) {
        if (newValue === self) {
          return reject(self, new TypeError('A promise cannot be resolved with itself.'));
        }
        if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
          var then = getThen(newValue);
          if (then === IS_ERROR) {
            return reject(self, LAST_ERROR);
          }
          if (then === self.then && newValue instanceof Promise) {
            self._37 = 3;
            self._12 = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(then.bind(newValue), self);
            return;
          }
        }
        self._37 = 1;
        self._12 = newValue;
        finale(self);
      }
      function reject(self, newValue) {
        self._37 = 2;
        self._12 = newValue;
        finale(self);
      }
      function finale(self) {
        for (var i = 0; i < self._59.length; i++) {
          handle(self, self._59[i]);
        }
        self._59 = null;
      }
      function Handler(onFulfilled, onRejected, promise) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
      }
      function doResolve(fn, promise) {
        var done = false;
        var res = tryCallTwo(fn, function(value) {
          if (done)
            return;
          done = true;
          resolve(promise, value);
        }, function(reason) {
          if (done)
            return;
          done = true;
          reject(promise, reason);
        });
        if (!done && res === IS_ERROR) {
          done = true;
          reject(promise, LAST_ERROR);
        }
      }
    }, function(module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_33__;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var QueryBuilder = __webpack_require__(17);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var warning = __webpack_require__(11);
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
          !callVariable ? true ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `if()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
          this._addCondition(function(variables) {
            return !!variables[callVariable.callVariableName];
          });
          return this;
        };
        RelayFragmentReference.prototype.unless = function unless(value) {
          var callVariable = QueryBuilder.getCallVariable(value);
          !callVariable ? true ? invariant(false, 'RelayFragmentReference: Invalid value `%s` supplied to `unless()`. ' + 'Expected a variable.', callVariable) : invariant(false) : undefined;
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
                true ? warning(false, 'RelayFragmentReference: Variable `%s` is undefined in fragment ' + '`%s`.', name, _this._getFragment().name) : undefined;
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
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _require = __webpack_require__(33);
      var PropTypes = _require.PropTypes;
      var isRelayContainer = __webpack_require__(90);
      var sprintf = __webpack_require__(110);
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
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQuery = __webpack_require__(3);
      var invariant = __webpack_require__(2);
      var ID = RelayNodeInterface.ID;
      var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
      var TYPENAME = RelayNodeInterface.TYPENAME;
      var idField = RelayQuery.Field.build({
        fieldName: ID,
        type: 'String'
      });
      var typeField = RelayQuery.Field.build({
        fieldName: TYPENAME,
        type: 'String'
      });
      var RelayQueryPath = (function() {
        function RelayQueryPath(node, parent) {
          _classCallCheck(this, RelayQueryPath);
          if (node instanceof RelayQuery.Root) {
            !!parent ? true ? invariant(false, 'RelayQueryPath: Root paths may not have a parent.') : invariant(false) : undefined;
            this._name = node.getName();
          } else {
            !parent ? true ? invariant(false, 'RelayQueryPath: A parent is required for field paths.') : invariant(false) : undefined;
            this._name = parent.getName();
          }
          this._node = node;
          this._parent = parent;
        }
        RelayQueryPath.prototype.isRootPath = function isRootPath() {
          return !this._parent;
        };
        RelayQueryPath.prototype.getParent = function getParent() {
          var parent = this._parent;
          !parent ? true ? invariant(false, 'RelayQueryPath.getParent(): Cannot get the parent of a root path.') : invariant(false) : undefined;
          return parent;
        };
        RelayQueryPath.prototype.getName = function getName() {
          return this._name;
        };
        RelayQueryPath.prototype.getPath = function getPath(node, dataID) {
          if (GraphQLStoreDataHandler.isClientID(dataID)) {
            return new RelayQueryPath(node, this);
          } else {
            var root = RelayQuery.Root.build(this.getName(), RelayNodeInterface.NODE, dataID, [idField, typeField], {identifyingArgName: RelayNodeInterface.ID}, NODE_TYPE);
            return new RelayQueryPath(root);
          }
        };
        RelayQueryPath.prototype.getQuery = function getQuery(appendNode) {
          var node = this._node;
          var path = this;
          var child = appendNode;
          while (node instanceof RelayQuery.Field || node instanceof RelayQuery.Fragment) {
            var idFieldName = node instanceof RelayQuery.Field ? node.getInferredPrimaryKey() : ID;
            if (idFieldName) {
              child = node.clone([child, node.getFieldByStorageKey(idFieldName), node.getFieldByStorageKey(TYPENAME)]);
            } else {
              child = node.clone([child]);
            }
            path = path._parent;
            !path ? true ? invariant(false, 'RelayQueryPath.getQuery(): Expected a parent path.') : invariant(false) : undefined;
            node = path._node;
          }
          !child ? true ? invariant(false, 'RelayQueryPath: Expected a leaf node.') : invariant(false) : undefined;
          !(node instanceof RelayQuery.Root) ? true ? invariant(false, 'RelayQueryPath: Expected a root node.') : invariant(false) : undefined;
          var metadata = _extends({}, node.__concreteNode__.metadata);
          var identifyingArg = node.getIdentifyingArg();
          if (identifyingArg && identifyingArg.name != null) {
            metadata.identifyingArgName = identifyingArg.name;
          }
          return RelayQuery.Root.build(this.getName(), node.getFieldName(), identifyingArg && identifyingArg.value || null, [child, node.getFieldByStorageKey(ID), node.getFieldByStorageKey(TYPENAME)], metadata, node.getType());
        };
        return RelayQueryPath;
      })();
      module.exports = RelayQueryPath;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var GraphQLFragmentPointer = __webpack_require__(21);
      var RelayMutationTransaction = __webpack_require__(49);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryResultObservable = __webpack_require__(150);
      var RelayStoreData = __webpack_require__(38);
      var forEachRootCallArg = __webpack_require__(27);
      var readRelayQueryData = __webpack_require__(91);
      var storeData = RelayStoreData.getDefaultInstance();
      var queryRunner = storeData.getQueryRunner();
      var queuedStore = storeData.getQueuedStore();
      var RelayStore = {
        primeCache: function primeCache(querySet, callback) {
          return queryRunner.run(querySet, callback);
        },
        forceFetch: function forceFetch(querySet, callback) {
          return queryRunner.forceFetch(querySet, callback);
        },
        read: function read(node, dataID, options) {
          return readRelayQueryData(storeData, node, dataID, options).data;
        },
        readAll: function readAll(node, dataIDs, options) {
          return dataIDs.map(function(dataID) {
            return readRelayQueryData(storeData, node, dataID, options).data;
          });
        },
        readQuery: function readQuery(root, options) {
          var storageKey = root.getStorageKey();
          var results = [];
          forEachRootCallArg(root, function(identifyingArgValue) {
            var data;
            var dataID = queuedStore.getDataID(storageKey, identifyingArgValue);
            if (dataID != null) {
              data = RelayStore.read(root, dataID, options);
            }
            results.push(data);
          });
          return results;
        },
        observe: function observe(fragment, dataID) {
          var fragmentPointer = new GraphQLFragmentPointer(fragment.isPlural() ? [dataID] : dataID, fragment);
          return new RelayQueryResultObservable(storeData, fragmentPointer);
        },
        applyUpdate: function applyUpdate(mutation, callbacks) {
          return storeData.getMutationQueue().createTransaction(mutation, callbacks);
        },
        update: function update(mutation, callbacks) {
          this.applyUpdate(mutation, callbacks).commit();
        }
      };
      module.exports = RelayStore;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      var GraphQLQueryRunner = __webpack_require__(124);
      var GraphQLStoreChangeEmitter = __webpack_require__(127);
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var GraphQLStoreRangeUtils = __webpack_require__(128);
      var RelayChangeTracker = __webpack_require__(130);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayMutationQueue = __webpack_require__(138);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayPendingQueryTracker = __webpack_require__(145);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryTracker = __webpack_require__(151);
      var RelayQueryWriter = __webpack_require__(152);
      var RelayRecordStore = __webpack_require__(154);
      var RelayStoreGarbageCollector = __webpack_require__(159);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var generateForceIndex = __webpack_require__(88);
      var readRelayDiskCache = __webpack_require__(175);
      var warning = __webpack_require__(11);
      var writeRelayQueryPayload = __webpack_require__(181);
      var writeRelayUpdatePayload = __webpack_require__(182);
      var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
      var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
      var _instance;
      var RelayStoreData = (function() {
        RelayStoreData.getDefaultInstance = function getDefaultInstance() {
          if (!_instance) {
            _instance = new RelayStoreData();
          }
          return _instance;
        };
        function RelayStoreData() {
          _classCallCheck(this, RelayStoreData);
          var cachedRecords = {};
          var cachedRootCallMap = {};
          var queuedRecords = {};
          var records = {};
          var rootCallMap = {};
          var nodeRangeMap = {};
          var _createRecordCollection = createRecordCollection({
            cachedRecords: cachedRecords,
            cachedRootCallMap: cachedRootCallMap,
            cacheWriter: null,
            queuedRecords: queuedRecords,
            nodeRangeMap: nodeRangeMap,
            records: records,
            rootCallMap: rootCallMap
          });
          var cachedStore = _createRecordCollection.cachedStore;
          var queuedStore = _createRecordCollection.queuedStore;
          var recordStore = _createRecordCollection.recordStore;
          var rangeData = new GraphQLStoreRangeUtils();
          this._cacheManager = null;
          this._cachedRecords = cachedRecords;
          this._cachedRootCallMap = cachedRootCallMap;
          this._cachedStore = cachedStore;
          this._changeEmitter = new GraphQLStoreChangeEmitter(rangeData);
          this._mutationQueue = new RelayMutationQueue(this);
          this._nodeRangeMap = nodeRangeMap;
          this._pendingQueryTracker = new RelayPendingQueryTracker(this);
          this._queryRunner = new GraphQLQueryRunner(this);
          this._queryTracker = new RelayQueryTracker();
          this._queuedRecords = queuedRecords;
          this._queuedStore = queuedStore;
          this._records = records;
          this._recordStore = recordStore;
          this._rangeData = rangeData;
          this._rootCallMap = rootCallMap;
        }
        RelayStoreData.prototype.initializeGarbageCollector = function initializeGarbageCollector() {
          !!this._garbageCollector ? true ? invariant(false, 'RelayStoreData: Garbage collector is already initialized.') : invariant(false) : undefined;
          var shouldInitialize = this._isStoreDataEmpty();
          true ? warning(shouldInitialize, 'RelayStoreData: Garbage collection can only be initialized when no ' + 'data is present.') : undefined;
          if (shouldInitialize) {
            this._garbageCollector = new RelayStoreGarbageCollector(this);
          }
        };
        RelayStoreData.prototype.injectCacheManager = function injectCacheManager(cacheManager) {
          var _createRecordCollection2 = createRecordCollection({
            cachedRecords: this._cachedRecords,
            cachedRootCallMap: this._cachedRootCallMap,
            cacheWriter: cacheManager ? cacheManager.getQueryWriter() : null,
            queuedRecords: this._queuedRecords,
            nodeRangeMap: this._nodeRangeMap,
            records: this._records,
            rootCallMap: this._rootCallMap
          });
          var cachedStore = _createRecordCollection2.cachedStore;
          var queuedStore = _createRecordCollection2.queuedStore;
          var recordStore = _createRecordCollection2.recordStore;
          this._cacheManager = cacheManager;
          this._cachedStore = cachedStore;
          this._queuedStore = queuedStore;
          this._recordStore = recordStore;
        };
        RelayStoreData.prototype.clearCacheManager = function clearCacheManager() {
          var _createRecordCollection3 = createRecordCollection({
            cachedRecords: this._cachedRecords,
            cachedRootCallMap: this._cachedRootCallMap,
            cacheWriter: null,
            queuedRecords: this._queuedRecords,
            nodeRangeMap: this._nodeRangeMap,
            records: this._records,
            rootCallMap: this._rootCallMap
          });
          var cachedStore = _createRecordCollection3.cachedStore;
          var queuedStore = _createRecordCollection3.queuedStore;
          var recordStore = _createRecordCollection3.recordStore;
          this._cacheManager = null;
          this._cachedStore = cachedStore;
          this._queuedStore = queuedStore;
          this._recordStore = recordStore;
        };
        RelayStoreData.prototype.hasCacheManager = function hasCacheManager() {
          return !!this._cacheManager;
        };
        RelayStoreData.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
          dataID = this.getRangeData().getCanonicalClientID(dataID);
          return this.getQueuedStore().hasOptimisticUpdate(dataID);
        };
        RelayStoreData.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
          dataID = this.getRangeData().getCanonicalClientID(dataID);
          return this.getQueuedStore().getClientMutationIDs(dataID);
        };
        RelayStoreData.prototype.readFromDiskCache = function readFromDiskCache(queries, callbacks) {
          var cacheManager = this._cacheManager;
          !cacheManager ? true ? invariant(false, 'RelayStoreData: `readFromDiskCache` should only be called when cache ' + 'manager is available.') : invariant(false) : undefined;
          var profile = RelayProfiler.profile('RelayStoreData.readFromDiskCache');
          readRelayDiskCache(queries, this._queuedStore, this._cachedRecords, this._cachedRootCallMap, cacheManager, {
            onSuccess: function onSuccess() {
              profile.stop();
              callbacks.onSuccess && callbacks.onSuccess();
            },
            onFailure: function onFailure() {
              profile.stop();
              callbacks.onFailure && callbacks.onFailure();
            }
          });
        };
        RelayStoreData.prototype.handleQueryPayload = function handleQueryPayload(query, response, forceIndex) {
          var profiler = RelayProfiler.profile('RelayStoreData.handleQueryPayload');
          var changeTracker = new RelayChangeTracker();
          var writer = new RelayQueryWriter(this._cachedStore, this._queryTracker, changeTracker, {
            forceIndex: forceIndex,
            updateTrackedQueries: true
          });
          writeRelayQueryPayload(writer, query, response);
          this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
          profiler.stop();
        };
        RelayStoreData.prototype.handleUpdatePayload = function handleUpdatePayload(operation, payload, _ref) {
          var configs = _ref.configs;
          var isOptimisticUpdate = _ref.isOptimisticUpdate;
          var profiler = RelayProfiler.profile('RelayStoreData.handleUpdatePayload');
          var changeTracker = new RelayChangeTracker();
          var store;
          if (isOptimisticUpdate) {
            var clientMutationID = payload[CLIENT_MUTATION_ID];
            !(typeof clientMutationID === 'string') ? true ? invariant(false, 'RelayStoreData.handleUpdatePayload(): Expected optimistic payload ' + 'to have a valid `%s`.', CLIENT_MUTATION_ID) : invariant(false) : undefined;
            store = this.getRecordStoreForOptimisticMutation(clientMutationID);
          } else {
            store = this._getRecordStoreForMutation();
          }
          var writer = new RelayQueryWriter(store, this._queryTracker, changeTracker, {
            forceIndex: generateForceIndex(),
            isOptimisticUpdate: isOptimisticUpdate,
            updateTrackedQueries: false
          });
          writeRelayUpdatePayload(writer, operation, payload, {
            configs: configs,
            isOptimisticUpdate: isOptimisticUpdate
          });
          this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());
          profiler.stop();
        };
        RelayStoreData.prototype.buildFragmentQueryForDataID = function buildFragmentQueryForDataID(fragment, dataID) {
          if (GraphQLStoreDataHandler.isClientID(dataID)) {
            var path = this._queuedStore.getPathToRecord(dataID);
            !path ? true ? invariant(false, 'RelayStoreData.buildFragmentQueryForDataID(): Cannot refetch ' + 'record `%s` without a path.', dataID) : invariant(false) : undefined;
            return path.getQuery(fragment);
          }
          return RelayQuery.Root.build(fragment.getDebugName() || 'UnknownQuery', RelayNodeInterface.NODE, dataID, [fragment], {identifyingArgName: RelayNodeInterface.ID}, NODE_TYPE);
        };
        RelayStoreData.prototype.getNodeData = function getNodeData() {
          return this._records;
        };
        RelayStoreData.prototype.getQueuedData = function getQueuedData() {
          return this._queuedRecords;
        };
        RelayStoreData.prototype.clearQueuedData = function clearQueuedData() {
          var _this = this;
          forEachObject(this._queuedRecords, function(_, key) {
            delete _this._queuedRecords[key];
            _this._changeEmitter.broadcastChangeForID(key);
          });
        };
        RelayStoreData.prototype.getCachedData = function getCachedData() {
          return this._cachedRecords;
        };
        RelayStoreData.prototype.getGarbageCollector = function getGarbageCollector() {
          return this._garbageCollector;
        };
        RelayStoreData.prototype.getMutationQueue = function getMutationQueue() {
          return this._mutationQueue;
        };
        RelayStoreData.prototype.getCachedStore = function getCachedStore() {
          return this._cachedStore;
        };
        RelayStoreData.prototype.getQueuedStore = function getQueuedStore() {
          return this._queuedStore;
        };
        RelayStoreData.prototype.getRecordStore = function getRecordStore() {
          return this._recordStore;
        };
        RelayStoreData.prototype.getQueryTracker = function getQueryTracker() {
          return this._queryTracker;
        };
        RelayStoreData.prototype.getQueryRunner = function getQueryRunner() {
          return this._queryRunner;
        };
        RelayStoreData.prototype.getChangeEmitter = function getChangeEmitter() {
          return this._changeEmitter;
        };
        RelayStoreData.prototype.getChangeEmitter = function getChangeEmitter() {
          return this._changeEmitter;
        };
        RelayStoreData.prototype.getRangeData = function getRangeData() {
          return this._rangeData;
        };
        RelayStoreData.prototype.getPendingQueryTracker = function getPendingQueryTracker() {
          return this._pendingQueryTracker;
        };
        RelayStoreData.prototype.getRootCallData = function getRootCallData() {
          return this._rootCallMap;
        };
        RelayStoreData.prototype._isStoreDataEmpty = function _isStoreDataEmpty() {
          return _Object$keys(this._records).length === 0 && _Object$keys(this._queuedRecords).length === 0 && _Object$keys(this._cachedRecords).length === 0;
        };
        RelayStoreData.prototype._handleChangedAndNewDataIDs = function _handleChangedAndNewDataIDs(changeSet) {
          var _this2 = this;
          var updatedDataIDs = _Object$keys(changeSet.updated);
          updatedDataIDs.forEach(function(id) {
            return _this2._changeEmitter.broadcastChangeForID(id);
          });
          if (this._garbageCollector) {
            var createdDataIDs = _Object$keys(changeSet.created);
            var garbageCollector = this._garbageCollector;
            createdDataIDs.forEach(function(dataID) {
              return garbageCollector.register(dataID);
            });
          }
        };
        RelayStoreData.prototype._getRecordStoreForMutation = function _getRecordStoreForMutation() {
          var records = this._records;
          var rootCallMap = this._rootCallMap;
          return new RelayRecordStore({records: records}, {rootCallMap: rootCallMap}, this._nodeRangeMap, this._cacheManager ? this._cacheManager.getMutationWriter() : null);
        };
        RelayStoreData.prototype.getRecordStoreForOptimisticMutation = function getRecordStoreForOptimisticMutation(clientMutationID) {
          var cachedRecords = this._cachedRecords;
          var cachedRootCallMap = this._cachedRootCallMap;
          var rootCallMap = this._rootCallMap;
          var queuedRecords = this._queuedRecords;
          var records = this._records;
          return new RelayRecordStore({
            cachedRecords: cachedRecords,
            queuedRecords: queuedRecords,
            records: records
          }, {
            cachedRootCallMap: cachedRootCallMap,
            rootCallMap: rootCallMap
          }, this._nodeRangeMap, null, clientMutationID);
        };
        return RelayStoreData;
      })();
      function createRecordCollection(_ref2) {
        var cachedRecords = _ref2.cachedRecords;
        var cachedRootCallMap = _ref2.cachedRootCallMap;
        var cacheWriter = _ref2.cacheWriter;
        var queuedRecords = _ref2.queuedRecords;
        var nodeRangeMap = _ref2.nodeRangeMap;
        var records = _ref2.records;
        var rootCallMap = _ref2.rootCallMap;
        return {
          queuedStore: new RelayRecordStore({
            cachedRecords: cachedRecords,
            queuedRecords: queuedRecords,
            records: records
          }, {
            cachedRootCallMap: cachedRootCallMap,
            rootCallMap: rootCallMap
          }, nodeRangeMap),
          cachedStore: new RelayRecordStore({
            cachedRecords: cachedRecords,
            records: records
          }, {
            cachedRootCallMap: cachedRootCallMap,
            rootCallMap: rootCallMap
          }, nodeRangeMap, cacheWriter),
          recordStore: new RelayRecordStore({records: records}, {rootCallMap: rootCallMap}, nodeRangeMap, cacheWriter)
        };
      }
      RelayProfiler.instrumentMethods(RelayStoreData.prototype, {
        handleQueryPayload: 'RelayStoreData.prototype.handleQueryPayload',
        handleUpdatePayload: 'RelayStoreData.prototype.handleUpdatePayload'
      });
      module.exports = RelayStoreData;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(16);
      'use strict';
      var invariant = __webpack_require__(2);
      var queue = [];
      var schedule;
      var running = false;
      var RelayTaskScheduler = {
        injectScheduler: function injectScheduler(injectedScheduler) {
          schedule = injectedScheduler;
        },
        await: function await() {
          for (var _len = arguments.length,
              callbacks = Array(_len),
              _key = 0; _key < _len; _key++) {
            callbacks[_key] = arguments[_key];
          }
          var promise = new Promise(function(resolve, reject) {
            var nextIndex = 0;
            var error = null;
            function enqueueNext(value) {
              if (error) {
                reject(error);
                return;
              }
              if (nextIndex >= callbacks.length) {
                resolve(value);
              } else {
                queue.push(function() {
                  enqueueNext((function() {
                    var nextCallback = callbacks[nextIndex++];
                    try {
                      value = nextCallback(value);
                    } catch (e) {
                      error = e;
                      value = undefined;
                    }
                    return value;
                  })());
                });
              }
            }
            enqueueNext(undefined);
          });
          scheduleIfNecessary();
          return promise;
        }
      };
      function scheduleIfNecessary() {
        if (running) {
          return;
        }
        if (queue.length) {
          running = true;
          var executeTask = createTaskExecutor(queue.shift());
          if (schedule) {
            schedule(executeTask);
          } else {
            executeTask();
          }
        } else {
          running = false;
        }
      }
      function createTaskExecutor(callback) {
        var invoked = false;
        return function() {
          !!invoked ? true ? invariant(false, 'RelayTaskScheduler: Tasks can only be executed once.') : invariant(false) : undefined;
          invoked = true;
          invokeWithinScopedQueue(callback);
          running = false;
          scheduleIfNecessary();
        };
      }
      function invokeWithinScopedQueue(callback) {
        var originalQueue = queue;
        queue = [];
        try {
          callback();
        } finally {
          Array.prototype.unshift.apply(originalQueue, queue);
          queue = originalQueue;
        }
      }
      module.exports = RelayTaskScheduler;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var flattenArray = __webpack_require__(225);
      function printRelayQueryCall(call) {
        var value = call.value;
        var valueString;
        if (Array.isArray(value)) {
          valueString = flattenArray(value).map(sanitizeCallValue).join(',');
        } else if (value != null) {
          valueString = sanitizeCallValue(value);
        } else {
          valueString = '';
        }
        return '.' + call.name + '(' + valueString + ')';
      }
      function sanitizeCallValue(value) {
        if (value == null) {
          return '';
        }
        if (typeof value !== 'string') {
          value = JSON.stringify(value);
        }
        value = value.replace(/[)(}{><,.\\]/g, '\\$&');
        if (/ $/.test(value)) {
          value += ' ';
        }
        return value.replace(/^( *)(.*?)( *)$/, function(_, prefix, body, suffix) {
          return '\\ '.repeat(prefix.length) + body + '\\ '.repeat(suffix.length);
        });
      }
      module.exports = printRelayQueryCall;
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(194),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }
      var Promise = __webpack_require__(16);
      var Deferred = (function() {
        function Deferred() {
          var _this = this;
          _classCallCheck(this, Deferred);
          this._settled = false;
          this._promise = new Promise(function(resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
          });
        }
        Deferred.prototype.getPromise = function getPromise() {
          return this._promise;
        };
        Deferred.prototype.resolve = function resolve(value) {
          this._settled = true;
          this._resolve(value);
        };
        Deferred.prototype.reject = function reject(reason) {
          this._settled = true;
          this._reject(reason);
        };
        Deferred.prototype.then = function then() {
          return Promise.prototype.then.apply(this._promise, arguments);
        };
        Deferred.prototype.done = function done() {
          Promise.prototype.done.apply(this._promise, arguments);
        };
        Deferred.prototype.isSettled = function isSettled() {
          return this._settled;
        };
        return Deferred;
      })();
      module.exports = Deferred;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(232);
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function mapObject(object, callback, context) {
        if (!object) {
          return null;
        }
        var result = {};
        for (var name in object) {
          if (hasOwnProperty.call(object, name)) {
            result[name] = callback.call(context, object[name], name, object);
          }
        }
        return result;
      }
      module.exports = mapObject;
    }, 13, [268, 114], function(module, exports) {
      var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
      if (typeof __g == 'number')
        __g = global;
    }, function(module, exports) {
      'use strict';
      var GraphQLMutatorConstants = {
        APPEND: 'append',
        PREPEND: 'prepend',
        REMOVE: 'remove',
        NODE_DELETE_HANDLER: 'node_delete',
        RANGE_ADD_HANDLER: 'range_add',
        RANGE_DELETE_HANDLER: 'range_delete',
        HANDLER_TYPES: {},
        OPTIMISTIC_UPDATE: 'optimistic',
        SERVER_UPDATE: 'server',
        POLLER_UPDATE: 'poller',
        UPDATE_TYPES: {},
        RANGE_OPERATIONS: {}
      };
      GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.NODE_DELETE_HANDLER] = true;
      GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.RANGE_ADD_HANDLER] = true;
      GraphQLMutatorConstants.HANDLER_TYPES[GraphQLMutatorConstants.RANGE_DELETE_HANDLER] = true;
      GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.OPTIMISTIC_UPDATE] = true;
      GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.SERVER_UPDATE] = true;
      GraphQLMutatorConstants.UPDATE_TYPES[GraphQLMutatorConstants.POLLER_UPDATE] = true;
      GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.APPEND] = true;
      GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.PREPEND] = true;
      GraphQLMutatorConstants.RANGE_OPERATIONS[GraphQLMutatorConstants.REMOVE] = true;
      module.exports = GraphQLMutatorConstants;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayMutationTransactionStatus = __webpack_require__(82);
      var invariant = __webpack_require__(2);
      var RelayMutationTransaction = (function() {
        function RelayMutationTransaction(mutationQueue, id) {
          _classCallCheck(this, RelayMutationTransaction);
          this._id = id;
          this._mutationQueue = mutationQueue;
        }
        RelayMutationTransaction.prototype.commit = function commit() {
          var status = this.getStatus();
          !(status === RelayMutationTransactionStatus.UNCOMMITTED) ? true ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + 'can be comitted.') : invariant(false) : undefined;
          this._mutationQueue.commit(this._id);
        };
        RelayMutationTransaction.prototype.recommit = function recommit() {
          var status = this.getStatus();
          !(status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ? true ? invariant(false, 'RelayMutationTransaction: Only transaction with status ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be comitted.') : invariant(false) : undefined;
          this._mutationQueue.commit(this._id);
        };
        RelayMutationTransaction.prototype.rollback = function rollback() {
          var status = this.getStatus();
          !(status === RelayMutationTransactionStatus.UNCOMMITTED || status === RelayMutationTransactionStatus.COMMIT_FAILED || status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED) ? true ? invariant(false, 'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + '`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be rolledback.') : invariant(false) : undefined;
          this._mutationQueue.rollback(this._id);
        };
        RelayMutationTransaction.prototype.getError = function getError() {
          return this._mutationQueue.getError(this._id);
        };
        RelayMutationTransaction.prototype.getStatus = function getStatus() {
          return this._mutationQueue.getStatus(this._id);
        };
        return RelayMutationTransaction;
      })();
      module.exports = RelayMutationTransaction;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayQueryVisitor = __webpack_require__(18);
      var RelayQueryTransform = (function(_RelayQueryVisitor) {
        _inherits(RelayQueryTransform, _RelayQueryVisitor);
        function RelayQueryTransform() {
          _classCallCheck(this, RelayQueryTransform);
          _RelayQueryVisitor.apply(this, arguments);
        }
        RelayQueryTransform.prototype.traverse = function traverse(node, nextState) {
          if (node.isScalar()) {
            return node;
          }
          var nextChildren;
          var children = node.getChildren();
          for (var ii = 0; ii < children.length; ii++) {
            var prevChild = children[ii];
            var nextChild = this.visit(prevChild, nextState);
            if (nextChild !== prevChild) {
              nextChildren = nextChildren || children.slice(0, ii);
            }
            if (nextChildren && nextChild) {
              nextChildren.push(nextChild);
            }
          }
          if (nextChildren) {
            if (!nextChildren.length) {
              return null;
            }
            return node.clone(nextChildren);
          }
          return node;
        };
        return RelayQueryTransform;
      })(RelayQueryVisitor);
      module.exports = RelayQueryTransform;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _extends = __webpack_require__(8)['default'];
      var _toConsumableArray = __webpack_require__(23)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var Map = __webpack_require__(43);
      var QueryBuilder = __webpack_require__(17);
      var RelayProfiler = __webpack_require__(4);
      var filterObject = __webpack_require__(224);
      var invariant = __webpack_require__(2);
      var mapObject = __webpack_require__(44);
      var fragmentCache = new Map();
      var queryCache = new Map();
      function isDeprecatedCallWithArgCountGreaterThan(nodeBuilder, count) {
        var argLength = nodeBuilder.length;
        if (true) {
          var mockImpl = nodeBuilder;
          while (mockImpl && mockImpl._getMockImplementation) {
            mockImpl = mockImpl._getMockImplementation();
          }
          if (mockImpl) {
            argLength = mockImpl.length;
          }
        }
        return argLength > count;
      }
      var buildRQL = {
        Fragment: function Fragment(fragmentBuilder, values) {
          var node = fragmentCache.get(fragmentBuilder);
          if (!node) {
            var variables = toVariables(values);
            !!isDeprecatedCallWithArgCountGreaterThan(fragmentBuilder, 1) ? true ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'fragment, use `variables => Relay.QL`.') : invariant(false) : undefined;
            node = fragmentBuilder(variables);
            fragmentCache.set(fragmentBuilder, node);
          }
          if (node) {
            return QueryBuilder.getFragment(node);
          }
        },
        Query: function Query(queryBuilder, Component, queryName, values) {
          var componentCache = queryCache.get(queryBuilder);
          var node = undefined;
          if (!componentCache) {
            componentCache = new Map();
            queryCache.set(queryBuilder, componentCache);
          } else {
            node = componentCache.get(Component);
          }
          if (!node) {
            var _variables = toVariables(values);
            !!isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 2) ? true ? invariant(false, 'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 'query, use `(Component, variables) => Relay.QL`.') : invariant(false) : undefined;
            if (isDeprecatedCallWithArgCountGreaterThan(queryBuilder, 0)) {
              node = queryBuilder(Component, _variables);
            } else {
              node = queryBuilder(Component, _variables);
              var query = QueryBuilder.getQuery(node);
              if (query) {
                (function() {
                  var hasFragment = false;
                  var hasScalarFieldsOnly = true;
                  if (query.children) {
                    query.children.forEach(function(child) {
                      if (child) {
                        hasFragment = hasFragment || child.kind === 'Fragment';
                        hasScalarFieldsOnly = hasScalarFieldsOnly && child.kind === 'Field' && (!child.children || child.children.length === 0);
                      }
                    });
                  }
                  if (!hasFragment) {
                    var children = query.children ? [].concat(_toConsumableArray(query.children)) : [];
                    !hasScalarFieldsOnly ? true ? invariant(false, 'Relay.QL: Expected query `%s` to be empty. For example, use ' + '`node(id: $id)`, not `node(id: $id) { ... }`.', query.fieldName) : invariant(false) : undefined;
                    var fragmentValues = filterObject(values, function(_, name) {
                      return Component.hasVariable(name);
                    });
                    children.push(Component.getFragment(queryName, fragmentValues));
                    node = _extends({}, query, {children: children});
                  }
                })();
              }
            }
            componentCache.set(Component, node);
          }
          if (node) {
            return QueryBuilder.getQuery(node) || undefined;
          }
          return null;
        }
      };
      function toVariables(variables) {
        return mapObject(variables, function(_, name) {
          return QueryBuilder.createCallVariable(name);
        });
      }
      RelayProfiler.instrumentMethods(buildRQL, {
        Fragment: 'buildRQL.Fragment',
        Query: 'buildRQL.Query'
      });
      module.exports = buildRQL;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var invariant = __webpack_require__(2);
      function callsFromGraphQL(concreteCalls, variables) {
        var callsOrDirectives = concreteCalls;
        var orderedCalls = [];
        for (var ii = 0; ii < callsOrDirectives.length; ii++) {
          var _callsOrDirectives$ii = callsOrDirectives[ii];
          var name = _callsOrDirectives$ii.name;
          var value = _callsOrDirectives$ii.value;
          if (value != null) {
            if (Array.isArray(value)) {
              value = value.map(function(arg) {
                return getCallVaue(arg, variables);
              });
            } else if (value.kind === 'BatchCallVariable') {
              value = null;
            } else {
              value = getCallVaue(value, variables);
            }
          }
          orderedCalls.push({
            name: name,
            value: value
          });
        }
        return orderedCalls;
      }
      function getCallVaue(value, variables) {
        if (value.kind === 'CallValue') {
          return value.callValue;
        } else {
          var variableName = value.callVariableName;
          !variables.hasOwnProperty(variableName) ? true ? invariant(false, 'callsFromGraphQL(): Expected a declared value for variable, `$%s`.', variableName) : invariant(false) : undefined;
          return variables[variableName];
        }
      }
      module.exports = callsFromGraphQL;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var _Array$from = __webpack_require__(93)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var Map = __webpack_require__(43);
      var RelayProfiler = __webpack_require__(4);
      var RelayQueryVisitor = __webpack_require__(18);
      var sortTypeFirst = __webpack_require__(177);
      function flattenRelayQuery(node, options) {
        var flattener = new RelayQueryFlattener(options && options.shouldRemoveFragments);
        var state = {
          node: node,
          type: node.getType(),
          flattenedFieldMap: new Map(),
          flattenedFragmentMap: new Map()
        };
        flattener.traverse(node, state);
        return toQuery(node, state);
      }
      function toQuery(node, _ref) {
        var flattenedFieldMap = _ref.flattenedFieldMap;
        var flattenedFragmentMap = _ref.flattenedFragmentMap;
        var children = [];
        var aliases = _Array$from(flattenedFieldMap.keys()).sort(sortTypeFirst);
        aliases.forEach(function(alias) {
          var field = flattenedFieldMap.get(alias);
          if (field) {
            children.push(toQuery(field.node, field));
          }
        });
        _Array$from(flattenedFragmentMap.keys()).forEach(function(type) {
          var fragment = flattenedFragmentMap.get(type);
          if (fragment) {
            children.push(toQuery(fragment.node, fragment));
          }
        });
        return node.clone(children);
      }
      var RelayQueryFlattener = (function(_RelayQueryVisitor) {
        _inherits(RelayQueryFlattener, _RelayQueryVisitor);
        function RelayQueryFlattener(shouldRemoveFragments) {
          _classCallCheck(this, RelayQueryFlattener);
          _RelayQueryVisitor.call(this);
          this._shouldRemoveFragments = !!shouldRemoveFragments;
        }
        RelayQueryFlattener.prototype.visitFragment = function visitFragment(node, state) {
          var type = node.getType();
          if (this._shouldRemoveFragments || type === state.type) {
            this.traverse(node, state);
            return;
          }
          var flattenedFragment = state.flattenedFragmentMap.get(type);
          if (!flattenedFragment) {
            flattenedFragment = {
              node: node,
              type: type,
              flattenedFieldMap: new Map(),
              flattenedFragmentMap: new Map()
            };
            state.flattenedFragmentMap.set(type, flattenedFragment);
          }
          this.traverse(node, flattenedFragment);
        };
        RelayQueryFlattener.prototype.visitField = function visitField(node, state) {
          var serializationKey = node.getSerializationKey();
          var flattenedField = state.flattenedFieldMap.get(serializationKey);
          if (!flattenedField) {
            flattenedField = {
              node: node,
              type: node.getType(),
              flattenedFieldMap: new Map(),
              flattenedFragmentMap: new Map()
            };
            state.flattenedFieldMap.set(serializationKey, flattenedField);
          }
          this.traverse(node, flattenedField);
        };
        return RelayQueryFlattener;
      })(RelayQueryVisitor);
      module.exports = RelayProfiler.instrument('flattenRelayQuery', flattenRelayQuery);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var crc32 = __webpack_require__(107);
      var performanceNow = __webpack_require__(229);
      var _clientID = 1;
      var _prefix = 'client:' + crc32('' + performanceNow());
      function generateClientID() {
        return _prefix + _clientID++;
      }
      module.exports = generateClientID;
    }, function(module, exports) {
      'use strict';
      function isCompatibleRelayFragmentType(fragment, recordType) {
        return recordType === fragment.getType() || !recordType || fragment.isAbstract();
      }
      module.exports = isCompatibleRelayFragmentType;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(174);
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(191),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var _Object$defineProperty = __webpack_require__(186)["default"];
      exports["default"] = function(obj, key, value) {
        if (key in obj) {
          _Object$defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key] = value;
        }
        return obj;
      };
      exports.__esModule = true;
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var _getIterator = __webpack_require__(183)["default"];
      var _isIterable = __webpack_require__(184)["default"];
      exports["default"] = (function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (var _i = _getIterator(arr),
                _s; !(_n = (_s = _i.next()).done); _n = true) {
              _arr.push(_s.value);
              if (i && _arr.length === i)
                break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i["return"])
                _i["return"]();
            } finally {
              if (_d)
                throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (_isIterable(Object(arr))) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
          }
        };
      })();
      exports.__esModule = true;
    }, [265, 66], [267, 197], function(module, exports) {
      module.exports = function(it) {
        if (it == undefined)
          throw TypeError("Can't call method on  " + it);
        return it;
      };
    }, function(module, exports) {
      module.exports = function(exec) {
        try {
          return !!exec();
        } catch (e) {
          return true;
        }
      };
    }, 47, [270, 14, 100, 199], function(module, exports) {
      module.exports = function(it) {
        return typeof it === 'object' ? it !== null : typeof it === 'function';
      };
    }, function(module, exports, __webpack_require__) {
      var defined = __webpack_require__(62);
      module.exports = function(it) {
        return Object(defined(it));
      };
    }, [285, 210, 98], function(module, exports) {
      "use strict";
      var ErrorUtils = {
        applyWithGuard: function(callback, context, args, onError, name) {
          return callback.apply(context, args);
        },
        guard: function(callback, name) {
          return callback;
        }
      };
      module.exports = ErrorUtils;
    }, function(module, exports) {
      "use strict";
      function makeEmptyFunction(arg) {
        return function() {
          return arg;
        };
      }
      function emptyFunction() {}
      emptyFunction.thatReturns = makeEmptyFunction;
      emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
      emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
      emptyFunction.thatReturnsNull = makeEmptyFunction(null);
      emptyFunction.thatReturnsThis = function() {
        return this;
      };
      emptyFunction.thatReturnsArgument = function(arg) {
        return arg;
      };
      module.exports = emptyFunction;
    }, function(module, exports) {
      "use strict";
      var nullthrows = function(x) {
        if (x != null) {
          return x;
        }
        throw new Error("Got unexpected null or undefined");
      };
      module.exports = nullthrows;
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function shallowEqual(objA, objB) {
        if (objA === objB) {
          return true;
        }
        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
          return false;
        }
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) {
          return false;
        }
        var bHasOwnProperty = hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
          if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
          }
        }
        return true;
      }
      module.exports = shallowEqual;
    }, [267, 233], 62, function(module, exports) {
      var hasOwnProperty = {}.hasOwnProperty;
      module.exports = function(it, key) {
        return hasOwnProperty.call(it, key);
      };
    }, 66, [275, 242, 113, 119, 30, 75, 31, 241, 78, 19, 20], [277, 19, 75, 20], function(module, exports, __webpack_require__) {
      'use strict';
      var keyMirror = __webpack_require__(227);
      var DliteFetchModeConstants = keyMirror({
        FETCH_MODE_CLIENT: null,
        FETCH_MODE_PRELOAD: null,
        FETCH_MODE_REFETCH: null
      });
      module.exports = DliteFetchModeConstants;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _slicedToArray = __webpack_require__(59)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      var RelayProfiler = __webpack_require__(4);
      var filterExclusiveKeys = __webpack_require__(165);
      var readRelayQueryData = __webpack_require__(91);
      var recycleNodesInto = __webpack_require__(176);
      var GraphQLStoreQueryResolver = (function() {
        function GraphQLStoreQueryResolver(storeData, fragmentPointer, callback) {
          _classCallCheck(this, GraphQLStoreQueryResolver);
          this.reset();
          this._callback = callback;
          this._fragmentPointer = fragmentPointer;
          this._resolver = null;
          this._storeData = storeData;
        }
        GraphQLStoreQueryResolver.prototype.reset = function reset() {
          if (this._resolver) {
            this._resolver.reset();
          }
        };
        GraphQLStoreQueryResolver.prototype.resolve = function resolve(fragmentPointer) {
          var resolver = this._resolver;
          if (!resolver) {
            resolver = this._fragmentPointer.getFragment().isPlural() ? new GraphQLStorePluralQueryResolver(this._storeData, this._callback) : new GraphQLStoreSingleQueryResolver(this._storeData, this._callback);
            this._resolver = resolver;
          }
          return resolver.resolve(fragmentPointer);
        };
        return GraphQLStoreQueryResolver;
      })();
      var GraphQLStorePluralQueryResolver = (function() {
        function GraphQLStorePluralQueryResolver(storeData, callback) {
          _classCallCheck(this, GraphQLStorePluralQueryResolver);
          this.reset();
          this._callback = callback;
          this._storeData = storeData;
        }
        GraphQLStorePluralQueryResolver.prototype.reset = function reset() {
          if (this._resolvers) {
            this._resolvers.forEach(function(resolver) {
              return resolver.reset();
            });
          }
          this._resolvers = [];
          this._results = [];
        };
        GraphQLStorePluralQueryResolver.prototype.resolve = function resolve(fragmentPointer) {
          var prevResults = this._results;
          var nextResults;
          var nextIDs = fragmentPointer.getDataIDs();
          var prevLength = prevResults.length;
          var nextLength = nextIDs.length;
          var resolvers = this._resolvers;
          while (resolvers.length < nextLength) {
            resolvers.push(new GraphQLStoreSingleQueryResolver(this._storeData, this._callback));
          }
          while (resolvers.length > nextLength) {
            resolvers.pop().reset();
          }
          if (prevLength !== nextLength) {
            nextResults = [];
          }
          for (var ii = 0; ii < nextLength; ii++) {
            var nextResult = resolvers[ii].resolve(fragmentPointer, nextIDs[ii]);
            if (nextResults || ii >= prevLength || nextResult !== prevResults[ii]) {
              nextResults = nextResults || prevResults.slice(0, ii);
              nextResults.push(nextResult);
            }
          }
          if (nextResults) {
            this._results = nextResults;
          }
          return this._results;
        };
        return GraphQLStorePluralQueryResolver;
      })();
      var GraphQLStoreSingleQueryResolver = (function() {
        function GraphQLStoreSingleQueryResolver(storeData, callback) {
          _classCallCheck(this, GraphQLStoreSingleQueryResolver);
          this.reset();
          this._callback = callback;
          this._garbageCollector = storeData.getGarbageCollector();
          this._storeData = storeData;
          this._subscribedIDs = {};
        }
        GraphQLStoreSingleQueryResolver.prototype.reset = function reset() {
          if (this._subscription) {
            this._subscription.remove();
          }
          this._hasDataChanged = false;
          this._fragment = null;
          this._result = null;
          this._resultID = null;
          this._subscription = null;
          this._updateGarbageCollectorSubscriptionCount({});
          this._subscribedIDs = {};
        };
        GraphQLStoreSingleQueryResolver.prototype.resolve = function resolve(fragmentPointer, nextPluralID) {
          var nextFragment = fragmentPointer.getFragment();
          var prevFragment = this._fragment;
          var nextID = nextPluralID || fragmentPointer.getDataID();
          var prevID = this._resultID;
          var nextResult;
          var prevResult = this._result;
          var subscribedIDs;
          if (prevFragment != null && prevID != null && this._getCanonicalID(prevID) === this._getCanonicalID(nextID)) {
            if (prevID !== nextID || this._hasDataChanged || !nextFragment.isEquivalent(prevFragment)) {
              var _resolveFragment2 = this._resolveFragment(nextFragment, nextID);
              var _resolveFragment22 = _slicedToArray(_resolveFragment2, 2);
              nextResult = _resolveFragment22[0];
              subscribedIDs = _resolveFragment22[1];
              nextResult = recycleNodesInto(prevResult, nextResult);
            } else {
              nextResult = prevResult;
            }
          } else {
            var _resolveFragment3 = this._resolveFragment(nextFragment, nextID);
            var _resolveFragment32 = _slicedToArray(_resolveFragment3, 2);
            nextResult = _resolveFragment32[0];
            subscribedIDs = _resolveFragment32[1];
          }
          if (prevResult !== nextResult) {
            if (this._subscription) {
              this._subscription.remove();
              this._subscription = null;
            }
            if (subscribedIDs) {
              subscribedIDs[nextID] = true;
              var changeEmitter = this._storeData.getChangeEmitter();
              this._subscription = changeEmitter.addListenerForIDs(_Object$keys(subscribedIDs), this._handleChange.bind(this));
              this._updateGarbageCollectorSubscriptionCount(subscribedIDs);
              this._subscribedIDs = subscribedIDs;
            }
            this._resultID = nextID;
            this._result = nextResult;
          }
          this._hasDataChanged = false;
          this._fragment = nextFragment;
          return this._result;
        };
        GraphQLStoreSingleQueryResolver.prototype._getCanonicalID = function _getCanonicalID(id) {
          return this._storeData.getRangeData().getCanonicalClientID(id);
        };
        GraphQLStoreSingleQueryResolver.prototype._handleChange = function _handleChange() {
          if (!this._hasDataChanged) {
            this._hasDataChanged = true;
            this._callback();
          }
        };
        GraphQLStoreSingleQueryResolver.prototype._resolveFragment = function _resolveFragment(fragment, dataID) {
          var _readRelayQueryData = readRelayQueryData(this._storeData, fragment, dataID);
          var data = _readRelayQueryData.data;
          var dataIDs = _readRelayQueryData.dataIDs;
          return [data, dataIDs];
        };
        GraphQLStoreSingleQueryResolver.prototype._updateGarbageCollectorSubscriptionCount = function _updateGarbageCollectorSubscriptionCount(nextDataIDs) {
          if (this._garbageCollector) {
            var garbageCollector = this._garbageCollector;
            var prevDataIDs = this._subscribedIDs;
            var _filterExclusiveKeys = filterExclusiveKeys(prevDataIDs, nextDataIDs);
            var _filterExclusiveKeys2 = _slicedToArray(_filterExclusiveKeys, 2);
            var removed = _filterExclusiveKeys2[0];
            var added = _filterExclusiveKeys2[1];
            added.forEach(function(id) {
              return garbageCollector.increaseSubscriptionsFor(id);
            });
            removed.forEach(function(id) {
              return garbageCollector.decreaseSubscriptionsFor(id);
            });
          }
        };
        return GraphQLStoreSingleQueryResolver;
      })();
      RelayProfiler.instrumentMethods(GraphQLStoreQueryResolver.prototype, {resolve: 'GraphQLStoreQueryResolver.resolve'});
      module.exports = GraphQLStoreQueryResolver;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var invariant = __webpack_require__(2);
      var RelayDeprecated = {upgradeContainerSpec: function upgradeContainerSpec(spec) {
          ['queries', 'queryParams'].forEach(function(property) {
            !!spec.hasOwnProperty(property) ? true ? invariant(false, 'Relay.createContainer(...): Found no longer supported property: %s', property) : invariant(false) : undefined;
          });
          return spec;
        }};
      module.exports = RelayDeprecated;
    }, function(module, exports) {
      'use strict';
      var RelayMutationTransactionStatus = {
        UNCOMMITTED: 'UNCOMMITTED',
        COMMIT_QUEUED: 'COMMIT_QUEUED',
        COLLISION_COMMIT_FAILED: 'COLLISION_COMMIT_FAILED',
        COMMITTING: 'COMMITTING',
        COMMIT_FAILED: 'COMMIT_FAILED'
      };
      module.exports = RelayMutationTransactionStatus;
    }, function(module, exports) {
      'use strict';
      var RelayMutationType = {
        FIELDS_CHANGE: 'FIELDS_CHANGE',
        NODE_DELETE: 'NODE_DELETE',
        RANGE_ADD: 'RANGE_ADD',
        RANGE_DELETE: 'RANGE_DELETE',
        REQUIRED_CHILDREN: 'REQUIRED_CHILDREN'
      };
      module.exports = RelayMutationType;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayRouteFragment = (function() {
        function RelayRouteFragment(builder) {
          _classCallCheck(this, RelayRouteFragment);
          this._builder = builder;
        }
        RelayRouteFragment.prototype.getFragmentForRoute = function getFragmentForRoute(route) {
          return this._builder(route);
        };
        return RelayRouteFragment;
      })();
      module.exports = RelayRouteFragment;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var QueryBuilder = __webpack_require__(17);
      function callsToGraphQL(calls) {
        return calls.map(function(_ref) {
          var name = _ref.name;
          var value = _ref.value;
          var concreteValue = null;
          if (Array.isArray(value)) {
            concreteValue = value.map(QueryBuilder.createCallValue);
          } else if (value != null) {
            concreteValue = QueryBuilder.createCallValue(value);
          }
          return QueryBuilder.createCall(name, concreteValue);
        });
      }
      module.exports = callsToGraphQL;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var RelayQuery = __webpack_require__(3);
      var RelayMetaRoute = __webpack_require__(22);
      var invariant = __webpack_require__(2);
      var fromGraphQL = {
        Field: (function(_Field) {
          function Field(_x) {
            return _Field.apply(this, arguments);
          }
          Field.toString = function() {
            return _Field.toString();
          };
          return Field;
        })(function(query) {
          var node = createNode(query, RelayQuery.Field);
          !(node instanceof RelayQuery.Field) ? true ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL field node.') : invariant(false) : undefined;
          return node;
        }),
        Fragment: (function(_Fragment) {
          function Fragment(_x2) {
            return _Fragment.apply(this, arguments);
          }
          Fragment.toString = function() {
            return _Fragment.toString();
          };
          return Fragment;
        })(function(query) {
          var node = createNode(query, RelayQuery.Fragment);
          !(node instanceof RelayQuery.Fragment) ? true ? invariant(false, 'fromGraphQL.Field(): Expected a GraphQL fragment node.') : invariant(false) : undefined;
          return node;
        }),
        Query: function Query(query) {
          var node = createNode(query, RelayQuery.Root);
          !(node instanceof RelayQuery.Root) ? true ? invariant(false, 'fromGraphQL.Operation(): Expected a root node.') : invariant(false) : undefined;
          return node;
        },
        Operation: (function(_Operation) {
          function Operation(_x3) {
            return _Operation.apply(this, arguments);
          }
          Operation.toString = function() {
            return _Operation.toString();
          };
          return Operation;
        })(function(query) {
          var node = createNode(query, RelayQuery.Operation);
          !(node instanceof RelayQuery.Operation) ? true ? invariant(false, 'fromGraphQL.Operation(): Expected a mutation/subscription node.') : invariant(false) : undefined;
          return node;
        })
      };
      function createNode(query, desiredType) {
        var variables = {};
        var route = RelayMetaRoute.get('$fromGraphQL');
        return desiredType.create(query, route, variables);
      }
      module.exports = fromGraphQL;
    }, function(module, exports) {
      'use strict';
      function generateClientEdgeID(rangeID, nodeID) {
        return 'client:' + rangeID + ':' + nodeID;
      }
      module.exports = generateClientEdgeID;
    }, function(module, exports) {
      'use strict';
      var _index = 1;
      function generateForceIndex() {
        return _index++;
      }
      module.exports = generateForceIndex;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$keys = __webpack_require__(10)['default'];
      var Map = __webpack_require__(43);
      var RelayMetaRoute = __webpack_require__(22);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var buildRQL = __webpack_require__(51);
      var invariant = __webpack_require__(2);
      var stableStringify = __webpack_require__(92);
      var warning = __webpack_require__(11);
      var queryCache = new Map();
      function getRelayQueries(Component, route) {
        if (!queryCache.has(Component)) {
          queryCache.set(Component, {});
        }
        var cacheKey = route.name + ':' + stableStringify(route.params);
        var cache = queryCache.get(Component);
        if (cache.hasOwnProperty(cacheKey)) {
          return cache[cacheKey];
        }
        var querySet = {};
        Component.getFragmentNames().forEach(function(fragmentName) {
          querySet[fragmentName] = null;
        });
        _Object$keys(route.queries).forEach(function(queryName) {
          if (!Component.hasFragment(queryName)) {
            true ? warning(false, 'Relay.QL: query `%s.queries.%s` is invalid, expected fragment ' + '`%s.fragments.%s` to be defined.', route.name, queryName, Component.displayName, queryName) : undefined;
            return;
          }
          var queryBuilder = route.queries[queryName];
          if (queryBuilder) {
            var concreteQuery = buildRQL.Query(queryBuilder, Component, queryName, route.params);
            !(concreteQuery !== undefined) ? true ? invariant(false, 'Relay.QL: query `%s.queries.%s` is invalid, a typical query is ' + 'defined using: () => Relay.QL`query { ... }`.', route.name, queryName) : invariant(false) : undefined;
            if (concreteQuery) {
              var rootQuery = RelayQuery.Root.create(concreteQuery, RelayMetaRoute.get(route.name), route.params);
              var identifyingArg = rootQuery.getIdentifyingArg();
              if (!identifyingArg || identifyingArg.value !== undefined) {
                querySet[queryName] = rootQuery;
                return;
              }
            }
          }
          querySet[queryName] = null;
        });
        cache[cacheKey] = querySet;
        return querySet;
      }
      module.exports = RelayProfiler.instrument('Relay.getQueries', getRelayQueries);
    }, function(module, exports) {
      'use strict';
      function isRelayContainer(component) {
        return !!(component && component.getFragmentNames && component.getFragment && component.hasFragment && component.hasVariable);
      }
      module.exports = isRelayContainer;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var GraphQLFragmentPointer = __webpack_require__(21);
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryVisitor = __webpack_require__(18);
      var RelayRecordState = __webpack_require__(26);
      var callsFromGraphQL = __webpack_require__(52);
      var callsToGraphQL = __webpack_require__(85);
      var invariant = __webpack_require__(2);
      var validateRelayReadQuery = __webpack_require__(180);
      var EDGES = RelayConnectionInterface.EDGES;
      var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
      var METADATA_KEYS = ['__status__', '__resolvedFragmentMapGeneration__'];
      function readRelayQueryData(storeData, queryNode, dataID, options) {
        var reader = new RelayStoreReader(storeData, options);
        var data = reader.retrieveData(queryNode, dataID);
        validateRelayReadQuery(queryNode, options);
        return data;
      }
      var RelayStoreReader = (function(_RelayQueryVisitor) {
        _inherits(RelayStoreReader, _RelayQueryVisitor);
        function RelayStoreReader(storeData, options) {
          _classCallCheck(this, RelayStoreReader);
          _RelayQueryVisitor.call(this);
          this._rangeData = storeData.getRangeData();
          this._recordStore = storeData.getQueuedStore();
          this._traverseFragmentReferences = options && options.traverseFragmentReferences || false;
          this._traverseGeneratedFields = options && options.traverseGeneratedFields || false;
        }
        RelayStoreReader.prototype.retrieveData = function retrieveData(queryNode, dataID) {
          var result = {
            data: undefined,
            dataIDs: {}
          };
          var rangeData = this._rangeData.parseRangeClientID(dataID);
          var status = this._recordStore.getRecordState(rangeData ? rangeData.dataID : dataID);
          if (status === RelayRecordState.EXISTENT) {
            var state = {
              componentDataID: null,
              data: undefined,
              parent: null,
              rangeInfo: null,
              seenDataIDs: result.dataIDs,
              storeDataID: dataID
            };
            this.visit(queryNode, state);
            result.data = state.data;
          } else if (status === RelayRecordState.NONEXISTENT) {
            result.data = null;
          }
          return result;
        };
        RelayStoreReader.prototype.visitField = function visitField(node, state) {
          this._handleRangeInfo(node, state);
          if (!node.isScalar() || node.isGenerated()) {
            getDataObject(state);
          }
          if (node.isGenerated() && !this._traverseGeneratedFields) {
            return;
          }
          var rangeInfo = state.rangeInfo;
          if (rangeInfo && node.getSchemaName() === EDGES) {
            this._readEdges(node, rangeInfo, state);
          } else if (rangeInfo && node.getSchemaName() === PAGE_INFO) {
            this._readPageInfo(node, rangeInfo, state);
          } else if (node.isScalar()) {
            this._readScalar(node, state);
          } else if (node.isPlural()) {
            this._readPlural(node, state);
          } else if (node.isConnection()) {
            this._readConnection(node, state);
          } else {
            this._readLinkedField(node, state);
          }
          state.seenDataIDs[state.storeDataID] = true;
        };
        RelayStoreReader.prototype.visitFragment = function visitFragment(node, state) {
          if (node.isContainerFragment() && !this._traverseFragmentReferences) {
            var dataID = getComponentDataID(state);
            state.seenDataIDs[dataID] = true;
            var fragmentPointer = new GraphQLFragmentPointer(node.isPlural() ? [dataID] : dataID, node);
            this._setDataValue(state, fragmentPointer.getFragment().getConcreteFragmentID(), fragmentPointer);
          } else {
            this.traverse(node, state);
          }
        };
        RelayStoreReader.prototype._readScalar = function _readScalar(node, state) {
          var storageKey = node.getStorageKey();
          var field = this._recordStore.getField(state.storeDataID, storageKey);
          if (field === undefined) {
            return;
          } else if (field === null && !state.data) {
            state.data = null;
          } else {
            this._setDataValue(state, node.getApplicationName(), Array.isArray(field) ? field.slice() : field);
          }
        };
        RelayStoreReader.prototype._readPlural = function _readPlural(node, state) {
          var _this = this;
          var storageKey = node.getStorageKey();
          var dataIDs = this._recordStore.getLinkedRecordIDs(state.storeDataID, storageKey);
          if (dataIDs) {
            var applicationName = node.getApplicationName();
            var previousData = getDataValue(state, applicationName);
            var nextData = dataIDs.map(function(dataID, ii) {
              var data;
              if (previousData instanceof Object) {
                data = previousData[ii];
              }
              var nextState = {
                componentDataID: null,
                data: data,
                parent: node,
                rangeInfo: null,
                seenDataIDs: state.seenDataIDs,
                storeDataID: dataID
              };
              node.getChildren().forEach(function(child) {
                return _this.visit(child, nextState);
              });
              return nextState.data;
            });
            this._setDataValue(state, applicationName, nextData);
          }
        };
        RelayStoreReader.prototype._readConnection = function _readConnection(node, state) {
          var applicationName = node.getApplicationName();
          var storageKey = node.getStorageKey();
          var calls = node.getCallsWithValues();
          var dataID = this._recordStore.getLinkedRecordID(state.storeDataID, storageKey);
          if (!dataID) {
            return;
          }
          enforceRangeCalls(node);
          var metadata = this._recordStore.getRangeMetadata(dataID, calls);
          var nextState = {
            componentDataID: this._getConnectionClientID(node, dataID),
            data: getDataValue(state, applicationName),
            parent: node,
            rangeInfo: metadata && calls.length ? metadata : null,
            seenDataIDs: state.seenDataIDs,
            storeDataID: dataID
          };
          this.traverse(node, nextState);
          this._setDataValue(state, applicationName, nextState.data);
        };
        RelayStoreReader.prototype._readEdges = function _readEdges(node, rangeInfo, state) {
          var _this2 = this;
          var previousData = getDataValue(state, EDGES);
          var edges = rangeInfo.filteredEdges.map(function(edgeData, ii) {
            var data;
            if (previousData instanceof Object) {
              data = previousData[ii];
            }
            var nextState = {
              componentDataID: null,
              data: data,
              parent: node,
              rangeInfo: null,
              seenDataIDs: state.seenDataIDs,
              storeDataID: edgeData.edgeID
            };
            _this2.traverse(node, nextState);
            return nextState.data;
          });
          this._setDataValue(state, EDGES, edges);
        };
        RelayStoreReader.prototype._readPageInfo = function _readPageInfo(node, rangeInfo, state) {
          var _this3 = this;
          var pageInfo = rangeInfo.pageInfo;
          !pageInfo ? true ? invariant(false, 'readRelayQueryData(): Missing field, `%s`.', PAGE_INFO) : invariant(false) : undefined;
          var info = pageInfo;
          var nextData;
          var read = function read(child) {
            if (child instanceof RelayQuery.Fragment) {
              if (child.isContainerFragment() && !_this3._traverseFragmentReferences) {
                var fragmentPointer = new GraphQLFragmentPointer(getComponentDataID(state), child);
                nextData = nextData || {};
                var concreteFragmentID = fragmentPointer.getFragment().getConcreteFragmentID();
                nextData[concreteFragmentID] = fragmentPointer;
              } else {
                child.getChildren().forEach(read);
              }
            } else {
              var field = child;
              if (!field.isGenerated() || _this3._traverseGeneratedFields) {
                nextData = nextData || {};
                nextData[field.getApplicationName()] = info[field.getStorageKey()];
              }
            }
          };
          node.getChildren().forEach(read);
          this._setDataValue(state, PAGE_INFO, nextData);
        };
        RelayStoreReader.prototype._readLinkedField = function _readLinkedField(node, state) {
          var storageKey = node.getStorageKey();
          var applicationName = node.getApplicationName();
          var dataID = this._recordStore.getLinkedRecordID(state.storeDataID, storageKey);
          if (dataID == null) {
            this._setDataValue(state, applicationName, dataID);
            return;
          }
          var nextState = {
            componentDataID: null,
            data: getDataValue(state, applicationName),
            parent: node,
            rangeInfo: null,
            seenDataIDs: state.seenDataIDs,
            storeDataID: dataID
          };
          var status = this._recordStore.getRecordState(dataID);
          if (status === RelayRecordState.EXISTENT) {
            getDataObject(nextState);
          }
          this.traverse(node, nextState);
          this._setDataValue(state, applicationName, nextState.data);
        };
        RelayStoreReader.prototype._setDataValue = function _setDataValue(state, key, value) {
          var _this4 = this;
          var data = getDataObject(state);
          if (value === undefined) {
            return;
          }
          data[key] = value;
          METADATA_KEYS.forEach(function(metadataKey) {
            var metadataValue = _this4._recordStore.getField(state.storeDataID, metadataKey);
            if (metadataValue != null) {
              data[metadataKey] = metadataValue;
            }
          });
        };
        RelayStoreReader.prototype._getConnectionClientID = function _getConnectionClientID(node, connectionID) {
          var calls = node.getCallsWithValues();
          if (!RelayConnectionInterface.hasRangeCalls(calls)) {
            return connectionID;
          }
          return this._rangeData.getClientIDForRangeWithID(callsToGraphQL(calls), {}, connectionID);
        };
        RelayStoreReader.prototype._handleRangeInfo = function _handleRangeInfo(node, state) {
          var rangeData = this._rangeData.parseRangeClientID(state.storeDataID);
          if (rangeData != null) {
            state.componentDataID = state.storeDataID;
            state.storeDataID = rangeData.dataID;
            state.rangeInfo = this._recordStore.getRangeMetadata(state.storeDataID, callsFromGraphQL(rangeData.calls, rangeData.callValues));
          }
        };
        return RelayStoreReader;
      })(RelayQueryVisitor);
      function enforceRangeCalls(parent) {
        if (!parent.__hasValidatedConnectionCalls__) {
          var calls = parent.getCallsWithValues();
          if (!RelayConnectionInterface.hasRangeCalls(calls)) {
            rangeCallEnforcer.traverse(parent, parent);
          }
          parent.__hasValidatedConnectionCalls__ = true;
        }
      }
      var RelayRangeCallEnforcer = (function(_RelayQueryVisitor2) {
        _inherits(RelayRangeCallEnforcer, _RelayQueryVisitor2);
        function RelayRangeCallEnforcer() {
          _classCallCheck(this, RelayRangeCallEnforcer);
          _RelayQueryVisitor2.apply(this, arguments);
        }
        RelayRangeCallEnforcer.prototype.visitField = function visitField(node, parent) {
          var schemaName = node.getSchemaName();
          !(schemaName !== EDGES && schemaName !== PAGE_INFO) ? true ? invariant(false, 'readRelayQueryData(): The field `%s` is a connection. Fields `%s` and ' + '`%s` cannot be fetched without a `first`, `last` or `find` argument.', parent.getApplicationName(), EDGES, PAGE_INFO) : invariant(false) : undefined;
        };
        return RelayRangeCallEnforcer;
      })(RelayQueryVisitor);
      var rangeCallEnforcer = new RelayRangeCallEnforcer();
      function getComponentDataID(state) {
        if (state.componentDataID != null) {
          return state.componentDataID;
        } else {
          return state.storeDataID;
        }
      }
      function getDataObject(state) {
        var data = state.data;
        if (!data) {
          var pointer = GraphQLStoreDataHandler.createPointerWithID(getComponentDataID(state));
          data = state.data = pointer;
        }
        !(data instanceof Object) ? true ? invariant(false, 'readRelayQueryData(): Unable to read field on non-object.') : invariant(false) : undefined;
        return data;
      }
      function getDataValue(state, key) {
        var data = getDataObject(state);
        return data[key];
      }
      var instrumented = RelayProfiler.instrument('readRelayQueryData', readRelayQueryData);
      module.exports = instrumented;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$keys = __webpack_require__(10)['default'];
      function isObject(value) {
        return value !== null && Object.prototype.toString.call(value) === '[object Object]';
      }
      function stableStringify(input) {
        var inputIsArray = Array.isArray(input);
        var inputIsObject = isObject(input);
        if (inputIsArray || inputIsObject) {
          var keys = _Object$keys(input);
          if (keys.length) {
            var result = [];
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
              var key = keys[i];
              var value = input[key];
              if (isObject(value) || Array.isArray(value)) {
                value = stableStringify(value);
              } else {
                value = JSON.stringify(value);
              }
              result.push(key + ':' + value);
            }
            if (inputIsArray) {
              return '[' + result.join(',') + ']';
            } else {
              return '{' + result.join(',') + '}';
            }
          }
        }
        return JSON.stringify(input);
      }
      module.exports = stableStringify;
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(188),
        __esModule: true
      };
    }, [266, 95, 15], function(module, exports) {
      var toString = {}.toString;
      module.exports = function(it) {
        return toString.call(it).slice(8, -1);
      };
    }, 75, [271, 95], [275, 205, 28, 207, 65, 96, 24, 202, 101, 14, 15], function(module, exports, __webpack_require__) {
      var $export = __webpack_require__(28),
          core = __webpack_require__(13),
          fails = __webpack_require__(63);
      module.exports = function(KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY],
            exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function() {
          fn(1);
        }), 'Object', exp);
      };
    }, function(module, exports) {
      module.exports = function(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      };
    }, [277, 14, 96, 15], function(module, exports) {
      var ceil = Math.ceil,
          floor = Math.floor;
      module.exports = function(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
      };
    }, [283, 94, 15, 24, 13], [286, 217, 24], function(module, exports) {
      'use strict';
      var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
      var ExecutionEnvironment = {
        canUseDOM: canUseDOM,
        canUseWorkers: typeof Worker !== 'undefined',
        canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
        canUseViewport: canUseDOM && !!window.screen,
        isInWorker: !canUseDOM
      };
      module.exports = ExecutionEnvironment;
    }, function(module, exports) {
      'use strict';
      var aStackPool = [];
      var bStackPool = [];
      function areEqual(a, b) {
        var aStack = aStackPool.length ? aStackPool.pop() : [];
        var bStack = bStackPool.length ? bStackPool.pop() : [];
        var result = eq(a, b, aStack, bStack);
        aStack.length = 0;
        bStack.length = 0;
        aStackPool.push(aStack);
        bStackPool.push(bStack);
        return result;
      }
      function eq(a, b, aStack, bStack) {
        if (a === b) {
          return a !== 0 || 1 / a == 1 / b;
        }
        if (a == null || b == null) {
          return false;
        }
        if (typeof a != 'object' || typeof b != 'object') {
          return false;
        }
        var objToStr = Object.prototype.toString;
        var className = objToStr.call(a);
        if (className != objToStr.call(b)) {
          return false;
        }
        switch (className) {
          case '[object String]':
            return a == String(b);
          case '[object Number]':
            return isNaN(a) || isNaN(b) ? false : a == Number(b);
          case '[object Date]':
          case '[object Boolean]':
            return +a == +b;
          case '[object RegExp]':
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
        }
        var length = aStack.length;
        while (length--) {
          if (aStack[length] == a) {
            return bStack[length] == b;
          }
        }
        aStack.push(a);
        bStack.push(b);
        var size = 0;
        if (className === '[object Array]') {
          size = a.length;
          if (size !== b.length) {
            return false;
          }
          while (size--) {
            if (!eq(a[size], b[size], aStack, bStack)) {
              return false;
            }
          }
        } else {
          if (a.constructor !== b.constructor) {
            return false;
          }
          if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
            return a.valueOf() == b.valueOf();
          }
          var keys = Object.keys(a);
          if (keys.length != Object.keys(b).length) {
            return false;
          }
          for (var i = 0; i < keys.length; i++) {
            if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
              return false;
            }
          }
        }
        aStack.pop();
        bStack.pop();
        return true;
      }
      module.exports = areEqual;
    }, function(module, exports) {
      (function(global) {
        "use strict";
        function crc32(str) {
          var crc = -1;
          for (var i = 0,
              len = str.length; i < len; i++) {
            crc = crc >>> 8 ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
          }
          return ~crc;
        }
        var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
        if (global.Int32Array !== undefined) {
          table = new Int32Array(table);
        }
        module.exports = crc32;
      }.call(exports, (function() {
        return this;
      }())));
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function everyObject(object, callback, context) {
        for (var name in object) {
          if (hasOwnProperty.call(object, name)) {
            if (!callback.call(context, object[name], name, object)) {
              return false;
            }
          }
        }
        return true;
      }
      module.exports = everyObject;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      __webpack_require__(261);
      module.exports = self.fetch.bind(self);
    }, function(module, exports) {
      "use strict";
      function sprintf(format) {
        for (var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        var index = 0;
        return format.replace(/%s/g, function(match) {
          return args[index++];
        });
      }
      module.exports = sprintf;
    }, [265, 76], 95, [269, 47, 45, 73], 63, function(module, exports, __webpack_require__) {
      var ctx = __webpack_require__(73),
          call = __webpack_require__(240),
          isArrayIter = __webpack_require__(239),
          anObject = __webpack_require__(111),
          toLength = __webpack_require__(247),
          getIterFn = __webpack_require__(248);
      module.exports = function(iterable, entries, fn, that) {
        var iterFn = getIterFn(iterable),
            f = ctx(fn, that, entries ? 2 : 1),
            index = 0,
            length,
            step,
            iterator;
        if (typeof iterFn != 'function')
          throw TypeError(iterable + ' is not iterable!');
        if (isArrayIter(iterFn))
          for (length = toLength(iterable.length); length > index; index++) {
            entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
          }
        else
          for (iterator = iterFn.call(iterable); !(step = iterator.next()).done; ) {
            call(iterator, f, step.value, entries);
          }
      };
    }, function(module, exports) {
      module.exports = function(done, value) {
        return {
          value: value,
          done: !!done
        };
      };
    }, 100, function(module, exports, __webpack_require__) {
      var redefine = __webpack_require__(119);
      module.exports = function(target, src) {
        for (var key in src)
          redefine(target, key, src[key]);
        return target;
      };
    }, [276, 30], function(module, exports) {
      module.exports = function(it, Constructor, name) {
        if (!(it instanceof Constructor))
          throw TypeError(name + ": use the 'new' operator!");
        return it;
      };
    }, 102, function(module, exports) {
      var id = 0,
          px = Math.random();
      module.exports = function(key) {
        return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
      };
    }, function(module, exports) {
      (function(global) {
        "use strict";
        module.exports = rawAsap;
        function rawAsap(task) {
          if (!queue.length) {
            requestFlush();
            flushing = true;
          }
          queue[queue.length] = task;
        }
        var queue = [];
        var flushing = false;
        var requestFlush;
        var index = 0;
        var capacity = 1024;
        function flush() {
          while (index < queue.length) {
            var currentIndex = index;
            index = index + 1;
            queue[currentIndex].call();
            if (index > capacity) {
              for (var scan = 0,
                  newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
              }
              queue.length -= index;
              index = 0;
            }
          }
          queue.length = 0;
          index = 0;
          flushing = false;
        }
        var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
        if (typeof BrowserMutationObserver === "function") {
          requestFlush = makeRequestCallFromMutationObserver(flush);
        } else {
          requestFlush = makeRequestCallFromTimer(flush);
        }
        rawAsap.requestFlush = requestFlush;
        function makeRequestCallFromMutationObserver(callback) {
          var toggle = 1;
          var observer = new BrowserMutationObserver(callback);
          var node = document.createTextNode("");
          observer.observe(node, {characterData: true});
          return function requestCall() {
            toggle = -toggle;
            node.data = toggle;
          };
        }
        function makeRequestCallFromTimer(callback) {
          return function requestCall() {
            var timeoutHandle = setTimeout(handleTimer, 0);
            var intervalHandle = setInterval(handleTimer, 50);
            function handleTimer() {
              clearTimeout(timeoutHandle);
              clearInterval(intervalHandle);
              callback();
            }
          };
        }
        rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
      }.call(exports, (function() {
        return this;
      }())));
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _toConsumableArray = __webpack_require__(23)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      var DliteFetchModeConstants = __webpack_require__(79);
      var RelayNetworkLayer = __webpack_require__(25);
      var RelayProfiler = __webpack_require__(4);
      var RelayTaskScheduler = __webpack_require__(39);
      var checkRelayQueryData = __webpack_require__(160);
      var diffRelayQuery = __webpack_require__(163);
      var everyObject = __webpack_require__(108);
      var flattenSplitRelayQueries = __webpack_require__(167);
      var forEachObject = __webpack_require__(9);
      var generateForceIndex = __webpack_require__(88);
      var invariant = __webpack_require__(2);
      var mapObject = __webpack_require__(44);
      var resolveImmediate = __webpack_require__(29);
      var someObject = __webpack_require__(231);
      var splitDeferredRelayQueries = __webpack_require__(178);
      var warning = __webpack_require__(11);
      var GraphQLQueryRunner = (function() {
        function GraphQLQueryRunner(storeData) {
          _classCallCheck(this, GraphQLQueryRunner);
          this._storeData = storeData;
        }
        GraphQLQueryRunner.prototype.run = function run(querySet, callback, fetchMode) {
          var _this = this;
          fetchMode = fetchMode || DliteFetchModeConstants.FETCH_MODE_CLIENT;
          var profiler = fetchMode === DliteFetchModeConstants.FETCH_MODE_REFETCH ? RelayProfiler.profile('GraphQLQueryRunner.forceFetch') : RelayProfiler.profile('GraphQLQueryRunner.primeCache');
          var diffQueries = [];
          if (fetchMode === DliteFetchModeConstants.FETCH_MODE_CLIENT) {
            forEachObject(querySet, function(query) {
              if (query) {
                diffQueries.push.apply(diffQueries, _toConsumableArray(diffRelayQuery(query, _this._storeData.getRecordStore(), _this._storeData.getQueryTracker())));
              }
            });
          } else {
            forEachObject(querySet, function(query) {
              if (query) {
                diffQueries.push(query);
              }
            });
          }
          return runQueries(this._storeData, diffQueries, callback, fetchMode, profiler);
        };
        GraphQLQueryRunner.prototype.forceFetch = function forceFetch(querySet, callback) {
          var fetchMode = DliteFetchModeConstants.FETCH_MODE_REFETCH;
          var profiler = RelayProfiler.profile('GraphQLQueryRunner.forceFetch');
          var queries = [];
          forEachObject(querySet, function(query) {
            query && queries.push(query);
          });
          return runQueries(this._storeData, queries, callback, fetchMode, profiler);
        };
        return GraphQLQueryRunner;
      })();
      function hasItems(map) {
        return !!_Object$keys(map).length;
      }
      function splitAndFlattenQueries(queries) {
        if (!RelayNetworkLayer.supports('defer')) {
          var hasDeferredDescendant = queries.some(function(query) {
            if (query.hasDeferredDescendant()) {
              true ? warning(false, 'Relay: Query `%s` contains a deferred fragment (e.g. ' + '`getFragment(\'foo\').defer()`) which is not supported by the ' + 'default network layer. This query will be sent without deferral.', query.getName()) : undefined;
              return true;
            }
          });
          if (hasDeferredDescendant) {
            return queries;
          }
        }
        var flattenedQueries = [];
        queries.forEach(function(query) {
          return flattenedQueries.push.apply(flattenedQueries, _toConsumableArray(flattenSplitRelayQueries(splitDeferredRelayQueries(query))));
        });
        return flattenedQueries;
      }
      function runQueries(storeData, queries, callback, fetchMode, profiler) {
        var readyState = {
          aborted: false,
          done: false,
          error: null,
          ready: false,
          stale: false
        };
        var scheduled = false;
        function setReadyState(partial) {
          if (readyState.aborted) {
            return;
          }
          if (readyState.done || readyState.error) {
            !partial.aborted ? true ? invariant(false, 'GraphQLQueryRunner: Unexpected ready state change.') : invariant(false) : undefined;
            return;
          }
          readyState = {
            aborted: partial.aborted != null ? partial.aborted : readyState.aborted,
            done: partial.done != null ? partial.done : readyState.done,
            error: partial.error != null ? partial.error : readyState.error,
            ready: partial.ready != null ? partial.ready : readyState.ready,
            stale: partial.stale != null ? partial.stale : readyState.stale
          };
          if (scheduled) {
            return;
          }
          scheduled = true;
          resolveImmediate(function() {
            scheduled = false;
            callback(readyState);
          });
        }
        var remainingFetchMap = {};
        var remainingRequiredFetchMap = {};
        function onResolved(pendingFetch) {
          var pendingQuery = pendingFetch.getQuery();
          var pendingQueryID = pendingQuery.getID();
          delete remainingFetchMap[pendingQueryID];
          if (!pendingQuery.isDeferred()) {
            delete remainingRequiredFetchMap[pendingQueryID];
          }
          if (hasItems(remainingRequiredFetchMap)) {
            return;
          }
          if (someObject(remainingFetchMap, function(query) {
            return query.isResolvable();
          })) {
            return;
          }
          if (hasItems(remainingFetchMap)) {
            setReadyState({
              done: false,
              ready: true,
              stale: false
            });
          } else {
            setReadyState({
              done: true,
              ready: true,
              stale: false
            });
          }
        }
        function onRejected(pendingFetch, error) {
          setReadyState({error: error});
          var pendingQuery = pendingFetch.getQuery();
          var pendingQueryID = pendingQuery.getID();
          delete remainingFetchMap[pendingQueryID];
          if (!pendingQuery.isDeferred()) {
            delete remainingRequiredFetchMap[pendingQueryID];
          }
        }
        function canResolve(fetch) {
          return checkRelayQueryData(storeData.getQueuedStore(), fetch.getQuery());
        }
        RelayTaskScheduler.await(function() {
          var forceIndex = fetchMode === DliteFetchModeConstants.FETCH_MODE_REFETCH ? generateForceIndex() : null;
          splitAndFlattenQueries(queries).forEach(function(query) {
            var pendingFetch = storeData.getPendingQueryTracker().add({
              query: query,
              fetchMode: fetchMode,
              forceIndex: forceIndex,
              storeData: storeData
            });
            var queryID = query.getID();
            remainingFetchMap[queryID] = pendingFetch;
            if (!query.isDeferred()) {
              remainingRequiredFetchMap[queryID] = pendingFetch;
            }
            pendingFetch.getResolvedPromise().then(onResolved.bind(null, pendingFetch), onRejected.bind(null, pendingFetch));
          });
          if (!hasItems(remainingFetchMap)) {
            setReadyState({
              done: true,
              ready: true
            });
          } else {
            if (!hasItems(remainingRequiredFetchMap)) {
              setReadyState({ready: true});
            } else {
              setReadyState({ready: false});
              resolveImmediate(function() {
                if (storeData.hasCacheManager()) {
                  var requiredQueryMap = mapObject(remainingRequiredFetchMap, function(value) {
                    return value.getQuery();
                  });
                  storeData.readFromDiskCache(requiredQueryMap, {onSuccess: function onSuccess() {
                      if (hasItems(remainingRequiredFetchMap)) {
                        setReadyState({
                          ready: true,
                          stale: true
                        });
                      }
                    }});
                } else {
                  if (everyObject(remainingRequiredFetchMap, canResolve)) {
                    if (hasItems(remainingRequiredFetchMap)) {
                      setReadyState({
                        ready: true,
                        stale: true
                      });
                    }
                  }
                }
              });
            }
          }
          profiler.stop();
        }).done();
        return {abort: function abort() {
            setReadyState({aborted: true});
          }};
      }
      module.exports = GraphQLQueryRunner;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _defineProperty = __webpack_require__(58)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _slicedToArray = __webpack_require__(59)['default'];
      var _toConsumableArray = __webpack_require__(23)['default'];
      var GraphQLMutatorConstants = __webpack_require__(48);
      var GraphQLSegment = __webpack_require__(126);
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var printRelayQueryCall = __webpack_require__(40);
      var warning = __webpack_require__(11);
      var END_CURSOR = RelayConnectionInterface.END_CURSOR;
      var HAS_NEXT_PAGE = RelayConnectionInterface.HAS_NEXT_PAGE;
      var HAS_PREV_PAGE = RelayConnectionInterface.HAS_PREV_PAGE;
      var START_CURSOR = RelayConnectionInterface.START_CURSOR;
      function callsArrayToObject(queryCalls) {
        var calls = {};
        for (var ii = 0; ii < queryCalls.length; ii++) {
          if (RelayConnectionInterface.isConnectionCall(queryCalls[ii])) {
            var _queryCalls$ii = queryCalls[ii];
            var name = _queryCalls$ii.name;
            var value = _queryCalls$ii.value;
            if (Array.isArray(value) && value.length) {
              value = value[0];
            }
            if (value === null) {
              continue;
            }
            calls[name] = value;
          }
        }
        if (calls.first) {
          !!isNaN(calls.first) ? true ? invariant(false, 'GraphQLRange: Expected `first` argument to be a number, got ' + '`%s`.', calls.first) : invariant(false) : undefined;
          calls.first = +calls.first;
        } else if (calls.last) {
          !!isNaN(calls.last) ? true ? invariant(false, 'GraphQLRange: Expected `last` argument to be a number, got ' + '`%s`.', calls.last) : invariant(false) : undefined;
          calls.last = +calls.last;
        }
        return calls;
      }
      function isStaticCall(calls) {
        return calls.hasOwnProperty('surrounds') || calls.hasOwnProperty('find');
      }
      function isValidRangeCall(calls) {
        var hasFirst = calls.hasOwnProperty('first');
        var hasLast = calls.hasOwnProperty('last');
        return (hasFirst || hasLast) && !(hasFirst && hasLast);
      }
      function isValidRangeCallValues(calls) {
        return calls.hasOwnProperty('first') && calls.first > 0 || calls.hasOwnProperty('last') && calls.last > 0;
      }
      function validateEdge(edge) {
        !(GraphQLStoreDataHandler.getID(edge) !== undefined) ? true ? invariant(false, 'GraphQLStore: `edge` must have a data id') : invariant(false) : undefined;
        !(edge.node !== undefined) ? true ? invariant(false, 'GraphQLStore: `edge` must have `node` field') : invariant(false) : undefined;
      }
      function validateEdges(edges) {
        edges.forEach(validateEdge);
      }
      var GraphQLRange = (function() {
        function GraphQLRange() {
          _classCallCheck(this, GraphQLRange);
          this.reset();
        }
        GraphQLRange.prototype.reset = function reset() {
          this._orderedSegments = [new GraphQLSegment(), new GraphQLSegment()];
          this._staticQueriesMap = {};
          this._hasFirst = false;
          this._hasLast = false;
        };
        GraphQLRange.prototype._resetSegment = function _resetSegment(index) {
          !(index >= 0 && index < this._orderedSegments.length) ? true ? invariant(false, 'cannot reset non-existent segment') : invariant(false) : undefined;
          this._orderedSegments[index] = new GraphQLSegment();
        };
        GraphQLRange.prototype._getSegmentIndexByCursor = function _getSegmentIndexByCursor(cursor) {
          for (var ii = 0; ii < this._orderedSegments.length; ii++) {
            if (this._orderedSegments[ii].containsEdgeWithCursor(cursor)) {
              return ii;
            }
          }
          return null;
        };
        GraphQLRange.prototype._getSegmentIndexByID = function _getSegmentIndexByID(id) {
          for (var ii = 0; ii < this._orderedSegments.length; ii++) {
            if (this._orderedSegments[ii].containsEdgeWithID(id)) {
              return ii;
            }
          }
          return null;
        };
        GraphQLRange.prototype._addStaticEdges = function _addStaticEdges(queryCalls, edges) {
          var calls = _callsToString(queryCalls);
          var edgeIDsToStore = [];
          var cursorsToStore = [];
          for (var ii = 0; ii < edges.length; ii++) {
            var edge = edges[ii];
            edgeIDsToStore.push(GraphQLStoreDataHandler.getID(edge));
            cursorsToStore.push(edge.cursor);
          }
          this._staticQueriesMap[calls] = {
            edgeIDs: edgeIDsToStore,
            cursors: cursorsToStore
          };
        };
        GraphQLRange.prototype.addItems = function addItems(queryCalls, edges, pageInfo) {
          validateEdges(edges);
          var calls = callsArrayToObject(queryCalls);
          var segmentCount,
              segmentIndex;
          if (isStaticCall(calls)) {
            this._addStaticEdges(queryCalls, edges);
            return;
          }
          if (!isValidRangeCall(calls)) {
            console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
            return;
          }
          if (calls.before === null || calls.after === null) {
            console.error('GraphQLRange received null as a cursor.');
            return;
          }
          if (calls.first) {
            if (calls.before && !calls.after) {
              if (pageInfo[HAS_NEXT_PAGE] === true) {
                if (this._getSegmentIndexByCursor(calls.before) === 0) {
                  this._orderedSegments.unshift(new GraphQLSegment());
                }
                this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], undefined, calls.before);
              } else {
                this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before);
              }
            } else {
              if (!calls.after) {
                segmentIndex = 0;
                segmentCount = this.getFirstSegment().getCount();
                if (segmentCount && (calls.first > segmentCount || edges.length > segmentCount) && !this.getFirstSegment().getFirstCursor()) {
                  this._resetSegment(segmentIndex);
                }
              }
              this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after, calls.before);
            }
          } else if (calls.last) {
            if (calls.after && !calls.before) {
              if (pageInfo[HAS_PREV_PAGE] === true) {
                if (this._getSegmentIndexByCursor(calls.after) === this._orderedSegments.length - 1) {
                  this._orderedSegments.push(new GraphQLSegment());
                }
                this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], undefined, calls.after);
              } else {
                this._addAfterFirstItems(edges, pageInfo[HAS_NEXT_PAGE], calls.after);
              }
            } else {
              if (!calls.before) {
                segmentIndex = this._orderedSegments.length - 1;
                segmentCount = this.getLastSegment().getCount();
                if (segmentCount && (calls.last > segmentCount || edges.length > segmentCount) && !this.getLastSegment().getLastCursor()) {
                  this._resetSegment(segmentIndex);
                }
              }
              this._addBeforeLastItems(edges, pageInfo[HAS_PREV_PAGE], calls.before, calls.after);
            }
          }
        };
        GraphQLRange.prototype.getFirstSegment = function getFirstSegment() {
          return this._orderedSegments[0];
        };
        GraphQLRange.prototype.getLastSegment = function getLastSegment() {
          return this._orderedSegments[this._orderedSegments.length - 1];
        };
        GraphQLRange.prototype._concatSegments = function _concatSegments(segmentIndex) {
          !(segmentIndex + 1 < this._orderedSegments.length && segmentIndex >= 0) ? true ? invariant(false, 'GraphQLRange cannot concat segments outside the range ' + 'of orderedSegments') : invariant(false) : undefined;
          var firstSegment = this._orderedSegments[segmentIndex];
          var secondSegment = this._orderedSegments[segmentIndex + 1];
          if (firstSegment.concatSegment(secondSegment)) {
            this._orderedSegments.splice(segmentIndex + 1, 1);
          } else {
            console.warn('GraphQLRange was unable to concat segment %d and segment %d', segmentIndex, segmentIndex + 1);
          }
        };
        GraphQLRange.prototype.prependEdge = function prependEdge(edge) {
          validateEdge(edge);
          this._hasFirst = true;
          this._removeEdgeIfApplicable(edge);
          var segment = this.getFirstSegment();
          segment.prependEdge(edge);
        };
        GraphQLRange.prototype.appendEdge = function appendEdge(edge) {
          validateEdge(edge);
          this._hasLast = true;
          this._removeEdgeIfApplicable(edge);
          var segment = this.getLastSegment();
          segment.appendEdge(edge);
        };
        GraphQLRange.prototype._removeEdgeIfApplicable = function _removeEdgeIfApplicable(edge) {
          var id = GraphQLStoreDataHandler.getID(edge);
          var index = this._getSegmentIndexByID(id);
          if (index != null) {
            this._orderedSegments[index].removeEdge(id);
          }
        };
        GraphQLRange.prototype._removeEdgesIfApplicable = function _removeEdgesIfApplicable(edges) {
          for (var ii = 0; ii < edges.length; ii++) {
            this._removeEdgeIfApplicable(edges[ii]);
          }
        };
        GraphQLRange.prototype._addAfterFirstItems = function _addAfterFirstItems(edges, hasNextPage, afterCursor, beforeCursor) {
          var segment;
          var segmentIndex;
          var lastCursor;
          if (afterCursor !== undefined) {
            segmentIndex = this._getSegmentIndexByCursor(afterCursor);
            if (segmentIndex == null) {
              true ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', afterCursor) : undefined;
              return;
            }
            segment = this._orderedSegments[segmentIndex];
            lastCursor = segment.getLastCursor();
            if (lastCursor !== afterCursor) {
              edges = this._reconcileAfterFirstEdges(segment, edges, afterCursor);
              afterCursor = lastCursor;
              if (!edges) {
                return;
              }
            }
          } else {
            segmentIndex = 0;
            segment = this._orderedSegments[segmentIndex];
            lastCursor = segment.getLastCursor();
            if (lastCursor !== undefined) {
              edges = this._reconcileAfterFirstEdges(segment, edges);
              afterCursor = lastCursor;
              if (!edges) {
                return;
              }
            }
          }
          if (beforeCursor !== undefined) {
            if (segmentIndex === this._orderedSegments.length - 1) {
              console.warn('GraphQLRange cannot add because there is no next segment');
              return;
            } else if (this._orderedSegments[segmentIndex + 1].getFirstCursor() !== beforeCursor) {
              true ? warning(false, 'GraphQLRange cannot add because beforeCursor does not match first ' + 'cursor of the next segment') : undefined;
              return;
            }
          }
          if (afterCursor === undefined) {
            this._hasFirst = true;
          }
          this._removeEdgesIfApplicable(edges);
          segment.addEdgesAfterCursor(edges, afterCursor);
          if (!hasNextPage) {
            if (beforeCursor !== undefined) {
              this._concatSegments(segmentIndex);
            } else {
              this._hasLast = true;
              this._orderedSegments.splice(segmentIndex + 1, this._orderedSegments.length - 1 - segmentIndex);
            }
          }
        };
        GraphQLRange.prototype._reconcileAfterFirstEdges = function _reconcileAfterFirstEdges(segment, edges, cursor) {
          var metadata = segment.getMetadataAfterCursor(edges.length + 1, cursor);
          var edgeIDs = metadata.edgeIDs;
          if (edgeIDs.length > edges.length) {
            return undefined;
          }
          for (var ii = 0; ii < edgeIDs.length; ii++) {
            if (edgeIDs[ii] !== GraphQLStoreDataHandler.getID(edges[ii])) {
              true ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
              return undefined;
            }
          }
          return edges.slice(edgeIDs.length);
        };
        GraphQLRange.prototype._addBeforeLastItems = function _addBeforeLastItems(edges, hasPrevPage, beforeCursor, afterCursor) {
          var segment;
          var segmentIndex;
          var firstCursor;
          if (beforeCursor !== undefined) {
            segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
            if (segmentIndex == null) {
              true ? warning(false, 'GraphQLRange cannot find a segment that has the cursor: %s', beforeCursor) : undefined;
              return;
            }
            segment = this._orderedSegments[segmentIndex];
            firstCursor = segment.getFirstCursor();
            if (firstCursor !== beforeCursor) {
              edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
              beforeCursor = firstCursor;
              if (!edges) {
                return;
              }
            }
          } else {
            segmentIndex = this._orderedSegments.length - 1;
            segment = this._orderedSegments[segmentIndex];
            firstCursor = segment.getFirstCursor();
            if (firstCursor !== undefined) {
              edges = this._reconcileBeforeLastEdges(segment, edges, beforeCursor);
              beforeCursor = firstCursor;
              if (!edges) {
                return;
              }
            }
          }
          if (afterCursor !== undefined) {
            if (segmentIndex === 0) {
              console.warn('GraphQLRange cannot add because there is no previous segment');
              return;
            } else if (this._orderedSegments[segmentIndex - 1].getLastCursor() !== afterCursor) {
              true ? warning(false, 'GraphQLRange cannot add because afterCursor does not match last ' + 'cursor of the previous segment') : undefined;
              return;
            }
          }
          if (beforeCursor === undefined) {
            this._hasLast = true;
          }
          this._removeEdgesIfApplicable(edges);
          segment.addEdgesBeforeCursor(edges, beforeCursor);
          if (!hasPrevPage) {
            if (afterCursor !== undefined) {
              this._concatSegments(segmentIndex - 1);
            } else {
              this._hasFirst = true;
              this._orderedSegments.splice(0, segmentIndex);
            }
          }
        };
        GraphQLRange.prototype._reconcileBeforeLastEdges = function _reconcileBeforeLastEdges(segment, edges, cursor) {
          var metadata = segment.getMetadataBeforeCursor(edges.length + 1, cursor);
          var edgeIDs = metadata.edgeIDs;
          if (edgeIDs.length > edges.length) {
            return undefined;
          }
          for (var ii = 1; ii <= edgeIDs.length; ii++) {
            if (edgeIDs[edgeIDs.length - ii] !== GraphQLStoreDataHandler.getID(edges[edges.length - ii])) {
              true ? warning(false, 'Relay was unable to reconcile edges on a connection. This most ' + 'likely occurred while trying to handle a server response that ' + 'includes connection edges with nodes that lack an `id` field.') : undefined;
              return undefined;
            }
          }
          return edges.slice(0, edges.length - edgeIDs.length);
        };
        GraphQLRange.prototype.removeEdgeWithID = function removeEdgeWithID(id) {
          for (var ii = 0; ii < this._orderedSegments.length; ii++) {
            this._orderedSegments[ii].removeAllEdges(id);
          }
        };
        GraphQLRange.prototype.retrieveRangeInfoForQuery = function retrieveRangeInfoForQuery(queryCalls, optimisticData) {
          var calls = callsArrayToObject(queryCalls);
          if (isStaticCall(calls)) {
            return this._retrieveRangeInfoForStaticCalls(queryCalls);
          }
          if (!isValidRangeCall(calls)) {
            console.error('GraphQLRange currently only handles first(<count>), ' + 'after(<cursor>).first(<count>), last(<count>), ' + 'before(<cursor>).last(<count>), before(<cursor>).first(<count>), ' + 'and after(<cursor>).last(<count>)');
            return {
              requestedEdgeIDs: [],
              diffCalls: [],
              pageInfo: RelayConnectionInterface.getDefaultPageInfo()
            };
          }
          if (calls.first && calls.before || calls.last && calls.after) {
            return {
              requestedEdgeIDs: [],
              diffCalls: [],
              pageInfo: RelayConnectionInterface.getDefaultPageInfo()
            };
          }
          if (!isValidRangeCallValues(calls)) {
            console.error('GraphQLRange only supports first(<count>) or last(<count>) ' + 'where count is greater than 0');
            return {
              requestedEdgeIDs: [],
              diffCalls: [],
              pageInfo: RelayConnectionInterface.getDefaultPageInfo()
            };
          }
          if (calls.first) {
            return this._retrieveRangeInfoForFirstQuery(queryCalls, optimisticData);
          } else if (calls.last) {
            return this._retrieveRangeInfoForLastQuery(queryCalls, optimisticData);
          }
        };
        GraphQLRange.prototype._retrieveRangeInfoForStaticCalls = function _retrieveRangeInfoForStaticCalls(queryCalls) {
          var calls = _callsToString(queryCalls);
          var storedInfo = this._staticQueriesMap[calls];
          if (storedInfo) {
            var _pageInfo;
            return {
              requestedEdgeIDs: storedInfo.edgeIDs,
              diffCalls: [],
              pageInfo: (_pageInfo = {}, _defineProperty(_pageInfo, START_CURSOR, storedInfo.cursors[0]), _defineProperty(_pageInfo, END_CURSOR, storedInfo.cursors[storedInfo.cursors.length - 1]), _defineProperty(_pageInfo, HAS_NEXT_PAGE, true), _defineProperty(_pageInfo, HAS_PREV_PAGE, true), _pageInfo)
            };
          }
          return {
            requestedEdgeIDs: [],
            diffCalls: queryCalls,
            pageInfo: RelayConnectionInterface.getDefaultPageInfo()
          };
        };
        GraphQLRange.prototype._retrieveRangeInfoForFirstQuery = function _retrieveRangeInfoForFirstQuery(queryCalls, optimisticData) {
          var appendEdgeIDs = [];
          var prependEdgeIDs = [];
          var deleteIDs = [];
          if (optimisticData) {
            appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
            prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
            deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
          }
          var calls = callsArrayToObject(queryCalls);
          var countNeeded = calls.first + deleteIDs.length;
          var segment;
          var segmentIndex;
          var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());
          var afterCursor = calls.after;
          if (afterCursor !== undefined) {
            segmentIndex = this._getSegmentIndexByCursor(afterCursor);
            if (segmentIndex == null) {
              console.warn('GraphQLRange cannot find a segment that has the cursor: ' + afterCursor);
              return {
                requestedEdgeIDs: [],
                diffCalls: [],
                pageInfo: pageInfo
              };
            }
            segment = this._orderedSegments[segmentIndex];
          } else {
            var prependEdgesCount = prependEdgeIDs.length;
            countNeeded -= prependEdgesCount;
            segmentIndex = 0;
            segment = this._orderedSegments[segmentIndex];
          }
          var requestedMetadata = segment.getMetadataAfterCursor(countNeeded, afterCursor);
          var requestedEdgeIDs = requestedMetadata.edgeIDs;
          var requestedCursors = requestedMetadata.cursors;
          var diffCalls = [];
          if (requestedCursors.length) {
            pageInfo[START_CURSOR] = requestedCursors[0];
            pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
          }
          var lastID = requestedEdgeIDs[requestedEdgeIDs.length - 1];
          if (!this._hasLast || segmentIndex !== this._orderedSegments.length - 1 || lastID && lastID !== segment.getLastID()) {
            pageInfo[HAS_NEXT_PAGE] = true;
            if (requestedEdgeIDs.length < countNeeded) {
              countNeeded -= requestedEdgeIDs.length;
              var lastCursor = segment.getLastCursor();
              if (lastCursor === null) {
                diffCalls.push({
                  name: 'first',
                  value: calls.first
                });
              } else {
                if (lastCursor !== undefined) {
                  diffCalls.push({
                    name: 'after',
                    value: lastCursor
                  });
                }
                if (segmentIndex !== this._orderedSegments.length - 1) {
                  var nextSegment = this._orderedSegments[segmentIndex + 1];
                  var firstCursor = nextSegment.getFirstCursor();
                  if (firstCursor !== undefined) {
                    diffCalls.push({
                      name: 'before',
                      value: firstCursor
                    });
                  }
                }
                diffCalls.push({
                  name: 'first',
                  value: countNeeded
                });
              }
            }
          }
          if (optimisticData) {
            if (prependEdgeIDs.length && !calls.after) {
              requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
            }
            if (appendEdgeIDs.length && !pageInfo[HAS_NEXT_PAGE]) {
              requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
            }
            if (deleteIDs.length) {
              requestedEdgeIDs = requestedEdgeIDs.filter(function(edgeID) {
                return deleteIDs.indexOf(edgeID) == -1;
              });
            }
            if (requestedEdgeIDs.length > calls.first) {
              requestedEdgeIDs = requestedEdgeIDs.slice(0, calls.first);
            }
          }
          return {
            requestedEdgeIDs: requestedEdgeIDs,
            diffCalls: diffCalls,
            pageInfo: pageInfo
          };
        };
        GraphQLRange.prototype._retrieveRangeInfoForLastQuery = function _retrieveRangeInfoForLastQuery(queryCalls, optimisticData) {
          var appendEdgeIDs = [];
          var prependEdgeIDs = [];
          var deleteIDs = [];
          if (optimisticData) {
            appendEdgeIDs = optimisticData[GraphQLMutatorConstants.APPEND] || [];
            prependEdgeIDs = optimisticData[GraphQLMutatorConstants.PREPEND] || [];
            deleteIDs = optimisticData[GraphQLMutatorConstants.REMOVE] || [];
          }
          var calls = callsArrayToObject(queryCalls);
          var countNeeded = calls.last + deleteIDs.length;
          var segment;
          var segmentIndex;
          var pageInfo = _extends({}, RelayConnectionInterface.getDefaultPageInfo());
          var beforeCursor = calls.before;
          if (beforeCursor !== undefined) {
            segmentIndex = this._getSegmentIndexByCursor(beforeCursor);
            if (segmentIndex == null) {
              console.warn('GraphQLRange cannot find a segment that has the cursor: ' + beforeCursor);
              return {
                requestedEdgeIDs: [],
                diffCalls: [],
                pageInfo: pageInfo
              };
            }
            segment = this._orderedSegments[segmentIndex];
          } else {
            var appendEdgesCount = appendEdgeIDs.length;
            countNeeded -= appendEdgesCount;
            segmentIndex = this._orderedSegments.length - 1;
            segment = this._orderedSegments[segmentIndex];
          }
          var requestedMetadata = segment.getMetadataBeforeCursor(countNeeded, beforeCursor);
          var requestedEdgeIDs = requestedMetadata.edgeIDs;
          var requestedCursors = requestedMetadata.cursors;
          var diffCalls = [];
          if (requestedCursors.length) {
            pageInfo[START_CURSOR] = requestedCursors[0];
            pageInfo[END_CURSOR] = requestedCursors[requestedCursors.length - 1];
          }
          var firstID = requestedEdgeIDs[0];
          if (!this._hasFirst || segmentIndex !== 0 || firstID && firstID !== segment.getFirstID()) {
            pageInfo[HAS_PREV_PAGE] = true;
            if (requestedEdgeIDs.length < countNeeded) {
              countNeeded -= requestedEdgeIDs.length;
              var firstCursor = segment.getFirstCursor();
              if (firstCursor === null) {
                diffCalls.push({
                  name: 'last',
                  value: calls.last
                });
              } else {
                if (firstCursor !== undefined) {
                  diffCalls.push({
                    name: 'before',
                    value: firstCursor
                  });
                }
                if (segmentIndex !== 0) {
                  var prevSegment = this._orderedSegments[segmentIndex - 1];
                  var lastCursor = prevSegment.getLastCursor();
                  if (lastCursor !== undefined) {
                    diffCalls.push({
                      name: 'after',
                      value: lastCursor
                    });
                  }
                }
                diffCalls.push({
                  name: 'last',
                  value: countNeeded
                });
              }
            }
          }
          if (optimisticData) {
            if (appendEdgeIDs.length && !calls.before) {
              requestedEdgeIDs = requestedEdgeIDs.concat(appendEdgeIDs);
            }
            if (prependEdgeIDs.length && !pageInfo[HAS_PREV_PAGE]) {
              requestedEdgeIDs = prependEdgeIDs.concat(requestedEdgeIDs);
            }
            if (deleteIDs.length) {
              requestedEdgeIDs = requestedEdgeIDs.filter(function(edgeID) {
                return deleteIDs.indexOf(edgeID) == -1;
              });
            }
            if (requestedEdgeIDs.length > calls.last) {
              var length = requestedEdgeIDs.length;
              requestedEdgeIDs = requestedEdgeIDs.slice(length - calls.last, length);
            }
          }
          return {
            requestedEdgeIDs: requestedEdgeIDs,
            diffCalls: diffCalls,
            pageInfo: pageInfo
          };
        };
        GraphQLRange.fromJSON = function fromJSON(descriptor) {
          var _descriptor = _slicedToArray(descriptor, 4);
          var hasFirst = _descriptor[0];
          var hasLast = _descriptor[1];
          var staticQueriesMap = _descriptor[2];
          var orderedSegments = _descriptor[3];
          var range = new GraphQLRange();
          range._hasFirst = hasFirst;
          range._hasLast = hasLast;
          range._staticQueriesMap = staticQueriesMap;
          range._orderedSegments = orderedSegments.map(function(descriptor) {
            return GraphQLSegment.fromJSON(descriptor);
          });
          return range;
        };
        GraphQLRange.prototype.toJSON = function toJSON() {
          return [this._hasFirst, this._hasLast, this._staticQueriesMap, this._orderedSegments];
        };
        GraphQLRange.prototype.__debug = function __debug() {
          return {orderedSegments: this._orderedSegments};
        };
        GraphQLRange.prototype.getEdgeIDs = function getEdgeIDs() {
          var edgeIDs = [];
          this._orderedSegments.forEach(function(segment) {
            edgeIDs.push.apply(edgeIDs, _toConsumableArray(segment.getEdgeIDs()));
          });
          forEachObject(this._staticQueriesMap, function(query) {
            edgeIDs.push.apply(edgeIDs, _toConsumableArray(query.edgeIDs));
          });
          return edgeIDs;
        };
        return GraphQLRange;
      })();
      function _callsToString(calls) {
        return calls.map(function(call) {
          return printRelayQueryCall(call).substring(1);
        }).join(',');
      }
      module.exports = GraphQLRange;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _slicedToArray = __webpack_require__(59)['default'];
      var _Object$assign = __webpack_require__(57)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var GraphQLSegment = (function() {
        function GraphQLSegment() {
          _classCallCheck(this, GraphQLSegment);
          this._indexToMetadataMap = {};
          this._idToIndicesMap = {};
          this._cursorToIndexMap = {};
          this._count = 0;
          this._minIndex = null;
          this._maxIndex = null;
        }
        GraphQLSegment.prototype._getIndexForCursor = function _getIndexForCursor(cursor) {
          return this._cursorToIndexMap[cursor];
        };
        GraphQLSegment.prototype._getIndexForID = function _getIndexForID(id) {
          var indices = this._idToIndicesMap[id];
          return indices && indices[0];
        };
        GraphQLSegment.prototype.getFirstCursor = function getFirstCursor() {
          if (this.getLength()) {
            for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
              var metadata = this._indexToMetadataMap[ii];
              if (!metadata.deleted) {
                return metadata.cursor;
              }
            }
          }
        };
        GraphQLSegment.prototype.getLastCursor = function getLastCursor() {
          if (this.getLength()) {
            for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
              var metadata = this._indexToMetadataMap[ii];
              if (!metadata.deleted) {
                return metadata.cursor;
              }
            }
          }
        };
        GraphQLSegment.prototype.getFirstID = function getFirstID() {
          if (this.getLength()) {
            for (var ii = this._minIndex; ii <= this._maxIndex; ii++) {
              var metadata = this._indexToMetadataMap[ii];
              if (!metadata.deleted) {
                return metadata.edgeID;
              }
            }
          }
        };
        GraphQLSegment.prototype.getLastID = function getLastID() {
          if (this.getLength()) {
            for (var ii = this._maxIndex; ii >= this._minIndex; ii--) {
              var metadata = this._indexToMetadataMap[ii];
              if (!metadata.deleted) {
                return metadata.edgeID;
              }
            }
          }
        };
        GraphQLSegment.prototype._getEdgeAtIndex = function _getEdgeAtIndex(index) {
          var edge = this._indexToMetadataMap[index];
          return edge && !edge.deleted ? edge : null;
        };
        GraphQLSegment.prototype.containsEdgeWithID = function containsEdgeWithID(id) {
          var index = this._getIndexForID(id);
          if (index === undefined) {
            return false;
          }
          return !!this._getEdgeAtIndex(index);
        };
        GraphQLSegment.prototype.containsEdgeWithCursor = function containsEdgeWithCursor(cursor) {
          var index = this._getIndexForCursor(cursor);
          if (index === undefined) {
            return false;
          }
          return !!this._getEdgeAtIndex(index);
        };
        GraphQLSegment.prototype.getMetadataAfterCursor = function getMetadataAfterCursor(count, cursor) {
          if (!this.getLength()) {
            return {
              edgeIDs: [],
              cursors: []
            };
          }
          var currentIndex = this._minIndex;
          if (cursor) {
            var index = this._getIndexForCursor(cursor);
            if (index === undefined) {
              console.warn('This segment does not have a cursor %s', cursor);
              return {
                edgeIDs: [],
                cursors: []
              };
            }
            currentIndex = index + 1;
          }
          var total = 0;
          var edgeIDs = [];
          var cursors = [];
          while (currentIndex <= this._maxIndex && total < count) {
            var metadata = this._indexToMetadataMap[currentIndex];
            if (!metadata.deleted) {
              edgeIDs.push(metadata.edgeID);
              cursors.push(metadata.cursor);
              total++;
            }
            currentIndex++;
          }
          return {
            edgeIDs: edgeIDs,
            cursors: cursors
          };
        };
        GraphQLSegment.prototype.getMetadataBeforeCursor = function getMetadataBeforeCursor(count, cursor) {
          if (!this.getLength()) {
            return {
              edgeIDs: [],
              cursors: []
            };
          }
          var currentIndex = this._maxIndex;
          if (cursor) {
            var index = this._getIndexForCursor(cursor);
            if (index === undefined) {
              console.warn('This segment does not have a cursor %s', cursor);
              return {
                edgeIDs: [],
                cursors: []
              };
            }
            currentIndex = index - 1;
          }
          var total = 0;
          var edgeIDs = [];
          var cursors = [];
          while (currentIndex >= this._minIndex && total < count) {
            var metadata = this._indexToMetadataMap[currentIndex];
            if (!metadata.deleted) {
              edgeIDs.push(metadata.edgeID);
              cursors.push(metadata.cursor);
              total++;
            }
            currentIndex--;
          }
          return {
            edgeIDs: edgeIDs.reverse(),
            cursors: cursors.reverse()
          };
        };
        GraphQLSegment.prototype._addEdgeAtIndex = function _addEdgeAtIndex(edge, index) {
          if (this.getLength() === 0) {
            this._minIndex = index;
            this._maxIndex = index;
          } else if (this._minIndex == index + 1) {
            this._minIndex = index;
          } else if (this._maxIndex == index - 1) {
            this._maxIndex = index;
          } else {
            console.warn('Attempted to add noncontiguous index to GraphQLSegment: ' + index + ' to ' + ('(' + this._minIndex + ', ' + this._maxIndex + ')'));
            return;
          }
          var edgeID = GraphQLStoreDataHandler.getID(edge);
          var cursor = edge.cursor;
          var idIndex = this._getIndexForID(edgeID);
          if (idIndex !== undefined && this._getEdgeAtIndex(idIndex)) {
            console.warn('Attempted to add an ID already in GraphQLSegment: %s', edgeID);
            return;
          }
          this._indexToMetadataMap[index] = {
            edgeID: edgeID,
            cursor: cursor,
            deleted: false
          };
          this._idToIndicesMap[edgeID] = this._idToIndicesMap[edgeID] || [];
          this._idToIndicesMap[edgeID].unshift(index);
          this._count++;
          if (cursor) {
            this._cursorToIndexMap[cursor] = index;
          }
        };
        GraphQLSegment.prototype.prependEdge = function prependEdge(edge) {
          this._addEdgeAtIndex(edge, this._minIndex !== null ? this._minIndex - 1 : 0);
        };
        GraphQLSegment.prototype.appendEdge = function appendEdge(edge) {
          this._addEdgeAtIndex(edge, this._maxIndex !== null ? this._maxIndex + 1 : 0);
        };
        GraphQLSegment.prototype.removeEdge = function removeEdge(id) {
          var index = this._getIndexForID(id);
          if (index === undefined) {
            console.warn('Attempted to remove edge with ID that was never in GraphQLSegment: ' + id);
            return;
          }
          var data = this._indexToMetadataMap[index];
          if (data.deleted) {
            console.warn('Attempted to remove edge with ID that was already removed: ' + id);
            return;
          }
          data.deleted = true;
          this._count--;
        };
        GraphQLSegment.prototype.removeAllEdges = function removeAllEdges(id) {
          var indices = this._idToIndicesMap[id];
          if (!indices) {
            return;
          }
          for (var ii = 0; ii < indices.length; ii++) {
            var data = this._indexToMetadataMap[indices[ii]];
            if (!data.deleted) {
              data.deleted = true;
              this._count--;
            }
          }
        };
        GraphQLSegment.prototype.addEdgesAfterCursor = function addEdgesAfterCursor(edges, cursor) {
          var index = -1;
          if (cursor) {
            index = this._getIndexForCursor(cursor);
            if (index === undefined) {
              console.warn('This segment does not have a cursor %s', cursor);
              return;
            }
          }
          while (this._maxIndex !== null && index < this._maxIndex) {
            var data = this._indexToMetadataMap[index + 1];
            if (data.deleted) {
              index++;
            } else {
              console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'last index is ' + this._maxIndex + ' trying to add edges before ' + index);
              return;
            }
          }
          var startIndex = index + 1;
          for (var ii = 0; ii < edges.length; ii++) {
            var edge = edges[ii];
            this._addEdgeAtIndex(edge, startIndex + ii);
          }
        };
        GraphQLSegment.prototype.addEdgesBeforeCursor = function addEdgesBeforeCursor(edges, cursor) {
          var index = 1;
          if (cursor) {
            index = this._getIndexForCursor(cursor);
            if (index === undefined) {
              console.warn('This segment does not have a cursor %s', cursor);
              return;
            }
          }
          while (this._minIndex !== null && index > this._minIndex) {
            var data = this._indexToMetadataMap[index - 1];
            if (data.deleted) {
              index--;
            } else {
              console.warn('Attempted to do an overwrite to GraphQLSegment: ' + 'first index is ' + this._minIndex + ' trying to add edges after ' + index);
              return;
            }
          }
          var startIndex = index - 1;
          for (var ii = 0; ii < edges.length; ii++) {
            var edge = edges[edges.length - ii - 1];
            this._addEdgeAtIndex(edge, startIndex - ii);
          }
        };
        GraphQLSegment.prototype.getLength = function getLength() {
          if (this._minIndex === null && this._maxIndex === null) {
            return 0;
          }
          return this._maxIndex - this._minIndex + 1;
        };
        GraphQLSegment.prototype.getCount = function getCount() {
          return this._count;
        };
        GraphQLSegment.prototype._rollback = function _rollback(cursorRollbackMap, idRollbackMap, counters) {
          _Object$assign(this._cursorToIndexMap, cursorRollbackMap);
          _Object$assign(this._idToIndicesMap, idRollbackMap);
          this._count = counters.count;
          this._maxIndex = counters.maxIndex;
          this._minIndex = counters.minIndex;
        };
        GraphQLSegment.prototype._getCounterState = function _getCounterState() {
          return {
            count: this._count,
            maxIndex: this._maxIndex,
            minIndex: this._minIndex
          };
        };
        GraphQLSegment.prototype.concatSegment = function concatSegment(segment) {
          if (!segment.getLength()) {
            return true;
          }
          var idRollbackMap = {};
          var cursorRollbackMap = {};
          var counterState = this._getCounterState();
          var newEdges = segment._indexToMetadataMap;
          for (var ii = segment._minIndex; ii <= segment._maxIndex; ii++) {
            var index;
            if (this.getLength()) {
              index = this._maxIndex + 1;
            } else {
              index = 0;
              this._minIndex = 0;
            }
            this._maxIndex = index;
            var newEdge = newEdges[ii];
            var idIndex = this._getIndexForID(newEdge.edgeID);
            if (!idRollbackMap.hasOwnProperty(newEdge.edgeID)) {
              if (this._idToIndicesMap[newEdge.edgeID]) {
                idRollbackMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID].slice();
              } else {
                idRollbackMap[newEdge.edgeID] = undefined;
              }
            }
            if (idIndex !== undefined) {
              var idEdge = this._indexToMetadataMap[idIndex];
              if (idEdge.deleted && !newEdge.deleted) {
                this._idToIndicesMap[newEdge.edgeID].unshift(index);
              } else if (!newEdge.deleted) {
                console.warn('Attempt to concat an ID already in GraphQLSegment: %s', newEdge.edgeID);
                this._rollback(cursorRollbackMap, idRollbackMap, counterState);
                return false;
              } else {
                this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
                this._idToIndicesMap[newEdge.edgeID].push(index);
              }
            } else {
              this._idToIndicesMap[newEdge.edgeID] = this._idToIndicesMap[newEdge.edgeID] || [];
              this._idToIndicesMap[newEdge.edgeID].unshift(index);
            }
            var cursorIndex = this._getIndexForCursor(newEdge.cursor);
            if (cursorIndex !== undefined) {
              var cursorEdge = this._indexToMetadataMap[cursorIndex];
              if (cursorEdge.deleted && !newEdge.deleted) {
                cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
                this._cursorToIndexMap[newEdge.cursor] = index;
              } else if (!newEdge.deleted) {
                console.warn('Attempt to concat a cursor already in GraphQLSegment: %s', newEdge.cursor);
                this._rollback(cursorRollbackMap, idRollbackMap, counterState);
                return false;
              }
            } else if (newEdge.cursor) {
              cursorRollbackMap[newEdge.cursor] = this._cursorToIndexMap[newEdge.cursor];
              this._cursorToIndexMap[newEdge.cursor] = index;
            }
            if (!newEdge.deleted) {
              this._count++;
            }
            this._indexToMetadataMap[index] = _Object$assign({}, newEdge);
          }
          return true;
        };
        GraphQLSegment.prototype.toJSON = function toJSON() {
          return [this._indexToMetadataMap, this._idToIndicesMap, this._cursorToIndexMap, this._minIndex, this._maxIndex, this._count];
        };
        GraphQLSegment.fromJSON = function fromJSON(descriptor) {
          var _descriptor = _slicedToArray(descriptor, 6);
          var indexToMetadataMap = _descriptor[0];
          var idToIndicesMap = _descriptor[1];
          var cursorToIndexMap = _descriptor[2];
          var minIndex = _descriptor[3];
          var maxIndex = _descriptor[4];
          var count = _descriptor[5];
          var segment = new GraphQLSegment();
          segment._indexToMetadataMap = indexToMetadataMap;
          segment._idToIndicesMap = idToIndicesMap;
          segment._cursorToIndexMap = cursorToIndexMap;
          segment._minIndex = minIndex;
          segment._maxIndex = maxIndex;
          segment._count = count;
          return segment;
        };
        GraphQLSegment.prototype.__debug = function __debug() {
          return {
            metadata: this._indexToMetadataMap,
            idToIndices: this._idToIndicesMap,
            cursorToIndex: this._cursorToIndexMap
          };
        };
        GraphQLSegment.prototype.getEdgeIDs = function getEdgeIDs() {
          return _Object$keys(this._idToIndicesMap);
        };
        return GraphQLSegment;
      })();
      module.exports = GraphQLSegment;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var ErrorUtils = __webpack_require__(69);
      var resolveImmediate = __webpack_require__(29);
      var GraphQLStoreChangeEmitter = (function() {
        function GraphQLStoreChangeEmitter(rangeData) {
          _classCallCheck(this, GraphQLStoreChangeEmitter);
          this._batchUpdate = function(callback) {
            return callback();
          };
          this._executingIDs = {};
          this._rangeData = rangeData;
          this._scheduledIDs = null;
          this._subscribers = [];
        }
        GraphQLStoreChangeEmitter.prototype.addListenerForIDs = function addListenerForIDs(ids, callback) {
          var _this = this;
          var subscribedIDs = ids.map(function(id) {
            return _this._getBroadcastID(id);
          });
          var index = this._subscribers.length;
          this._subscribers.push({
            subscribedIDs: subscribedIDs,
            callback: callback
          });
          return {remove: function remove() {
              delete _this._subscribers[index];
            }};
        };
        GraphQLStoreChangeEmitter.prototype.broadcastChangeForID = function broadcastChangeForID(id) {
          var _this2 = this;
          var scheduledIDs = this._scheduledIDs;
          if (scheduledIDs == null) {
            resolveImmediate(function() {
              return _this2._processBroadcasts();
            });
            scheduledIDs = this._scheduledIDs = {};
          }
          scheduledIDs[this._getBroadcastID(id)] = this._subscribers.length - 1;
        };
        GraphQLStoreChangeEmitter.prototype.injectBatchingStrategy = function injectBatchingStrategy(batchStrategy) {
          this._batchUpdate = batchStrategy;
        };
        GraphQLStoreChangeEmitter.prototype._processBroadcasts = function _processBroadcasts() {
          var _this3 = this;
          if (this._scheduledIDs) {
            this._executingIDs = this._scheduledIDs;
            this._scheduledIDs = null;
            this._batchUpdate(function() {
              return _this3._processSubscribers();
            });
          }
        };
        GraphQLStoreChangeEmitter.prototype._processSubscribers = function _processSubscribers() {
          var _this4 = this;
          this._subscribers.forEach(function(subscriber, subscriberIndex) {
            return _this4._processSubscriber(subscriber, subscriberIndex);
          });
        };
        GraphQLStoreChangeEmitter.prototype._processSubscriber = function _processSubscriber(_ref, subscriberIndex) {
          var subscribedIDs = _ref.subscribedIDs;
          var callback = _ref.callback;
          for (var broadcastID in this._executingIDs) {
            if (this._executingIDs.hasOwnProperty(broadcastID)) {
              var broadcastIndex = this._executingIDs[broadcastID];
              if (broadcastIndex < subscriberIndex) {
                break;
              }
              if (subscribedIDs.indexOf(broadcastID) >= 0) {
                ErrorUtils.applyWithGuard(callback, null, null, null, 'GraphQLStoreChangeEmitter');
                break;
              }
            }
          }
        };
        GraphQLStoreChangeEmitter.prototype._getBroadcastID = function _getBroadcastID(id) {
          return this._rangeData.getCanonicalClientID(id);
        };
        return GraphQLStoreChangeEmitter;
      })();
      module.exports = GraphQLStoreChangeEmitter;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var callsFromGraphQL = __webpack_require__(52);
      var printRelayQueryCall = __webpack_require__(40);
      var GraphQLStoreRangeUtils = (function() {
        function GraphQLStoreRangeUtils() {
          _classCallCheck(this, GraphQLStoreRangeUtils);
          this._rangeData = {};
        }
        GraphQLStoreRangeUtils.prototype.getClientIDForRangeWithID = function getClientIDForRangeWithID(calls, callValues, dataID) {
          var callsAsString = callsFromGraphQL(calls, callValues).map(function(call) {
            return printRelayQueryCall(call).substring(1);
          }).join(',');
          var key = dataID + '_' + callsAsString;
          var edge = this._rangeData[key];
          if (!edge) {
            this._rangeData[key] = {
              dataID: dataID,
              calls: calls,
              callValues: callValues
            };
          }
          return key;
        };
        GraphQLStoreRangeUtils.prototype.parseRangeClientID = function parseRangeClientID(rangeSpecificClientID) {
          return this._rangeData[rangeSpecificClientID] || null;
        };
        GraphQLStoreRangeUtils.prototype.getCanonicalClientID = function getCanonicalClientID(dataID) {
          return this._rangeData[dataID] ? this._rangeData[dataID].dataID : dataID;
        };
        return GraphQLStoreRangeUtils;
      })();
      module.exports = GraphQLStoreRangeUtils;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var invariant = __webpack_require__(2);
      var RelayBufferedNeglectionStateMap = (function() {
        function RelayBufferedNeglectionStateMap(neglectionStateMap) {
          _classCallCheck(this, RelayBufferedNeglectionStateMap);
          this._bufferedChanges = [];
          this._neglectionStateMap = neglectionStateMap;
        }
        RelayBufferedNeglectionStateMap.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
          this._bufferedChanges.push({
            type: 'decrease',
            dataID: dataID
          });
        };
        RelayBufferedNeglectionStateMap.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
          this._bufferedChanges.push({
            type: 'increase',
            dataID: dataID
          });
        };
        RelayBufferedNeglectionStateMap.prototype.register = function register(dataID) {
          this._bufferedChanges.push({
            type: 'register',
            dataID: dataID
          });
        };
        RelayBufferedNeglectionStateMap.prototype.remove = function remove(dataID) {
          this._bufferedChanges.push({
            type: 'remove',
            dataID: dataID
          });
        };
        RelayBufferedNeglectionStateMap.prototype.size = function size() {
          return this._neglectionStateMap.size();
        };
        RelayBufferedNeglectionStateMap.prototype.values = function values() {
          return this._neglectionStateMap.values();
        };
        RelayBufferedNeglectionStateMap.prototype.flushBuffer = function flushBuffer() {
          var _this = this;
          this._bufferedChanges.forEach(function(action) {
            var type = action.type;
            var dataID = action.dataID;
            switch (type) {
              case 'decrease':
                _this._neglectionStateMap.decreaseSubscriptionsFor(dataID);
                break;
              case 'increase':
                _this._neglectionStateMap.increaseSubscriptionsFor(dataID);
                break;
              case 'register':
                _this._neglectionStateMap.register(dataID);
                break;
              case 'remove':
                _this._neglectionStateMap.remove(dataID);
                break;
              default:
                true ? true ? invariant(false, 'RelayBufferedNeglectionStateMap._flushBufferedChanges: ' + 'Invalid type %s for buffered chaged', type) : invariant(false) : undefined;
            }
          });
          this._bufferedChanges = [];
        };
        return RelayBufferedNeglectionStateMap;
      })();
      module.exports = RelayBufferedNeglectionStateMap;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _Object$freeze = __webpack_require__(41)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayChangeTracker = (function() {
        function RelayChangeTracker() {
          _classCallCheck(this, RelayChangeTracker);
          this._created = {};
          this._updated = {};
        }
        RelayChangeTracker.prototype.createID = function createID(recordID) {
          this._created[recordID] = true;
        };
        RelayChangeTracker.prototype.updateID = function updateID(recordID) {
          if (!this._created.hasOwnProperty(recordID)) {
            this._updated[recordID] = true;
          }
        };
        RelayChangeTracker.prototype.hasChange = function hasChange(recordID) {
          return !!(this._updated[recordID] || this._created[recordID]);
        };
        RelayChangeTracker.prototype.isNewRecord = function isNewRecord(recordID) {
          return !!this._created[recordID];
        };
        RelayChangeTracker.prototype.getChangeSet = function getChangeSet() {
          if (true) {
            return {
              created: _Object$freeze(this._created),
              updated: _Object$freeze(this._updated)
            };
          }
          return {
            created: this._created,
            updated: this._updated
          };
        };
        return RelayChangeTracker;
      })();
      module.exports = RelayChangeTracker;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var ErrorUtils = __webpack_require__(69);
      var GraphQLFragmentPointer = __webpack_require__(21);
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var GraphQLStoreQueryResolver = __webpack_require__(80);
      var React = __webpack_require__(33);
      var ReactDOM = __webpack_require__(264);
      var RelayContainerComparators = __webpack_require__(132);
      var RelayContainerProxy = __webpack_require__(133);
      var RelayDeprecated = __webpack_require__(81);
      var RelayFragmentReference = __webpack_require__(34);
      var RelayMetaRoute = __webpack_require__(22);
      var RelayMutationTransaction = __webpack_require__(49);
      var RelayPropTypes = __webpack_require__(35);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayStore = __webpack_require__(37);
      var RelayStoreData = __webpack_require__(38);
      var buildRQL = __webpack_require__(51);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var nullthrows = __webpack_require__(71);
      var prepareRelayContainerProps = __webpack_require__(172);
      var shallowEqual = __webpack_require__(72);
      var warning = __webpack_require__(11);
      var containerContextTypes = {route: RelayPropTypes.QueryConfig.isRequired};
      var nextContainerID = 0;
      var storeData = RelayStoreData.getDefaultInstance();
      storeData.getChangeEmitter().injectBatchingStrategy(ReactDOM.unstable_batchedUpdates);
      function createContainerComponent(Component, spec, containerID) {
        var componentName = Component.displayName || Component.name;
        var containerName = 'Relay(' + componentName + ')';
        var fragments = spec.fragments;
        var fragmentNames = _Object$keys(fragments);
        var initialVariables = spec.initialVariables || {};
        var prepareVariables = spec.prepareVariables;
        var RelayContainer = (function(_React$Component) {
          _inherits(RelayContainer, _React$Component);
          function RelayContainer(props, context) {
            _classCallCheck(this, RelayContainer);
            _React$Component.call(this, props, context);
            var route = context.route;
            !(route && typeof route.name === 'string') ? true ? invariant(false, 'RelayContainer: `%s` was rendered without a valid route. Make sure ' + 'the route is valid, and make sure that it is correctly set on the ' + 'parent component\'s context (e.g. using <RelayRootContainer>).', containerName) : invariant(false) : undefined;
            var self = this;
            self.forceFetch = this.forceFetch.bind(this);
            self.getPendingTransactions = this.getPendingTransactions.bind(this);
            self.hasFragmentData = this.hasFragmentData.bind(this);
            self.hasOptimisticUpdate = this.hasOptimisticUpdate.bind(this);
            self.setVariables = this.setVariables.bind(this);
            this._deferredSubscriptions = null;
            this._didShowFakeDataWarning = false;
            this._fragmentPointers = {};
            this._hasStaleQueryData = false;
            this._queryResolvers = {};
            this.mounted = true;
            this.pending = null;
            this.state = {
              variables: {},
              queryData: {}
            };
          }
          RelayContainer.prototype.setVariables = function setVariables(partialVariables, callback) {
            this._runVariables(partialVariables, callback, false);
          };
          RelayContainer.prototype.forceFetch = function forceFetch(partialVariables, callback) {
            this._runVariables(partialVariables, callback, true);
          };
          RelayContainer.prototype._createQuerySetAndFragmentPointers = function _createQuerySetAndFragmentPointers(variables) {
            var _this = this;
            var fragmentPointers = {};
            var querySet = {};
            fragmentNames.forEach(function(fragmentName) {
              var fragment = getFragment(fragmentName, _this.context.route, variables);
              var queryData = _this.state.queryData[fragmentName];
              if (!fragment || queryData == null) {
                return;
              }
              var fragmentPointer;
              if (fragment.isPlural()) {
                !Array.isArray(queryData) ? true ? invariant(false, 'RelayContainer: Invalid queryData for `%s`, expected an array ' + 'of records because the corresponding fragment is plural.', fragmentName) : invariant(false) : undefined;
                var dataIDs = [];
                queryData.forEach(function(data, ii) {
                  var dataID = GraphQLStoreDataHandler.getID(data);
                  if (dataID) {
                    querySet[fragmentName + ii] = storeData.buildFragmentQueryForDataID(fragment, dataID);
                    dataIDs.push(dataID);
                  }
                });
                if (dataIDs.length) {
                  fragmentPointer = new GraphQLFragmentPointer(dataIDs, fragment);
                }
              } else {
                var dataID = GraphQLStoreDataHandler.getID(queryData);
                if (dataID) {
                  fragmentPointer = new GraphQLFragmentPointer(dataID, fragment);
                  querySet[fragmentName] = storeData.buildFragmentQueryForDataID(fragment, dataID);
                }
              }
              fragmentPointers[fragmentName] = fragmentPointer;
            });
            return {
              fragmentPointers: fragmentPointers,
              querySet: querySet
            };
          };
          RelayContainer.prototype._runVariables = function _runVariables(partialVariables, callback, forceFetch) {
            var _this2 = this;
            var lastVariables = this.state.variables;
            var prevVariables = this.pending ? this.pending.variables : lastVariables;
            var nextVariables = mergeVariables(prevVariables, partialVariables);
            this.pending && this.pending.request.abort();
            var completeProfiler = RelayProfiler.profile('RelayContainer.setVariables', {
              containerName: containerName,
              nextVariables: nextVariables
            });
            var querySet = {};
            var fragmentPointers = null;
            if (forceFetch || !shallowEqual(nextVariables, lastVariables)) {
              var _createQuerySetAndFragmentPointers2 = this._createQuerySetAndFragmentPointers(nextVariables);
              querySet = _createQuerySetAndFragmentPointers2.querySet;
              fragmentPointers = _createQuerySetAndFragmentPointers2.fragmentPointers;
            }
            var onReadyStateChange = ErrorUtils.guard(function(readyState) {
              var aborted = readyState.aborted;
              var done = readyState.done;
              var error = readyState.error;
              var ready = readyState.ready;
              var isComplete = aborted || done || error;
              if (isComplete && _this2.pending === current) {
                _this2.pending = null;
              }
              var partialState;
              if (ready && fragmentPointers) {
                _this2._fragmentPointers = fragmentPointers;
                _this2._updateQueryResolvers();
                var queryData = _this2._getQueryData(_this2.props);
                partialState = {
                  variables: nextVariables,
                  queryData: queryData
                };
              } else {
                partialState = {};
              }
              var mounted = _this2.mounted;
              if (mounted) {
                var updateProfiler = RelayProfiler.profile('RelayContainer.update');
                ReactDOM.unstable_batchedUpdates(function() {
                  _this2.setState(partialState, function() {
                    updateProfiler.stop();
                    if (isComplete) {
                      completeProfiler.stop();
                    }
                  });
                  if (callback) {
                    callback.call(_this2.refs.component, _extends({}, readyState, {mounted: mounted}));
                  }
                });
              } else {
                if (callback) {
                  callback(_extends({}, readyState, {mounted: mounted}));
                }
                if (isComplete) {
                  completeProfiler.stop();
                }
              }
            }, 'RelayContainer.onReadyStateChange');
            var current = {
              variables: nextVariables,
              request: forceFetch ? RelayStore.forceFetch(querySet, onReadyStateChange) : RelayStore.primeCache(querySet, onReadyStateChange)
            };
            this.pending = current;
          };
          RelayContainer.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(record) {
            var dataID = GraphQLStoreDataHandler.getID(record);
            !(dataID != null) ? true ? invariant(false, 'RelayContainer.hasOptimisticUpdate(): Expected a record in `%s`.', componentName) : invariant(false) : undefined;
            return storeData.hasOptimisticUpdate(dataID);
          };
          RelayContainer.prototype.getPendingTransactions = function getPendingTransactions(record) {
            var dataID = GraphQLStoreDataHandler.getID(record);
            !(dataID != null) ? true ? invariant(false, 'RelayContainer.getPendingTransactions(): Expected a record in `%s`.', componentName) : invariant(false) : undefined;
            var mutationIDs = storeData.getClientMutationIDs(dataID);
            if (!mutationIDs) {
              return null;
            }
            var mutationQueue = storeData.getMutationQueue();
            return mutationIDs.map(function(id) {
              return mutationQueue.getTransaction(id);
            });
          };
          RelayContainer.prototype.hasFragmentData = function hasFragmentData(fragmentReference, record) {
            if (!storeData.getPendingQueryTracker().hasPendingQueries()) {
              return true;
            }
            var dataID = GraphQLStoreDataHandler.getID(record);
            !(dataID != null) ? true ? invariant(false, 'RelayContainer.hasFragmentData(): Second argument is not a valid ' + 'record. For `<%s X={this.props.X} />`, use ' + '`this.props.hasFragmentData(%s.getFragment(\'X\'), this.props.X)`.', componentName, componentName) : invariant(false) : undefined;
            var fragment = getDeferredFragment(fragmentReference, this.context, this.state.variables);
            !(fragment instanceof RelayQuery.Fragment) ? true ? invariant(false, 'RelayContainer.hasFragmentData(): First argument is not a valid ' + 'fragment. Ensure that there are no failing `if` or `unless` ' + 'conditions.') : invariant(false) : undefined;
            return storeData.getCachedStore().hasDeferredFragmentData(dataID, fragment.getFragmentID());
          };
          RelayContainer.prototype.componentWillMount = function componentWillMount() {
            if (this.context.route.useMockData) {
              return;
            }
            var variables = getVariablesWithPropOverrides(spec, this.props, initialVariables);
            this._updateFragmentPointers(this.props, this.context.route, variables);
            this._updateQueryResolvers();
            var queryData = this._getQueryData(this.props);
            this.setState({
              variables: variables,
              queryData: queryData
            });
          };
          RelayContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
            var _this3 = this;
            var _nullthrows = nullthrows(nextContext);
            var route = _nullthrows.route;
            if (route.useMockData) {
              return;
            }
            this.setState(function(state) {
              var variables = getVariablesWithPropOverrides(spec, nextProps, resetPropOverridesForVariables(spec, nextProps, state.variables));
              _this3._updateFragmentPointers(nextProps, route, variables);
              _this3._updateQueryResolvers();
              return {
                variables: variables,
                queryData: _this3._getQueryData(nextProps)
              };
            });
          };
          RelayContainer.prototype.componentWillUnmount = function componentWillUnmount() {
            if (this._queryResolvers) {
              forEachObject(this._queryResolvers, function(queryResolver) {
                return queryResolver && queryResolver.reset();
              });
            }
            if (this._deferredSubscriptions) {
              forEachObject(this._deferredSubscriptions, function(sub) {
                return sub.dispose();
              });
            }
            this._deferredSubscriptions = null;
            this._fragmentPointers = {};
            this._queryResolvers = {};
            var pending = this.pending;
            if (pending) {
              pending.request.abort();
              this.pending = null;
            }
            this.mounted = false;
          };
          RelayContainer.prototype._updateQueryResolvers = function _updateQueryResolvers() {
            var _this4 = this;
            var fragmentPointers = this._fragmentPointers;
            var queryResolvers = this._queryResolvers;
            fragmentNames.forEach(function(fragmentName) {
              var fragmentPointer = fragmentPointers[fragmentName];
              var queryResolver = queryResolvers[fragmentName];
              if (!fragmentPointer) {
                if (queryResolver) {
                  queryResolver.reset();
                  queryResolvers[fragmentName] = null;
                }
              } else if (!queryResolver) {
                queryResolver = new GraphQLStoreQueryResolver(storeData, fragmentPointer, _this4._handleFragmentDataUpdate.bind(_this4));
                queryResolvers[fragmentName] = queryResolver;
              }
            });
          };
          RelayContainer.prototype._handleFragmentDataUpdate = function _handleFragmentDataUpdate() {
            var queryData = this._getQueryData(this.props);
            var updateProfiler = RelayProfiler.profile('RelayContainer.handleFragmentDataUpdate');
            this.setState({queryData: queryData}, updateProfiler.stop);
          };
          RelayContainer.prototype._updateFragmentPointers = function _updateFragmentPointers(props, route, variables) {
            var _this5 = this;
            var fragmentPointers = this._fragmentPointers;
            fragmentNames.forEach(function(fragmentName) {
              var propValue = props[fragmentName];
              true ? warning(propValue !== undefined, 'RelayContainer: Expected query `%s` to be supplied to `%s` as ' + 'a prop from the parent. Pass an explicit `null` if this is ' + 'intentional.', fragmentName, componentName) : undefined;
              if (!propValue) {
                fragmentPointers[fragmentName] = null;
                return;
              }
              var fragment = getFragment(fragmentName, route, variables);
              var concreteFragmentID = fragment.getConcreteFragmentID();
              var dataIDOrIDs;
              if (fragment.isPlural()) {
                !Array.isArray(propValue) ? true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, expected an ' + 'array of records because the corresponding fragment is plural.', fragmentName, componentName) : invariant(false) : undefined;
                if (propValue.length) {
                  dataIDOrIDs = propValue.reduce(function(acc, item, ii) {
                    var eachFragmentPointer = item[concreteFragmentID];
                    !eachFragmentPointer ? true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, ' + 'expected element at index %s to have query data.', fragmentName, componentName, ii) : invariant(false) : undefined;
                    return acc.concat(eachFragmentPointer.getDataIDs());
                  }, []);
                } else {
                  dataIDOrIDs = null;
                }
              } else {
                !!Array.isArray(propValue) ? true ? invariant(false, 'RelayContainer: Invalid prop `%s` supplied to `%s`, expected a ' + 'single record because the corresponding fragment is not plural.', fragmentName, componentName) : invariant(false) : undefined;
                var fragmentPointer = propValue[concreteFragmentID];
                if (fragmentPointer) {
                  dataIDOrIDs = fragmentPointer.getDataID();
                } else {
                  dataIDOrIDs = null;
                  if (true) {
                    if (!route.useMockData && !_this5._didShowFakeDataWarning) {
                      _this5._didShowFakeDataWarning = true;
                      true ? warning(false, 'RelayContainer: Expected prop `%s` supplied to `%s` to ' + 'be data fetched by Relay. This is likely an error unless ' + 'you are purposely passing in mock data that conforms to ' + 'the shape of this component\'s fragment.', fragmentName, componentName) : undefined;
                    }
                  }
                }
              }
              fragmentPointers[fragmentName] = dataIDOrIDs ? new GraphQLFragmentPointer(dataIDOrIDs, fragment) : null;
            });
            if (true) {
              fragmentNames.forEach(function(fragmentName) {
                if (fragmentPointers[fragmentName]) {
                  return;
                }
                var fragment = getFragment(fragmentName, route, variables);
                var concreteFragmentID = fragment.getConcreteFragmentID();
                _Object$keys(props).forEach(function(propName) {
                  true ? warning(fragmentPointers[propName] || !props[propName] || !props[propName][concreteFragmentID], 'RelayContainer: Expected record data for prop `%s` on `%s`, ' + 'but it was instead on prop `%s`. Did you misspell a prop or ' + 'pass record data into the wrong prop?', fragmentName, componentName, propName) : undefined;
                });
              });
            }
          };
          RelayContainer.prototype._getQueryData = function _getQueryData(props) {
            var _this6 = this;
            var queryData = {};
            var fragmentPointers = this._fragmentPointers;
            forEachObject(this._queryResolvers, function(queryResolver, propName) {
              var propValue = props[propName];
              var fragmentPointer = fragmentPointers[propName];
              if (!propValue || !fragmentPointer) {
                queryResolver && queryResolver.reset();
                queryData[propName] = propValue;
              } else {
                queryData[propName] = queryResolver.resolve(fragmentPointer);
              }
              if (_this6.state.queryData.hasOwnProperty(propName) && queryData[propName] !== _this6.state.queryData[propName]) {
                _this6._hasStaleQueryData = true;
              }
            });
            return queryData;
          };
          RelayContainer.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
            if (this._hasStaleQueryData) {
              this._hasStaleQueryData = false;
              return true;
            }
            if (this.context.route !== nextContext.route) {
              return true;
            }
            var fragmentPointers = this._fragmentPointers;
            return !RelayContainerComparators.areNonQueryPropsEqual(fragments, this.props, nextProps) || fragmentPointers && !RelayContainerComparators.areQueryResultsEqual(fragmentPointers, this.state.queryData, nextState.queryData) || !RelayContainerComparators.areQueryVariablesEqual(this.state.variables, nextState.variables);
          };
          RelayContainer.prototype.render = function render() {
            var relayProps = {
              forceFetch: this.forceFetch,
              getPendingTransactions: this.getPendingTransactions,
              hasFragmentData: this.hasFragmentData,
              hasOptimisticUpdate: this.hasOptimisticUpdate,
              route: this.context.route,
              setVariables: this.setVariables,
              variables: this.state.variables
            };
            return React.createElement(Component, _extends({}, this.props, this.state.queryData, prepareRelayContainerProps(relayProps, this), {ref: 'component'}));
          };
          return RelayContainer;
        })(React.Component);
        function getFragment(fragmentName, route, variables) {
          var fragmentBuilder = fragments[fragmentName];
          !fragmentBuilder ? true ? invariant(false, 'RelayContainer: Expected `%s` to have a query fragment named `%s`.', containerName, fragmentName) : invariant(false) : undefined;
          var fragment = buildContainerFragment(containerName, fragmentName, fragmentBuilder, initialVariables);
          var metaRoute = RelayMetaRoute.get(route.name);
          if (prepareVariables) {
            variables = prepareVariables(variables, metaRoute);
          }
          return RelayQuery.Fragment.create(fragment, metaRoute, variables);
        }
        initializeProfiler(RelayContainer);
        RelayContainer.contextTypes = containerContextTypes;
        RelayContainer.displayName = containerName;
        RelayContainerProxy.proxyMethods(RelayContainer, Component);
        return RelayContainer;
      }
      function getVariablesWithPropOverrides(spec, props, variables) {
        var initialVariables = spec.initialVariables;
        if (initialVariables) {
          var mergedVariables;
          for (var key in initialVariables) {
            if (key in props) {
              mergedVariables = mergedVariables || _extends({}, variables);
              mergedVariables[key] = props[key];
            }
          }
          variables = mergedVariables || variables;
        }
        return variables;
      }
      function resetPropOverridesForVariables(spec, props, variables) {
        var initialVariables = spec.initialVariables;
        for (var key in initialVariables) {
          if (key in props && props[key] != variables[key]) {
            return initialVariables;
          }
        }
        return variables;
      }
      function getSubscriptionKey(dataID, fragmentID) {
        return dataID + '.' + fragmentID;
      }
      function initializeProfiler(RelayContainer) {
        RelayProfiler.instrumentMethods(RelayContainer.prototype, {
          componentWillMount: 'RelayContainer.prototype.componentWillMount',
          componentWillReceiveProps: 'RelayContainer.prototype.componentWillReceiveProps',
          shouldComponentUpdate: 'RelayContainer.prototype.shouldComponentUpdate'
        });
      }
      function mergeVariables(currentVariables, partialVariables) {
        if (partialVariables) {
          for (var key in partialVariables) {
            if (currentVariables[key] !== partialVariables[key]) {
              return _extends({}, currentVariables, partialVariables);
            }
          }
        }
        return currentVariables;
      }
      function buildContainerFragment(containerName, fragmentName, fragmentBuilder, variables) {
        var fragment = buildRQL.Fragment(fragmentBuilder, variables);
        !fragment ? true ? invariant(false, 'Relay.QL defined on container `%s` named `%s` is not a valid fragment. ' + 'A typical fragment is defined using: Relay.QL`fragment on Type {...}`', containerName, fragmentName) : invariant(false) : undefined;
        return fragment;
      }
      function getDeferredFragment(fragmentReference, context, variables) {
        var route = RelayMetaRoute.get(context.route.name);
        var concreteFragment = fragmentReference.getFragment(variables);
        var concreteVariables = fragmentReference.getVariables(route, variables);
        return RelayQuery.Fragment.create(concreteFragment, route, concreteVariables, {
          isDeferred: true,
          isContainerFragment: fragmentReference.isContainerFragment(),
          isTypeConditional: fragmentReference.isTypeConditional()
        });
      }
      function create(Component, maybeSpec) {
        var spec = RelayDeprecated.upgradeContainerSpec(maybeSpec);
        var componentName = Component.displayName || Component.name;
        var containerName = 'Relay(' + componentName + ')';
        var containerID = (nextContainerID++).toString(36);
        var fragments = spec.fragments;
        !(typeof fragments === 'object' && fragments) ? true ? invariant(false, 'Relay.createContainer(%s, ...): Missing `fragments`, which is expected ' + 'to be an object mapping from `propName` to: () => Relay.QL`...`', componentName) : invariant(false) : undefined;
        var fragmentNames = _Object$keys(fragments);
        var initialVariables = spec.initialVariables || {};
        var prepareVariables = spec.prepareVariables;
        var Container;
        function ContainerConstructor(props, context) {
          if (!Container) {
            Container = createContainerComponent(Component, spec, containerID);
          }
          return new Container(props, context);
        }
        ContainerConstructor.getFragmentNames = function() {
          return fragmentNames;
        };
        ContainerConstructor.hasFragment = function(fragmentName) {
          return !!fragments[fragmentName];
        };
        ContainerConstructor.hasVariable = function(variableName) {
          return Object.prototype.hasOwnProperty.call(initialVariables, variableName);
        };
        ContainerConstructor.getFragment = function(fragmentName, variableMapping) {
          var fragmentBuilder = fragments[fragmentName];
          if (!fragmentBuilder) {
            true ? true ? invariant(false, '%s.getFragment(): `%s` is not a valid fragment name. Available ' + 'fragments names: %s', containerName, fragmentName, fragmentNames.map(function(name) {
              return '`' + name + '`';
            }).join(', ')) : invariant(false) : undefined;
          }
          !(typeof fragmentBuilder === 'function') ? true ? invariant(false, 'RelayContainer: Expected `%s.fragments.%s` to be a function returning ' + 'a fragment. Example: `%s: () => Relay.QL`fragment on ...`', containerName, fragmentName, fragmentName) : invariant(false) : undefined;
          return RelayFragmentReference.createForContainer(function() {
            return buildContainerFragment(containerName, fragmentName, fragmentBuilder, initialVariables);
          }, initialVariables, variableMapping, prepareVariables);
        };
        ContainerConstructor.getQuery = function() {
          true ? true ? invariant(false, 'RelayContainer: `%s.getQuery` no longer exists; use `%s.getFragment`.', componentName, componentName) : invariant(false) : undefined;
        };
        ContainerConstructor.contextTypes = containerContextTypes;
        ContainerConstructor.displayName = containerName;
        ContainerConstructor.moduleName = null;
        return ContainerConstructor;
      }
      module.exports = {create: create};
    }, function(module, exports) {
      'use strict';
      function compareObjects(isEqual, objectA, objectB, filter) {
        var key;
        for (key in objectA) {
          if (filter && !filter.hasOwnProperty(key)) {
            continue;
          }
          if (objectA.hasOwnProperty(key) && (!objectB.hasOwnProperty(key) || !isEqual(objectA[key], objectB[key], key))) {
            return false;
          }
        }
        for (key in objectB) {
          if (filter && !filter.hasOwnProperty(key)) {
            continue;
          }
          if (objectB.hasOwnProperty(key) && !objectA.hasOwnProperty(key)) {
            return false;
          }
        }
        return true;
      }
      function isScalarAndEqual(valueA, valueB) {
        return valueA === valueB && (valueA === null || typeof valueA !== 'object');
      }
      function isQueryDataEqual(fragmentPointers, currProp, nextProp, propName) {
        return (fragmentPointers[propName] && currProp === nextProp || isScalarAndEqual(currProp, nextProp));
      }
      function isNonQueryPropEqual(fragments, currProp, nextProp, propName) {
        return (fragments.hasOwnProperty(propName) || isScalarAndEqual(currProp, nextProp));
      }
      var RelayContainerComparators = {
        areQueryResultsEqual: function areQueryResultsEqual(fragmentPointers, prevQueryData, nextQueryData) {
          return compareObjects(isQueryDataEqual.bind(null, fragmentPointers), prevQueryData, nextQueryData);
        },
        areNonQueryPropsEqual: function areNonQueryPropsEqual(fragments, props, nextProps) {
          return compareObjects(isNonQueryPropEqual.bind(null, fragments), props, nextProps);
        },
        areQueryVariablesEqual: function areQueryVariablesEqual(variables, nextVariables) {
          return compareObjects(isScalarAndEqual, variables, nextVariables);
        }
      };
      module.exports = RelayContainerComparators;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(143);
    }, function(module, exports, __webpack_require__) {
      (function(global) {
        'use strict';
        var _classCallCheck = __webpack_require__(1)['default'];
        var _extends = __webpack_require__(8)['default'];
        var Promise = __webpack_require__(16);
        'use strict';
        var fetch = __webpack_require__(109);
        var fetchWithRetries = __webpack_require__(223);
        var RelayDefaultNetworkLayer = (function() {
          function RelayDefaultNetworkLayer(uri, init) {
            _classCallCheck(this, RelayDefaultNetworkLayer);
            this._uri = uri;
            this._init = _extends({}, init);
            var self = this;
            self.sendMutation = this.sendMutation.bind(this);
            self.sendQueries = this.sendQueries.bind(this);
            self.supports = this.supports.bind(this);
          }
          RelayDefaultNetworkLayer.prototype.sendMutation = function sendMutation(request) {
            return this._sendMutation(request).then(function(result) {
              return result.json();
            }).then(function(payload) {
              if (payload.hasOwnProperty('errors')) {
                var error = new Error('Server request for mutation `' + request.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + formatRequestErrors(request, payload.errors));
                error.source = payload;
                request.reject(error);
              } else {
                request.resolve({response: payload.data});
              }
            })['catch'](function(error) {
              return request.reject(error);
            });
          };
          RelayDefaultNetworkLayer.prototype.sendQueries = function sendQueries(requests) {
            var _this = this;
            return Promise.all(requests.map(function(request) {
              return _this._sendQuery(request).then(function(result) {
                return result.json();
              }).then(function(payload) {
                if (payload.hasOwnProperty('errors')) {
                  var error = new Error('Server request for query `' + request.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + formatRequestErrors(request, payload.errors));
                  error.source = payload;
                  request.reject(error);
                } else if (!payload.hasOwnProperty('data')) {
                  request.reject(new Error('Server response was missing for query `' + request.getDebugName() + '`.'));
                } else {
                  request.resolve({response: payload.data});
                }
              })['catch'](function(error) {
                return request.reject(error);
              });
            }));
          };
          RelayDefaultNetworkLayer.prototype.supports = function supports() {
            return false;
          };
          RelayDefaultNetworkLayer.prototype._sendMutation = function _sendMutation(request) {
            var init;
            var files = request.getFiles();
            if (files) {
              if (!global.FormData) {
                throw new Error('Uploading files without `FormData` not supported.');
              }
              var formData = new FormData();
              formData.append('query', request.getQueryString());
              formData.append('variables', JSON.stringify(request.getVariables()));
              for (var filename in files) {
                if (files.hasOwnProperty(filename)) {
                  formData.append(filename, files[filename]);
                }
              }
              init = _extends({}, this._init, {
                body: formData,
                method: 'POST'
              });
            } else {
              init = _extends({}, this._init, {
                body: JSON.stringify({
                  query: request.getQueryString(),
                  variables: request.getVariables()
                }),
                headers: _extends({}, this._init.headers, {
                  'Accept': '*/*',
                  'Content-Type': 'application/json'
                }),
                method: 'POST'
              });
            }
            return fetch(this._uri, init).then(throwOnServerError);
          };
          RelayDefaultNetworkLayer.prototype._sendQuery = function _sendQuery(request) {
            return fetchWithRetries(this._uri, _extends({}, this._init, {
              body: JSON.stringify({
                query: request.getQueryString(),
                variables: request.getVariables()
              }),
              headers: _extends({}, this._init.headers, {
                'Accept': '*/*',
                'Content-Type': 'application/json'
              }),
              method: 'POST'
            }));
          };
          return RelayDefaultNetworkLayer;
        })();
        function throwOnServerError(response) {
          if (response.status >= 200 && response.status < 300) {
            return response;
          } else {
            throw response;
          }
        }
        function formatRequestErrors(request, errors) {
          var CONTEXT_BEFORE = 20;
          var CONTEXT_LENGTH = 60;
          var queryLines = request.getQueryString().split('\n');
          return errors.map(function(_ref, ii) {
            var locations = _ref.locations;
            var message = _ref.message;
            var prefix = ii + 1 + '. ';
            var indent = ' '.repeat(prefix.length);
            var locationMessage = locations ? '\n' + locations.map(function(_ref2) {
              var column = _ref2.column;
              var line = _ref2.line;
              var queryLine = queryLines[line - 1];
              var offset = Math.min(column - 1, CONTEXT_BEFORE);
              return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), ' '.repeat(offset) + '^^^'].map(function(messageLine) {
                return indent + messageLine;
              }).join('\n');
            }).join('\n') : '';
            return prefix + message + locationMessage;
          }).join('\n');
        }
        module.exports = RelayDefaultNetworkLayer;
      }.call(exports, (function() {
        return this;
      }())));
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var RelayNetworkLayer = __webpack_require__(25);
      var RelayStoreData = __webpack_require__(38);
      var flattenRelayQuery = __webpack_require__(53);
      var printRelayQuery = __webpack_require__(56);
      var RelayInternals = {
        NetworkLayer: RelayNetworkLayer,
        DefaultStoreData: RelayStoreData.getDefaultInstance(),
        flattenRelayQuery: flattenRelayQuery,
        printRelayQuery: printRelayQuery
      };
      module.exports = RelayInternals;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayFragmentReference = __webpack_require__(34);
      var RelayStore = __webpack_require__(37);
      var buildRQL = __webpack_require__(51);
      var forEachObject = __webpack_require__(9);
      var fromGraphQL = __webpack_require__(86);
      var invariant = __webpack_require__(2);
      var warning = __webpack_require__(11);
      var RelayMutation = (function() {
        function RelayMutation(props) {
          _classCallCheck(this, RelayMutation);
          this._didShowFakeDataWarning = false;
          this._resolveProps(props);
        }
        RelayMutation.prototype.getMutation = function getMutation() {
          true ? true ? invariant(false, '%s: Expected abstract method `getMutation` to be implemented.', this.constructor.name) : invariant(false) : undefined;
        };
        RelayMutation.prototype.getFatQuery = function getFatQuery() {
          true ? true ? invariant(false, '%s: Expected abstract method `getFatQuery` to be implemented.', this.constructor.name) : invariant(false) : undefined;
        };
        RelayMutation.prototype.getConfigs = function getConfigs() {
          true ? true ? invariant(false, '%s: Expected abstract method `getConfigs` to be implemented.', this.constructor.name) : invariant(false) : undefined;
        };
        RelayMutation.prototype.getVariables = function getVariables() {
          true ? true ? invariant(false, '%s: Expected abstract method `getVariables` to be implemented.', this.constructor.name) : invariant(false) : undefined;
        };
        RelayMutation.prototype.getFiles = function getFiles() {
          return null;
        };
        RelayMutation.prototype.getOptimisticResponse = function getOptimisticResponse() {
          return null;
        };
        RelayMutation.prototype.getOptimisticConfigs = function getOptimisticConfigs() {
          return null;
        };
        RelayMutation.prototype.getCollisionKey = function getCollisionKey() {
          return null;
        };
        RelayMutation.prototype._resolveProps = function _resolveProps(props) {
          var _this = this;
          var fragments = this.constructor.fragments;
          var initialVariables = this.constructor.initialVariables || {};
          var resolvedProps = _extends({}, props);
          forEachObject(fragments, function(fragmentBuilder, fragmentName) {
            var propValue = props[fragmentName];
            true ? warning(propValue !== undefined, 'RelayMutation: Expected data for fragment `%s` to be supplied to ' + '`%s` as a prop. Pass an explicit `null` if this is intentional.', fragmentName, _this.constructor.name) : undefined;
            if (!propValue) {
              return;
            }
            var fragment = fromGraphQL.Fragment(buildMutationFragment(_this.constructor.name, fragmentName, fragmentBuilder, initialVariables));
            var concreteFragmentID = fragment.getConcreteFragmentID();
            if (fragment.isPlural()) {
              !Array.isArray(propValue) ? true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, expected an ' + 'array of records because the corresponding fragment is plural.', fragmentName, _this.constructor.name) : invariant(false) : undefined;
              var dataIDs = propValue.reduce(function(acc, item, ii) {
                var eachFragmentPointer = item[concreteFragmentID];
                !eachFragmentPointer ? true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, ' + 'expected element at index %s to have query data.', fragmentName, _this.constructor.name, ii) : invariant(false) : undefined;
                return acc.concat(eachFragmentPointer.getDataIDs());
              }, []);
              resolvedProps[fragmentName] = RelayStore.readAll(fragment, dataIDs);
            } else {
              !!Array.isArray(propValue) ? true ? invariant(false, 'RelayMutation: Invalid prop `%s` supplied to `%s`, expected a ' + 'single record because the corresponding fragment is not plural.', fragmentName, _this.constructor.name) : invariant(false) : undefined;
              var fragmentPointer = propValue[concreteFragmentID];
              if (fragmentPointer) {
                var dataID = fragmentPointer.getDataID();
                resolvedProps[fragmentName] = RelayStore.read(fragment, dataID);
              } else {
                if (true) {
                  if (!_this._didShowFakeDataWarning) {
                    _this._didShowFakeDataWarning = true;
                    true ? warning(false, 'RelayMutation: Expected prop `%s` supplied to `%s` to ' + 'be data fetched by Relay. This is likely an error unless ' + 'you are purposely passing in mock data that conforms to ' + 'the shape of this mutation\'s fragment.', fragmentName, _this.constructor.name) : undefined;
                  }
                }
              }
            }
          });
          this.props = resolvedProps;
        };
        RelayMutation.getFragment = function getFragment(fragmentName, variableMapping) {
          var _this2 = this;
          var fragments = this.fragments;
          var fragmentBuilder = fragments[fragmentName];
          if (!fragmentBuilder) {
            true ? true ? invariant(false, '%s.getFragment(): `%s` is not a valid fragment name. Available ' + 'fragments names: %s', this.name, fragmentName, _Object$keys(fragments).map(function(name) {
              return '`' + name + '`';
            }).join(', ')) : invariant(false) : undefined;
          }
          var initialVariables = this.initialVariables || {};
          var prepareVariables = this.prepareVariables;
          return RelayFragmentReference.createForContainer(function() {
            return buildMutationFragment(_this2.name, fragmentName, fragmentBuilder, initialVariables);
          }, initialVariables, variableMapping, prepareVariables);
        };
        RelayMutation.getQuery = function getQuery() {
          true ? true ? invariant(false, 'RelayMutation: `%s.getQuery` no longer exists; use `%s.getFragment`.', this.name, this.name) : invariant(false) : undefined;
        };
        return RelayMutation;
      })();
      function buildMutationFragment(mutationName, fragmentName, fragmentBuilder, variables) {
        var fragment = buildRQL.Fragment(fragmentBuilder, variables);
        !fragment ? true ? invariant(false, 'Relay.QL defined on mutation `%s` named `%s` is not a valid fragment. ' + 'A typical fragment is defined using: Relay.QL`fragment on Type {...}`', mutationName, fragmentName) : invariant(false) : undefined;
        return fragment;
      }
      module.exports = RelayMutation;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _toConsumableArray = __webpack_require__(23)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayMetaRoute = __webpack_require__(22);
      var RelayMutationType = __webpack_require__(83);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQuery = __webpack_require__(3);
      var flattenRelayQuery = __webpack_require__(53);
      var forEachObject = __webpack_require__(9);
      var nullthrows = __webpack_require__(71);
      var inferRelayFieldsFromData = __webpack_require__(170);
      var intersectRelayQuery = __webpack_require__(171);
      var invariant = __webpack_require__(2);
      var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
      var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
      var ID = RelayNodeInterface.ID;
      var TYPENAME = RelayNodeInterface.TYPENAME;
      var RelayMutationQuery = {
        buildFragmentForFields: function buildFragmentForFields(_ref) {
          var fatQuery = _ref.fatQuery;
          var fieldIDs = _ref.fieldIDs;
          var tracker = _ref.tracker;
          var mutatedFields = [];
          forEachObject(fieldIDs, function(dataIDOrIDs, fieldName) {
            var fatField = getFieldFromFatQuery(fatQuery, fieldName);
            var dataIDs = [].concat(dataIDOrIDs);
            var trackedChildren = [];
            dataIDs.forEach(function(dataID) {
              trackedChildren.push.apply(trackedChildren, _toConsumableArray(tracker.getTrackedChildrenForID(dataID)));
            });
            var trackedField = fatField.clone(trackedChildren);
            if (trackedField) {
              var mutationField = intersectRelayQuery(trackedField, fatField);
              if (mutationField) {
                mutatedFields.push(mutationField);
              }
            }
          });
          return buildMutationFragment(fatQuery, mutatedFields);
        },
        buildFragmentForEdgeDeletion: function buildFragmentForEdgeDeletion(_ref2) {
          var fatQuery = _ref2.fatQuery;
          var connectionName = _ref2.connectionName;
          var parentID = _ref2.parentID;
          var parentName = _ref2.parentName;
          var tracker = _ref2.tracker;
          var fatParent = getFieldFromFatQuery(fatQuery, parentName);
          var mutatedFields = [];
          var trackedParent = fatParent.clone(tracker.getTrackedChildrenForID(parentID));
          if (trackedParent) {
            var filterUnterminatedRange = function filterUnterminatedRange(node) {
              return node.getSchemaName() === connectionName;
            };
            var mutatedField = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
            if (mutatedField) {
              mutatedFields.push(mutatedField);
            }
          }
          return buildMutationFragment(fatQuery, mutatedFields);
        },
        buildFragmentForEdgeInsertion: function buildFragmentForEdgeInsertion(_ref3) {
          var fatQuery = _ref3.fatQuery;
          var connectionName = _ref3.connectionName;
          var parentID = _ref3.parentID;
          var edgeName = _ref3.edgeName;
          var parentName = _ref3.parentName;
          var rangeBehaviors = _ref3.rangeBehaviors;
          var tracker = _ref3.tracker;
          var trackedChildren = tracker.getTrackedChildrenForID(parentID);
          var mutatedFields = [];
          var trackedConnections = [];
          trackedChildren.forEach(function(trackedChild) {
            trackedConnections.push.apply(trackedConnections, _toConsumableArray(findDescendantFields(trackedChild, connectionName)));
          });
          if (trackedConnections.length) {
            var keysWithoutRangeBehavior = {};
            var mutatedEdgeFields = [];
            trackedConnections.forEach(function(trackedConnection) {
              var trackedEdges = findDescendantFields(trackedConnection, 'edges');
              if (!trackedEdges.length) {
                return;
              }
              if (trackedConnection.getRangeBehaviorKey() in rangeBehaviors) {
                trackedEdges.forEach(function(trackedEdge) {
                  mutatedEdgeFields.push.apply(mutatedEdgeFields, _toConsumableArray(trackedEdge.getChildren()));
                });
              } else {
                var key = trackedConnection.getSerializationKey();
                keysWithoutRangeBehavior[key] = true;
              }
            });
            if (mutatedEdgeFields.length) {
              mutatedFields.push(buildEdgeField(parentID, edgeName, mutatedEdgeFields));
            }
            if (parentName != null) {
              var fatParent = getFieldFromFatQuery(fatQuery, parentName);
              var trackedParent = fatParent.clone(trackedChildren);
              if (trackedParent) {
                var filterUnterminatedRange = function filterUnterminatedRange(node) {
                  return !keysWithoutRangeBehavior.hasOwnProperty(node.getSerializationKey());
                };
                var mutatedParent = intersectRelayQuery(trackedParent, fatParent, filterUnterminatedRange);
                if (mutatedParent) {
                  mutatedFields.push(mutatedParent);
                }
              }
            }
          }
          return buildMutationFragment(fatQuery, mutatedFields);
        },
        buildFragmentForOptimisticUpdate: function buildFragmentForOptimisticUpdate(_ref4) {
          var response = _ref4.response;
          var fatQuery = _ref4.fatQuery;
          var mutatedFields = inferRelayFieldsFromData(response);
          return buildMutationFragment(fatQuery, mutatedFields);
        },
        buildQueryForOptimisticUpdate: function buildQueryForOptimisticUpdate(_ref5) {
          var fatQuery = _ref5.fatQuery;
          var mutation = _ref5.mutation;
          var response = _ref5.response;
          var tracker = _ref5.tracker;
          var children = [nullthrows(RelayMutationQuery.buildFragmentForOptimisticUpdate({
            response: response,
            fatQuery: fatQuery,
            tracker: tracker
          }))];
          return RelayQuery.Mutation.build('OptimisticQuery', fatQuery.getType(), mutation.calls[0].name, null, children, mutation.metadata);
        },
        buildQuery: function buildQuery(_ref6) {
          var configs = _ref6.configs;
          var fatQuery = _ref6.fatQuery;
          var input = _ref6.input;
          var mutationName = _ref6.mutationName;
          var mutation = _ref6.mutation;
          var tracker = _ref6.tracker;
          return (function() {
            var children = [RelayQuery.Field.build({
              fieldName: CLIENT_MUTATION_ID,
              type: 'String',
              metadata: {isRequisite: true}
            })];
            configs.forEach(function(config) {
              switch (config.type) {
                case RelayMutationType.REQUIRED_CHILDREN:
                  children = children.concat(config.children.map(function(child) {
                    return RelayQuery.Fragment.create(child, RelayMetaRoute.get('$buildQuery'), {});
                  }));
                  break;
                case RelayMutationType.RANGE_ADD:
                  children.push(RelayMutationQuery.buildFragmentForEdgeInsertion({
                    connectionName: config.connectionName,
                    edgeName: config.edgeName,
                    fatQuery: fatQuery,
                    parentID: config.parentID,
                    parentName: config.parentName,
                    rangeBehaviors: sanitizeRangeBehaviors(config.rangeBehaviors),
                    tracker: tracker
                  }));
                  break;
                case RelayMutationType.RANGE_DELETE:
                case RelayMutationType.NODE_DELETE:
                  children.push(RelayMutationQuery.buildFragmentForEdgeDeletion({
                    connectionName: config.connectionName,
                    fatQuery: fatQuery,
                    parentID: config.parentID,
                    parentName: config.parentName,
                    tracker: tracker
                  }));
                  children.push(RelayQuery.Field.build({
                    fieldName: config.deletedIDFieldName,
                    type: 'String'
                  }));
                  break;
                case RelayMutationType.FIELDS_CHANGE:
                  children.push(RelayMutationQuery.buildFragmentForFields({
                    fatQuery: fatQuery,
                    fieldIDs: config.fieldIDs,
                    tracker: tracker
                  }));
                  break;
              }
            });
            return RelayQuery.Mutation.build(mutationName, fatQuery.getType(), mutation.calls[0].name, input, children.filter(function(child) {
              return child != null;
            }), mutation.metadata);
          })();
        }
      };
      function getFieldFromFatQuery(fatQuery, fieldName) {
        var field = fatQuery.getFieldByStorageKey(fieldName);
        !field ? true ? invariant(false, 'RelayMutationQuery: Invalid field name on fat query, `%s`.', fieldName) : invariant(false) : undefined;
        return field;
      }
      function buildMutationFragment(fatQuery, fields) {
        var fragment = RelayQuery.Fragment.build('MutationQuery', fatQuery.getType(), fields);
        if (fragment) {
          !(fragment instanceof RelayQuery.Fragment) ? true ? invariant(false, 'RelayMutationQuery: Expected a fragment.') : invariant(false) : undefined;
          return fragment;
        }
        return null;
      }
      function buildEdgeField(parentID, edgeName, edgeFields) {
        var fields = [RelayQuery.Field.build({
          fieldName: 'cursor',
          type: 'String'
        })];
        if (RelayConnectionInterface.EDGES_HAVE_SOURCE_FIELD && !GraphQLStoreDataHandler.isClientID(parentID)) {
          fields.push(RelayQuery.Field.build({
            fieldName: 'source',
            type: ANY_TYPE,
            children: [RelayQuery.Field.build({
              fieldName: ID,
              type: 'String'
            }), RelayQuery.Field.build({
              fieldName: TYPENAME,
              type: 'String'
            })]
          }));
        }
        fields.push.apply(fields, edgeFields);
        var edgeField = flattenRelayQuery(RelayQuery.Field.build({
          fieldName: edgeName,
          type: ANY_TYPE,
          children: fields
        }));
        !(edgeField instanceof RelayQuery.Field) ? true ? invariant(false, 'RelayMutationQuery: Expected a field.') : invariant(false) : undefined;
        return edgeField;
      }
      function sanitizeRangeBehaviors(rangeBehaviors) {
        var unsortedKeys = undefined;
        forEachObject(rangeBehaviors, function(value, key) {
          if (key !== '') {
            var keyParts = key.slice(0, -1).split(/\)\./);
            var sortedKey = keyParts.sort().join(').') + (keyParts.length ? ')' : '');
            if (sortedKey !== key) {
              unsortedKeys = unsortedKeys || [];
              unsortedKeys.push(key);
            }
          }
        });
        if (unsortedKeys) {
          true ? true ? invariant(false, 'RelayMutation: To define a range behavior key without sorting ' + 'the arguments alphabetically is disallowed as of Relay 0.5.1. Please ' + 'sort the argument names of the range behavior key%s `%s`%s.', unsortedKeys.length === 1 ? '' : 's', unsortedKeys.length === 1 ? unsortedKeys[0] : unsortedKeys.length === 2 ? unsortedKeys[0] + '` and `' + unsortedKeys[1] : unsortedKeys.slice(0, -1).join('`, `'), unsortedKeys.length > 2 ? ', and `' + unsortedKeys.slice(-1) + '`' : '') : invariant(false) : undefined;
        }
        return rangeBehaviors;
      }
      function findDescendantFields(rootNode, fieldName) {
        var fields = [];
        function traverse(node) {
          if (node instanceof RelayQuery.Field) {
            if (node.getSchemaName() === fieldName) {
              fields.push(node);
              return;
            }
          }
          if (node === rootNode || node instanceof RelayQuery.Fragment) {
            node.getChildren().forEach(function(child) {
              return traverse(child);
            });
          }
        }
        traverse(rootNode);
        return fields;
      }
      module.exports = RelayMutationQuery;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _defineProperty = __webpack_require__(58)['default'];
      var ErrorUtils = __webpack_require__(69);
      var QueryBuilder = __webpack_require__(17);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayMutationQuery = __webpack_require__(137);
      var RelayMutationRequest = __webpack_require__(139);
      var RelayMutationTransaction = __webpack_require__(49);
      var RelayMutationTransactionStatus = __webpack_require__(82);
      var RelayNetworkLayer = __webpack_require__(25);
      var flattenRelayQuery = __webpack_require__(53);
      var fromGraphQL = __webpack_require__(86);
      var invariant = __webpack_require__(2);
      var nullthrows = __webpack_require__(71);
      var resolveImmediate = __webpack_require__(29);
      var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
      var transactionIDCounter = 0;
      var RelayMutationQueue = (function() {
        function RelayMutationQueue(storeData) {
          _classCallCheck(this, RelayMutationQueue);
          this._collisionQueueMap = {};
          this._pendingTransactionMap = {};
          this._queue = [];
          this._storeData = storeData;
          this._willBatchRefreshQueuedData = false;
        }
        RelayMutationQueue.prototype.createTransaction = function createTransaction(mutation, callbacks) {
          var id = (transactionIDCounter++).toString(36);
          var mutationTransaction = new RelayMutationTransaction(this, id);
          var transaction = new PendingTransaction({
            id: id,
            mutation: mutation,
            mutationTransaction: mutationTransaction,
            onFailure: callbacks && callbacks.onFailure,
            onSuccess: callbacks && callbacks.onSuccess
          });
          this._pendingTransactionMap[id] = transaction;
          this._queue.push(transaction);
          this._handleOptimisticUpdate(transaction);
          return mutationTransaction;
        };
        RelayMutationQueue.prototype.getTransaction = function getTransaction(id) {
          return this._get(id).mutationTransaction;
        };
        RelayMutationQueue.prototype.getError = function getError(id) {
          return this._get(id).error;
        };
        RelayMutationQueue.prototype.getStatus = function getStatus(id) {
          return this._get(id).status;
        };
        RelayMutationQueue.prototype.commit = function commit(id) {
          var transaction = this._get(id);
          var collisionKey = transaction.getCollisionKey();
          var collisionQueue = collisionKey && this._collisionQueueMap[collisionKey];
          if (collisionQueue) {
            collisionQueue.push(transaction);
            transaction.status = RelayMutationTransactionStatus.COMMIT_QUEUED;
            transaction.error = null;
            return;
          }
          if (collisionKey) {
            this._collisionQueueMap[collisionKey] = [transaction];
          }
          this._handleCommit(transaction);
        };
        RelayMutationQueue.prototype.rollback = function rollback(id) {
          var transaction = this._get(id);
          this._handleRollback(transaction);
        };
        RelayMutationQueue.prototype._get = function _get(id) {
          var transaction = this._pendingTransactionMap[id];
          !transaction ? true ? invariant(false, 'RelayMutationQueue: `%s` is not a valid pending transaction ID.', id) : invariant(false) : undefined;
          return transaction;
        };
        RelayMutationQueue.prototype._handleOptimisticUpdate = function _handleOptimisticUpdate(transaction) {
          var optimisticResponse = transaction.getOptimisticResponse();
          var optimisticQuery = transaction.getOptimisticQuery(this._storeData);
          if (optimisticResponse && optimisticQuery) {
            var configs = transaction.getOptimisticConfigs() || transaction.getConfigs();
            this._storeData.handleUpdatePayload(optimisticQuery, optimisticResponse, {
              configs: configs,
              isOptimisticUpdate: true
            });
          }
        };
        RelayMutationQueue.prototype._handleCommitFailure = function _handleCommitFailure(transaction, error) {
          var status = error ? RelayMutationTransactionStatus.COMMIT_FAILED : RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED;
          transaction.status = status;
          transaction.error = error;
          var shouldRollback = true;
          var onFailure = transaction.onFailure;
          if (onFailure) {
            var preventAutoRollback = function preventAutoRollback() {
              shouldRollback = false;
            };
            ErrorUtils.applyWithGuard(onFailure, null, [transaction.mutationTransaction, preventAutoRollback], null, 'RelayMutationTransaction:onCommitFailure');
          }
          if (error) {
            this._failCollisionQueue(transaction);
          }
          if (shouldRollback && this._pendingTransactionMap.hasOwnProperty(transaction.id)) {
            this._handleRollback(transaction);
          }
          this._batchRefreshQueuedData();
        };
        RelayMutationQueue.prototype._handleCommitSuccess = function _handleCommitSuccess(transaction, response) {
          this._advanceCollisionQueue(transaction);
          this._clearPendingTransaction(transaction);
          this._refreshQueuedData();
          this._storeData.handleUpdatePayload(transaction.getQuery(this._storeData), response[transaction.getCallName()], {
            configs: transaction.getConfigs(),
            isOptimisticUpdate: false
          });
          var onSuccess = transaction.onSuccess;
          if (onSuccess) {
            ErrorUtils.applyWithGuard(onSuccess, null, [response], null, 'RelayMutationTransaction:onCommitSuccess');
          }
        };
        RelayMutationQueue.prototype._handleCommit = function _handleCommit(transaction) {
          var _this = this;
          transaction.status = RelayMutationTransactionStatus.COMMITTING;
          transaction.error = null;
          var request = new RelayMutationRequest(transaction.getQuery(this._storeData), transaction.getFiles());
          RelayNetworkLayer.sendMutation(request);
          request.getPromise().done(function(result) {
            return _this._handleCommitSuccess(transaction, result.response);
          }, function(error) {
            return _this._handleCommitFailure(transaction, error);
          });
        };
        RelayMutationQueue.prototype._handleRollback = function _handleRollback(transaction) {
          this._clearPendingTransaction(transaction);
          this._batchRefreshQueuedData();
        };
        RelayMutationQueue.prototype._clearPendingTransaction = function _clearPendingTransaction(transaction) {
          delete this._pendingTransactionMap[transaction.id];
          this._queue = this._queue.filter(function(tx) {
            return tx !== transaction;
          });
        };
        RelayMutationQueue.prototype._advanceCollisionQueue = function _advanceCollisionQueue(transaction) {
          var collisionKey = transaction.getCollisionKey();
          if (collisionKey) {
            var collisionQueue = nullthrows(this._collisionQueueMap[collisionKey]);
            collisionQueue.shift();
            if (collisionQueue.length) {
              this._handleCommit(collisionQueue[0]);
            } else {
              delete this._collisionQueueMap[collisionKey];
            }
          }
        };
        RelayMutationQueue.prototype._failCollisionQueue = function _failCollisionQueue(transaction) {
          var _this2 = this;
          var collisionKey = transaction.getCollisionKey();
          if (collisionKey) {
            var collisionQueue = nullthrows(this._collisionQueueMap[collisionKey]);
            collisionQueue.shift();
            collisionQueue.forEach(function(transaction) {
              return _this2._handleCommitFailure(transaction, null);
            });
            delete this._collisionQueueMap[collisionKey];
          }
        };
        RelayMutationQueue.prototype._batchRefreshQueuedData = function _batchRefreshQueuedData() {
          var _this3 = this;
          if (!this._willBatchRefreshQueuedData) {
            this._willBatchRefreshQueuedData = true;
            resolveImmediate(function() {
              _this3._willBatchRefreshQueuedData = false;
              _this3._refreshQueuedData();
            });
          }
        };
        RelayMutationQueue.prototype._refreshQueuedData = function _refreshQueuedData() {
          var _this4 = this;
          this._storeData.clearQueuedData();
          this._queue.forEach(function(transaction) {
            return _this4._handleOptimisticUpdate(transaction);
          });
        };
        return RelayMutationQueue;
      })();
      var PendingTransaction = (function() {
        function PendingTransaction(transactionData) {
          _classCallCheck(this, PendingTransaction);
          this.error = null;
          this.id = transactionData.id;
          this.mutation = transactionData.mutation;
          this.mutationTransaction = transactionData.mutationTransaction;
          this.onFailure = transactionData.onFailure;
          this.onSuccess = transactionData.onSuccess;
          this.status = RelayMutationTransactionStatus.UNCOMMITTED;
        }
        PendingTransaction.prototype.getCallName = function getCallName() {
          if (!this._callName) {
            this._callName = this.getMutationNode().calls[0].name;
          }
          return this._callName;
        };
        PendingTransaction.prototype.getCollisionKey = function getCollisionKey() {
          if (this._collisionKey === undefined) {
            this._collisionKey = this.mutation.getCollisionKey() || null;
          }
          return this._collisionKey;
        };
        PendingTransaction.prototype.getConfigs = function getConfigs() {
          if (!this._configs) {
            this._configs = this.mutation.getConfigs();
          }
          return this._configs;
        };
        PendingTransaction.prototype.getFatQuery = function getFatQuery() {
          if (!this._fatQuery) {
            this._fatQuery = nullthrows(flattenRelayQuery(fromGraphQL.Fragment(this.mutation.getFatQuery()), {shouldRemoveFragments: true}));
          }
          return this._fatQuery;
        };
        PendingTransaction.prototype.getFiles = function getFiles() {
          if (this._files === undefined) {
            this._files = this.mutation.getFiles() || null;
          }
          return this._files;
        };
        PendingTransaction.prototype.getInputVariable = function getInputVariable() {
          if (!this._inputVariable) {
            var inputVariable = _extends({}, this.mutation.getVariables(), _defineProperty({}, CLIENT_MUTATION_ID, this.id));
            this._inputVariable = inputVariable;
          }
          return this._inputVariable;
        };
        PendingTransaction.prototype.getMutationNode = function getMutationNode() {
          if (!this._mutationNode) {
            var mutationNode = QueryBuilder.getMutation(this.mutation.getMutation());
            !mutationNode ? true ? invariant(false, 'RelayMutation: Expected `getMutation` to return a mutation created ' + 'with Relay.QL`mutation { ... }`.') : invariant(false) : undefined;
            this._mutationNode = mutationNode;
          }
          return this._mutationNode;
        };
        PendingTransaction.prototype.getOptimisticConfigs = function getOptimisticConfigs() {
          if (this._optimisticConfigs === undefined) {
            this._optimisticConfigs = this.mutation.getOptimisticConfigs() || null;
          }
          return this._optimisticConfigs;
        };
        PendingTransaction.prototype.getOptimisticQuery = function getOptimisticQuery(storeData) {
          if (this._optimisticQuery === undefined) {
            var optimisticResponse = this.getOptimisticResponse();
            if (optimisticResponse) {
              var optimisticConfigs = this.getOptimisticConfigs();
              if (optimisticConfigs) {
                this._optimisticQuery = RelayMutationQuery.buildQuery({
                  configs: optimisticConfigs,
                  fatQuery: this.getFatQuery(),
                  input: this.getInputVariable(),
                  mutationName: this.mutation.constructor.name,
                  mutation: this.getMutationNode(),
                  tracker: storeData.getQueryTracker()
                });
              } else {
                this._optimisticQuery = RelayMutationQuery.buildQueryForOptimisticUpdate({
                  response: optimisticResponse,
                  fatQuery: this.getFatQuery(),
                  mutation: this.getMutationNode(),
                  tracker: storeData.getQueryTracker()
                });
              }
            } else {
              this._optimisticQuery = null;
            }
          }
          return this._optimisticQuery;
        };
        PendingTransaction.prototype.getOptimisticResponse = function getOptimisticResponse() {
          if (this._optimisticResponse === undefined) {
            var optimisticResponse = this.mutation.getOptimisticResponse() || null;
            if (optimisticResponse) {
              optimisticResponse[CLIENT_MUTATION_ID] = this.id;
            }
            this._optimisticResponse = optimisticResponse;
          }
          return this._optimisticResponse;
        };
        PendingTransaction.prototype.getQuery = function getQuery(storeData) {
          if (!this._query) {
            this._query = RelayMutationQuery.buildQuery({
              configs: this.getConfigs(),
              fatQuery: this.getFatQuery(),
              input: this.getInputVariable(),
              mutationName: this.getMutationNode().name,
              mutation: this.getMutationNode(),
              tracker: storeData.getQueryTracker()
            });
          }
          return this._query;
        };
        return PendingTransaction;
      })();
      module.exports = RelayMutationQueue;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var Deferred = __webpack_require__(42);
      var printRelayQuery = __webpack_require__(56);
      var RelayMutationRequest = (function(_Deferred) {
        _inherits(RelayMutationRequest, _Deferred);
        function RelayMutationRequest(mutation, files) {
          _classCallCheck(this, RelayMutationRequest);
          _Deferred.call(this);
          this._mutation = mutation;
          this._printedQuery = null;
          this._files = files;
        }
        RelayMutationRequest.prototype.getDebugName = function getDebugName() {
          return this._mutation.getName();
        };
        RelayMutationRequest.prototype.getFiles = function getFiles() {
          return this._files;
        };
        RelayMutationRequest.prototype.getVariables = function getVariables() {
          var printedQuery = this._printedQuery;
          if (!printedQuery) {
            printedQuery = printRelayQuery(this._mutation);
            this._printedQuery = printedQuery;
          }
          return printedQuery.variables;
        };
        RelayMutationRequest.prototype.getQueryString = function getQueryString() {
          var printedQuery = this._printedQuery;
          if (!printedQuery) {
            printedQuery = printRelayQuery(this._mutation);
            this._printedQuery = printedQuery;
          }
          return printedQuery.text;
        };
        RelayMutationRequest.prototype.getMutation = function getMutation() {
          return this._mutation;
        };
        return RelayMutationRequest;
      })(Deferred);
      module.exports = RelayMutationRequest;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var clientIDToServerIDMap = {};
      var mutationIDToClientNodeIDMap = {};
      var clientMutationIDToErrorNodeID = {};
      var clientNodeIDToErrorMutationID = {};
      var RelayMutationTracker = {
        isClientOnlyID: function isClientOnlyID(dataID) {
          return GraphQLStoreDataHandler.isClientID(dataID) && !clientIDToServerIDMap[dataID];
        },
        updateClientServerIDMap: function updateClientServerIDMap(clientID, serverID) {
          clientIDToServerIDMap[clientID] = serverID;
        },
        getServerIDForClientID: function getServerIDForClientID(clientID) {
          return clientIDToServerIDMap[clientID] || null;
        },
        putClientIDForMutation: function putClientIDForMutation(clientID, clientMutationID) {
          mutationIDToClientNodeIDMap[clientMutationID] = clientID;
          var errorNodeID = RelayMutationTracker.getErrorNodeForMutation(clientMutationID);
          if (errorNodeID) {
            RelayMutationTracker.deleteMutationForErrorNode(errorNodeID);
            RelayMutationTracker.putErrorNodeForMutation(clientID, clientMutationID);
          }
        },
        getClientIDForMutation: function getClientIDForMutation(clientMutationID) {
          return mutationIDToClientNodeIDMap[clientMutationID];
        },
        deleteClientIDForMutation: function deleteClientIDForMutation(clientMutationID) {
          delete mutationIDToClientNodeIDMap[clientMutationID];
        },
        putErrorNodeForMutation: function putErrorNodeForMutation(clientID, clientMutationID) {
          clientNodeIDToErrorMutationID[clientID] = clientMutationID;
          clientMutationIDToErrorNodeID[clientMutationID] = clientID;
        },
        getMutationForErrorNode: function getMutationForErrorNode(clientID) {
          return clientNodeIDToErrorMutationID[clientID];
        },
        getErrorNodeForMutation: function getErrorNodeForMutation(clientMutationID) {
          return clientMutationIDToErrorNodeID[clientMutationID];
        },
        deleteMutationForErrorNode: function deleteMutationForErrorNode(clientID) {
          delete clientNodeIDToErrorMutationID[clientID];
        },
        deleteErrorNodeForMutation: function deleteErrorNodeForMutation(clientMutationID) {
          delete clientMutationIDToErrorNodeID[clientMutationID];
        }
      };
      module.exports = RelayMutationTracker;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var Map = __webpack_require__(43);
      var invariant = __webpack_require__(2);
      var RelayNeglectionStateMap = (function() {
        function RelayNeglectionStateMap() {
          _classCallCheck(this, RelayNeglectionStateMap);
          this._isSorted = true;
          this._map = new Map();
          this._states = [];
        }
        RelayNeglectionStateMap.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
          this._isSorted = false;
          !this._map.has(dataID) ? true ? invariant(false, 'RelayNeglectionStatesMap.decreaseSubscriptionsFor(): Cannot ' + 'decrease subscriptions for unregistered record `%s`.', dataID) : invariant(false) : undefined;
          var data = this._map.get(dataID);
          !(data.subscriptions > 0) ? true ? invariant(false, 'RelayNeglectionStatesMap.decreaseSubscriptionsFor(): Cannot ' + 'decrease subscriptions below 0 for record `%s`.', dataID) : invariant(false) : undefined;
          data.subscriptions--;
          this._map.set(dataID, data);
        };
        RelayNeglectionStateMap.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
          this._isSorted = false;
          if (!this._map.has(dataID)) {
            this._registerWithSubscriptionCount(dataID, 1);
            return;
          }
          var data = this._map.get(dataID);
          data.subscriptions++;
          this._map.set(dataID, data);
        };
        RelayNeglectionStateMap.prototype.register = function register(dataID) {
          this._isSorted = false;
          if (!this._map.has(dataID)) {
            this._registerWithSubscriptionCount(dataID, 0);
          }
        };
        RelayNeglectionStateMap.prototype.remove = function remove(dataID) {
          this._map['delete'](dataID);
        };
        RelayNeglectionStateMap.prototype.size = function size() {
          return this._map.size;
        };
        RelayNeglectionStateMap.prototype.values = function values() {
          this._sort();
          var done = false;
          var ii = 0;
          var states = this._states.slice();
          return {next: function next() {
              if (done || ii === states.length) {
                done = true;
                states = [];
                return {done: done};
              }
              var value = states[ii++];
              return {
                done: done,
                value: value
              };
            }};
        };
        RelayNeglectionStateMap.prototype._registerWithSubscriptionCount = function _registerWithSubscriptionCount(dataID, subscriptions) {
          this._isSorted = false;
          this._map.set(dataID, {
            dataID: dataID,
            collectible: false,
            generations: 0,
            subscriptions: subscriptions
          });
        };
        RelayNeglectionStateMap.prototype._sort = function _sort() {
          var _this = this;
          if (!this._isSorted) {
            this._states = [];
            this._map.forEach(function(state) {
              return state && _this._states.push(state);
            });
            this._states.sort(function(a, b) {
              return a.subscriptions - b.subscriptions;
            });
            this._isSorted = true;
          }
        };
        return RelayNeglectionStateMap;
      })();
      module.exports = RelayNeglectionStateMap;
    }, function(module, exports) {
      'use strict';
      var CONNECTION_CALLS = {
        'after': true,
        'before': true,
        'find': true,
        'first': true,
        'last': true,
        'surrounds': true
      };
      var REQUIRED_RANGE_CALLS = {
        'find': true,
        'first': true,
        'last': true
      };
      var RelayOSSConnectionInterface = {
        CLIENT_MUTATION_ID: 'clientMutationId',
        CURSOR: 'cursor',
        EDGES: 'edges',
        END_CURSOR: 'endCursor',
        HAS_NEXT_PAGE: 'hasNextPage',
        HAS_PREV_PAGE: 'hasPreviousPage',
        NODE: 'node',
        PAGE_INFO: 'pageInfo',
        START_CURSOR: 'startCursor',
        EDGES_HAVE_SOURCE_FIELD: false,
        isConnectionCall: function isConnectionCall(call) {
          return CONNECTION_CALLS.hasOwnProperty(call.name);
        },
        hasRangeCalls: function hasRangeCalls(calls) {
          return calls.some(function(call) {
            return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
          });
        },
        getDefaultPageInfo: function getDefaultPageInfo() {
          var pageInfo = {};
          pageInfo[RelayOSSConnectionInterface.START_CURSOR] = undefined;
          pageInfo[RelayOSSConnectionInterface.END_CURSOR] = undefined;
          pageInfo[RelayOSSConnectionInterface.HAS_NEXT_PAGE] = false;
          pageInfo[RelayOSSConnectionInterface.HAS_PREV_PAGE] = false;
          return pageInfo;
        }
      };
      module.exports = RelayOSSConnectionInterface;
    }, function(module, exports) {
      'use strict';
      var RelayOSSContainerProxy = {proxyMethods: function proxyMethods(RelayContainer, Component) {}};
      module.exports = RelayOSSContainerProxy;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var forEachRootCallArg = __webpack_require__(27);
      var generateClientID = __webpack_require__(54);
      var invariant = __webpack_require__(2);
      var RelayOSSNodeInterface = {
        ANY_TYPE: '__any',
        ID: 'id',
        NODE: 'node',
        NODE_TYPE: 'Node',
        NODES: 'nodes',
        TYPENAME: '__typename',
        isNodeRootCall: function isNodeRootCall(fieldName) {
          return fieldName === RelayOSSNodeInterface.NODE || fieldName === RelayOSSNodeInterface.NODES;
        },
        getResultsFromPayload: function getResultsFromPayload(store, query, payload) {
          var results = [];
          var rootBatchCall = query.getBatchCall();
          if (rootBatchCall) {
            getPayloadRecords(query, payload).forEach(function(result) {
              if (typeof result !== 'object' || !result) {
                return;
              }
              var dataID = result[RelayOSSNodeInterface.ID];
              !(dataID != null) ? true ? invariant(false, 'RelayOSSNodeInterface.getResultsFromPayload(): Unable to write ' + 'result with no `%s` field for query, `%s`.', RelayOSSNodeInterface.ID, query.getName()) : invariant(false) : undefined;
              results.push({
                dataID: dataID,
                result: result
              });
            });
          } else {
            var records;
            var ii;
            (function() {
              records = getPayloadRecords(query, payload);
              ii = 0;
              var storageKey = query.getStorageKey();
              forEachRootCallArg(query, function(identifyingArgValue) {
                var result = records[ii++];
                var dataID = store.getDataID(storageKey, identifyingArgValue);
                if (dataID == null) {
                  var payloadID = typeof result === 'object' && result ? result[RelayOSSNodeInterface.ID] : null;
                  if (payloadID != null) {
                    dataID = payloadID;
                  } else {
                    dataID = generateClientID();
                  }
                  store.putDataID(storageKey, identifyingArgValue, dataID);
                }
                results.push({
                  dataID: dataID,
                  result: result
                });
              });
            })();
          }
          return results;
        }
      };
      function getPayloadRecords(query, payload) {
        var fieldName = query.getFieldName();
        var identifyingArg = query.getIdentifyingArg();
        var identifyingArgValue = identifyingArg && identifyingArg.value || null;
        var records = payload[fieldName];
        if (!query.getBatchCall()) {
          if (Array.isArray(identifyingArgValue)) {
            !Array.isArray(records) ? true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'an array with %s results, instead received a single non-array result.', fieldName, identifyingArgValue.length) : invariant(false) : undefined;
            !(records.length === identifyingArgValue.length) ? true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'an array with %s results, instead received an array with %s results.', fieldName, identifyingArgValue.length, records.length) : invariant(false) : undefined;
          } else if (Array.isArray(records)) {
            true ? true ? invariant(false, 'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 'a single non-array result, instead received an array with %s results.', fieldName, records.length) : invariant(false) : undefined;
          }
        }
        return Array.isArray(records) ? records : [records];
      }
      module.exports = RelayOSSNodeInterface;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var Promise = __webpack_require__(16);
      'use strict';
      var Deferred = __webpack_require__(42);
      var DliteFetchModeConstants = __webpack_require__(79);
      var PromiseMap = __webpack_require__(222);
      var RelayTaskScheduler = __webpack_require__(39);
      var containsRelayQueryRootCall = __webpack_require__(161);
      var everyObject = __webpack_require__(108);
      var fetchRelayQuery = __webpack_require__(164);
      var invariant = __webpack_require__(2);
      var subtractRelayQuery = __webpack_require__(179);
      var RelayPendingQueryTracker = (function() {
        function RelayPendingQueryTracker(storeData) {
          _classCallCheck(this, RelayPendingQueryTracker);
          this._pendingFetchMap = {};
          this._preloadQueryMap = new PromiseMap();
          this._storeData = storeData;
        }
        RelayPendingQueryTracker.prototype.add = function add(params) {
          return new PendingFetch(params, {
            pendingFetchMap: this._pendingFetchMap,
            preloadQueryMap: this._preloadQueryMap,
            storeData: this._storeData
          });
        };
        RelayPendingQueryTracker.prototype.hasPendingQueries = function hasPendingQueries() {
          return hasItems(this._pendingFetchMap);
        };
        RelayPendingQueryTracker.prototype.resetPending = function resetPending() {
          this._pendingFetchMap = {};
        };
        RelayPendingQueryTracker.prototype.resolvePreloadQuery = function resolvePreloadQuery(queryID, result) {
          this._preloadQueryMap.resolveKey(queryID, result);
        };
        RelayPendingQueryTracker.prototype.rejectPreloadQuery = function rejectPreloadQuery(queryID, error) {
          this._preloadQueryMap.rejectKey(queryID, error);
        };
        return RelayPendingQueryTracker;
      })();
      var PendingFetch = (function() {
        function PendingFetch(_ref, _ref2) {
          var fetchMode = _ref.fetchMode;
          var forceIndex = _ref.forceIndex;
          var query = _ref.query;
          var pendingFetchMap = _ref2.pendingFetchMap;
          var preloadQueryMap = _ref2.preloadQueryMap;
          var storeData = _ref2.storeData;
          return (function() {
            _classCallCheck(this, PendingFetch);
            var queryID = query.getID();
            this._dependents = [];
            this._forceIndex = forceIndex;
            this._pendingDependencyMap = {};
            this._pendingFetchMap = pendingFetchMap;
            this._preloadQueryMap = preloadQueryMap;
            this._query = query;
            this._resolvedDeferred = new Deferred();
            this._resolvedSubtractedQuery = false;
            this._storeData = storeData;
            var subtractedQuery;
            if (fetchMode === DliteFetchModeConstants.FETCH_MODE_PRELOAD) {
              subtractedQuery = query;
              this._fetchSubtractedQueryPromise = this._preloadQueryMap.get(queryID);
            } else {
              subtractedQuery = this._subtractPending(query);
              this._fetchSubtractedQueryPromise = subtractedQuery ? fetchRelayQuery(subtractedQuery) : Promise.resolve();
            }
            this._fetchedSubtractedQuery = !subtractedQuery;
            this._errors = [];
            if (subtractedQuery) {
              this._pendingFetchMap[queryID] = {
                fetch: this,
                query: subtractedQuery
              };
              this._fetchSubtractedQueryPromise.done(this._handleSubtractedQuerySuccess.bind(this, subtractedQuery), this._handleSubtractedQueryFailure.bind(this, subtractedQuery));
            } else {
              this._markSubtractedQueryAsResolved();
            }
          }).apply(this, arguments);
        }
        PendingFetch.prototype.isResolvable = function isResolvable() {
          if (this._fetchedSubtractedQuery) {
            return everyObject(this._pendingDependencyMap, function(pendingDependency) {
              return pendingDependency._fetchedSubtractedQuery;
            });
          }
          return false;
        };
        PendingFetch.prototype.getQuery = function getQuery() {
          return this._query;
        };
        PendingFetch.prototype.getResolvedPromise = function getResolvedPromise() {
          return this._resolvedDeferred.getPromise();
        };
        PendingFetch.prototype._subtractPending = function _subtractPending(query) {
          var _this = this;
          everyObject(this._pendingFetchMap, function(pending) {
            if (!query) {
              return false;
            }
            if (containsRelayQueryRootCall(pending.query, query)) {
              var subtractedQuery = subtractRelayQuery(query, pending.query);
              if (subtractedQuery !== query) {
                query = subtractedQuery;
                _this._addPendingDependency(pending.fetch);
              }
            }
            return true;
          });
          return query;
        };
        PendingFetch.prototype._addPendingDependency = function _addPendingDependency(pendingFetch) {
          var queryID = pendingFetch.getQuery().getID();
          this._pendingDependencyMap[queryID] = pendingFetch;
          pendingFetch._addDependent(this);
        };
        PendingFetch.prototype._addDependent = function _addDependent(pendingFetch) {
          this._dependents.push(pendingFetch);
        };
        PendingFetch.prototype._handleSubtractedQuerySuccess = function _handleSubtractedQuerySuccess(subtractedQuery, result) {
          var _this2 = this;
          this._fetchedSubtractedQuery = true;
          RelayTaskScheduler.await(function() {
            var response = result.response;
            !(response && typeof response === 'object') ? true ? invariant(false, 'RelayPendingQueryTracker: Expected response to be an object, got ' + '`%s`.', response ? typeof response : response) : invariant(false) : undefined;
            _this2._storeData.handleQueryPayload(subtractedQuery, response, _this2._forceIndex);
          }).done(this._markSubtractedQueryAsResolved.bind(this), this._markAsRejected.bind(this));
        };
        PendingFetch.prototype._handleSubtractedQueryFailure = function _handleSubtractedQueryFailure(subtractedQuery, error) {
          this._markAsRejected(error);
        };
        PendingFetch.prototype._markSubtractedQueryAsResolved = function _markSubtractedQueryAsResolved() {
          var queryID = this.getQuery().getID();
          delete this._pendingFetchMap[queryID];
          this._resolvedSubtractedQuery = true;
          this._updateResolvedDeferred();
          this._dependents.forEach(function(dependent) {
            return dependent._markDependencyAsResolved(queryID);
          });
        };
        PendingFetch.prototype._markAsRejected = function _markAsRejected(error) {
          var queryID = this.getQuery().getID();
          delete this._pendingFetchMap[queryID];
          console.warn(error.message);
          this._errors.push(error);
          this._updateResolvedDeferred();
          this._dependents.forEach(function(dependent) {
            return dependent._markDependencyAsRejected(queryID, error);
          });
        };
        PendingFetch.prototype._markDependencyAsResolved = function _markDependencyAsResolved(dependencyQueryID) {
          delete this._pendingDependencyMap[dependencyQueryID];
          this._updateResolvedDeferred();
        };
        PendingFetch.prototype._markDependencyAsRejected = function _markDependencyAsRejected(dependencyQueryID, error) {
          delete this._pendingDependencyMap[dependencyQueryID];
          this._errors.push(error);
          this._updateResolvedDeferred();
        };
        PendingFetch.prototype._updateResolvedDeferred = function _updateResolvedDeferred() {
          if (this._isSettled() && !this._resolvedDeferred.isSettled()) {
            if (this._errors.length) {
              this._resolvedDeferred.reject(this._errors[0]);
            } else {
              this._resolvedDeferred.resolve(undefined);
            }
          }
        };
        PendingFetch.prototype._isSettled = function _isSettled() {
          return this._errors.length > 0 || this._resolvedSubtractedQuery && !hasItems(this._pendingDependencyMap);
        };
        return PendingFetch;
      })();
      function hasItems(map) {
        return !!_Object$keys(map).length;
      }
      exports.PendingFetch = PendingFetch;
      module.exports = RelayPendingQueryTracker;
    }, function(module, exports, __webpack_require__) {
      (function(global) {
        'use strict';
        var RelayContainer = __webpack_require__(131);
        var RelayMutation = __webpack_require__(136);
        var RelayNetworkLayer = __webpack_require__(25);
        var RelayPropTypes = __webpack_require__(35);
        var RelayQL = __webpack_require__(147);
        var RelayRootContainer = __webpack_require__(157);
        var RelayRoute = __webpack_require__(158);
        var RelayStore = __webpack_require__(37);
        var RelayTaskScheduler = __webpack_require__(39);
        var RelayInternals = __webpack_require__(135);
        var createRelayQuery = __webpack_require__(162);
        var getRelayQueries = __webpack_require__(89);
        var isRelayContainer = __webpack_require__(90);
        if (typeof global.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
          global.__REACT_DEVTOOLS_GLOBAL_HOOK__._relayInternals = RelayInternals;
        }
        var RelayPublic = {
          Mutation: RelayMutation,
          PropTypes: RelayPropTypes,
          QL: RelayQL,
          RootContainer: RelayRootContainer,
          Route: RelayRoute,
          Store: RelayStore,
          createContainer: RelayContainer.create,
          createQuery: createRelayQuery,
          getQueries: getRelayQueries,
          injectNetworkLayer: RelayNetworkLayer.injectNetworkLayer,
          injectTaskScheduler: RelayTaskScheduler.injectScheduler,
          isContainer: isRelayContainer
        };
        module.exports = RelayPublic;
      }.call(exports, (function() {
        return this;
      }())));
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$assign = __webpack_require__(57)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var QueryBuilder = __webpack_require__(17);
      var RelayFragmentReference = __webpack_require__(34);
      var RelayRouteFragment = __webpack_require__(84);
      var invariant = __webpack_require__(2);
      function RelayQL(strings) {
        true ? true ? invariant(false, 'RelayQL: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `Relay.QL`.') : invariant(false) : undefined;
      }
      _Object$assign(RelayQL, {
        __frag: function __frag(substitution) {
          if (typeof substitution === 'function') {
            return new RelayRouteFragment(substitution);
          }
          if (substitution != null) {
            !(substitution instanceof RelayFragmentReference || QueryBuilder.getFragment(substitution) || QueryBuilder.getFragmentReference(substitution)) ? true ? invariant(false, 'RelayQL: Invalid fragment composition, use ' + '`${Child.getFragment(\'name\')}`.') : invariant(false) : undefined;
          }
          return substitution;
        },
        __var: function __var(expression) {
          var variable = QueryBuilder.getCallVariable(expression);
          if (variable) {
            true ? true ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
          }
          return QueryBuilder.createCallValue(expression);
        },
        __varDEPRECATED: function __varDEPRECATED(expression) {
          var variable = QueryBuilder.getCallVariable(expression);
          if (variable) {
            true ? true ? invariant(false, 'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 'Instead, use an inline variable (e.g. `comments(count: $count)`).', variable.callVariableName) : invariant(false) : undefined;
          }
          return expression;
        }
      });
      module.exports = RelayQL;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var _Object$freeze = __webpack_require__(41)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var invariant = __webpack_require__(2);
      var RelayQueryConfig = (function() {
        function RelayQueryConfig(initialVariables) {
          _classCallCheck(this, RelayQueryConfig);
          !(this.constructor !== RelayQueryConfig) ? true ? invariant(false, 'RelayQueryConfig: Abstract class cannot be instantiated.') : invariant(false) : undefined;
          Object.defineProperty(this, 'name', {
            enumerable: true,
            value: this.constructor.routeName,
            writable: false
          });
          Object.defineProperty(this, 'params', {
            enumerable: true,
            value: this.prepareVariables(_extends({}, initialVariables)) || {},
            writable: false
          });
          Object.defineProperty(this, 'queries', {
            enumerable: true,
            value: _extends({}, this.constructor.queries),
            writable: false
          });
          if (true) {
            _Object$freeze(this.params);
            _Object$freeze(this.queries);
          }
        }
        RelayQueryConfig.prototype.prepareVariables = function prepareVariables(prevVariables) {
          return prevVariables;
        };
        return RelayQueryConfig;
      })();
      module.exports = RelayQueryConfig;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var Deferred = __webpack_require__(42);
      var printRelayQuery = __webpack_require__(56);
      var RelayQueryRequest = (function(_Deferred) {
        _inherits(RelayQueryRequest, _Deferred);
        function RelayQueryRequest(query) {
          _classCallCheck(this, RelayQueryRequest);
          _Deferred.call(this);
          this._printedQuery = null;
          this._query = query;
        }
        RelayQueryRequest.prototype.getDebugName = function getDebugName() {
          return this._query.getName();
        };
        RelayQueryRequest.prototype.getID = function getID() {
          return this._query.getID();
        };
        RelayQueryRequest.prototype.getVariables = function getVariables() {
          var printedQuery = this._printedQuery;
          if (!printedQuery) {
            printedQuery = printRelayQuery(this._query);
            this._printedQuery = printedQuery;
          }
          return printedQuery.variables;
        };
        RelayQueryRequest.prototype.getQueryString = function getQueryString() {
          var printedQuery = this._printedQuery;
          if (!printedQuery) {
            printedQuery = printRelayQuery(this._query);
            this._printedQuery = printedQuery;
          }
          return printedQuery.text;
        };
        RelayQueryRequest.prototype.getQuery = function getQuery() {
          return this._query;
        };
        return RelayQueryRequest;
      })(Deferred);
      module.exports = RelayQueryRequest;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var GraphQLFragmentPointer = __webpack_require__(21);
      var GraphQLStoreQueryResolver = __webpack_require__(80);
      var invariant = __webpack_require__(2);
      var RelayQueryResultObservable = (function() {
        function RelayQueryResultObservable(storeData, fragmentPointer) {
          _classCallCheck(this, RelayQueryResultObservable);
          this._data = undefined;
          this._fragmentPointer = fragmentPointer;
          this._queryResolver = null;
          this._storeData = storeData;
          this._subscriptionCallbacks = [];
          this._subscriptionCount = 0;
        }
        RelayQueryResultObservable.prototype.subscribe = function subscribe(callbacks) {
          var _this = this;
          this._subscriptionCount++;
          var subscriptionIndex = this._subscriptionCallbacks.length;
          var subscription = {dispose: function dispose() {
              !_this._subscriptionCallbacks[subscriptionIndex] ? true ? invariant(false, 'RelayQueryResultObservable: Subscriptions may only be disposed once.') : invariant(false) : undefined;
              delete _this._subscriptionCallbacks[subscriptionIndex];
              _this._subscriptionCount--;
              if (_this._subscriptionCount === 0) {
                _this._unobserve();
              }
            }};
          this._subscriptionCallbacks.push(callbacks);
          if (this._subscriptionCount === 1) {
            this._resolveData(this._observe());
          }
          this._fire(callbacks);
          return subscription;
        };
        RelayQueryResultObservable.prototype._observe = function _observe() {
          var _this2 = this;
          !!this._queryResolver ? true ? invariant(false, 'RelayQueryResultObservable: Initialized twice.') : invariant(false) : undefined;
          var queryResolver = new GraphQLStoreQueryResolver(this._storeData, this._fragmentPointer, function() {
            return _this2._onUpdate(queryResolver);
          });
          this._queryResolver = queryResolver;
          return queryResolver;
        };
        RelayQueryResultObservable.prototype._unobserve = function _unobserve() {
          if (this._queryResolver) {
            this._data = undefined;
            this._queryResolver.reset();
            this._queryResolver = null;
          }
        };
        RelayQueryResultObservable.prototype._onUpdate = function _onUpdate(queryResolver) {
          var _this3 = this;
          this._resolveData(queryResolver);
          this._subscriptionCallbacks.forEach(function(callbacks) {
            return _this3._fire(callbacks);
          });
        };
        RelayQueryResultObservable.prototype._fire = function _fire(callbacks) {
          callbacks.onNext && callbacks.onNext(this._data);
        };
        RelayQueryResultObservable.prototype._resolveData = function _resolveData(queryResolver) {
          var data = queryResolver.resolve(this._fragmentPointer);
          !!Array.isArray(data) ? true ? invariant(false, 'RelayQueryResultObservable: Plural fragments are not supported.') : invariant(false) : undefined;
          this._data = data;
        };
        return RelayQueryResultObservable;
      })();
      module.exports = RelayQueryResultObservable;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _toConsumableArray = __webpack_require__(23)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQuery = __webpack_require__(3);
      var invariant = __webpack_require__(2);
      var TYPE = '__type__';
      var RelayQueryTracker = (function() {
        function RelayQueryTracker() {
          _classCallCheck(this, RelayQueryTracker);
          this._trackedNodesByID = {};
        }
        RelayQueryTracker.prototype.trackNodeForID = function trackNodeForID(node, dataID, path) {
          if (GraphQLStoreDataHandler.isClientID(dataID)) {
            !path ? true ? invariant(false, 'RelayQueryTracker.trackNodeForID(): Expected `path` for client ID, ' + '`%s`.', dataID) : invariant(false) : undefined;
            if (!path.isRootPath()) {
              return;
            }
          }
          if (node instanceof RelayQuery.Field && node.getSchemaName() === TYPE) {
            return;
          }
          this._trackedNodesByID[dataID] = this._trackedNodesByID[dataID] || {
            trackedNodes: [],
            isMerged: false
          };
          this._trackedNodesByID[dataID].trackedNodes.push(node);
          this._trackedNodesByID[dataID].isMerged = false;
        };
        RelayQueryTracker.prototype.getTrackedChildrenForID = function getTrackedChildrenForID(dataID) {
          var trackedNodesByID = this._trackedNodesByID[dataID];
          if (!trackedNodesByID) {
            return [];
          }
          var isMerged = trackedNodesByID.isMerged;
          var trackedNodes = trackedNodesByID.trackedNodes;
          if (!isMerged) {
            (function() {
              var trackedChildren = [];
              trackedNodes.forEach(function(trackedQuery) {
                trackedChildren.push.apply(trackedChildren, _toConsumableArray(trackedQuery.getChildren()));
              });
              trackedNodes.length = 0;
              trackedNodesByID.isMerged = true;
              var containerNode = RelayQuery.Fragment.build('RelayQueryTracker', RelayNodeInterface.NODE_TYPE, trackedChildren);
              if (containerNode) {
                trackedNodes.push(containerNode);
              }
            })();
          }
          var trackedNode = trackedNodes[0];
          if (trackedNode) {
            return trackedNode.getChildren();
          }
          return [];
        };
        RelayQueryTracker.prototype.untrackNodesForID = function untrackNodesForID(dataID) {
          delete this._trackedNodesByID[dataID];
        };
        return RelayQueryTracker;
      })();
      module.exports = RelayQueryTracker;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var RelayQuery = __webpack_require__(3);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQueryVisitor = __webpack_require__(18);
      var RelayRecordState = __webpack_require__(26);
      var generateClientEdgeID = __webpack_require__(87);
      var generateClientID = __webpack_require__(54);
      var invariant = __webpack_require__(2);
      var isCompatibleRelayFragmentType = __webpack_require__(55);
      var warning = __webpack_require__(11);
      var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
      var ID = RelayNodeInterface.ID;
      var TYPENAME = RelayNodeInterface.TYPENAME;
      var EDGES = RelayConnectionInterface.EDGES;
      var NODE = RelayConnectionInterface.NODE;
      var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
      var RelayQueryWriter = (function(_RelayQueryVisitor) {
        _inherits(RelayQueryWriter, _RelayQueryVisitor);
        function RelayQueryWriter(store, queryTracker, changeTracker, options) {
          _classCallCheck(this, RelayQueryWriter);
          _RelayQueryVisitor.call(this);
          this._changeTracker = changeTracker;
          this._forceIndex = options && options.forceIndex ? options.forceIndex : 0;
          this._isOptimisticUpdate = !!(options && options.isOptimisticUpdate);
          this._store = store;
          this._queryTracker = queryTracker;
          this._updateTrackedQueries = !!(options && options.updateTrackedQueries);
        }
        RelayQueryWriter.prototype.getRecordStore = function getRecordStore() {
          return this._store;
        };
        RelayQueryWriter.prototype.getRecordTypeName = function getRecordTypeName(node, recordID, payload) {
          if (this._isOptimisticUpdate) {
            return null;
          }
          var typeName = payload[TYPENAME];
          if (typeName == null && !node.isAbstract()) {
            typeName = node.getType();
          }
          true ? warning(typeName && typeName !== ANY_TYPE, 'RelayQueryWriter: Could not find a type name for record `%s`.', recordID) : undefined;
          return typeName || null;
        };
        RelayQueryWriter.prototype.writePayload = function writePayload(node, recordID, responseData, path) {
          var _this = this;
          var state = {
            nodeID: null,
            recordID: recordID,
            responseData: responseData,
            path: path
          };
          if (node instanceof RelayQuery.Field && !node.isScalar()) {
            node.getChildren().forEach(function(child) {
              _this.visit(child, state);
            });
            return;
          }
          this.visit(node, state);
        };
        RelayQueryWriter.prototype.recordCreate = function recordCreate(recordID) {
          this._changeTracker.createID(recordID);
        };
        RelayQueryWriter.prototype.recordUpdate = function recordUpdate(recordID) {
          this._changeTracker.updateID(recordID);
        };
        RelayQueryWriter.prototype.hasChangeToRecord = function hasChangeToRecord(recordID) {
          return this._changeTracker.hasChange(recordID);
        };
        RelayQueryWriter.prototype.isNewRecord = function isNewRecord(recordID) {
          return this._changeTracker.isNewRecord(recordID);
        };
        RelayQueryWriter.prototype.createRecordIfMissing = function createRecordIfMissing(node, recordID, typeName, path) {
          var recordState = this._store.getRecordState(recordID);
          if (recordState !== RelayRecordState.EXISTENT) {
            this._store.putRecord(recordID, typeName, path);
            this.recordCreate(recordID);
          }
          if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
            this._queryTracker.trackNodeForID(node, recordID, path);
          }
        };
        RelayQueryWriter.prototype.visitRoot = function visitRoot(root, state) {
          var path = state.path;
          var recordID = state.recordID;
          var responseData = state.responseData;
          var recordState = this._store.getRecordState(recordID);
          if (responseData == null) {
            !(responseData !== undefined) ? true ? invariant(false, 'RelayQueryWriter: Unexpectedly encountered `undefined` in payload. ' + 'Cannot set root record `%s` to undefined.', recordID) : invariant(false) : undefined;
            this._store.deleteRecord(recordID);
            if (recordState === RelayRecordState.EXISTENT) {
              this.recordUpdate(recordID);
            }
            return;
          }
          !(typeof responseData === 'object' && responseData !== null) ? true ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an array or object.', recordID) : invariant(false) : undefined;
          if (recordState !== RelayRecordState.EXISTENT) {
            var typeName = this.getRecordTypeName(root, recordID, responseData);
            this._store.putRecord(recordID, typeName, path);
            this.recordCreate(recordID);
          }
          if (this.isNewRecord(recordID) || this._updateTrackedQueries) {
            this._queryTracker.trackNodeForID(root, recordID, path);
          }
          this.traverse(root, state);
        };
        RelayQueryWriter.prototype.visitFragment = function visitFragment(fragment, state) {
          var recordID = state.recordID;
          if (fragment.isDeferred()) {
            this._store.setHasDeferredFragmentData(recordID, fragment.getFragmentID());
            this.recordUpdate(recordID);
          }
          if (this._isOptimisticUpdate || isCompatibleRelayFragmentType(fragment, this._store.getType(recordID))) {
            var _path = state.path.getPath(fragment, recordID);
            this.traverse(fragment, _extends({}, state, {path: _path}));
          }
        };
        RelayQueryWriter.prototype.visitField = function visitField(field, state) {
          var recordID = state.recordID;
          var responseData = state.responseData;
          !(this._store.getRecordState(recordID) === RelayRecordState.EXISTENT) ? true ? invariant(false, 'RelayQueryWriter: Cannot update a non-existent record, `%s`.', recordID) : invariant(false) : undefined;
          !(typeof responseData === 'object' && responseData !== null) ? true ? invariant(false, 'RelayQueryWriter: Cannot update record `%s`, expected response to be ' + 'an object.', recordID) : invariant(false) : undefined;
          var fieldData = responseData[field.getSerializationKey()];
          if (fieldData === undefined) {
            return;
          }
          if (fieldData === null) {
            this._store.deleteField(recordID, field.getStorageKey());
            this.recordUpdate(recordID);
            return;
          }
          if (field.isScalar()) {
            this._writeScalar(field, state, recordID, fieldData);
          } else if (field.isConnection()) {
            this._writeConnection(field, state, recordID, fieldData);
          } else if (field.isPlural()) {
            this._writePluralLink(field, state, recordID, fieldData);
          } else {
            this._writeLink(field, state, recordID, fieldData);
          }
        };
        RelayQueryWriter.prototype._writeScalar = function _writeScalar(field, state, recordID, nextValue) {
          var storageKey = field.getStorageKey();
          var prevValue = this._store.getField(recordID, storageKey);
          this._store.putField(recordID, storageKey, nextValue);
          if (Array.isArray(prevValue) && Array.isArray(nextValue) && prevValue.length === nextValue.length && prevValue.every(function(prev, ii) {
            return prev === nextValue[ii];
          })) {
            return;
          } else if (prevValue === nextValue) {
            return;
          }
          this.recordUpdate(recordID);
        };
        RelayQueryWriter.prototype._writeConnection = function _writeConnection(field, state, recordID, connectionData) {
          var storageKey = field.getStorageKey();
          var connectionID = this._store.getLinkedRecordID(recordID, storageKey);
          if (!connectionID) {
            connectionID = generateClientID();
          }
          var connectionRecordState = this._store.getRecordState(connectionID);
          var hasEdges = !!(field.getFieldByStorageKey(EDGES) || connectionData != null && typeof connectionData === 'object' && connectionData[EDGES]);
          var path = state.path.getPath(field, connectionID);
          this._store.putRecord(connectionID, null, path);
          this._store.putLinkedRecordID(recordID, storageKey, connectionID);
          if (connectionRecordState !== RelayRecordState.EXISTENT) {
            this.recordUpdate(recordID);
            this.recordCreate(connectionID);
          }
          if (this.isNewRecord(connectionID) || this._updateTrackedQueries) {
            this._queryTracker.trackNodeForID(field, connectionID, path);
          }
          if (hasEdges && (!this._store.hasRange(connectionID) || this._forceIndex && this._forceIndex > this._store.getRangeForceIndex(connectionID))) {
            this._store.putRange(connectionID, field.getCallsWithValues(), this._forceIndex);
            this.recordUpdate(connectionID);
          }
          var connectionState = {
            path: path,
            nodeID: null,
            recordID: connectionID,
            responseData: connectionData
          };
          this._traverseConnection(field, field, connectionState);
        };
        RelayQueryWriter.prototype._traverseConnection = function _traverseConnection(connection, node, state) {
          var _this2 = this;
          node.getChildren().forEach(function(child) {
            if (child instanceof RelayQuery.Field) {
              if (child.getSchemaName() === EDGES) {
                _this2._writeEdges(connection, child, state);
              } else if (child.getSchemaName() !== PAGE_INFO) {
                _this2.visit(child, state);
              }
            } else {
              _this2._traverseConnection(connection, child, state);
            }
          });
        };
        RelayQueryWriter.prototype._writeEdges = function _writeEdges(connection, edges, state) {
          var _this3 = this;
          var connectionID = state.recordID;
          var connectionData = state.responseData;
          !(typeof connectionData === 'object' && connectionData !== null) ? true ? invariant(false, 'RelayQueryWriter: Cannot write edges for malformed connection `%s` on ' + 'record `%s`, expected the response to be an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
          var edgesData = connectionData[EDGES];
          if (edgesData == null) {
            true ? warning(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected a response for field `edges`.', connection.getDebugName(), connectionID) : undefined;
            return;
          }
          !Array.isArray(edgesData) ? true ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s`, expected `edges` to be an array.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
          var rangeCalls = connection.getCallsWithValues();
          !RelayConnectionInterface.hasRangeCalls(rangeCalls) ? true ? invariant(false, 'RelayQueryWriter: Cannot write edges for connection `%s` on record ' + '`%s` without `first`, `last`, or `find` argument.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
          var rangeInfo = this._store.getRangeMetadata(connectionID, rangeCalls);
          !rangeInfo ? true ? invariant(false, 'RelayQueryWriter: Expected a range to exist for connection field `%s` ' + 'on record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
          var fetchedEdgeIDs = [];
          var isUpdate = false;
          var nextIndex = 0;
          var filteredEdges = rangeInfo.filteredEdges;
          edgesData.forEach(function(edgeData) {
            if (edgeData == null) {
              return;
            }
            !(typeof edgeData === 'object' && edgeData) ? true ? invariant(false, 'RelayQueryWriter: Cannot write edge for connection field `%s` on ' + 'record `%s`, expected an object.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
            var nodeData = edgeData[NODE];
            if (nodeData == null) {
              return;
            }
            !(typeof nodeData === 'object') ? true ? invariant(false, 'RelayQueryWriter: Expected node to be an object for field `%s` on ' + 'record `%s`.', connection.getDebugName(), connectionID) : invariant(false) : undefined;
            var prevEdge = filteredEdges[nextIndex++];
            var nodeID = nodeData && nodeData[ID] || prevEdge && _this3._store.getLinkedRecordID(prevEdge.edgeID, NODE) || generateClientID();
            var edgeID = generateClientEdgeID(connectionID, nodeID);
            var path = state.path.getPath(edges, edgeID);
            _this3.createRecordIfMissing(edges, edgeID, null, path);
            fetchedEdgeIDs.push(edgeID);
            _this3.traverse(edges, {
              path: path,
              nodeID: nodeID,
              recordID: edgeID,
              responseData: edgeData
            });
            isUpdate = isUpdate || _this3.hasChangeToRecord(edgeID);
          });
          var pageInfo = connectionData[PAGE_INFO] || RelayConnectionInterface.getDefaultPageInfo();
          this._store.putRangeEdges(connectionID, rangeCalls, pageInfo, fetchedEdgeIDs);
          if (isUpdate) {
            this.recordUpdate(connectionID);
          }
        };
        RelayQueryWriter.prototype._writePluralLink = function _writePluralLink(field, state, recordID, fieldData) {
          var _this4 = this;
          var storageKey = field.getStorageKey();
          !Array.isArray(fieldData) ? true ? invariant(false, 'RelayQueryWriter: Expected array data for field `%s` on record `%s`.', field.getDebugName(), recordID) : invariant(false) : undefined;
          var prevLinkedIDs = this._store.getLinkedRecordIDs(recordID, storageKey);
          var nextLinkedIDs = [];
          var isUpdate = !prevLinkedIDs;
          var nextIndex = 0;
          fieldData.forEach(function(nextRecord) {
            if (nextRecord == null) {
              return;
            }
            !(typeof nextRecord === 'object' && nextRecord) ? true ? invariant(false, 'RelayQueryWriter: Expected elements for plural field `%s` to be ' + 'objects.', storageKey) : invariant(false) : undefined;
            var prevLinkedID = prevLinkedIDs && prevLinkedIDs[nextIndex];
            var nextLinkedID = nextRecord[ID] || prevLinkedID || generateClientID();
            nextLinkedIDs.push(nextLinkedID);
            var path = state.path.getPath(field, nextLinkedID);
            var typeName = _this4.getRecordTypeName(field, nextLinkedID, nextRecord);
            _this4.createRecordIfMissing(field, nextLinkedID, typeName, path);
            isUpdate = isUpdate || nextLinkedID !== prevLinkedID || _this4.isNewRecord(nextLinkedID);
            _this4.traverse(field, {
              path: path,
              nodeID: null,
              recordID: nextLinkedID,
              responseData: nextRecord
            });
            isUpdate = isUpdate || _this4.hasChangeToRecord(nextLinkedID);
            nextIndex++;
          });
          this._store.putLinkedRecordIDs(recordID, storageKey, nextLinkedIDs);
          isUpdate = isUpdate || !prevLinkedIDs || prevLinkedIDs.length !== nextLinkedIDs.length;
          if (isUpdate) {
            this.recordUpdate(recordID);
          }
        };
        RelayQueryWriter.prototype._writeLink = function _writeLink(field, state, recordID, fieldData) {
          var nodeID = state.nodeID;
          var storageKey = field.getStorageKey();
          !(typeof fieldData === 'object' && fieldData !== null) ? true ? invariant(false, 'RelayQueryWriter: Expected data for non-scalar field `%s` on record ' + '`%s` to be an object.', field.getDebugName(), recordID) : invariant(false) : undefined;
          var prevLinkedID = this._store.getLinkedRecordID(recordID, storageKey);
          var nextLinkedID = field.getSchemaName() === NODE && nodeID || fieldData[ID] || prevLinkedID || generateClientID();
          var path = state.path.getPath(field, nextLinkedID);
          var typeName = this.getRecordTypeName(field, nextLinkedID, fieldData);
          this.createRecordIfMissing(field, nextLinkedID, typeName, path);
          this._store.putLinkedRecordID(recordID, storageKey, nextLinkedID);
          if (prevLinkedID !== nextLinkedID || this.isNewRecord(nextLinkedID)) {
            this.recordUpdate(recordID);
          }
          this.traverse(field, {
            path: path,
            nodeID: null,
            recordID: nextLinkedID,
            responseData: fieldData
          });
        };
        return RelayQueryWriter;
      })(RelayQueryVisitor);
      module.exports = RelayQueryWriter;
    }, function(module, exports) {
      'use strict';
      var OPTIMISTIC_MASK = 0x01;
      var ERROR_MASK = 0x02;
      function set(status, value, mask) {
        status = status || 0;
        if (value) {
          return status | mask;
        } else {
          return status & ~mask;
        }
      }
      function check(status, mask) {
        return ((status || 0) & mask) != 0;
      }
      var RelayRecordStatusMap = {
        setOptimisticStatus: function setOptimisticStatus(status, value) {
          return set(status, value, OPTIMISTIC_MASK);
        },
        isOptimisticStatus: function isOptimisticStatus(status) {
          return check(status, OPTIMISTIC_MASK);
        },
        setErrorStatus: function setErrorStatus(status, value) {
          return set(status, value, ERROR_MASK);
        },
        isErrorStatus: function isErrorStatus(status) {
          return check(status, ERROR_MASK);
        }
      };
      module.exports = RelayRecordStatusMap;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var _Object$keys = __webpack_require__(10)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var GraphQLMutatorConstants = __webpack_require__(48);
      var GraphQLRange = __webpack_require__(125);
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayRecordStatusMap = __webpack_require__(153);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var warning = __webpack_require__(11);
      var CURSOR = RelayConnectionInterface.CURSOR;
      var NODE = RelayConnectionInterface.NODE;
      var EMPTY = '';
      var FILTER_CALLS = '__filterCalls__';
      var FORCE_INDEX = '__forceIndex__';
      var RANGE = '__range__';
      var RESOLVED_FRAGMENT_MAP = '__resolvedFragmentMap__';
      var RESOLVED_FRAGMENT_MAP_GENERATION = '__resolvedFragmentMapGeneration__';
      var PATH = '__path__';
      var APPEND = GraphQLMutatorConstants.APPEND;
      var PREPEND = GraphQLMutatorConstants.PREPEND;
      var REMOVE = GraphQLMutatorConstants.REMOVE;
      var RelayRecordStore = (function() {
        function RelayRecordStore(records, rootCallMaps, nodeConnectionMap, cacheWriter, clientMutationID) {
          _classCallCheck(this, RelayRecordStore);
          this._cacheWriter = cacheWriter;
          this._cachedRecords = records.cachedRecords;
          this._cachedRootCallMap = rootCallMaps && rootCallMaps.cachedRootCallMap || {};
          this._clientMutationID = clientMutationID;
          this._queuedRecords = records.queuedRecords;
          this._nodeConnectionMap = nodeConnectionMap || {};
          this._records = records.records;
          this._rootCallMap = rootCallMaps && rootCallMaps.rootCallMap || {};
          this._storage = [];
          if (this._queuedRecords) {
            this._storage.push(this._queuedRecords);
          }
          if (this._records) {
            this._storage.push(this._records);
          }
          if (this._cachedRecords) {
            this._storage.push(this._cachedRecords);
          }
        }
        RelayRecordStore.prototype.getDataID = function getDataID(storageKey, identifyingArgValue) {
          if (RelayNodeInterface.isNodeRootCall(storageKey)) {
            !(identifyingArgValue != null) ? true ? invariant(false, 'RelayRecordStore.getDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
            return identifyingArgValue;
          }
          if (identifyingArgValue == null) {
            identifyingArgValue = EMPTY;
          }
          if (this._rootCallMap.hasOwnProperty(storageKey) && this._rootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
            return this._rootCallMap[storageKey][identifyingArgValue];
          } else if (this._cachedRootCallMap.hasOwnProperty(storageKey)) {
            return this._cachedRootCallMap[storageKey][identifyingArgValue];
          }
        };
        RelayRecordStore.prototype.putDataID = function putDataID(storageKey, identifyingArgValue, dataID) {
          if (RelayNodeInterface.isNodeRootCall(storageKey)) {
            !(identifyingArgValue != null) ? true ? invariant(false, 'RelayRecordStore.putDataID(): Argument to `%s()` ' + 'cannot be null or undefined.', storageKey) : invariant(false) : undefined;
            return;
          }
          if (identifyingArgValue == null) {
            identifyingArgValue = EMPTY;
          }
          this._rootCallMap[storageKey] = this._rootCallMap[storageKey] || {};
          this._rootCallMap[storageKey][identifyingArgValue] = dataID;
          if (this._cacheWriter) {
            this._cacheWriter.writeRootCall(storageKey, identifyingArgValue, dataID);
          }
        };
        RelayRecordStore.prototype.getRecordState = function getRecordState(dataID) {
          var record = this._getRecord(dataID);
          if (record === null) {
            return 'NONEXISTENT';
          } else if (record === undefined) {
            return 'UNKNOWN';
          }
          return 'EXISTENT';
        };
        RelayRecordStore.prototype.putRecord = function putRecord(dataID, typeName, path) {
          var target = this._queuedRecords || this._records;
          var prevRecord = target[dataID];
          if (prevRecord) {
            if (target === this._queuedRecords) {
              this._setClientMutationID(prevRecord);
            }
            return;
          }
          var nextRecord = {
            __dataID__: dataID,
            __typename: typeName
          };
          if (target === this._queuedRecords) {
            this._setClientMutationID(nextRecord);
          }
          if (GraphQLStoreDataHandler.isClientID(dataID)) {
            !path ? true ? invariant(false, 'RelayRecordStore.putRecord(): Expected a path for non-refetchable ' + 'record `%s`.', dataID) : invariant(false) : undefined;
            nextRecord[PATH] = path;
          }
          target[dataID] = nextRecord;
          var cacheWriter = this._cacheWriter;
          if (!this._queuedRecords && cacheWriter) {
            cacheWriter.writeField(dataID, '__dataID__', dataID, typeName);
          }
        };
        RelayRecordStore.prototype.getPathToRecord = function getPathToRecord(dataID) {
          var path = this._getField(dataID, PATH);
          return path;
        };
        RelayRecordStore.prototype.hasOptimisticUpdate = function hasOptimisticUpdate(dataID) {
          !this._queuedRecords ? true ? invariant(false, 'RelayRecordStore.hasOptimisticUpdate(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
          return this._queuedRecords.hasOwnProperty(dataID);
        };
        RelayRecordStore.prototype.getClientMutationIDs = function getClientMutationIDs(dataID) {
          !this._queuedRecords ? true ? invariant(false, 'RelayRecordStore.getClientMutationIDs(): Optimistic updates require ' + 'queued records.') : invariant(false) : undefined;
          var record = this._queuedRecords[dataID];
          return record ? record.__mutationIDs__ : null;
        };
        RelayRecordStore.prototype.hasMutationError = function hasMutationError(dataID) {
          if (this._queuedRecords) {
            var record = this._queuedRecords[dataID];
            return !!(record && RelayRecordStatusMap.isErrorStatus(record.__status__));
          }
          return false;
        };
        RelayRecordStore.prototype.setMutationErrorStatus = function setMutationErrorStatus(dataID, hasError) {
          !this._queuedRecords ? true ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Can only set the ' + 'mutation status of queued records.') : invariant(false) : undefined;
          var record = this._queuedRecords[dataID];
          !record ? true ? invariant(false, 'RelayRecordStore.setMutationErrorStatus(): Expected record `%s` to ' + 'exist before settings its mutation error status.', dataID) : invariant(false) : undefined;
          record.__status__ = RelayRecordStatusMap.setErrorStatus(record.__status__, hasError);
        };
        RelayRecordStore.prototype.hasDeferredFragmentData = function hasDeferredFragmentData(dataID, fragmentID) {
          var resolvedFragmentMap = this._getField(dataID, RESOLVED_FRAGMENT_MAP);
          !(typeof resolvedFragmentMap === 'object' || resolvedFragmentMap == null) ? true ? invariant(false, 'RelayRecordStore.hasDeferredFragmentData(): Expected the map of ' + 'resolved deferred fragments associated with record `%s` to be null or ' + 'an object. Found a(n) `%s`.', dataID, typeof resolvedFragmentMap) : invariant(false) : undefined;
          return !!(resolvedFragmentMap && resolvedFragmentMap[fragmentID]);
        };
        RelayRecordStore.prototype.setHasDeferredFragmentData = function setHasDeferredFragmentData(dataID, fragmentID) {
          var record = this._getRecord(dataID);
          !record ? true ? invariant(false, 'RelayRecordStore.setHasDeferredFragmentData(): Expected record `%s` ' + 'to exist before marking it as having received data for the deferred ' + 'fragment with id `%s`.', dataID, fragmentID) : invariant(false) : undefined;
          var resolvedFragmentMap = record[RESOLVED_FRAGMENT_MAP];
          if (typeof resolvedFragmentMap !== 'object' || !resolvedFragmentMap) {
            resolvedFragmentMap = {};
          }
          resolvedFragmentMap[fragmentID] = true;
          record[RESOLVED_FRAGMENT_MAP] = resolvedFragmentMap;
          if (typeof record[RESOLVED_FRAGMENT_MAP_GENERATION] === 'number') {
            record[RESOLVED_FRAGMENT_MAP_GENERATION]++;
          } else {
            record[RESOLVED_FRAGMENT_MAP_GENERATION] = 0;
          }
        };
        RelayRecordStore.prototype.deleteRecord = function deleteRecord(dataID) {
          var target = this._queuedRecords || this._records;
          target[dataID] = null;
          if (!this._queuedRecords) {
            delete this._nodeConnectionMap[dataID];
            if (this._cacheWriter) {
              this._cacheWriter.writeNode(dataID, null);
            }
          }
        };
        RelayRecordStore.prototype.getType = function getType(dataID) {
          return this._getField(dataID, '__typename');
        };
        RelayRecordStore.prototype.getField = function getField(dataID, storageKey) {
          return this._getField(dataID, storageKey);
        };
        RelayRecordStore.prototype.putField = function putField(dataID, storageKey, value) {
          var record = this._getRecordForWrite(dataID);
          !record ? true ? invariant(false, 'RelayRecordStore.putField(): Expected record `%s` to exist before ' + 'writing field `%s`.', dataID, storageKey) : invariant(false) : undefined;
          record[storageKey] = value;
          if (!this._queuedRecords && this._cacheWriter) {
            var typeName = record.__typename;
            this._cacheWriter.writeField(dataID, storageKey, value, typeName);
          }
        };
        RelayRecordStore.prototype.deleteField = function deleteField(dataID, storageKey) {
          var record = this._getRecordForWrite(dataID);
          !record ? true ? invariant(false, 'RelayRecordStore.deleteField(): Expected record `%s` to exist before ' + 'deleting field `%s`.', dataID, storageKey) : invariant(false) : undefined;
          record[storageKey] = null;
          if (!this._queuedRecords && this._cacheWriter) {
            this._cacheWriter.writeField(dataID, storageKey, null);
          }
        };
        RelayRecordStore.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
          var field = this._getField(dataID, storageKey);
          if (field == null) {
            return field;
          }
          !(typeof field === 'object' && field !== null && !Array.isArray(field)) ? true ? invariant(false, 'RelayRecordStore.getLinkedRecordID(): Expected field `%s` for record ' + '`%s` to have a linked record.', storageKey, dataID) : invariant(false) : undefined;
          return field.__dataID__;
        };
        RelayRecordStore.prototype.putLinkedRecordID = function putLinkedRecordID(parentID, storageKey, recordID) {
          var parent = this._getRecordForWrite(parentID);
          !parent ? true ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking to record `%s`.', parentID, recordID) : invariant(false) : undefined;
          var record = this._getRecord(recordID);
          !record ? true ? invariant(false, 'RelayRecordStore.putLinkedRecordID(): Expected record `%s` to exist ' + 'before linking from record `%s`.', recordID, parentID) : invariant(false) : undefined;
          var fieldValue = {__dataID__: recordID};
          parent[storageKey] = fieldValue;
          if (!this._queuedRecords && this._cacheWriter) {
            this._cacheWriter.writeField(parentID, storageKey, fieldValue);
          }
        };
        RelayRecordStore.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
          var field = this._getField(dataID, storageKey);
          if (field == null) {
            return field;
          }
          !Array.isArray(field) ? true ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected field `%s` for ' + 'record `%s` to have an array of linked records.', storageKey, dataID) : invariant(false) : undefined;
          return field.map(function(item, ii) {
            !(typeof item === 'object' && item.__dataID__) ? true ? invariant(false, 'RelayRecordStore.getLinkedRecordIDs(): Expected element at index %s ' + 'in field `%s` for record `%s` to be a linked record.', ii, storageKey, dataID) : invariant(false) : undefined;
            return item.__dataID__;
          });
        };
        RelayRecordStore.prototype.putLinkedRecordIDs = function putLinkedRecordIDs(parentID, storageKey, recordIDs) {
          var _this = this;
          var parent = this._getRecordForWrite(parentID);
          !parent ? true ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to exist ' + 'before linking records.', parentID) : invariant(false) : undefined;
          var records = recordIDs.map(function(recordID) {
            var record = _this._getRecord(recordID);
            !record ? true ? invariant(false, 'RelayRecordStore.putLinkedRecordIDs(): Expected record `%s` to ' + 'exist before linking from `%s`.', recordID, parentID) : invariant(false) : undefined;
            return {__dataID__: recordID};
          });
          parent[storageKey] = records;
          if (!this._queuedRecords && this._cacheWriter) {
            this._cacheWriter.writeField(parentID, storageKey, records);
          }
        };
        RelayRecordStore.prototype.getConnectionIDsForRecord = function getConnectionIDsForRecord(dataID) {
          var connectionIDs = this._nodeConnectionMap[dataID];
          if (connectionIDs) {
            return _Object$keys(connectionIDs);
          }
          return null;
        };
        RelayRecordStore.prototype.getConnectionIDsForField = function getConnectionIDsForField(dataID, schemaName) {
          var record = this._records[dataID];
          if (record == null) {
            return record;
          }
          var connectionIDs;
          forEachObject(record, function(datum, key) {
            if (datum && getFieldNameFromKey(key) === schemaName) {
              var dataID = datum.__dataID__;
              if (dataID) {
                connectionIDs = connectionIDs || [];
                connectionIDs.push(dataID);
              }
            }
          });
          return connectionIDs;
        };
        RelayRecordStore.prototype.getRangeForceIndex = function getRangeForceIndex(connectionID) {
          var forceIndex = this._getField(connectionID, FORCE_INDEX);
          if (forceIndex === null) {
            return -1;
          }
          return forceIndex || 0;
        };
        RelayRecordStore.prototype.getRangeFilterCalls = function getRangeFilterCalls(connectionID) {
          return this._getField(connectionID, FILTER_CALLS);
        };
        RelayRecordStore.prototype.getRangeMetadata = function getRangeMetadata(connectionID, calls) {
          var _this2 = this;
          if (connectionID == null) {
            return connectionID;
          }
          var range = this._getField(connectionID, RANGE);
          if (range == null) {
            if (range === null) {
              true ? warning(false, 'RelayRecordStore.getRangeMetadata(): Expected range to exist if ' + '`edges` has been fetched.') : undefined;
            }
            return undefined;
          }
          var filterCalls = getFilterCalls(calls);
          if (calls.length === filterCalls.length) {
            return {
              diffCalls: calls,
              filterCalls: filterCalls,
              pageInfo: undefined,
              requestedEdgeIDs: [],
              filteredEdges: []
            };
          }
          var queuedRecord = this._queuedRecords ? this._queuedRecords[connectionID] : null;
          var _range$retrieveRangeInfoForQuery = range.retrieveRangeInfoForQuery(calls, queuedRecord);
          var diffCalls = _range$retrieveRangeInfoForQuery.diffCalls;
          var pageInfo = _range$retrieveRangeInfoForQuery.pageInfo;
          var requestedEdgeIDs = _range$retrieveRangeInfoForQuery.requestedEdgeIDs;
          if (diffCalls && diffCalls.length) {
            diffCalls = filterCalls.concat(diffCalls);
          } else {
            diffCalls = [];
          }
          var filteredEdges;
          if (requestedEdgeIDs) {
            filteredEdges = requestedEdgeIDs.map(function(edgeID) {
              return {
                edgeID: edgeID,
                nodeID: _this2.getLinkedRecordID(edgeID, NODE)
              };
            }).filter(function(edge) {
              return _this2._getRecord(edge.nodeID);
            });
          } else {
            filteredEdges = [];
          }
          return {
            diffCalls: diffCalls,
            filterCalls: filterCalls,
            pageInfo: pageInfo,
            requestedEdgeIDs: requestedEdgeIDs,
            filteredEdges: filteredEdges
          };
        };
        RelayRecordStore.prototype.putRange = function putRange(connectionID, calls, forceIndex) {
          !!this._queuedRecords ? true ? invariant(false, 'RelayRecordStore.putRange(): Cannot create a queued range.') : invariant(false) : undefined;
          var record = this._getRecord(connectionID);
          !record ? true ? invariant(false, 'RelayRecordStore.putRange(): Expected record `%s` to exist before ' + 'adding a range.', connectionID) : invariant(false) : undefined;
          var range = new GraphQLRange();
          var filterCalls = getFilterCalls(calls);
          forceIndex = forceIndex || 0;
          record.__filterCalls__ = filterCalls;
          record.__forceIndex__ = forceIndex;
          record.__range__ = range;
          var cacheWriter = this._cacheWriter;
          if (!this._queuedRecords && cacheWriter) {
            cacheWriter.writeField(connectionID, FILTER_CALLS, filterCalls);
            cacheWriter.writeField(connectionID, FORCE_INDEX, forceIndex);
            cacheWriter.writeField(connectionID, RANGE, range);
          }
        };
        RelayRecordStore.prototype.hasRange = function hasRange(connectionID) {
          return !!this._getField(connectionID, RANGE);
        };
        RelayRecordStore.prototype.putRangeEdges = function putRangeEdges(connectionID, calls, pageInfo, edges) {
          var _this3 = this;
          var range = this._getField(connectionID, RANGE);
          !range ? true ? invariant(false, 'RelayRecordStore.putRangeEdges(): Expected record `%s` to exist and ' + 'have a range.', connectionID) : invariant(false) : undefined;
          var edgesData = [];
          edges.forEach(function(edgeID) {
            var edgeData = _this3._getRangeEdgeData(edgeID);
            edgesData.push(edgeData);
            _this3._addConnectionForNode(connectionID, edgeData.node.__dataID__);
          });
          range.addItems(calls, edgesData, pageInfo);
          if (!this._queuedRecords && this._cacheWriter) {
            this._cacheWriter.writeField(connectionID, RANGE, range);
          }
        };
        RelayRecordStore.prototype.applyRangeUpdate = function applyRangeUpdate(connectionID, edgeID, operation) {
          if (this._queuedRecords) {
            this._applyOptimisticRangeUpdate(connectionID, edgeID, operation);
          } else {
            this._applyServerRangeUpdate(connectionID, edgeID, operation);
          }
        };
        RelayRecordStore.prototype.removeRecord = function removeRecord(dataID) {
          delete this._records[dataID];
          if (this._queuedRecords) {
            delete this._queuedRecords[dataID];
          }
          if (this._cachedRecords) {
            delete this._cachedRecords[dataID];
          }
        };
        RelayRecordStore.prototype._getRangeEdgeData = function _getRangeEdgeData(edgeID) {
          var nodeID = this.getLinkedRecordID(edgeID, NODE);
          !nodeID ? true ? invariant(false, 'RelayRecordStore: Expected edge `%s` to have a `node` record.', edgeID) : invariant(false) : undefined;
          return {
            __dataID__: edgeID,
            cursor: this.getField(edgeID, CURSOR),
            node: {__dataID__: nodeID}
          };
        };
        RelayRecordStore.prototype._applyOptimisticRangeUpdate = function _applyOptimisticRangeUpdate(connectionID, edgeID, operation) {
          !this._queuedRecords ? true ? invariant(false, 'RelayRecordStore: Expected queued records to exist for optimistic ' + '`%s` update to record `%s`.', operation, connectionID) : invariant(false) : undefined;
          var record = this._queuedRecords[connectionID];
          if (!record) {
            record = {__dataID__: connectionID};
            this._queuedRecords[connectionID] = record;
          }
          this._setClientMutationID(record);
          var queue = record[operation];
          if (!queue) {
            queue = [];
            record[operation] = queue;
          }
          if (operation === PREPEND) {
            queue.unshift(edgeID);
          } else {
            queue.push(edgeID);
          }
        };
        RelayRecordStore.prototype._applyServerRangeUpdate = function _applyServerRangeUpdate(connectionID, edgeID, operation) {
          !this._records ? true ? invariant(false, 'RelayRecordStore: Expected base records to exist for `%s` update to ' + 'record `%s`.', operation, connectionID) : invariant(false) : undefined;
          var range = this._getField(connectionID, RANGE);
          !range ? true ? invariant(false, 'RelayRecordStore: Cannot apply `%s` update to non-existent record `%s`.', operation, connectionID) : invariant(false) : undefined;
          if (operation === REMOVE) {
            range.removeEdgeWithID(edgeID);
            var nodeID = this.getLinkedRecordID(edgeID, 'node');
            if (nodeID) {
              this._removeConnectionForNode(connectionID, nodeID);
            }
          } else {
            var edgeData = this._getRangeEdgeData(edgeID);
            this._addConnectionForNode(connectionID, edgeData.node.__dataID__);
            if (operation === APPEND) {
              range.appendEdge(this._getRangeEdgeData(edgeID));
            } else {
              range.prependEdge(this._getRangeEdgeData(edgeID));
            }
          }
          if (this._cacheWriter) {
            this._cacheWriter.writeField(connectionID, RANGE, range);
          }
        };
        RelayRecordStore.prototype._addConnectionForNode = function _addConnectionForNode(connectionID, nodeID) {
          var connectionMap = this._nodeConnectionMap[nodeID];
          if (!connectionMap) {
            connectionMap = {};
            this._nodeConnectionMap[nodeID] = connectionMap;
          }
          connectionMap[connectionID] = true;
        };
        RelayRecordStore.prototype._removeConnectionForNode = function _removeConnectionForNode(connectionID, nodeID) {
          var connectionMap = this._nodeConnectionMap[nodeID];
          if (connectionMap) {
            delete connectionMap[connectionID];
            if (_Object$keys(connectionMap).length === 0) {
              delete this._nodeConnectionMap[nodeID];
            }
          }
        };
        RelayRecordStore.prototype._getRecord = function _getRecord(dataID) {
          if (this._queuedRecords && this._queuedRecords.hasOwnProperty(dataID)) {
            return this._queuedRecords[dataID];
          } else if (this._records.hasOwnProperty(dataID)) {
            return this._records[dataID];
          } else if (this._cachedRecords) {
            return this._cachedRecords[dataID];
          }
        };
        RelayRecordStore.prototype._getRecordForWrite = function _getRecordForWrite(dataID) {
          var record = this._getRecord(dataID);
          if (!record) {
            return record;
          }
          var source = this._queuedRecords || this._records;
          if (!source[dataID]) {
            record = source[dataID] = {__dataID__: dataID};
          }
          if (source === this._queuedRecords) {
            this._setClientMutationID(record);
          }
          return record;
        };
        RelayRecordStore.prototype._getField = function _getField(dataID, storageKey) {
          var storage = this._storage;
          for (var ii = 0; ii < storage.length; ii++) {
            var record = storage[ii][dataID];
            if (record === null) {
              return null;
            } else if (record && record.hasOwnProperty(storageKey)) {
              return record[storageKey];
            }
          }
          return undefined;
        };
        RelayRecordStore.prototype._setClientMutationID = function _setClientMutationID(record) {
          var clientMutationID = this._clientMutationID;
          !clientMutationID ? true ? invariant(false, 'RelayRecordStore: _clientMutationID cannot be null/undefined.') : invariant(false) : undefined;
          var mutationIDs = record.__mutationIDs__ || [];
          if (mutationIDs.indexOf(clientMutationID) === -1) {
            mutationIDs.push(clientMutationID);
            record.__mutationIDs__ = mutationIDs;
          }
          record.__status__ = RelayRecordStatusMap.setOptimisticStatus(0, true);
        };
        return RelayRecordStore;
      })();
      function getFilterCalls(calls) {
        return calls.filter(function(call) {
          return !RelayConnectionInterface.isConnectionCall(call);
        });
      }
      function getFieldNameFromKey(key) {
        return key.split(/(?![_A-Za-z][_0-9A-Za-z]*)/, 1)[0];
      }
      module.exports = RelayRecordStore;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayRefQueryDescriptor = function RelayRefQueryDescriptor(node, path) {
        _classCallCheck(this, RelayRefQueryDescriptor);
        this.node = node;
        this.path = path;
      };
      module.exports = RelayRefQueryDescriptor;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var _extends = __webpack_require__(8)['default'];
      var GraphQLFragmentPointer = __webpack_require__(21);
      var React = __webpack_require__(33);
      var RelayPropTypes = __webpack_require__(35);
      var RelayStore = __webpack_require__(37);
      var RelayStoreData = __webpack_require__(38);
      var StaticContainer = __webpack_require__(262);
      var getRelayQueries = __webpack_require__(89);
      var invariant = __webpack_require__(2);
      var mapObject = __webpack_require__(44);
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
          !(readyState && readyState.error) ? true ? invariant(false, 'RelayRenderer: You tried to call `retry`, but the last request did ' + 'not fail. You can only call this when the last request has failed.') : invariant(false) : undefined;
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
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var React = __webpack_require__(33);
      var RelayPropTypes = __webpack_require__(35);
      var RelayRenderer = __webpack_require__(156);
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
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayDeprecated = __webpack_require__(81);
      var RelayQueryConfig = __webpack_require__(148);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var createURI = function createURI() {
        return null;
      };
      var RelayRoute = (function(_RelayQueryConfig) {
        _inherits(RelayRoute, _RelayQueryConfig);
        function RelayRoute(initialVariables, uri) {
          _classCallCheck(this, RelayRoute);
          _RelayQueryConfig.call(this, initialVariables);
          var constructor = this.constructor;
          var routeName = constructor.routeName;
          var path = constructor.path;
          !(constructor !== RelayRoute) ? true ? invariant(false, 'RelayRoute: Abstract class cannot be instantiated.') : invariant(false) : undefined;
          !routeName ? true ? invariant(false, '%s: Subclasses of RelayRoute must define a `routeName`.', constructor.name || '<<anonymous>>') : invariant(false) : undefined;
          if (!uri && path) {
            uri = createURI(constructor, this.params);
          }
          Object.defineProperty(this, 'uri', {
            enumerable: true,
            value: uri,
            writable: false
          });
        }
        RelayRoute.prototype.prepareVariables = function prepareVariables(prevVariables) {
          var _constructor = this.constructor;
          var paramDefinitions = _constructor.paramDefinitions;
          var prepareParams = _constructor.prepareParams;
          var routeName = _constructor.routeName;
          var params = prevVariables;
          if (prepareParams) {
            params = prepareParams(params);
          }
          forEachObject(paramDefinitions, function(paramDefinition, paramName) {
            if (params) {
              if (params.hasOwnProperty(paramName)) {
                return;
              } else {
                params[paramName] = undefined;
              }
            }
            !!paramDefinition.required ? true ? invariant(false, 'RelayRoute: Missing required parameter `%s` in `%s`. Check the ' + 'supplied params or URI.', paramName, routeName) : invariant(false) : undefined;
          });
          return params;
        };
        RelayRoute.injectURICreator = function injectURICreator(creator) {
          createURI = creator;
        };
        return RelayRoute;
      })(RelayQueryConfig);
      module.exports = RelayRoute;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayBufferedNeglectionStateMap = __webpack_require__(129);
      var RelayNeglectionStateMap = __webpack_require__(141);
      var RelayProfiler = __webpack_require__(4);
      var RelayTaskScheduler = __webpack_require__(39);
      var forEachObject = __webpack_require__(9);
      var resolveImmediate = __webpack_require__(29);
      var RANGE = '__range__';
      var RelayStoreGarbageCollector = (function() {
        function RelayStoreGarbageCollector(relayStoreData) {
          _classCallCheck(this, RelayStoreGarbageCollector);
          this._directNeglectionStates = new RelayNeglectionStateMap();
          this._bufferedNeglectionStates = new RelayBufferedNeglectionStateMap(this._directNeglectionStates);
          this._neglectionStates = this._bufferedNeglectionStates;
          this._relayStoreData = relayStoreData;
          this._cycles = 0;
        }
        RelayStoreGarbageCollector.prototype.scheduleCollection = function scheduleCollection(stepLength) {
          var _this = this;
          this._bufferedNeglectionStates.flushBuffer();
          var iterator = this._neglectionStates.values();
          var currentCycle = ++this._cycles;
          this._neglectionStates = this._directNeglectionStates;
          RelayTaskScheduler.await(function() {
            return _this._collectGarbageStep(currentCycle, iterator, iterator.next(), stepLength);
          });
        };
        RelayStoreGarbageCollector.prototype._collectGarbageStep = function _collectGarbageStep(currentCycle, remainingDataIDs, offset, stepLength) {
          var _this2 = this;
          var iterator = offset;
          var neglectionState;
          if (currentCycle !== this._cycles) {
            for (iterator = offset; !iterator.done; iterator = remainingDataIDs.next()) {
              var _iterator = iterator;
              neglectionState = _iterator.value;
              if (neglectionState) {
                neglectionState.collectible = true;
              }
            }
            return;
          }
          iterator = offset;
          var profileState = {
            count: -1,
            stepLength: stepLength
          };
          var profile = RelayProfiler.profile('RelayStoreGarbageCollector.collect', profileState);
          var recordsBefore = this._neglectionStates.size();
          var seenRecords = 0;
          for (iterator = offset; !iterator.done && (stepLength == null || seenRecords < stepLength); iterator = remainingDataIDs.next()) {
            var _iterator2 = iterator;
            neglectionState = _iterator2.value;
            if (neglectionState) {
              if (this._isCollectible(neglectionState)) {
                seenRecords += this._removeRecordAndDescendentClientRecords(neglectionState.dataID);
              } else {
                seenRecords++;
              }
              neglectionState.collectible = true;
            }
          }
          var recordsAfter = this._neglectionStates.size();
          profileState.count = recordsBefore - recordsAfter;
          profile.stop();
          if (!iterator.done) {
            resolveImmediate(function() {
              return RelayTaskScheduler.await(function() {
                return _this2._collectGarbageStep(currentCycle, remainingDataIDs, iterator, stepLength);
              });
            });
          } else {
            this._neglectionStates = this._bufferedNeglectionStates;
          }
        };
        RelayStoreGarbageCollector.prototype.decreaseSubscriptionsFor = function decreaseSubscriptionsFor(dataID) {
          this._neglectionStates.decreaseSubscriptionsFor(dataID);
        };
        RelayStoreGarbageCollector.prototype.increaseSubscriptionsFor = function increaseSubscriptionsFor(dataID) {
          this._neglectionStates.increaseSubscriptionsFor(dataID);
        };
        RelayStoreGarbageCollector.prototype.register = function register(dataID) {
          this._neglectionStates.register(dataID);
        };
        RelayStoreGarbageCollector.prototype._isCollectible = function _isCollectible(neglectionState) {
          var isEligibleForCollection = neglectionState.collectible && !neglectionState.subscriptions;
          var queuedStore = this._relayStoreData.getQueuedStore();
          return isEligibleForCollection && (!GraphQLStoreDataHandler.isClientID(neglectionState.dataID) || queuedStore.hasRange(neglectionState.dataID));
        };
        RelayStoreGarbageCollector.prototype._removeRecordAndDescendentClientRecords = function _removeRecordAndDescendentClientRecords(dataID) {
          var records = this._relayStoreData.getNodeData();
          var queuedRecords = this._relayStoreData.getQueuedData();
          var cachedRecords = this._relayStoreData.getCachedData();
          var removalStatusMap = {};
          removalStatusMap[dataID] = 'pending';
          var removedRecords = 0;
          var remainingRecords = [records[dataID], queuedRecords[dataID], cachedRecords[dataID]];
          function enqueueField(field) {
            var dataID = getClientIDFromLinkedRecord(field);
            if (dataID && !removalStatusMap[dataID]) {
              removalStatusMap[dataID] = 'pending';
              remainingRecords.push(records[dataID], queuedRecords[dataID], cachedRecords[dataID]);
            }
          }
          while (remainingRecords.length) {
            var currentRecord = remainingRecords.shift();
            if (currentRecord && typeof currentRecord === 'object') {
              var range = currentRecord[RANGE];
              if (range) {
                range.getEdgeIDs().forEach(function(id) {
                  return enqueueField({__dataID__: id});
                });
              } else {
                forEachObject(currentRecord, function(field, fieldName) {
                  if (GraphQLStoreDataHandler.isMetadataKey(fieldName)) {
                    return;
                  }
                  if (Array.isArray(field)) {
                    field.forEach(enqueueField);
                  } else {
                    enqueueField(field);
                  }
                });
              }
              var currentDataID = GraphQLStoreDataHandler.getID(currentRecord);
              if (currentDataID && removalStatusMap[currentDataID] === 'pending') {
                this._removeRecord(currentRecord);
                removalStatusMap[currentDataID] = 'removed';
                removedRecords++;
              }
            }
          }
          return removedRecords;
        };
        RelayStoreGarbageCollector.prototype._removeRecord = function _removeRecord(record) {
          var dataID = record.__dataID__;
          this._relayStoreData.getQueryTracker().untrackNodesForID(dataID);
          this._relayStoreData.getQueuedStore().removeRecord(dataID);
          this._neglectionStates.remove(dataID);
        };
        return RelayStoreGarbageCollector;
      })();
      function getClientIDFromLinkedRecord(field) {
        if (!field || typeof field !== 'object') {
          return null;
        }
        var dataID = GraphQLStoreDataHandler.getID(field);
        if (dataID && GraphQLStoreDataHandler.isClientID(dataID)) {
          return dataID;
        }
        return null;
      }
      module.exports = RelayStoreGarbageCollector;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayProfiler = __webpack_require__(4);
      var RelayQueryVisitor = __webpack_require__(18);
      var RelayRecordState = __webpack_require__(26);
      var forEachRootCallArg = __webpack_require__(27);
      var EDGES = RelayConnectionInterface.EDGES;
      var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
      function checkRelayQueryData(store, query) {
        var checker = new RelayQueryChecker(store);
        var state = {
          dataID: undefined,
          rangeInfo: undefined,
          result: true
        };
        checker.visit(query, state);
        return state.result;
      }
      var RelayQueryChecker = (function(_RelayQueryVisitor) {
        _inherits(RelayQueryChecker, _RelayQueryVisitor);
        function RelayQueryChecker(store) {
          _classCallCheck(this, RelayQueryChecker);
          _RelayQueryVisitor.call(this);
          this._store = store;
        }
        RelayQueryChecker.prototype.traverse = function traverse(node, state) {
          var children = node.getChildren();
          for (var ii = 0; ii < children.length; ii++) {
            if (!state.result) {
              return;
            }
            this.visit(children[ii], state);
          }
        };
        RelayQueryChecker.prototype.visitRoot = function visitRoot(root, state) {
          var _this = this;
          var nextState;
          var storageKey = root.getStorageKey();
          forEachRootCallArg(root, function(identifyingArgValue) {
            var dataID = _this._store.getDataID(storageKey, identifyingArgValue);
            if (dataID == null) {
              state.result = false;
            } else {
              nextState = {
                dataID: dataID,
                rangeInfo: undefined,
                result: true
              };
              _this.traverse(root, nextState);
              state.result = state.result && nextState.result;
            }
          });
        };
        RelayQueryChecker.prototype.visitField = function visitField(field, state) {
          var dataID = state.dataID;
          var recordState = dataID && this._store.getRecordState(dataID);
          if (recordState === RelayRecordState.UNKNOWN) {
            state.result = false;
            return;
          } else if (recordState === RelayRecordState.NONEXISTENT) {
            return;
          }
          var rangeInfo = state.rangeInfo;
          if (rangeInfo && field.getSchemaName() === EDGES) {
            this._checkEdges(field, state);
          } else if (rangeInfo && field.getSchemaName() === PAGE_INFO) {
            this._checkPageInfo(field, state);
          } else if (field.isScalar()) {
            this._checkScalar(field, state);
          } else if (field.isPlural()) {
            this._checkPlural(field, state);
          } else if (field.isConnection()) {
            this._checkConnection(field, state);
          } else {
            this._checkLinkedField(field, state);
          }
        };
        RelayQueryChecker.prototype._checkScalar = function _checkScalar(field, state) {
          var fieldData = state.dataID && this._store.getField(state.dataID, field.getStorageKey());
          if (fieldData === undefined) {
            state.result = false;
          }
        };
        RelayQueryChecker.prototype._checkPlural = function _checkPlural(field, state) {
          var dataIDs = state.dataID && this._store.getLinkedRecordIDs(state.dataID, field.getStorageKey());
          if (dataIDs === undefined) {
            state.result = false;
            return;
          }
          if (dataIDs) {
            for (var ii = 0; ii < dataIDs.length; ii++) {
              if (!state.result) {
                break;
              }
              var nextState = {
                dataID: dataIDs[ii],
                rangeInfo: undefined,
                result: true
              };
              this.traverse(field, nextState);
              state.result = nextState.result;
            }
          }
        };
        RelayQueryChecker.prototype._checkConnection = function _checkConnection(field, state) {
          var calls = field.getCallsWithValues();
          var dataID = state.dataID && this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
          if (dataID === undefined) {
            state.result = false;
            return;
          }
          var nextState = {
            dataID: dataID,
            rangeInfo: null,
            result: true
          };
          var metadata = this._store.getRangeMetadata(dataID, calls);
          if (metadata) {
            nextState.rangeInfo = metadata;
          }
          this.traverse(field, nextState);
          state.result = state.result && nextState.result;
        };
        RelayQueryChecker.prototype._checkEdges = function _checkEdges(field, state) {
          var rangeInfo = state.rangeInfo;
          if (!rangeInfo) {
            state.result = false;
            return;
          }
          if (rangeInfo.diffCalls.length) {
            state.result = false;
            return;
          }
          var edges = rangeInfo.filteredEdges;
          for (var ii = 0; ii < edges.length; ii++) {
            if (!state.result) {
              break;
            }
            var nextState = {
              dataID: edges[ii].edgeID,
              rangeInfo: undefined,
              result: true
            };
            this.traverse(field, nextState);
            state.result = nextState.result;
          }
        };
        RelayQueryChecker.prototype._checkPageInfo = function _checkPageInfo(field, state) {
          var rangeInfo = state.rangeInfo;
          if (!rangeInfo || !rangeInfo.pageInfo) {
            state.result = false;
            return;
          }
        };
        RelayQueryChecker.prototype._checkLinkedField = function _checkLinkedField(field, state) {
          var dataID = state.dataID && this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
          if (dataID === undefined) {
            state.result = false;
            return;
          }
          if (dataID) {
            var nextState = {
              dataID: dataID,
              rangeInfo: undefined,
              result: true
            };
            this.traverse(field, nextState);
            state.result = state.result && nextState.result;
          }
        };
        return RelayQueryChecker;
      })(RelayQueryVisitor);
      module.exports = RelayProfiler.instrument('checkRelayQueryData', checkRelayQueryData);
    }, function(module, exports) {
      'use strict';
      function containsRelayQueryRootCall(thisRoot, thatRoot) {
        if (thisRoot === thatRoot) {
          return true;
        }
        if (getCanonicalName(thisRoot.getFieldName()) !== getCanonicalName(thatRoot.getFieldName())) {
          return false;
        }
        var thisIdentifyingArg = thisRoot.getIdentifyingArg();
        var thatIdentifyingArg = thatRoot.getIdentifyingArg();
        var thisValue = thisIdentifyingArg && thisIdentifyingArg.value || null;
        var thatValue = thatIdentifyingArg && thatIdentifyingArg.value || null;
        if (thisValue == null && thatValue == null) {
          return true;
        }
        if (thisValue == null || thatValue == null) {
          return false;
        }
        if (Array.isArray(thisValue)) {
          var thisArray = thisValue;
          if (Array.isArray(thatValue)) {
            return thatValue.every(function(eachValue) {
              return thisArray.indexOf(eachValue) >= 0;
            });
          } else {
            return thisValue.indexOf(thatValue) >= 0;
          }
        } else {
          if (Array.isArray(thatValue)) {
            return thatValue.every(function(eachValue) {
              return eachValue === thisValue;
            });
          } else {
            return thatValue === thisValue;
          }
        }
      }
      var canonicalRootCalls = {
        'nodes': 'node',
        'usernames': 'username'
      };
      function getCanonicalName(name) {
        if (canonicalRootCalls.hasOwnProperty(name)) {
          return canonicalRootCalls[name];
        }
        return name;
      }
      module.exports = containsRelayQueryRootCall;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var RelayMetaRoute = __webpack_require__(22);
      var RelayQuery = __webpack_require__(3);
      var invariant = __webpack_require__(2);
      function createRelayQuery(node, variables) {
        !(typeof variables === 'object' && variables != null && !Array.isArray(variables)) ? true ? invariant(false, 'Relay.Query: Expected `variables` to be an object.') : invariant(false) : undefined;
        return RelayQuery.Root.create(node, RelayMetaRoute.get('$createRelayQuery'), variables);
      }
      module.exports = createRelayQuery;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryPath = __webpack_require__(36);
      var forEachRootCallArg = __webpack_require__(27);
      var invariant = __webpack_require__(2);
      var isCompatibleRelayFragmentType = __webpack_require__(55);
      var warning = __webpack_require__(11);
      var ID = RelayNodeInterface.ID;
      var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
      var TYPENAME = RelayNodeInterface.TYPENAME;
      var EDGES = RelayConnectionInterface.EDGES;
      var NODE = RelayConnectionInterface.NODE;
      var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
      var idField = RelayQuery.Field.build({
        fieldName: ID,
        metadata: {isRequisite: true},
        type: 'String'
      });
      var typeField = RelayQuery.Field.build({
        fieldName: TYPENAME,
        metadata: {isRequisite: true},
        type: 'String'
      });
      var nodeWithID = RelayQuery.Field.build({
        fieldName: RelayNodeInterface.NODE,
        children: [idField, typeField],
        type: NODE_TYPE
      });
      function diffRelayQuery(root, store, tracker) {
        var path = new RelayQueryPath(root);
        var queries = [];
        var visitor = new RelayDiffQueryBuilder(store, tracker);
        var rootIdentifyingArg = root.getIdentifyingArg();
        var rootIdentifyingArgValue = rootIdentifyingArg && rootIdentifyingArg.value || null;
        var isPluralCall = Array.isArray(rootIdentifyingArgValue) && rootIdentifyingArgValue.length > 1;
        var metadata = undefined;
        if (rootIdentifyingArg != null) {
          metadata = {};
          metadata.identifyingArgName = rootIdentifyingArg.name;
          if (rootIdentifyingArg.type != null) {
            metadata.identifyingArgType = rootIdentifyingArg.type;
          }
        }
        var fieldName = root.getFieldName();
        var storageKey = root.getStorageKey();
        forEachRootCallArg(root, function(identifyingArgValue) {
          var nodeRoot;
          if (isPluralCall) {
            !(identifyingArgValue != null) ? true ? invariant(false, 'diffRelayQuery(): Unexpected null or undefined value in root call ' + 'argument array for query, `%s(...).', fieldName) : invariant(false) : undefined;
            nodeRoot = RelayQuery.Root.build(root.getName(), fieldName, [identifyingArgValue], root.getChildren(), metadata, root.getType());
          } else {
            nodeRoot = root;
          }
          var dataID = store.getDataID(storageKey, identifyingArgValue);
          if (dataID == null) {
            queries.push(nodeRoot);
            return;
          }
          var scope = makeScope(dataID);
          var diffOutput = visitor.visit(nodeRoot, path, scope);
          var diffNode = diffOutput ? diffOutput.diffNode : null;
          if (diffNode) {
            !(diffNode instanceof RelayQuery.Root) ? true ? invariant(false, 'diffRelayQuery(): Expected result to be a root query.') : invariant(false) : undefined;
            queries.push(diffNode);
          }
        });
        return queries.concat(visitor.getSplitQueries());
      }
      var RelayDiffQueryBuilder = (function() {
        function RelayDiffQueryBuilder(store, tracker) {
          _classCallCheck(this, RelayDiffQueryBuilder);
          this._store = store;
          this._splitQueries = [];
          this._tracker = tracker;
        }
        RelayDiffQueryBuilder.prototype.splitQuery = function splitQuery(root) {
          this._splitQueries.push(root);
        };
        RelayDiffQueryBuilder.prototype.getSplitQueries = function getSplitQueries() {
          return this._splitQueries;
        };
        RelayDiffQueryBuilder.prototype.visit = function visit(node, path, scope) {
          if (node instanceof RelayQuery.Field) {
            return this.visitField(node, path, scope);
          } else if (node instanceof RelayQuery.Fragment) {
            return this.visitFragment(node, path, scope);
          } else if (node instanceof RelayQuery.Root) {
            return this.visitRoot(node, path, scope);
          }
        };
        RelayDiffQueryBuilder.prototype.visitRoot = function visitRoot(node, path, scope) {
          return this.traverse(node, path, scope);
        };
        RelayDiffQueryBuilder.prototype.visitFragment = function visitFragment(node, path, scope) {
          return this.traverse(node, path, scope);
        };
        RelayDiffQueryBuilder.prototype.visitField = function visitField(node, path, _ref) {
          var connectionField = _ref.connectionField;
          var dataID = _ref.dataID;
          var edgeID = _ref.edgeID;
          var rangeInfo = _ref.rangeInfo;
          if (connectionField && rangeInfo) {
            if (edgeID) {
              if (node.getSchemaName() === EDGES) {
                return this.diffConnectionEdge(connectionField, node, path.getPath(node, edgeID), edgeID, rangeInfo);
              } else {
                return null;
              }
            } else {
              if (node.getSchemaName() === EDGES || node.getSchemaName() === PAGE_INFO) {
                return rangeInfo.diffCalls.length > 0 ? {
                  diffNode: node,
                  trackedNode: null
                } : null;
              }
            }
          }
          if (node.isScalar()) {
            return this.diffScalar(node, dataID);
          } else if (node.isGenerated()) {
            return {
              diffNode: node,
              trackedNode: null
            };
          } else if (node.isConnection()) {
            return this.diffConnection(node, path, dataID);
          } else if (node.isPlural()) {
            return this.diffPluralLink(node, path, dataID);
          } else {
            return this.diffLink(node, path, dataID);
          }
        };
        RelayDiffQueryBuilder.prototype.traverse = function traverse(node, path, scope) {
          var _this = this;
          var diffNode = undefined;
          var diffChildren = undefined;
          var trackedNode = undefined;
          var trackedChildren = undefined;
          var hasDiffField = false;
          var hasTrackedField = false;
          node.getChildren().forEach(function(child) {
            if (child instanceof RelayQuery.Field) {
              var diffOutput = _this.visitField(child, path, scope);
              var diffChild = diffOutput ? diffOutput.diffNode : null;
              var trackedChild = diffOutput ? diffOutput.trackedNode : null;
              if (diffChild) {
                diffChildren = diffChildren || [];
                diffChildren.push(diffChild);
                hasDiffField = hasDiffField || !diffChild.isGenerated();
              } else if (child.isRequisite() && !scope.rangeInfo) {
                diffChildren = diffChildren || [];
                diffChildren.push(child);
              }
              if (trackedChild) {
                trackedChildren = trackedChildren || [];
                trackedChildren.push(trackedChild);
                hasTrackedField = hasTrackedField || !trackedChild.isGenerated();
              } else if (child.isRequisite()) {
                trackedChildren = trackedChildren || [];
                trackedChildren.push(child);
              }
            } else if (child instanceof RelayQuery.Fragment) {
              var isCompatibleType = isCompatibleRelayFragmentType(child, _this._store.getType(scope.dataID));
              if (isCompatibleType) {
                var diffOutput = _this.traverse(child, path, scope);
                var diffChild = diffOutput ? diffOutput.diffNode : null;
                var trackedChild = diffOutput ? diffOutput.trackedNode : null;
                if (diffChild) {
                  diffChildren = diffChildren || [];
                  diffChildren.push(diffChild);
                  hasDiffField = true;
                }
                if (trackedChild) {
                  trackedChildren = trackedChildren || [];
                  trackedChildren.push(trackedChild);
                  hasTrackedField = true;
                }
              } else {
                diffChildren = diffChildren || [];
                diffChildren.push(child);
              }
            }
          });
          if (diffChildren && hasDiffField) {
            diffNode = node.clone(diffChildren);
          }
          if (trackedChildren && hasTrackedField) {
            trackedNode = node.clone(trackedChildren);
          }
          if (trackedNode && !(trackedNode instanceof RelayQuery.Fragment)) {
            this._tracker.trackNodeForID(trackedNode, scope.dataID, path);
          }
          return {
            diffNode: diffNode,
            trackedNode: trackedNode
          };
        };
        RelayDiffQueryBuilder.prototype.diffScalar = function diffScalar(field, dataID) {
          if (this._store.getField(dataID, field.getStorageKey()) === undefined) {
            return {
              diffNode: field,
              trackedNode: null
            };
          }
          return null;
        };
        RelayDiffQueryBuilder.prototype.diffLink = function diffLink(field, path, dataID) {
          var nextDataID = this._store.getLinkedRecordID(dataID, field.getStorageKey());
          if (nextDataID === undefined) {
            return {
              diffNode: field,
              trackedNode: null
            };
          }
          if (nextDataID === null) {
            return null;
          }
          return this.traverse(field, path.getPath(field, nextDataID), makeScope(nextDataID));
        };
        RelayDiffQueryBuilder.prototype.diffPluralLink = function diffPluralLink(field, path, dataID) {
          var _this2 = this;
          var linkedIDs = this._store.getLinkedRecordIDs(dataID, field.getStorageKey());
          if (linkedIDs === undefined) {
            return {
              diffNode: field,
              trackedNode: null
            };
          } else if (linkedIDs === null || linkedIDs.length === 0) {
            return null;
          } else if (field.getInferredRootCallName() === NODE) {
            var hasSplitQueries = false;
            linkedIDs.forEach(function(itemID) {
              var itemState = _this2.traverse(field, path.getPath(field, itemID), makeScope(itemID));
              if (itemState) {
                hasSplitQueries = hasSplitQueries || !!itemState.trackedNode || !!itemState.diffNode;
                if (itemState.diffNode) {
                  _this2.splitQuery(buildRoot(itemID, itemState.diffNode.getChildren(), path.getName(), field.getType()));
                }
              }
            });
            if (hasSplitQueries) {
              return {
                diffNode: null,
                trackedNode: field
              };
            }
          } else {
            var sampleItemID = linkedIDs[0];
            return this.traverse(field, path.getPath(field, sampleItemID), makeScope(sampleItemID));
          }
          return null;
        };
        RelayDiffQueryBuilder.prototype.diffConnection = function diffConnection(field, path, dataID) {
          var _this3 = this;
          var store = this._store;
          var connectionID = store.getLinkedRecordID(dataID, field.getStorageKey());
          var rangeInfo = store.getRangeMetadata(connectionID, field.getCallsWithValues());
          if (connectionID === undefined) {
            return {
              diffNode: field,
              trackedNode: null
            };
          }
          if (connectionID === null) {
            return null;
          }
          if (rangeInfo == null) {
            return this.traverse(field, path.getPath(field, connectionID), makeScope(connectionID));
          }
          var diffCalls = rangeInfo.diffCalls;
          var filteredEdges = rangeInfo.filteredEdges;
          var hasSplitQueries = false;
          filteredEdges.forEach(function(edge) {
            if (rangeInfo && connectionID) {
              var scope = {
                connectionField: field,
                dataID: connectionID,
                edgeID: edge.edgeID,
                rangeInfo: rangeInfo
              };
              var diffOutput = _this3.traverse(field, path.getPath(field, edge.edgeID), scope);
              if (diffOutput) {
                hasSplitQueries = hasSplitQueries || !!diffOutput.trackedNode;
              }
            }
          });
          var scope = {
            connectionField: field,
            dataID: connectionID,
            edgeID: null,
            rangeInfo: rangeInfo
          };
          var diffOutput = this.traverse(field, path.getPath(field, connectionID), scope);
          var diffNode = diffOutput ? diffOutput.diffNode : null;
          var trackedNode = diffOutput ? diffOutput.trackedNode : null;
          if (diffCalls.length && diffNode instanceof RelayQuery.Field) {
            diffNode = diffNode.cloneFieldWithCalls(diffNode.getChildren(), diffCalls);
          }
          if (hasSplitQueries) {
            trackedNode = field;
          }
          return {
            diffNode: diffNode,
            trackedNode: trackedNode
          };
        };
        RelayDiffQueryBuilder.prototype.diffConnectionEdge = function diffConnectionEdge(connectionField, edgeField, path, edgeID, rangeInfo) {
          var nodeID = this._store.getLinkedRecordID(edgeID, NODE);
          if (!nodeID || GraphQLStoreDataHandler.isClientID(nodeID)) {
            true ? warning(false, 'RelayDiffQueryBuilder: connection `node{*}` can only be refetched ' + 'if the node is refetchable by `id`. Cannot refetch data for field ' + '`%s`.', connectionField.getStorageKey()) : undefined;
            return null;
          }
          var hasSplitQueries = false;
          var diffOutput = this.traverse(edgeField, path.getPath(edgeField, edgeID), makeScope(edgeID));
          var diffNode = diffOutput ? diffOutput.diffNode : null;
          var trackedNode = diffOutput ? diffOutput.trackedNode : null;
          if (diffNode) {
            var _splitNodeAndEdgesFields = splitNodeAndEdgesFields(diffNode);
            var diffEdgesField = _splitNodeAndEdgesFields.edges;
            var diffNodeField = _splitNodeAndEdgesFields.node;
            if (diffNodeField) {
              hasSplitQueries = true;
              var nodeField = edgeField.getFieldByStorageKey('node');
              !nodeField ? true ? invariant(false, 'RelayDiffQueryBuilder: expected a `node` field for connection `%s`.', connectionField.getSchemaName()) : invariant(false) : undefined;
              this.splitQuery(buildRoot(nodeID, diffNodeField.getChildren(), path.getName(), nodeField.getType()));
            }
            if (diffEdgesField) {
              if (connectionField.isFindable()) {
                diffEdgesField = diffEdgesField.clone(diffEdgesField.getChildren().concat(nodeWithID));
                var connectionFind = connectionField.cloneFieldWithCalls([diffEdgesField], rangeInfo.filterCalls.concat({
                  name: 'find',
                  value: nodeID
                }));
                if (connectionFind) {
                  hasSplitQueries = true;
                  var connectionParent = path.getParent().getParent();
                  this.splitQuery(connectionParent.getQuery(connectionFind));
                }
              } else {
                true ? warning(false, 'RelayDiffQueryBuilder: connection `edges{*}` fields can only be ' + 'refetched if the connection supports the `find` call. Cannot ' + 'refetch data for field `%s`.', connectionField.getStorageKey()) : undefined;
              }
            }
          }
          return {
            diffNode: null,
            trackedNode: hasSplitQueries ? edgeField : trackedNode
          };
        };
        return RelayDiffQueryBuilder;
      })();
      function makeScope(dataID) {
        return {
          connectionField: null,
          dataID: dataID,
          edgeID: null,
          rangeInfo: null
        };
      }
      function splitNodeAndEdgesFields(edgeOrFragment) {
        var children = edgeOrFragment.getChildren();
        var edgeChildren = [];
        var hasNodeChild = false;
        var nodeChildren = [];
        var hasEdgeChild = false;
        for (var ii = 0; ii < children.length; ii++) {
          var child = children[ii];
          if (child instanceof RelayQuery.Field) {
            if (child.getSchemaName() === NODE) {
              var subFields = child.getChildren();
              nodeChildren = nodeChildren.concat(subFields);
              hasNodeChild = hasNodeChild || subFields.length !== 1 || !(subFields[0] instanceof RelayQuery.Field) || subFields[0].getSchemaName() !== 'id';
            } else {
              edgeChildren.push(child);
              hasEdgeChild = hasEdgeChild || !child.isRequisite();
            }
          } else if (child instanceof RelayQuery.Fragment) {
            var _splitNodeAndEdgesFields2 = splitNodeAndEdgesFields(child);
            var edges = _splitNodeAndEdgesFields2.edges;
            var node = _splitNodeAndEdgesFields2.node;
            if (edges) {
              edgeChildren.push(edges);
              hasEdgeChild = true;
            }
            if (node) {
              nodeChildren.push(node);
              hasNodeChild = true;
            }
          }
        }
        return {
          edges: hasEdgeChild ? edgeOrFragment.clone(edgeChildren) : null,
          node: hasNodeChild ? edgeOrFragment.clone(nodeChildren) : null
        };
      }
      function buildRoot(rootID, nodes, name, type) {
        var children = [idField, typeField];
        var fields = [];
        nodes.forEach(function(node) {
          if (node instanceof RelayQuery.Field) {
            fields.push(node);
          } else {
            children.push(node);
          }
        });
        children.push(RelayQuery.Fragment.build('diffRelayQuery', type, fields));
        return RelayQuery.Root.build(name, NODE, rootID, children, {identifyingArgName: RelayNodeInterface.ID}, NODE_TYPE);
      }
      module.exports = RelayProfiler.instrument('diffRelayQuery', diffRelayQuery);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(16);
      'use strict';
      var RelayNetworkLayer = __webpack_require__(25);
      var RelayProfiler = __webpack_require__(4);
      var RelayQueryRequest = __webpack_require__(149);
      var resolveImmediate = __webpack_require__(29);
      var queue = null;
      function fetchRelayQuery(query) {
        if (!queue) {
          (function() {
            queue = [];
            var currentQueue = queue;
            resolveImmediate(function() {
              queue = null;
              profileQueue(currentQueue);
              processQueue(currentQueue);
            });
          })();
        }
        var request = new RelayQueryRequest(query);
        queue.push(request);
        return request.getPromise();
      }
      function processQueue(currentQueue) {
        RelayNetworkLayer.sendQueries(currentQueue);
      }
      function profileQueue(currentQueue) {
        var firstResultProfiler = RelayProfiler.profile('fetchRelayQuery');
        currentQueue.forEach(function(query) {
          var profiler = RelayProfiler.profile('fetchRelayQuery.query');
          var onSettle = function onSettle() {
            profiler.stop();
            if (firstResultProfiler) {
              firstResultProfiler.stop();
              firstResultProfiler = null;
            }
          };
          query.getPromise().done(onSettle, onSettle);
        });
      }
      module.exports = fetchRelayQuery;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$keys = __webpack_require__(10)['default'];
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function filterExclusiveKeys(a, b) {
        var keysA = a ? _Object$keys(a) : [];
        var keysB = b ? _Object$keys(b) : [];
        if (keysA.length === 0 || keysB.length === 0) {
          return [keysA, keysB];
        }
        return [keysA.filter(function(key) {
          return !hasOwnProperty.call(b, key);
        }), keysB.filter(function(key) {
          return !hasOwnProperty.call(a, key);
        })];
      }
      module.exports = filterExclusiveKeys;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayQueryVisitor = __webpack_require__(18);
      var RelayRecordState = __webpack_require__(26);
      var isCompatibleRelayFragmentType = __webpack_require__(55);
      var EDGES = RelayConnectionInterface.EDGES;
      var PAGE_INFO = RelayConnectionInterface.PAGE_INFO;
      function findRelayQueryLeaves(store, cachedRecords, queryNode, dataID, path, rangeCalls) {
        var finder = new RelayQueryLeavesFinder(store, cachedRecords);
        var state = {
          dataID: dataID,
          missingData: false,
          path: path,
          rangeCalls: rangeCalls,
          rangeInfo: undefined
        };
        finder.visit(queryNode, state);
        return {
          missingData: state.missingData,
          pendingNodes: finder.getPendingNodes()
        };
      }
      var RelayQueryLeavesFinder = (function(_RelayQueryVisitor) {
        _inherits(RelayQueryLeavesFinder, _RelayQueryVisitor);
        function RelayQueryLeavesFinder(store) {
          var cachedRecords = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          _classCallCheck(this, RelayQueryLeavesFinder);
          _RelayQueryVisitor.call(this);
          this._store = store;
          this._cachedRecords = cachedRecords;
          this._pendingNodes = {};
        }
        RelayQueryLeavesFinder.prototype.getPendingNodes = function getPendingNodes() {
          return this._pendingNodes;
        };
        RelayQueryLeavesFinder.prototype.traverse = function traverse(node, state) {
          var children = node.getChildren();
          for (var ii = 0; ii < children.length; ii++) {
            if (state.missingData) {
              return;
            }
            this.visit(children[ii], state);
          }
        };
        RelayQueryLeavesFinder.prototype.visitFragment = function visitFragment(fragment, state) {
          var dataID = state.dataID;
          var recordState = this._store.getRecordState(dataID);
          if (recordState === RelayRecordState.UNKNOWN) {
            this._handleMissingData(fragment, state);
            return;
          } else if (recordState === RelayRecordState.NONEXISTENT) {
            return;
          }
          if (isCompatibleRelayFragmentType(fragment, this._store.getType(dataID))) {
            this.traverse(fragment, state);
          }
        };
        RelayQueryLeavesFinder.prototype.visitField = function visitField(field, state) {
          var dataID = state.dataID;
          var recordState = this._store.getRecordState(dataID);
          if (recordState === RelayRecordState.UNKNOWN) {
            this._handleMissingData(field, state);
            return;
          } else if (recordState === RelayRecordState.NONEXISTENT) {
            return;
          }
          if (state.rangeCalls && !state.rangeInfo) {
            var metadata = this._store.getRangeMetadata(dataID, state.rangeCalls);
            if (metadata) {
              state.rangeInfo = metadata;
            }
          }
          var rangeInfo = state.rangeInfo;
          if (rangeInfo && field.getSchemaName() === EDGES) {
            this._visitEdges(field, state);
          } else if (rangeInfo && field.getSchemaName() === PAGE_INFO) {
            this._visitPageInfo(field, state);
          } else if (field.isScalar()) {
            this._visitScalar(field, state);
          } else if (field.isPlural()) {
            this._visitPlural(field, state);
          } else if (field.isConnection()) {
            this._visitConnection(field, state);
          } else {
            this._visitLinkedField(field, state);
          }
        };
        RelayQueryLeavesFinder.prototype._visitScalar = function _visitScalar(field, state) {
          var fieldData = this._store.getField(state.dataID, field.getStorageKey());
          if (fieldData === undefined) {
            this._handleMissingData(field, state);
          }
        };
        RelayQueryLeavesFinder.prototype._visitPlural = function _visitPlural(field, state) {
          var dataIDs = this._store.getLinkedRecordIDs(state.dataID, field.getStorageKey());
          if (dataIDs === undefined) {
            this._handleMissingData(field, state);
            return;
          }
          if (dataIDs) {
            for (var ii = 0; ii < dataIDs.length; ii++) {
              if (state.missingData) {
                break;
              }
              var nextState = {
                dataID: dataIDs[ii],
                missingData: false,
                path: state.path.getPath(field, dataIDs[ii]),
                rangeCalls: undefined,
                rangeInfo: undefined
              };
              this.traverse(field, nextState);
              state.missingData = nextState.missingData;
            }
          }
        };
        RelayQueryLeavesFinder.prototype._visitConnection = function _visitConnection(field, state) {
          var calls = field.getCallsWithValues();
          var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
          if (dataID === undefined) {
            this._handleMissingData(field, state);
            return;
          }
          if (dataID) {
            var nextState = {
              dataID: dataID,
              missingData: false,
              path: state.path.getPath(field, dataID),
              rangeCalls: calls,
              rangeInfo: null
            };
            var metadata = this._store.getRangeMetadata(dataID, calls);
            if (metadata) {
              nextState.rangeInfo = metadata;
            }
            this.traverse(field, nextState);
            state.missingData = state.missingData || nextState.missingData;
          }
        };
        RelayQueryLeavesFinder.prototype._visitEdges = function _visitEdges(field, state) {
          var rangeInfo = state.rangeInfo;
          if (!rangeInfo) {
            this._handleMissingData(field, state);
            return;
          }
          if (rangeInfo.diffCalls.length) {
            state.missingData = true;
            return;
          }
          var edgeIDs = rangeInfo.requestedEdgeIDs;
          for (var ii = 0; ii < edgeIDs.length; ii++) {
            if (state.missingData) {
              break;
            }
            var nextState = {
              dataID: edgeIDs[ii],
              missingData: false,
              path: state.path.getPath(field, edgeIDs[ii]),
              rangeCalls: undefined,
              rangeInfo: undefined
            };
            this.traverse(field, nextState);
            state.missingData = state.missingData || nextState.missingData;
          }
        };
        RelayQueryLeavesFinder.prototype._visitPageInfo = function _visitPageInfo(field, state) {
          var rangeInfo = state.rangeInfo;
          if (!rangeInfo || !rangeInfo.pageInfo) {
            this._handleMissingData(field, state);
            return;
          }
        };
        RelayQueryLeavesFinder.prototype._visitLinkedField = function _visitLinkedField(field, state) {
          var dataID = this._store.getLinkedRecordID(state.dataID, field.getStorageKey());
          if (dataID === undefined) {
            this._handleMissingData(field, state);
            return;
          }
          if (dataID) {
            var nextState = {
              dataID: dataID,
              missingData: false,
              path: state.path.getPath(field, dataID),
              rangeCalls: undefined,
              rangeInfo: undefined
            };
            this.traverse(field, nextState);
            state.missingData = state.missingData || nextState.missingData;
          }
        };
        RelayQueryLeavesFinder.prototype._handleMissingData = function _handleMissingData(node, state) {
          var dataID = state.dataID;
          if (this._cachedRecords.hasOwnProperty(dataID)) {
            state.missingData = true;
          } else {
            this._pendingNodes[dataID] = this._pendingNodes[dataID] || [];
            this._pendingNodes[dataID].push({
              node: node,
              path: state.path,
              rangeCalls: state.rangeCalls
            });
          }
        };
        return RelayQueryLeavesFinder;
      })(RelayQueryVisitor);
      module.exports = findRelayQueryLeaves;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _toConsumableArray = __webpack_require__(23)['default'];
      function flattenSplitRelayQueries(splitQueries) {
        var flattenedQueries = [];
        var queue = [splitQueries];
        while (queue.length) {
          splitQueries = queue.shift();
          var _splitQueries = splitQueries;
          var required = _splitQueries.required;
          var deferred = _splitQueries.deferred;
          if (required) {
            flattenedQueries.push(required);
          }
          if (deferred.length) {
            queue.push.apply(queue, _toConsumableArray(deferred));
          }
        }
        return flattenedQueries;
      }
      module.exports = flattenSplitRelayQueries;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var crc32 = __webpack_require__(107);
      var PREFIX = '_';
      function generateRQLFieldAlias(input) {
        var index = input.indexOf('.');
        if (index === -1) {
          return input;
        }
        return PREFIX + input.substr(0, index) + Math.abs(crc32(input)).toString(36);
      }
      module.exports = generateRQLFieldAlias;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var KEY = '$getWeakIdForObject';
      if (true) {
        KEY += Math.random().toString(36).slice(2);
      }
      var _nextNodeID = 0;
      function getWeakIdForObject(node) {
        var id = node[KEY];
        if (id == null) {
          id = (_nextNodeID++).toString(36);
          node[KEY] = id;
        }
        return id;
      }
      module.exports = getWeakIdForObject;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$keys = __webpack_require__(10)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQuery = __webpack_require__(3);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var warning = __webpack_require__(11);
      var ARGUMENTS = /^(\w+)(?:\((.+?)\))?$/;
      var ARGUMENT_NAME = /(\w+)(?=\s*:)/;
      var DEPRECATED_CALLS = /^\w+(?:\.\w+\(.*?\))+$/;
      var DEPRECATED_CALL = /^(\w+)\((.*?)\)$/;
      var NODE = RelayConnectionInterface.NODE;
      var EDGES = RelayConnectionInterface.EDGES;
      var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
      var ID = RelayNodeInterface.ID;
      var idField = RelayQuery.Field.build({
        fieldName: ID,
        type: 'String'
      });
      var cursorField = RelayQuery.Field.build({
        fieldName: 'cursor',
        type: 'String'
      });
      function inferRelayFieldsFromData(data) {
        var fields = [];
        forEachObject(data, function(value, key) {
          if (!GraphQLStoreDataHandler.isMetadataKey(key)) {
            fields.push(inferField(value, key));
          }
        });
        return fields;
      }
      function inferField(value, key) {
        var metadata = {isPlural: false};
        var children = undefined;
        if (Array.isArray(value)) {
          var element = value[0];
          if (element && typeof element === 'object') {
            children = inferRelayFieldsFromData(element);
          } else {
            children = [];
          }
          metadata.isPlural = true;
        } else if (typeof value === 'object' && value !== null) {
          children = inferRelayFieldsFromData(value);
        } else {
          children = [];
        }
        if (key === NODE) {
          children.push(idField);
        } else if (key === EDGES) {
          children.push(cursorField);
        }
        return buildField(key, children, metadata);
      }
      function buildField(key, children, metadata) {
        var fieldName = key;
        var calls = null;
        if (DEPRECATED_CALLS.test(key)) {
          true ? warning(false, 'inferRelayFieldsFromData(): Encountered an optimistic payload with ' + 'a deprecated field call string, `%s`. Use valid GraphQL OSS syntax.', key) : undefined;
          var parts = key.split('.');
          if (parts.length > 1) {
            fieldName = parts.shift();
            calls = parts.map(function(callString) {
              var captures = callString.match(DEPRECATED_CALL);
              !captures ? true ? invariant(false, 'inferRelayFieldsFromData(): Malformed data key, `%s`.', key) : invariant(false) : undefined;
              var value = captures[2].split(',');
              return {
                name: captures[1],
                value: value.length === 1 ? value[0] : value
              };
            });
          }
        } else {
          var captures = key.match(ARGUMENTS);
          !captures ? true ? invariant(false, 'inferRelayFieldsFromData(): Malformed data key, `%s`.', key) : invariant(false) : undefined;
          fieldName = captures[1];
          if (captures[2]) {
            try {
              (function() {
                var args = JSON.parse('{' + captures[2].replace(ARGUMENT_NAME, '"$1"') + '}');
                calls = _Object$keys(args).map(function(name) {
                  return {
                    name: name,
                    value: args[name]
                  };
                });
              })();
            } catch (error) {
              true ? true ? invariant(false, 'inferRelayFieldsFromData(): Malformed or unsupported data key, ' + '`%s`. Only booleans, strings, and numbers are currenly supported, ' + 'and commas are required. Parse failure reason was `%s`.', key, error.message) : invariant(false) : undefined;
            }
          }
        }
        return RelayQuery.Field.build({
          calls: calls,
          children: children,
          fieldName: fieldName,
          metadata: metadata,
          type: ANY_TYPE
        });
      }
      module.exports = inferRelayFieldsFromData;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryTransform = __webpack_require__(50);
      var invariant = __webpack_require__(2);
      function intersectRelayQuery(subjectNode, patternNode, filterUnterminatedRange) {
        filterUnterminatedRange = filterUnterminatedRange || returnsFalse;
        var visitor = new RelayQueryIntersector(filterUnterminatedRange);
        return visitor.traverse(subjectNode, patternNode);
      }
      var RelayQueryIntersector = (function(_RelayQueryTransform) {
        _inherits(RelayQueryIntersector, _RelayQueryTransform);
        function RelayQueryIntersector(filterUnterminatedRange) {
          _classCallCheck(this, RelayQueryIntersector);
          _RelayQueryTransform.call(this);
          this._filterUnterminatedRange = filterUnterminatedRange;
        }
        RelayQueryIntersector.prototype.traverse = function traverse(subjectNode, patternNode) {
          var _this = this;
          if (subjectNode.isScalar()) {
            return subjectNode;
          }
          if (!hasChildren(patternNode)) {
            if (subjectNode instanceof RelayQuery.Field && subjectNode.isConnection() && this._filterUnterminatedRange(subjectNode)) {
              return filterRangeFields(subjectNode);
            }
            return subjectNode;
          }
          return subjectNode.clone(subjectNode.getChildren().map(function(subjectChild) {
            if (subjectChild instanceof RelayQuery.Fragment) {
              return _this.visit(subjectChild, patternNode);
            }
            if (subjectChild instanceof RelayQuery.Field) {
              var schemaName = subjectChild.getSchemaName();
              var patternChild;
              var patternChildren = patternNode.getChildren();
              for (var ii = 0; ii < patternChildren.length; ii++) {
                var child = patternChildren[ii];
                !(child instanceof RelayQuery.Field) ? true ? invariant(false, 'intersectRelayQuery(): Nodes in `patternNode` must be fields.') : invariant(false) : undefined;
                if (child.getSchemaName() === schemaName) {
                  patternChild = child;
                  break;
                }
              }
              if (patternChild) {
                return _this.visit(subjectChild, patternChild);
              }
            }
            return null;
          }));
        };
        return RelayQueryIntersector;
      })(RelayQueryTransform);
      var RelayQueryRangeFilter = (function(_RelayQueryTransform2) {
        _inherits(RelayQueryRangeFilter, _RelayQueryTransform2);
        function RelayQueryRangeFilter() {
          _classCallCheck(this, RelayQueryRangeFilter);
          _RelayQueryTransform2.apply(this, arguments);
        }
        RelayQueryRangeFilter.prototype.visitField = function visitField(node) {
          var schemaName = node.getSchemaName();
          if (schemaName === RelayConnectionInterface.EDGES || schemaName === RelayConnectionInterface.PAGE_INFO) {
            return null;
          } else {
            return node;
          }
        };
        return RelayQueryRangeFilter;
      })(RelayQueryTransform);
      var rangeFilter = new RelayQueryRangeFilter();
      function filterRangeFields(node) {
        return rangeFilter.traverse(node, undefined);
      }
      function returnsFalse() {
        return false;
      }
      function hasChildren(node) {
        return !node.getChildren().every(isGenerated);
      }
      function isGenerated(node) {
        return node.isGenerated();
      }
      module.exports = intersectRelayQuery;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(173);
    }, function(module, exports) {
      'use strict';
      function prepareRelayOSSContainerProps(relayProps) {
        return {relay: relayProps};
      }
      module.exports = prepareRelayOSSContainerProps;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var forEachObject = __webpack_require__(9);
      var invariant = __webpack_require__(2);
      var mapObject = __webpack_require__(44);
      function printRelayOSSQuery(node) {
        var printerState = {
          fragmentMap: {},
          nextVariableID: 0,
          variableMap: {}
        };
        var queryText = null;
        if (node instanceof RelayQuery.Root) {
          queryText = printRoot(node, printerState);
        } else if (node instanceof RelayQuery.Fragment) {
          queryText = printFragment(node, printerState);
        } else if (node instanceof RelayQuery.Field) {
          queryText = printField(node, printerState);
        } else if (node instanceof RelayQuery.Mutation) {
          queryText = printMutation(node, printerState);
        }
        !queryText ? true ? invariant(false, 'printRelayOSSQuery(): Unsupported node type.') : invariant(false) : undefined;
        var text = queryText;
        forEachObject(printerState.fragmentMap, function(fragmentText, fragmentID) {
          if (fragmentText) {
            text = text + ' ' + fragmentText;
          }
        });
        var variables = mapObject(printerState.variableMap, function(variable) {
          return variable.value;
        });
        return {
          text: text,
          variables: variables
        };
      }
      function printRoot(node, printerState) {
        !!node.getBatchCall() ? true ? invariant(false, 'printRelayOSSQuery(): Deferred queries are not supported.') : invariant(false) : undefined;
        var identifyingArg = node.getIdentifyingArg();
        var identifyingArgName = identifyingArg && identifyingArg.name || null;
        var identifyingArgType = identifyingArg && identifyingArg.type || null;
        var identifyingArgValue = identifyingArg && identifyingArg.value || null;
        var fieldName = node.getFieldName();
        if (identifyingArgValue != null) {
          !identifyingArgName ? true ? invariant(false, 'printRelayOSSQuery(): Expected an argument name for root field `%s`.', fieldName) : invariant(false) : undefined;
          var rootArgString = printArgument(identifyingArgName, identifyingArgValue, identifyingArgType, printerState);
          if (rootArgString) {
            fieldName += '(' + rootArgString + ')';
          }
        }
        var children = printChildren(node, printerState);
        var queryString = node.getName() + printVariableDefinitions(printerState);
        fieldName += printDirectives(node);
        return 'query ' + queryString + '{' + fieldName + children + '}';
      }
      function printMutation(node, printerState) {
        var call = node.getCall();
        var inputString = printArgument(node.getCallVariableName(), call.value, node.getInputType(), printerState);
        !inputString ? true ? invariant(false, 'printRelayOSSQuery(): Expected mutation `%s` to have a value for `%s`.', node.getName(), node.getCallVariableName()) : invariant(false) : undefined;
        var children = printChildren(node, printerState);
        var mutationString = node.getName() + printVariableDefinitions(printerState);
        var fieldName = call.name + '(' + inputString + ')';
        return 'mutation ' + mutationString + '{' + fieldName + children + '}';
      }
      function printVariableDefinitions(printerState) {
        var argStrings = null;
        forEachObject(printerState.variableMap, function(variable, variableID) {
          argStrings = argStrings || [];
          argStrings.push('$' + variableID + ':' + variable.type);
        });
        if (argStrings) {
          return '(' + argStrings.join(',') + ')';
        }
        return '';
      }
      function printFragment(node, printerState) {
        var directives = printDirectives(node);
        return 'fragment ' + node.getDebugName() + ' on ' + node.getType() + directives + printChildren(node, printerState);
      }
      function printInlineFragment(node, printerState) {
        if (!node.getChildren().length) {
          return null;
        }
        var fragmentID = node.getFragmentID();
        var fragmentMap = printerState.fragmentMap;
        if (!(fragmentID in fragmentMap)) {
          var directives = printDirectives(node);
          fragmentMap[fragmentID] = 'fragment ' + node.getFragmentID() + ' on ' + node.getType() + directives + printChildren(node, printerState);
        }
        return '...' + fragmentID;
      }
      function printField(node, printerState) {
        !(node instanceof RelayQuery.Field) ? true ? invariant(false, 'printRelayOSSQuery(): Query must be flattened before printing.') : invariant(false) : undefined;
        var schemaName = node.getSchemaName();
        var serializationKey = node.getSerializationKey();
        var callsWithValues = node.getCallsWithValues();
        var fieldString = schemaName;
        var argStrings = null;
        if (callsWithValues.length) {
          callsWithValues.forEach(function(_ref) {
            var name = _ref.name;
            var value = _ref.value;
            var argString = printArgument(name, value, node.getCallType(name), printerState);
            if (argString) {
              argStrings = argStrings || [];
              argStrings.push(argString);
            }
          });
          if (argStrings) {
            fieldString += '(' + argStrings.join(',') + ')';
          }
        }
        var directives = printDirectives(node);
        return (serializationKey !== schemaName ? serializationKey + ':' : '') + fieldString + directives + printChildren(node, printerState);
      }
      function printChildren(node, printerState) {
        var children = undefined;
        node.getChildren().forEach(function(node) {
          if (node instanceof RelayQuery.Field) {
            children = children || [];
            children.push(printField(node, printerState));
          } else {
            !(node instanceof RelayQuery.Fragment) ? true ? invariant(false, 'printRelayOSSQuery(): expected child node to be a `Field` or ' + '`Fragment`, got `%s`.', node.constructor.name) : invariant(false) : undefined;
            var printedFragment = printInlineFragment(node, printerState);
            if (printedFragment) {
              children = children || [];
              children.push(printedFragment);
            }
          }
        });
        if (!children) {
          return '';
        }
        return '{' + children.join(',') + '}';
      }
      function printDirectives(node) {
        var directiveStrings;
        node.getDirectives().forEach(function(directive) {
          var dirString = '@' + directive.name;
          if (directive.arguments.length) {
            dirString += '(' + directive.arguments.map(printDirective).join(',') + ')';
          }
          directiveStrings = directiveStrings || [];
          directiveStrings.push(dirString);
        });
        if (!directiveStrings) {
          return '';
        }
        return ' ' + directiveStrings.join(' ');
      }
      function printDirective(_ref2) {
        var name = _ref2.name;
        var value = _ref2.value;
        !(typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') ? true ? invariant(false, 'printRelayOSSQuery(): Relay only supports directives with scalar values ' + '(boolean, number, or string), got `%s: %s`.', name, value) : invariant(false) : undefined;
        return name + ':' + JSON.stringify(value);
      }
      function printArgument(name, value, type, printerState) {
        var stringValue;
        if (value == null) {
          return value;
        }
        if (type != null) {
          var variableID = createVariable(name, value, type, printerState);
          stringValue = '$' + variableID;
        } else {
          stringValue = JSON.stringify(value);
        }
        return name + ':' + stringValue;
      }
      function createVariable(name, value, type, printerState) {
        var variableID = name + '_' + printerState.nextVariableID.toString(36);
        printerState.nextVariableID++;
        printerState.variableMap[variableID] = {
          type: type,
          value: value
        };
        return variableID;
      }
      module.exports = RelayProfiler.instrument('printRelayQuery', printRelayOSSQuery);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _classCallCheck = __webpack_require__(1)['default'];
      var GraphQLStoreDataHandler = __webpack_require__(6);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryPath = __webpack_require__(36);
      var findRelayQueryLeaves = __webpack_require__(166);
      var forEachObject = __webpack_require__(9);
      var forEachRootCallArg = __webpack_require__(27);
      var invariant = __webpack_require__(2);
      var isEmpty = __webpack_require__(226);
      function readRelayDiskCache(queries, store, cachedRecords, cachedRootCallMap, cacheManager, callbacks) {
        var reader = new RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, callbacks);
        reader.read(queries);
      }
      var RelayCacheReader = (function() {
        function RelayCacheReader(store, cachedRecords, cachedRootCallMap, cacheManager, callbacks) {
          _classCallCheck(this, RelayCacheReader);
          this._store = store;
          this._cachedRecords = cachedRecords;
          this._cachedRootCallMap = cachedRootCallMap;
          this._cacheManager = cacheManager;
          this._callbacks = callbacks;
          this._hasFailed = false;
          this._pendingNodes = {};
          this._pendingRoots = {};
        }
        RelayCacheReader.prototype.read = function read(queries) {
          var _this = this;
          forEachObject(queries, function(query) {
            if (_this._hasFailed) {
              return;
            }
            if (query) {
              (function() {
                var storageKey = query.getStorageKey();
                forEachRootCallArg(query, function(identifyingArgValue) {
                  if (_this._hasFailed) {
                    return;
                  }
                  identifyingArgValue = identifyingArgValue || '';
                  _this._visitRoot(storageKey, identifyingArgValue, query);
                });
              })();
            }
          });
          if (this._isDone()) {
            this._callbacks.onSuccess && this._callbacks.onSuccess();
          }
        };
        RelayCacheReader.prototype._visitRoot = function _visitRoot(storageKey, identifyingArgValue, query) {
          var dataID = this._store.getDataID(storageKey, identifyingArgValue);
          if (dataID == null) {
            if (this._cachedRootCallMap.hasOwnProperty(storageKey) && this._cachedRootCallMap[storageKey].hasOwnProperty(identifyingArgValue)) {
              this._handleFailed();
            } else {
              this._queueRoot(storageKey, identifyingArgValue, query);
            }
          } else {
            this._visitNode(dataID, {
              node: query,
              path: new RelayQueryPath(query),
              rangeCalls: undefined
            });
          }
        };
        RelayCacheReader.prototype._queueRoot = function _queueRoot(storageKey, identifyingArgValue, query) {
          var _this2 = this;
          var rootKey = storageKey + '*' + identifyingArgValue;
          if (this._pendingRoots.hasOwnProperty(rootKey)) {
            this._pendingRoots[rootKey].push(query);
          } else {
            this._pendingRoots[rootKey] = [query];
            this._cacheManager.readRootCall(storageKey, identifyingArgValue, function(error, value) {
              if (_this2._hasFailed) {
                return;
              }
              if (error) {
                _this2._handleFailed();
                return;
              }
              var roots = _this2._pendingRoots[rootKey];
              delete _this2._pendingRoots[rootKey];
              _this2._cachedRootCallMap[storageKey] = _this2._cachedRootCallMap[storageKey] || {};
              _this2._cachedRootCallMap[storageKey][identifyingArgValue] = value;
              if (value == null) {
                _this2._handleFailed();
              } else {
                (function() {
                  var dataID = value;
                  roots.forEach(function(root) {
                    if (_this2._hasFailed) {
                      return;
                    }
                    _this2._visitNode(dataID, {
                      node: root,
                      path: new RelayQueryPath(root),
                      rangeCalls: undefined
                    });
                  });
                })();
              }
              if (_this2._isDone()) {
                _this2._callbacks.onSuccess && _this2._callbacks.onSuccess();
              }
            });
          }
        };
        RelayCacheReader.prototype._visitNode = function _visitNode(dataID, pendingItem) {
          var _this3 = this;
          var _findRelayQueryLeaves = findRelayQueryLeaves(this._store, this._cachedRecords, pendingItem.node, dataID, pendingItem.path, pendingItem.rangeCalls);
          var missingData = _findRelayQueryLeaves.missingData;
          var pendingNodes = _findRelayQueryLeaves.pendingNodes;
          if (missingData) {
            this._handleFailed();
            return;
          }
          forEachObject(pendingNodes, function(pendingItems, dataID) {
            _this3._queueNode(dataID, pendingItems);
          });
        };
        RelayCacheReader.prototype._queueNode = function _queueNode(dataID, pendingItems) {
          var _this4 = this;
          if (this._pendingNodes.hasOwnProperty(dataID)) {
            var _pendingNodes$dataID;
            (_pendingNodes$dataID = this._pendingNodes[dataID]).push.apply(_pendingNodes$dataID, pendingItems);
          } else {
            this._pendingNodes[dataID] = pendingItems;
            this._cacheManager.readNode(dataID, function(error, value) {
              if (_this4._hasFailed) {
                return;
              }
              if (error) {
                _this4._handleFailed();
                return;
              }
              if (value && GraphQLStoreDataHandler.isClientID(dataID)) {
                value.__path__ = pendingItems[0].path;
              }
              _this4._cachedRecords[dataID] = value;
              var items = _this4._pendingNodes[dataID];
              delete _this4._pendingNodes[dataID];
              if (value === undefined) {
                _this4._handleFailed();
              } else {
                items.forEach(function(item) {
                  if (_this4._hasFailed) {
                    return;
                  }
                  _this4._visitNode(dataID, item);
                });
              }
              if (_this4._isDone()) {
                _this4._callbacks.onSuccess && _this4._callbacks.onSuccess();
              }
            });
          }
        };
        RelayCacheReader.prototype._isDone = function _isDone() {
          return isEmpty(this._pendingRoots) && isEmpty(this._pendingNodes) && !this._hasFailed;
        };
        RelayCacheReader.prototype._handleFailed = function _handleFailed() {
          !!this._hasFailed ? true ? invariant(false, 'RelayStoreReader: Query set already failed') : invariant(false) : undefined;
          this._hasFailed = true;
          this._callbacks.onFailure && this._callbacks.onFailure();
        };
        return RelayCacheReader;
      })();
      module.exports = readRelayDiskCache;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _Object$keys = __webpack_require__(10)['default'];
      var GraphQLFragmentPointer = __webpack_require__(21);
      function recycleNodesInto(prevData, nextData) {
        if (typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
          return nextData;
        }
        var canRecycle = false;
        if (prevData instanceof GraphQLFragmentPointer) {
          canRecycle = nextData instanceof GraphQLFragmentPointer && nextData.equals(prevData);
        } else {
          var isPrevArray = Array.isArray(prevData);
          var isNextArray = Array.isArray(nextData);
          if (isPrevArray && isNextArray) {
            var prevArray = prevData;
            var nextArray = nextData;
            canRecycle = nextArray.reduce(function(wasEqual, nextItem, ii) {
              nextArray[ii] = recycleNodesInto(prevArray[ii], nextItem);
              return wasEqual && nextArray[ii] === prevArray[ii];
            }, true) && prevArray.length === nextArray.length;
          } else if (!isPrevArray && !isNextArray) {
            var prevObject = prevData;
            var nextObject = nextData;
            var prevKeys = _Object$keys(prevObject);
            var nextKeys = _Object$keys(nextObject);
            canRecycle = nextKeys.reduce(function(wasEqual, key) {
              var nextValue = nextObject[key];
              nextObject[key] = recycleNodesInto(prevObject[key], nextValue);
              return wasEqual && nextObject[key] === prevObject[key];
            }, true) && prevKeys.length === nextKeys.length;
          }
        }
        return canRecycle ? prevData : nextData;
      }
      module.exports = recycleNodesInto;
    }, function(module, exports) {
      'use strict';
      var TYPE = '__type__';
      function sortTypeFirst(a, b) {
        if (a === b) {
          return 0;
        }
        if (a === TYPE) {
          return -1;
        }
        if (b === TYPE) {
          return 1;
        }
        return 0;
      }
      module.exports = sortTypeFirst;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      Object.defineProperty(exports, '__esModule', {value: true});
      var QueryBuilder = __webpack_require__(17);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryTransform = __webpack_require__(50);
      var RelayRefQueryDescriptor = __webpack_require__(155);
      var invariant = __webpack_require__(2);
      function splitDeferredRelayQueries(node) {
        var splitter = new GraphQLSplitDeferredQueries();
        var splitQueries = {
          __parent__: null,
          __path__: [],
          __refQuery__: null,
          deferred: [],
          required: null
        };
        splitter.visit(node, splitQueries);
        return buildQueries(splitQueries);
      }
      function getRequisiteSiblings(node, parent) {
        var siblings = parent.getChildren().filter(function(child) {
          return child !== node && child instanceof RelayQuery.Field && child.isRequisite();
        });
        return siblings.map(function(sibling) {
          var children = sibling.getChildren().filter(function(child) {
            return child instanceof RelayQuery.Field && child.isRequisite();
          });
          var clone = sibling.clone(children);
          !clone ? true ? invariant(false, 'splitDeferredRelayQueries(): Unexpected non-scalar, requisite field.') : invariant(false) : undefined;
          return clone;
        });
      }
      function wrapNode(node, path) {
        for (var ii = path.length - 1; ii >= 0; ii--) {
          var parent = path[ii];
          if (parent instanceof RelayQuery.Field && parent.getInferredRootCallName()) {
            return new RelayRefQueryDescriptor(node, path.slice(0, ii + 1));
          }
          var siblings = getRequisiteSiblings(node, parent);
          var children = [node].concat(siblings);
          node = parent.clone(children);
        }
        !(node instanceof RelayQuery.Root) ? true ? invariant(false, 'splitDeferredRelayQueries(): Cannot build query without a root node.') : invariant(false) : undefined;
        var identifyingArg = node.getIdentifyingArg();
        var identifyingArgName = identifyingArg && identifyingArg.name || null;
        var identifyingArgValue = identifyingArg && identifyingArg.value || null;
        var metadata = {
          identifyingArgName: identifyingArgName,
          isDeferred: true
        };
        return RelayQuery.Root.build(node.getName(), node.getFieldName(), identifyingArgValue, node.getChildren(), metadata, node.getType());
      }
      function isEmpty(node) {
        if (node.isScalar()) {
          return node.isGenerated() && !node.isRefQueryDependency();
        } else {
          return node.getChildren().every(isEmpty);
        }
      }
      function buildQueries(splitQueries) {
        if (splitQueries.required && isEmpty(splitQueries.required)) {
          splitQueries.required = null;
        }
        splitQueries.deferred = splitQueries.deferred.map(function(nestedSplitQueries) {
          var descriptor = nestedSplitQueries.__refQuery__;
          if (descriptor) {
            var context = splitQueries.required;
            if (!context) {
              var parentSplitQueries = splitQueries;
              while (parentSplitQueries.__parent__) {
                context = parentSplitQueries.__parent__.required;
                if (context) {
                  break;
                }
                parentSplitQueries = parentSplitQueries.__parent__;
              }
            }
            !context ? true ? invariant(false, 'splitDeferredRelayQueries(): Expected a context root query.') : invariant(false) : undefined;
            nestedSplitQueries.required = createRefQuery(descriptor, context);
          }
          return buildQueries(nestedSplitQueries);
        });
        return splitQueries;
      }
      function createRefQuery(descriptor, context) {
        var node = descriptor.node;
        !(node instanceof RelayQuery.Field || node instanceof RelayQuery.Fragment) ? true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a field or fragment.') : invariant(false) : undefined;
        var path = ['$', '*'];
        var parent;
        for (var ii = 0; ii < descriptor.path.length; ii++) {
          parent = descriptor.path[ii];
          if (parent instanceof RelayQuery.Field) {
            path.push(parent.getSerializationKey());
            if (parent.isPlural()) {
              path.push('*');
            }
          }
        }
        !(path.length > 2) ? true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a complete path.') : invariant(false) : undefined;
        var field = parent;
        var primaryKey = field.getInferredPrimaryKey();
        !primaryKey ? true ? invariant(false, 'splitDeferredRelayQueries(): Ref query requires a primary key.') : invariant(false) : undefined;
        path.push(primaryKey);
        var root = RelayQuery.Root.build(context.getName(), RelayNodeInterface.NODES, QueryBuilder.createBatchCallVariable(context.getID(), path.join('.')), [node], {
          identifyingArgName: RelayNodeInterface.ID,
          isDeferred: true
        }, RelayNodeInterface.NODE_TYPE);
        var result = root;
        return result;
      }
      var GraphQLSplitDeferredQueries = (function(_RelayQueryTransform) {
        _inherits(GraphQLSplitDeferredQueries, _RelayQueryTransform);
        function GraphQLSplitDeferredQueries() {
          _classCallCheck(this, GraphQLSplitDeferredQueries);
          _RelayQueryTransform.apply(this, arguments);
        }
        GraphQLSplitDeferredQueries.prototype.visitField = function visitField(node, splitQueries) {
          if (!node.hasDeferredDescendant()) {
            return node;
          }
          splitQueries.__path__.push(node);
          var result = this.traverse(node, splitQueries);
          splitQueries.__path__.pop();
          if (result && node.getInferredRootCallName()) {
            var key = node.getInferredPrimaryKey();
            var children = result.getChildren().map(function(child) {
              if (child instanceof RelayQuery.Field && child.getSchemaName() === key) {
                return child.cloneAsRefQueryDependency();
              } else {
                return child;
              }
            });
            result = result.clone(children);
          }
          return result;
        };
        GraphQLSplitDeferredQueries.prototype.visitFragment = function visitFragment(node, splitQueries) {
          if (!node.getChildren().length) {
            return null;
          }
          if (node.isDeferred()) {
            var path = splitQueries.__path__;
            var deferred = {
              __parent__: splitQueries,
              __path__: path,
              __refQuery__: null,
              deferred: [],
              required: null
            };
            var result = this.traverse(node, deferred);
            if (result) {
              var wrapped = wrapNode(result, path);
              if (wrapped instanceof RelayQuery.Root) {
                deferred.required = wrapped;
              } else if (wrapped instanceof RelayRefQueryDescriptor) {
                deferred.__refQuery__ = wrapped;
              }
            }
            if (result || deferred.deferred.length) {
              splitQueries.deferred.push(deferred);
            }
            return null;
          } else if (node.hasDeferredDescendant()) {
            return this.traverse(node, splitQueries);
          } else {
            return node;
          }
        };
        GraphQLSplitDeferredQueries.prototype.visitRoot = function visitRoot(node, splitQueries) {
          var result;
          if (!node.hasDeferredDescendant()) {
            splitQueries.required = node;
            return node;
          } else {
            splitQueries.__path__.push(node);
            result = this.traverse(node, splitQueries);
            splitQueries.__path__.pop();
            splitQueries.required = result;
            return result;
          }
        };
        return GraphQLSplitDeferredQueries;
      })(RelayQueryTransform);
      var instrumented = RelayProfiler.instrument('splitDeferredRelayQueries', splitDeferredRelayQueries);
      module.exports = instrumented;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayProfiler = __webpack_require__(4);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryTransform = __webpack_require__(50);
      var areEqual = __webpack_require__(106);
      var invariant = __webpack_require__(2);
      function subtractRelayQuery(minuend, subtrahend) {
        var visitor = new RelayQuerySubtractor();
        var state = {
          isEmpty: true,
          subtrahend: subtrahend
        };
        var diff = visitor.visit(minuend, state);
        if (!state.isEmpty) {
          !(diff instanceof RelayQuery.Root) ? true ? invariant(false, 'subtractRelayQuery(): Expected a subtracted query root.') : invariant(false) : undefined;
          return diff;
        }
        return null;
      }
      var RelayQuerySubtractor = (function(_RelayQueryTransform) {
        _inherits(RelayQuerySubtractor, _RelayQueryTransform);
        function RelayQuerySubtractor() {
          _classCallCheck(this, RelayQuerySubtractor);
          _RelayQueryTransform.apply(this, arguments);
        }
        RelayQuerySubtractor.prototype.visitRoot = function visitRoot(node, state) {
          var subtrahend = state.subtrahend;
          !(subtrahend instanceof RelayQuery.Root) ? true ? invariant(false, 'subtractRelayQuery(): Cannot subtract a non-root node from a root.') : invariant(false) : undefined;
          if (!canSubtractRoot(node, subtrahend)) {
            state.isEmpty = false;
            return node;
          }
          return this._subtractChildren(node, state);
        };
        RelayQuerySubtractor.prototype.visitFragment = function visitFragment(node, state) {
          return this._subtractChildren(node, state);
        };
        RelayQuerySubtractor.prototype.visitField = function visitField(node, state) {
          var diff;
          if (node.isScalar()) {
            diff = this._subtractScalar(node, state);
          } else if (node.isConnection()) {
            diff = this._subtractConnection(node, state);
          } else {
            diff = this._subtractField(node, state);
          }
          if (diff && (diff.isRequisite() || !state.isEmpty)) {
            return diff;
          }
          return null;
        };
        RelayQuerySubtractor.prototype._subtractScalar = function _subtractScalar(node, state) {
          var subField = state.subtrahend.getField(node);
          if (subField && !node.isRequisite()) {
            return null;
          }
          state.isEmpty = isEmptyField(node);
          return node;
        };
        RelayQuerySubtractor.prototype._subtractConnection = function _subtractConnection(node, state) {
          var subtrahendRanges = getMatchingRangeFields(node, state.subtrahend);
          if (!subtrahendRanges.length) {
            state.isEmpty = isEmptyField(node);
            return node;
          }
          var diff = node;
          var fieldState;
          for (var ii = 0; ii < subtrahendRanges.length; ii++) {
            fieldState = {
              isEmpty: true,
              subtrahend: subtrahendRanges[ii]
            };
            diff = this._subtractChildren(diff, fieldState);
            state.isEmpty = fieldState.isEmpty;
            if (!diff) {
              break;
            }
          }
          return diff;
        };
        RelayQuerySubtractor.prototype._subtractField = function _subtractField(node, state) {
          var subField = state.subtrahend.getField(node);
          if (!subField) {
            state.isEmpty = isEmptyField(node);
            return node;
          }
          var fieldState = {
            isEmpty: true,
            subtrahend: subField
          };
          var diff = this._subtractChildren(node, fieldState);
          state.isEmpty = fieldState.isEmpty;
          return diff;
        };
        RelayQuerySubtractor.prototype._subtractChildren = function _subtractChildren(node, state) {
          var _this = this;
          return node.clone(node.getChildren().map(function(child) {
            var childState = {
              isEmpty: true,
              subtrahend: state.subtrahend
            };
            var diff = _this.visit(child, childState);
            state.isEmpty = state.isEmpty && childState.isEmpty;
            return diff;
          }));
        };
        return RelayQuerySubtractor;
      })(RelayQueryTransform);
      function isEmptyField(node) {
        if (node instanceof RelayQuery.Field && node.isScalar()) {
          return node.isRequisite() && !node.isRefQueryDependency() && node.getApplicationName() === node.getSchemaName();
        } else {
          return node.getChildren().every(isEmptyField);
        }
      }
      function canSubtractRoot(min, sub) {
        var minIdentifyingCall = min.getIdentifyingArg();
        var subIdentifyingCall = sub.getIdentifyingArg();
        return min.getFieldName() === sub.getFieldName() && areEqual(minIdentifyingCall, subIdentifyingCall);
      }
      function getMatchingRangeFields(node, subtrahend) {
        return subtrahend.getChildren().filter(function(child) {
          return child instanceof RelayQuery.Field && canSubtractField(node, child);
        });
      }
      function canSubtractField(minField, subField) {
        if (minField.getSchemaName() !== subField.getSchemaName()) {
          return false;
        }
        var minArgs = minField.getCallsWithValues();
        var subArgs = subField.getCallsWithValues();
        if (minArgs.length !== subArgs.length) {
          return false;
        }
        return minArgs.every(function(minArg, ii) {
          var subArg = subArgs[ii];
          if (subArg == null) {
            return false;
          }
          if (minArg.name !== subArg.name) {
            return false;
          }
          if (minArg.name === 'first' || minArg.name === 'last') {
            return parseInt('' + minArg.value, 10) <= parseInt('' + subArg.value, 10);
          }
          return areEqual(minArg.value, subArg.value);
        });
      }
      module.exports = RelayProfiler.instrument('subtractRelayQuery', subtractRelayQuery);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _inherits = __webpack_require__(5)['default'];
      var _classCallCheck = __webpack_require__(1)['default'];
      var RelayQueryVisitor = __webpack_require__(18);
      var emptyFunction = __webpack_require__(70);
      var SERIALIZATION_KEY = '__serializationKey__';
      var validateRelayReadQuery = emptyFunction;
      if (true) {
        (function() {
          validateRelayReadQuery = function validateRelayReadQuery(queryNode, options) {
            var validator = new RelayStoreReadValidator(options);
            validator.visit(queryNode, {});
          };
          function assertUniqueAlias(field, aliasMap) {
            var serializationKey = field.getSerializationKey();
            if (aliasMap[SERIALIZATION_KEY]) {
              if (aliasMap[SERIALIZATION_KEY] !== serializationKey) {
                console.error('`%s` is used as an alias more than once. Please use unique ' + 'aliases.', field.getApplicationName());
              }
            } else {
              aliasMap[SERIALIZATION_KEY] = serializationKey;
            }
          }
          function getAliasMap(node, aliasMap) {
            var applicationName = node.getApplicationName();
            if (!aliasMap[applicationName]) {
              aliasMap[applicationName] = {};
            }
            return aliasMap[applicationName];
          }
          var RelayStoreReadValidator = (function(_RelayQueryVisitor) {
            _inherits(RelayStoreReadValidator, _RelayQueryVisitor);
            function RelayStoreReadValidator(options) {
              _classCallCheck(this, RelayStoreReadValidator);
              _RelayQueryVisitor.call(this);
              this._traverseFragmentReferences = options && options.traverseFragmentReferences || false;
            }
            RelayStoreReadValidator.prototype.visitField = function visitField(node, aliasMap) {
              aliasMap = getAliasMap(node, aliasMap);
              assertUniqueAlias(node, aliasMap);
              if (node.isGenerated()) {
                return;
              } else if (node.isScalar()) {
                return;
              } else if (node.isPlural()) {
                this._readPlural(node, aliasMap);
              } else {
                this._readLinkedField(node, aliasMap);
              }
            };
            RelayStoreReadValidator.prototype.visitFragment = function visitFragment(node, aliasMap) {
              if (this._traverseFragmentReferences || !node.isContainerFragment()) {
                this.traverse(node, aliasMap);
              }
            };
            RelayStoreReadValidator.prototype._readPlural = function _readPlural(node, aliasMap) {
              var _this = this;
              node.getChildren().forEach(function(child) {
                return _this.visit(child, aliasMap);
              });
            };
            RelayStoreReadValidator.prototype._readLinkedField = function _readLinkedField(node, aliasMap) {
              aliasMap = getAliasMap(node, aliasMap);
              this.traverse(node, aliasMap);
            };
            return RelayStoreReadValidator;
          })(RelayQueryVisitor);
        })();
      }
      module.exports = validateRelayReadQuery;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var RelayNodeInterface = __webpack_require__(12);
      var RelayProfiler = __webpack_require__(4);
      var RelayQueryPath = __webpack_require__(36);
      function writeRelayQueryPayload(writer, query, payload) {
        var store = writer.getRecordStore();
        var path = new RelayQueryPath(query);
        RelayNodeInterface.getResultsFromPayload(store, query, payload).forEach(function(_ref) {
          var dataID = _ref.dataID;
          var result = _ref.result;
          writer.writePayload(query, dataID, result, path);
        });
      }
      module.exports = RelayProfiler.instrument('writeRelayQueryPayload', writeRelayQueryPayload);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _defineProperty = __webpack_require__(58)['default'];
      var _extends = __webpack_require__(8)['default'];
      var GraphQLMutatorConstants = __webpack_require__(48);
      var RelayConnectionInterface = __webpack_require__(7);
      var RelayMutationTracker = __webpack_require__(140);
      var RelayMutationType = __webpack_require__(83);
      var RelayNodeInterface = __webpack_require__(12);
      var RelayQuery = __webpack_require__(3);
      var RelayQueryPath = __webpack_require__(36);
      var RelayProfiler = __webpack_require__(4);
      var RelayRecordState = __webpack_require__(26);
      var generateClientEdgeID = __webpack_require__(87);
      var generateClientID = __webpack_require__(54);
      var invariant = __webpack_require__(2);
      var printRelayQueryCall = __webpack_require__(40);
      var warning = __webpack_require__(11);
      var CLIENT_MUTATION_ID = RelayConnectionInterface.CLIENT_MUTATION_ID;
      var EDGES = RelayConnectionInterface.EDGES;
      var ANY_TYPE = RelayNodeInterface.ANY_TYPE;
      var ID = RelayNodeInterface.ID;
      var NODE = RelayNodeInterface.NODE;
      var NODE_TYPE = RelayNodeInterface.NODE_TYPE;
      var APPEND = GraphQLMutatorConstants.APPEND;
      var PREPEND = GraphQLMutatorConstants.PREPEND;
      var REMOVE = GraphQLMutatorConstants.REMOVE;
      var EDGES_FIELD = RelayQuery.Field.build({
        fieldName: EDGES,
        type: ANY_TYPE,
        metadata: {isPlural: true}
      });
      var IGNORED_KEYS = _defineProperty({error: true}, CLIENT_MUTATION_ID, true);
      var STUB_CURSOR_ID = 'client:cursor';
      function writeRelayUpdatePayload(writer, operation, payload, _ref) {
        var configs = _ref.configs;
        var isOptimisticUpdate = _ref.isOptimisticUpdate;
        configs.forEach(function(config) {
          switch (config.type) {
            case RelayMutationType.NODE_DELETE:
              handleNodeDelete(writer, payload, config);
              break;
            case RelayMutationType.RANGE_ADD:
              handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate);
              break;
            case RelayMutationType.RANGE_DELETE:
              handleRangeDelete(writer, payload, config);
              break;
            case RelayMutationType.FIELDS_CHANGE:
            case RelayMutationType.REQUIRED_CHILDREN:
              break;
            default:
              console.error('Expected a valid mutation handler type, got `%s`.', config.type);
          }
        });
        handleMerge(writer, payload, operation);
      }
      function handleNodeDelete(writer, payload, config) {
        var recordIDs = payload[config.deletedIDFieldName];
        if (!recordIDs) {
          return;
        }
        if (Array.isArray(recordIDs)) {
          recordIDs.forEach(function(id) {
            deleteRecord(writer, id);
          });
        } else {
          deleteRecord(writer, recordIDs);
        }
      }
      function deleteRecord(writer, recordID) {
        var store = writer.getRecordStore();
        var status = store.getRecordState(recordID);
        if (status === RelayRecordState.NONEXISTENT) {
          return;
        }
        var connectionIDs = store.getConnectionIDsForRecord(recordID);
        if (connectionIDs) {
          connectionIDs.forEach(function(connectionID) {
            var edgeID = generateClientEdgeID(connectionID, recordID);
            store.applyRangeUpdate(connectionID, edgeID, REMOVE);
            writer.recordUpdate(edgeID);
            writer.recordUpdate(connectionID);
            deleteRecord(writer, edgeID);
          });
        }
        store.deleteRecord(recordID);
        writer.recordUpdate(recordID);
      }
      function handleMerge(writer, payload, operation) {
        var store = writer.getRecordStore();
        for (var fieldName in payload) {
          if (!payload.hasOwnProperty(fieldName)) {
            continue;
          }
          var payloadData = payload[fieldName];
          if (typeof payloadData !== 'object' || payloadData == null) {
            continue;
          }
          var rootID = store.getDataID(fieldName);
          if (ID in payloadData || rootID || Array.isArray(payloadData)) {
            mergeField(writer, fieldName, payloadData, operation);
          }
        }
      }
      function mergeField(writer, fieldName, payload, operation) {
        if (fieldName in IGNORED_KEYS) {
          return;
        }
        if (Array.isArray(payload)) {
          payload.forEach(function(item) {
            if (typeof item === 'object' && item != null && !Array.isArray(item)) {
              if (getString(item, ID)) {
                mergeField(writer, fieldName, item, operation);
              }
            }
          });
          return;
        }
        var payloadData = payload;
        var store = writer.getRecordStore();
        var recordID = getString(payloadData, ID);
        var path;
        if (recordID != null) {
          path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', NODE, recordID, null, {identifyingArgName: ID}, NODE_TYPE));
        } else {
          recordID = store.getDataID(fieldName);
          path = new RelayQueryPath(RelayQuery.Root.build('writeRelayUpdatePayload', fieldName, null, null, null, ANY_TYPE));
        }
        !recordID ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected a record ID in the response payload ' + 'supplied to update the store.') : invariant(false) : undefined;
        var handleNode = function handleNode(node) {
          node.getChildren().forEach(function(child) {
            if (child instanceof RelayQuery.Fragment) {
              handleNode(child);
            } else if (child instanceof RelayQuery.Field && child.getSerializationKey() === fieldName) {
              if (path && recordID) {
                var typeName = writer.getRecordTypeName(child, recordID, payloadData);
                writer.createRecordIfMissing(child, recordID, typeName, path);
                writer.writePayload(child, recordID, payloadData, path);
              }
            }
          });
        };
        handleNode(operation);
      }
      function handleRangeAdd(writer, payload, operation, config, isOptimisticUpdate) {
        var clientMutationID = getString(payload, CLIENT_MUTATION_ID);
        !clientMutationID ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected operation `%s` to have a `%s`.', operation.getName(), CLIENT_MUTATION_ID) : invariant(false) : undefined;
        var store = writer.getRecordStore();
        var edge = getObject(payload, config.edgeName);
        var edgeNode = edge && getObject(edge, NODE);
        if (!edge || !edgeNode) {
          true ? warning(false, 'writeRelayUpdatePayload(): Expected response payload to include the ' + 'newly created edge `%s` and its `node` field. Did you forget to ' + 'update the `RANGE_ADD` mutation config?', config.edgeName) : undefined;
          return;
        }
        var connectionParentID = config.parentID;
        if (!connectionParentID) {
          var edgeSource = getObject(edge, 'source');
          if (edgeSource) {
            connectionParentID = getString(edgeSource, ID);
          }
        }
        !connectionParentID ? true ? invariant(false, 'writeRelayUpdatePayload(): Cannot insert edge without a configured ' + '`parentID` or a `%s.source.id` field.', config.edgeName) : invariant(false) : undefined;
        var nodeID = getString(edgeNode, ID) || generateClientID();
        var cursor = edge.cursor || STUB_CURSOR_ID;
        var edgeData = _extends({}, edge, {
          cursor: cursor,
          node: _extends({}, edgeNode, {id: nodeID})
        });
        var connectionIDs = store.getConnectionIDsForField(connectionParentID, config.connectionName);
        if (connectionIDs) {
          connectionIDs.forEach(function(connectionID) {
            return addRangeNode(writer, operation, config, connectionID, nodeID, edgeData);
          });
        }
        if (isOptimisticUpdate) {
          RelayMutationTracker.putClientIDForMutation(nodeID, clientMutationID);
        } else {
          var clientNodeID = RelayMutationTracker.getClientIDForMutation(clientMutationID);
          if (clientNodeID) {
            RelayMutationTracker.updateClientServerIDMap(clientNodeID, nodeID);
            RelayMutationTracker.deleteClientIDForMutation(clientMutationID);
          }
        }
      }
      function addRangeNode(writer, operation, config, connectionID, nodeID, edgeData) {
        var store = writer.getRecordStore();
        var filterCalls = store.getRangeFilterCalls(connectionID);
        var rangeBehavior = filterCalls ? getRangeBehavior(config.rangeBehaviors, filterCalls) : null;
        if (!rangeBehavior) {
          return;
        }
        var edgeID = generateClientEdgeID(connectionID, nodeID);
        var path = store.getPathToRecord(connectionID);
        !path ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected a path for connection record, `%s`.', connectionID) : invariant(false) : undefined;
        path = path.getPath(EDGES_FIELD, edgeID);
        var typeName = writer.getRecordTypeName(EDGES_FIELD, edgeID, edgeData);
        writer.createRecordIfMissing(EDGES_FIELD, edgeID, typeName, path);
        var hasEdgeField = false;
        var handleNode = function handleNode(node) {
          node.getChildren().forEach(function(child) {
            if (child instanceof RelayQuery.Fragment) {
              handleNode(child);
            } else if (child instanceof RelayQuery.Field && child.getSchemaName() === config.edgeName) {
              hasEdgeField = true;
              if (path) {
                writer.writePayload(child, edgeID, edgeData, path);
              }
            }
          });
        };
        handleNode(operation);
        !hasEdgeField ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected mutation query to include the ' + 'relevant edge field, `%s`.', config.edgeName) : invariant(false) : undefined;
        if (rangeBehavior in GraphQLMutatorConstants.RANGE_OPERATIONS) {
          store.applyRangeUpdate(connectionID, edgeID, rangeBehavior);
          if (writer.hasChangeToRecord(edgeID)) {
            writer.recordUpdate(connectionID);
          }
        } else {
          console.error('writeRelayUpdatePayload(): invalid range operation `%s`, valid ' + 'options are `%s` or `%s`.', rangeBehavior, APPEND, PREPEND);
        }
      }
      function handleRangeDelete(writer, payload, config) {
        var maybeRecordID = getString(payload, config.deletedIDFieldName);
        !(maybeRecordID != null) ? true ? invariant(false, 'writeRelayUpdatePayload(): Missing ID for deleted record at field `%s`.', config.deletedIDFieldName) : invariant(false) : undefined;
        var recordID = maybeRecordID;
        var store = writer.getRecordStore();
        var connectionName = config.pathToConnection.pop();
        var connectionParentID = getIDFromPath(store, config.pathToConnection, payload);
        config.pathToConnection.push(connectionName);
        if (!connectionParentID) {
          return;
        }
        var connectionIDs = store.getConnectionIDsForField(connectionParentID, connectionName);
        if (connectionIDs) {
          connectionIDs.forEach(function(connectionID) {
            deleteRangeEdge(writer, connectionID, recordID);
          });
        }
      }
      function deleteRangeEdge(writer, connectionID, nodeID) {
        var store = writer.getRecordStore();
        var edgeID = generateClientEdgeID(connectionID, nodeID);
        store.applyRangeUpdate(connectionID, edgeID, REMOVE);
        deleteRecord(writer, edgeID);
        if (writer.hasChangeToRecord(edgeID)) {
          writer.recordUpdate(connectionID);
        }
      }
      function getRangeBehavior(rangeBehaviors, calls) {
        var call = calls.map(printRelayQueryCall).sort().join('').slice(1);
        return rangeBehaviors[call] || null;
      }
      function getIDFromPath(store, path, payload) {
        if (path.length === 1) {
          var rootCallID = store.getDataID(path[0]);
          if (rootCallID) {
            return rootCallID;
          }
        }
        var payloadItem = path.reduce(function(payloadItem, step) {
          return payloadItem ? getObject(payloadItem, step) : null;
        }, payload);
        if (payloadItem) {
          var id = getString(payloadItem, ID);
          !(id != null) ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s.id` to be a string.', path.join('.')) : invariant(false) : undefined;
          return id;
        }
        return null;
      }
      function getString(payload, field) {
        var value = payload[field];
        if (typeof value === 'number') {
          true ? warning(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got the ' + 'number `%s`.', field, value) : undefined;
          value = '' + value;
        }
        !(value == null || typeof value === 'string') ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be a string, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
        return value;
      }
      function getObject(payload, field) {
        var value = payload[field];
        !(value == null || typeof value === 'object' && !Array.isArray(value)) ? true ? invariant(false, 'writeRelayUpdatePayload(): Expected `%s` to be an object, got `%s`.', field, JSON.stringify(value)) : invariant(false) : undefined;
        return value;
      }
      module.exports = RelayProfiler.instrument('writeRelayUpdatePayload', writeRelayUpdatePayload);
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(189),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(190),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(192),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(193),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      module.exports = {
        "default": __webpack_require__(196),
        __esModule: true
      };
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(68);
      __webpack_require__(216);
      module.exports = __webpack_require__(13).Array.from;
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(104);
      __webpack_require__(68);
      module.exports = __webpack_require__(214);
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(104);
      __webpack_require__(68);
      module.exports = __webpack_require__(215);
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(218);
      module.exports = __webpack_require__(13).Object.assign;
    }, function(module, exports, __webpack_require__) {
      var $ = __webpack_require__(14);
      module.exports = function create(P, D) {
        return $.create(P, D);
      };
    }, function(module, exports, __webpack_require__) {
      var $ = __webpack_require__(14);
      module.exports = function defineProperty(it, key, desc) {
        return $.setDesc(it, key, desc);
      };
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(219);
      module.exports = __webpack_require__(13).Object.freeze;
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(220);
      module.exports = __webpack_require__(13).Object.keys;
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(221);
      module.exports = __webpack_require__(13).Object.setPrototypeOf;
    }, function(module, exports) {
      module.exports = function(it) {
        if (typeof it != 'function')
          throw TypeError(it + ' is not a function!');
        return it;
      };
    }, function(module, exports) {
      module.exports = function() {};
    }, [268, 63], [272, 24, 15], [273, 60], [274, 14, 100, 101, 65, 15], function(module, exports, __webpack_require__) {
      var ITERATOR = __webpack_require__(15)('iterator'),
          SAFE_CLOSING = false;
      try {
        var riter = [7][ITERATOR]();
        riter['return'] = function() {
          SAFE_CLOSING = true;
        };
        Array.from(riter, function() {
          throw 2;
        });
      } catch (e) {}
      module.exports = function(exec, skipClosing) {
        if (!skipClosing && !SAFE_CLOSING)
          return false;
        var safe = false;
        try {
          var arr = [7],
              iter = arr[ITERATOR]();
          iter.next = function() {
            safe = true;
          };
          arr[ITERATOR] = function() {
            return iter;
          };
          exec(arr);
        } catch (e) {}
        return safe;
      };
    }, 116, function(module, exports) {
      module.exports = true;
    }, function(module, exports, __webpack_require__) {
      var $ = __webpack_require__(14),
          toObject = __webpack_require__(67),
          IObject = __webpack_require__(97);
      module.exports = __webpack_require__(63)(function() {
        var a = Object.assign,
            A = {},
            B = {},
            S = Symbol(),
            K = 'abcdefghijklmnopqrst';
        A[S] = 7;
        K.split('').forEach(function(k) {
          B[k] = k;
        });
        return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
      }) ? function assign(target, source) {
        var T = toObject(target),
            $$ = arguments,
            $$len = $$.length,
            index = 1,
            getKeys = $.getKeys,
            getSymbols = $.getSymbols,
            isEnum = $.isEnum;
        while ($$len > index) {
          var S = IObject($$[index++]),
              keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
              length = keys.length,
              j = 0,
              key;
          while (length > j)
            if (isEnum.call(S, key = keys[j++]))
              T[key] = S[key];
        }
        return T;
      } : Object.assign;
    }, [276, 65], function(module, exports, __webpack_require__) {
      var getDesc = __webpack_require__(14).getDesc,
          isObject = __webpack_require__(66),
          anObject = __webpack_require__(60);
      var check = function(O, proto) {
        anObject(O);
        if (!isObject(proto) && proto !== null)
          throw TypeError(proto + ": can't set as prototype!");
      };
      module.exports = {
        set: Object.setPrototypeOf || ('__proto__' in {} ? function(test, buggy, set) {
          try {
            set = __webpack_require__(61)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
            set(test, []);
            buggy = !(test instanceof Array);
          } catch (e) {
            buggy = true;
          }
          return function setPrototypeOf(O, proto) {
            check(O, proto);
            if (buggy)
              O.__proto__ = proto;
            else
              set(O, proto);
            return O;
          };
        }({}, false) : undefined),
        check: check
      };
    }, [278, 64], [279, 102, 62], [280, 97, 62], [281, 102], 122, function(module, exports, __webpack_require__) {
      var anObject = __webpack_require__(60),
          get = __webpack_require__(103);
      module.exports = __webpack_require__(13).getIterator = function(it) {
        var iterFn = get(it);
        if (typeof iterFn != 'function')
          throw TypeError(it + ' is not iterable!');
        return anObject(iterFn.call(it));
      };
    }, function(module, exports, __webpack_require__) {
      var classof = __webpack_require__(94),
          ITERATOR = __webpack_require__(15)('iterator'),
          Iterators = __webpack_require__(24);
      module.exports = __webpack_require__(13).isIterable = function(it) {
        var O = Object(it);
        return O[ITERATOR] !== undefined || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var ctx = __webpack_require__(61),
          $export = __webpack_require__(28),
          toObject = __webpack_require__(67),
          call = __webpack_require__(201),
          isArrayIter = __webpack_require__(200),
          toLength = __webpack_require__(212),
          getIterFn = __webpack_require__(103);
      $export($export.S + $export.F * !__webpack_require__(203)(function(iter) {
        Array.from(iter);
      }), 'Array', {from: function from(arrayLike) {
          var O = toObject(arrayLike),
              C = typeof this == 'function' ? this : Array,
              $$ = arguments,
              $$len = $$.length,
              mapfn = $$len > 1 ? $$[1] : undefined,
              mapping = mapfn !== undefined,
              index = 0,
              iterFn = getIterFn(O),
              length,
              result,
              step,
              iterator;
          if (mapping)
            mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
          if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
            for (iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++) {
              result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
            }
          } else {
            length = toLength(O.length);
            for (result = new C(length); length > index; index++) {
              result[index] = mapping ? mapfn(O[index], index) : O[index];
            }
          }
          result.length = index;
          return result;
        }});
    }, [284, 198, 204, 24, 211, 98], function(module, exports, __webpack_require__) {
      var $export = __webpack_require__(28);
      $export($export.S + $export.F, 'Object', {assign: __webpack_require__(206)});
    }, function(module, exports, __webpack_require__) {
      var isObject = __webpack_require__(66);
      __webpack_require__(99)('freeze', function($freeze) {
        return function freeze(it) {
          return $freeze && isObject(it) ? $freeze(it) : it;
        };
      });
    }, function(module, exports, __webpack_require__) {
      var toObject = __webpack_require__(67);
      __webpack_require__(99)('keys', function($keys) {
        return function keys(it) {
          return $keys(toObject(it));
        };
      });
    }, function(module, exports, __webpack_require__) {
      var $export = __webpack_require__(28);
      $export($export.S, 'Object', {setPrototypeOf: __webpack_require__(208).set});
    }, function(module, exports, __webpack_require__) {
      'use strict';
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }
      var Deferred = __webpack_require__(42);
      var invariant = __webpack_require__(2);
      var PromiseMap = (function() {
        function PromiseMap() {
          _classCallCheck(this, PromiseMap);
          this._deferred = {};
        }
        PromiseMap.prototype.get = function get(key) {
          return getDeferred(this._deferred, key).getPromise();
        };
        PromiseMap.prototype.resolveKey = function resolveKey(key, value) {
          var entry = getDeferred(this._deferred, key);
          !!entry.isSettled() ? true ? invariant(false, 'PromiseMap: Already settled `%s`.', key) : invariant(false) : undefined;
          entry.resolve(value);
        };
        PromiseMap.prototype.rejectKey = function rejectKey(key, reason) {
          var entry = getDeferred(this._deferred, key);
          !!entry.isSettled() ? true ? invariant(false, 'PromiseMap: Already settled `%s`.', key) : invariant(false) : undefined;
          entry.reject(reason);
        };
        return PromiseMap;
      })();
      function getDeferred(entries, key) {
        if (!entries.hasOwnProperty(key)) {
          entries[key] = new Deferred();
        }
        return entries[key];
      }
      module.exports = PromiseMap;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      Object.defineProperty(exports, '__esModule', {value: true});
      function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
          if (keys.indexOf(i) >= 0)
            continue;
          if (!Object.prototype.hasOwnProperty.call(obj, i))
            continue;
          target[i] = obj[i];
        }
        return target;
      }
      var ExecutionEnvironment = __webpack_require__(105);
      var Promise = __webpack_require__(16);
      var sprintf = __webpack_require__(110);
      var fetch = __webpack_require__(109);
      var warning = __webpack_require__(11);
      var DEFAULT_TIMEOUT = 15000;
      var DEFAULT_RETRIES = [1000, 3000];
      function fetchWithRetries(uri, initWithRetries) {
        var _ref = initWithRetries || {};
        var fetchTimeout = _ref.fetchTimeout;
        var retryDelays = _ref.retryDelays;
        var init = _objectWithoutProperties(_ref, ['fetchTimeout', 'retryDelays']);
        var _fetchTimeout = fetchTimeout != null ? fetchTimeout : DEFAULT_TIMEOUT;
        var _retryDelays = retryDelays != null ? retryDelays : DEFAULT_RETRIES;
        var requestsAttempted = 0;
        var requestStartTime = 0;
        return new Promise(function(resolve, reject) {
          function sendTimedRequest() {
            requestsAttempted++;
            requestStartTime = Date.now();
            var isRequestAlive = true;
            var request = fetch(uri, init);
            var requestTimeout = setTimeout(function() {
              isRequestAlive = false;
              if (shouldRetry(requestsAttempted)) {
                true ? warning(false, 'fetchWithRetries: HTTP timeout, retrying.') : undefined;
                retryRequest();
              } else {
                reject(new Error(sprintf('fetchWithRetries(): Failed to get response from server, ' + 'tried %s times.', requestsAttempted)));
              }
            }, _fetchTimeout);
            request.then(function(response) {
              clearTimeout(requestTimeout);
              if (isRequestAlive) {
                if (response.status >= 200 && response.status < 300) {
                  resolve(response);
                } else if (shouldRetry(requestsAttempted)) {
                  true ? true ? warning(false, 'fetchWithRetries: HTTP error, retrying.') : undefined : undefined, retryRequest();
                } else {
                  var error = new Error(sprintf('fetchWithRetries(): Still no successful response after ' + '%s retries, giving up.', requestsAttempted));
                  error.response = response;
                  reject(error);
                }
              }
            })['catch'](function(error) {
              clearTimeout(requestTimeout);
              if (shouldRetry(requestsAttempted)) {
                retryRequest();
              } else {
                reject(error);
              }
            });
          }
          function retryRequest() {
            var retryDelay = _retryDelays[requestsAttempted - 1];
            var retryStartTime = requestStartTime + retryDelay;
            setTimeout(sendTimedRequest, retryStartTime - Date.now());
          }
          function shouldRetry(attempt) {
            return ExecutionEnvironment.canUseDOM && attempt <= _retryDelays.length;
          }
          sendTimedRequest();
        });
      }
      module.exports = fetchWithRetries;
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function filterObject(object, callback, context) {
        if (!object) {
          return null;
        }
        var result = {};
        for (var name in object) {
          if (hasOwnProperty.call(object, name) && callback.call(context, object[name], name, object)) {
            result[name] = object[name];
          }
        }
        return result;
      }
      module.exports = filterObject;
    }, function(module, exports) {
      "use strict";
      function flattenArray(array) {
        var result = [];
        flatten(array, result);
        return result;
      }
      function flatten(array, result) {
        var length = array.length;
        var ii = 0;
        while (length--) {
          var current = array[ii++];
          if (Array.isArray(current)) {
            flatten(current, result);
          } else {
            result.push(current);
          }
        }
      }
      module.exports = flattenArray;
    }, function(module, exports) {
      'use strict';
      function isEmpty(obj) {
        if (Array.isArray(obj)) {
          return obj.length === 0;
        } else if (typeof obj === 'object') {
          for (var i in obj) {
            return false;
          }
          return true;
        } else {
          return !obj;
        }
      }
      module.exports = isEmpty;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var invariant = __webpack_require__(2);
      var keyMirror = function(obj) {
        var ret = {};
        var key;
        !(obj instanceof Object && !Array.isArray(obj)) ? true ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : undefined;
        for (key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          ret[key] = key;
        }
        return ret;
      };
      module.exports = keyMirror;
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var ExecutionEnvironment = __webpack_require__(105);
      var performance;
      if (ExecutionEnvironment.canUseDOM) {
        performance = window.performance || window.msPerformance || window.webkitPerformance;
      }
      module.exports = performance || {};
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var performance = __webpack_require__(228);
      var performanceNow;
      if (performance.now) {
        performanceNow = function() {
          return performance.now();
        };
      } else {
        performanceNow = function() {
          return Date.now();
        };
      }
      module.exports = performanceNow;
    }, function(module, exports) {
      "use strict";
      function removeFromArray(array, element) {
        var index = array.indexOf(element);
        if (index !== -1) {
          array.splice(index, 1);
        }
      }
      module.exports = removeFromArray;
    }, function(module, exports) {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      function someObject(object, callback, context) {
        for (var name in object) {
          if (hasOwnProperty.call(object, name)) {
            if (callback.call(context, object[name], name, object)) {
              return true;
            }
          }
        }
        return false;
      }
      module.exports = someObject;
    }, function(module, exports, __webpack_require__) {
      __webpack_require__(251);
      __webpack_require__(252);
      __webpack_require__(253);
      __webpack_require__(250);
      module.exports = __webpack_require__(45).Map;
    }, 197, 198, [266, 112, 20], function(module, exports, __webpack_require__) {
      'use strict';
      var $ = __webpack_require__(19),
          hide = __webpack_require__(30),
          redefineAll = __webpack_require__(118),
          ctx = __webpack_require__(73),
          strictNew = __webpack_require__(120),
          defined = __webpack_require__(74),
          forOf = __webpack_require__(115),
          $iterDefine = __webpack_require__(77),
          step = __webpack_require__(116),
          ID = __webpack_require__(122)('id'),
          $has = __webpack_require__(75),
          isObject = __webpack_require__(76),
          setSpecies = __webpack_require__(243),
          DESCRIPTORS = __webpack_require__(46),
          isExtensible = Object.isExtensible || isObject,
          SIZE = DESCRIPTORS ? '_s' : 'size',
          id = 0;
      var fastKey = function(it, create) {
        if (!isObject(it))
          return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
        if (!$has(it, ID)) {
          if (!isExtensible(it))
            return 'F';
          if (!create)
            return 'E';
          hide(it, ID, ++id);
        }
        return 'O' + it[ID];
      };
      var getEntry = function(that, key) {
        var index = fastKey(key),
            entry;
        if (index !== 'F')
          return that._i[index];
        for (entry = that._f; entry; entry = entry.n) {
          if (entry.k == key)
            return entry;
        }
      };
      module.exports = {
        getConstructor: function(wrapper, NAME, IS_MAP, ADDER) {
          var C = wrapper(function(that, iterable) {
            strictNew(that, C, NAME);
            that._i = $.create(null);
            that._f = undefined;
            that._l = undefined;
            that[SIZE] = 0;
            if (iterable != undefined)
              forOf(iterable, IS_MAP, that[ADDER], that);
          });
          redefineAll(C.prototype, {
            clear: function clear() {
              for (var that = this,
                  data = that._i,
                  entry = that._f; entry; entry = entry.n) {
                entry.r = true;
                if (entry.p)
                  entry.p = entry.p.n = undefined;
                delete data[entry.i];
              }
              that._f = that._l = undefined;
              that[SIZE] = 0;
            },
            'delete': function(key) {
              var that = this,
                  entry = getEntry(that, key);
              if (entry) {
                var next = entry.n,
                    prev = entry.p;
                delete that._i[entry.i];
                entry.r = true;
                if (prev)
                  prev.n = next;
                if (next)
                  next.p = prev;
                if (that._f == entry)
                  that._f = next;
                if (that._l == entry)
                  that._l = prev;
                that[SIZE]--;
              }
              return !!entry;
            },
            forEach: function forEach(callbackfn) {
              var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3),
                  entry;
              while (entry = entry ? entry.n : this._f) {
                f(entry.v, entry.k, this);
                while (entry && entry.r)
                  entry = entry.p;
              }
            },
            has: function has(key) {
              return !!getEntry(this, key);
            }
          });
          if (DESCRIPTORS)
            $.setDesc(C.prototype, 'size', {get: function() {
                return defined(this[SIZE]);
              }});
          return C;
        },
        def: function(that, key, value) {
          var entry = getEntry(that, key),
              prev,
              index;
          if (entry) {
            entry.v = value;
          } else {
            that._l = entry = {
              i: index = fastKey(key, true),
              k: key,
              v: value,
              p: prev = that._l,
              n: undefined,
              r: false
            };
            if (!that._f)
              that._f = entry;
            if (prev)
              prev.n = entry;
            that[SIZE]++;
            if (index !== 'F')
              that._i[index] = entry;
          }
          return that;
        },
        getEntry: getEntry,
        setStrong: function(C, NAME, IS_MAP) {
          $iterDefine(C, NAME, function(iterated, kind) {
            this._t = iterated;
            this._k = kind;
            this._l = undefined;
          }, function() {
            var that = this,
                kind = that._k,
                entry = that._l;
            while (entry && entry.r)
              entry = entry.p;
            if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
              that._t = undefined;
              return step(1);
            }
            if (kind == 'keys')
              return step(0, entry.k);
            if (kind == 'values')
              return step(0, entry.v);
            return step(0, [entry.k, entry.v]);
          }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);
          setSpecies(NAME);
        }
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var $ = __webpack_require__(19),
          global = __webpack_require__(47),
          $export = __webpack_require__(113),
          fails = __webpack_require__(114),
          hide = __webpack_require__(30),
          redefineAll = __webpack_require__(118),
          forOf = __webpack_require__(115),
          strictNew = __webpack_require__(120),
          isObject = __webpack_require__(76),
          setToStringTag = __webpack_require__(78),
          DESCRIPTORS = __webpack_require__(46);
      module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
        var Base = global[NAME],
            C = Base,
            ADDER = IS_MAP ? 'set' : 'add',
            proto = C && C.prototype,
            O = {};
        if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function() {
          new C().entries().next();
        }))) {
          C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
          redefineAll(C.prototype, methods);
        } else {
          C = wrapper(function(target, iterable) {
            strictNew(target, C, NAME);
            target._c = new Base;
            if (iterable != undefined)
              forOf(iterable, IS_MAP, target[ADDER], target);
          });
          $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','), function(KEY) {
            var IS_ADDER = KEY == 'add' || KEY == 'set';
            if (KEY in proto && !(IS_WEAK && KEY == 'clear'))
              hide(C.prototype, KEY, function(a, b) {
                if (!IS_ADDER && IS_WEAK && !isObject(a))
                  return KEY == 'get' ? undefined : false;
                var result = this._c[KEY](a === 0 ? 0 : a, b);
                return IS_ADDER ? this : result;
              });
          });
          if ('size' in proto)
            $.setDesc(C.prototype, 'size', {get: function() {
                return this._c.size;
              }});
        }
        setToStringTag(C, NAME);
        O[NAME] = C;
        $export($export.G + $export.W + $export.F, O);
        if (!IS_WEAK)
          common.setStrong(C, NAME, IS_MAP);
        return C;
      };
    }, [271, 112], [272, 31, 20], [273, 111], [274, 19, 117, 78, 30, 20], 205, function(module, exports, __webpack_require__) {
      'use strict';
      var core = __webpack_require__(45),
          $ = __webpack_require__(19),
          DESCRIPTORS = __webpack_require__(46),
          SPECIES = __webpack_require__(20)('species');
      module.exports = function(KEY) {
        var C = core[KEY];
        if (DESCRIPTORS && C && !C[SPECIES])
          $.setDesc(C, SPECIES, {
            configurable: true,
            get: function() {
              return this;
            }
          });
      };
    }, [278, 47], [279, 121, 74], [280, 238, 74], [281, 121], [283, 235, 20, 31, 45], [284, 234, 116, 31, 246, 77], function(module, exports, __webpack_require__) {
      'use strict';
      var strong = __webpack_require__(236);
      __webpack_require__(237)('Map', function(get) {
        return function Map() {
          return get(this, arguments.length > 0 ? arguments[0] : undefined);
        };
      }, {
        get: function get(key) {
          var entry = strong.getEntry(this, key);
          return entry && entry.v;
        },
        set: function set(key, value) {
          return strong.def(this, key === 0 ? 0 : key, value);
        }
      }, strong, true);
    }, function(module, exports) {}, [285, 245, 77], [286, 249, 31], function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(258);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(32);
      module.exports = Promise;
      Promise.prototype.done = function(onFulfilled, onRejected) {
        var self = arguments.length ? this.then.apply(this, arguments) : this;
        self.then(null, function(err) {
          setTimeout(function() {
            throw err;
          }, 0);
        });
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(32);
      module.exports = Promise;
      var TRUE = valuePromise(true);
      var FALSE = valuePromise(false);
      var NULL = valuePromise(null);
      var UNDEFINED = valuePromise(undefined);
      var ZERO = valuePromise(0);
      var EMPTYSTRING = valuePromise('');
      function valuePromise(value) {
        var p = new Promise(Promise._99);
        p._37 = 1;
        p._12 = value;
        return p;
      }
      Promise.resolve = function(value) {
        if (value instanceof Promise)
          return value;
        if (value === null)
          return NULL;
        if (value === undefined)
          return UNDEFINED;
        if (value === true)
          return TRUE;
        if (value === false)
          return FALSE;
        if (value === 0)
          return ZERO;
        if (value === '')
          return EMPTYSTRING;
        if (typeof value === 'object' || typeof value === 'function') {
          try {
            var then = value.then;
            if (typeof then === 'function') {
              return new Promise(then.bind(value));
            }
          } catch (ex) {
            return new Promise(function(resolve, reject) {
              reject(ex);
            });
          }
        }
        return valuePromise(value);
      };
      Promise.all = function(arr) {
        var args = Array.prototype.slice.call(arr);
        return new Promise(function(resolve, reject) {
          if (args.length === 0)
            return resolve([]);
          var remaining = args.length;
          function res(i, val) {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              if (val instanceof Promise && val.then === Promise.prototype.then) {
                while (val._37 === 3) {
                  val = val._12;
                }
                if (val._37 === 1)
                  return res(i, val._12);
                if (val._37 === 2)
                  reject(val._12);
                val.then(function(val) {
                  res(i, val);
                }, reject);
                return;
              } else {
                var then = val.then;
                if (typeof then === 'function') {
                  var p = new Promise(then.bind(val));
                  p.then(function(val) {
                    res(i, val);
                  }, reject);
                  return;
                }
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          }
          for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
          }
        });
      };
      Promise.reject = function(value) {
        return new Promise(function(resolve, reject) {
          reject(value);
        });
      };
      Promise.race = function(values) {
        return new Promise(function(resolve, reject) {
          values.forEach(function(value) {
            Promise.resolve(value).then(resolve, reject);
          });
        });
      };
      Promise.prototype['catch'] = function(onRejected) {
        return this.then(null, onRejected);
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(32);
      module.exports = Promise;
      Promise.prototype['finally'] = function(f) {
        return this.then(function(value) {
          return Promise.resolve(f()).then(function() {
            return value;
          });
        }, function(err) {
          return Promise.resolve(f()).then(function() {
            throw err;
          });
        });
      };
    }, function(module, exports, __webpack_require__) {
      'use strict';
      module.exports = __webpack_require__(32);
      __webpack_require__(255);
      __webpack_require__(257);
      __webpack_require__(256);
      __webpack_require__(259);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var Promise = __webpack_require__(32);
      var asap = __webpack_require__(260);
      module.exports = Promise;
      Promise.denodeify = function(fn, argumentCount) {
        argumentCount = argumentCount || Infinity;
        return function() {
          var self = this;
          var args = Array.prototype.slice.call(arguments, 0, argumentCount > 0 ? argumentCount : 0);
          return new Promise(function(resolve, reject) {
            args.push(function(err, res) {
              if (err)
                reject(err);
              else
                resolve(res);
            });
            var res = fn.apply(self, args);
            if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
              resolve(res);
            }
          });
        };
      };
      Promise.nodeify = function(fn) {
        return function() {
          var args = Array.prototype.slice.call(arguments);
          var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
          var ctx = this;
          try {
            return fn.apply(this, arguments).nodeify(callback, ctx);
          } catch (ex) {
            if (callback === null || typeof callback == 'undefined') {
              return new Promise(function(resolve, reject) {
                reject(ex);
              });
            } else {
              asap(function() {
                callback.call(ctx, ex);
              });
            }
          }
        };
      };
      Promise.prototype.nodeify = function(callback, ctx) {
        if (typeof callback != 'function')
          return this;
        this.then(function(value) {
          asap(function() {
            callback.call(ctx, null, value);
          });
        }, function(err) {
          asap(function() {
            callback.call(ctx, err);
          });
        });
      };
    }, function(module, exports, __webpack_require__) {
      "use strict";
      var rawAsap = __webpack_require__(123);
      var freeTasks = [];
      var pendingErrors = [];
      var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
      function throwFirstError() {
        if (pendingErrors.length) {
          throw pendingErrors.shift();
        }
      }
      module.exports = asap;
      function asap(task) {
        var rawTask;
        if (freeTasks.length) {
          rawTask = freeTasks.pop();
        } else {
          rawTask = new RawTask();
        }
        rawTask.task = task;
        rawAsap(rawTask);
      }
      function RawTask() {
        this.task = null;
      }
      RawTask.prototype.call = function() {
        try {
          this.task.call();
        } catch (error) {
          if (asap.onerror) {
            asap.onerror(error);
          } else {
            pendingErrors.push(error);
            requestErrorThrow();
          }
        } finally {
          this.task = null;
          freeTasks[freeTasks.length] = this;
        }
      };
    }, function(module, exports) {
      (function() {
        'use strict';
        if (self.fetch) {
          return;
        }
        function normalizeName(name) {
          if (typeof name !== 'string') {
            name = name.toString();
          }
          if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
            throw new TypeError('Invalid character in header field name');
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== 'string') {
            value = value.toString();
          }
          return value;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var list = this.map[name];
          if (!list) {
            list = [];
            this.map[name] = list;
          }
          list.push(value);
        };
        Headers.prototype['delete'] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          var values = this.map[normalizeName(name)];
          return values ? values[0] : null;
        };
        Headers.prototype.getAll = function(name) {
          return this.map[normalizeName(name)] || [];
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = [normalizeValue(value)];
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          Object.getOwnPropertyNames(this.map).forEach(function(name) {
            this.map[name].forEach(function(value) {
              callback.call(thisArg, value, name, this);
            }, this);
          }, this);
        };
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError('Already read'));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          return fileReaderReady(reader);
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          reader.readAsText(blob);
          return fileReaderReady(reader);
        }
        var support = {
          blob: 'FileReader' in self && 'Blob' in self && (function() {
            try {
              new Blob();
              return true;
            } catch (e) {
              return false;
            }
          })(),
          formData: 'FormData' in self
        };
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this._bodyInit = body;
            if (typeof body === 'string') {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (!body) {
              this._bodyText = '';
            } else {
              throw new Error('unsupported BodyInit type');
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as blob');
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              return this.blob().then(readBlobAsArrayBuffer);
            };
            this.text = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
              } else if (this._bodyFormData) {
                throw new Error('could not read FormData body as text');
              } else {
                return Promise.resolve(this._bodyText);
              }
            };
          } else {
            this.text = function() {
              var rejected = consumed(this);
              return rejected ? rejected : Promise.resolve(this._bodyText);
            };
          }
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return (methods.indexOf(upcased) > -1) ? upcased : method;
        }
        function Request(url, options) {
          options = options || {};
          this.url = url;
          this.credentials = options.credentials || 'omit';
          this.headers = new Headers(options.headers);
          this.method = normalizeMethod(options.method || 'GET');
          this.mode = options.mode || null;
          this.referrer = null;
          if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
            throw new TypeError('Body not allowed for GET or HEAD requests');
          }
          this._initBody(options.body);
        }
        function decode(body) {
          var form = new FormData();
          body.trim().split('&').forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function headers(xhr) {
          var head = new Headers();
          var pairs = xhr.getAllResponseHeaders().trim().split('\n');
          pairs.forEach(function(header) {
            var split = header.trim().split(':');
            var key = split.shift().trim();
            var value = split.join(':').trim();
            head.append(key, value);
          });
          return head;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }
          this._initBody(bodyInit);
          this.type = 'default';
          this.url = null;
          this.status = options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = options.statusText;
          this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
          this.url = options.url || '';
        }
        Body.call(Response.prototype);
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
        self.fetch = function(input, init) {
          var request;
          if (Request.prototype.isPrototypeOf(input) && !init) {
            request = input;
          } else {
            request = new Request(input, init);
          }
          return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            function responseURL() {
              if ('responseURL' in xhr) {
                return xhr.responseURL;
              }
              if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
                return xhr.getResponseHeader('X-Request-URL');
              }
              return;
            }
            xhr.onload = function() {
              var status = (xhr.status === 1223) ? 204 : xhr.status;
              if (status < 100 || status > 599) {
                reject(new TypeError('Network request failed'));
                return;
              }
              var options = {
                status: status,
                statusText: xhr.statusText,
                headers: headers(xhr),
                url: responseURL()
              };
              var body = 'response' in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };
            xhr.onerror = function() {
              reject(new TypeError('Network request failed'));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === 'include') {
              xhr.withCredentials = true;
            }
            if ('responseType' in xhr && support.blob) {
              xhr.responseType = 'blob';
            }
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
            xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
          });
        };
        self.fetch.polyfill = true;
      })();
    }, function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(263);
    }, function(module, exports, __webpack_require__) {
      'use strict';
      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor)
              descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      var _get = function get(_x, _x2, _x3) {
        var _again = true;
        _function: while (_again) {
          var object = _x,
              property = _x2,
              receiver = _x3;
          desc = parent = getter = undefined;
          _again = false;
          if (object === null)
            object = Function.prototype;
          var desc = Object.getOwnPropertyDescriptor(object, property);
          if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);
            if (parent === null) {
              return undefined;
            } else {
              _x = parent;
              _x2 = property;
              _x3 = receiver;
              _again = true;
              continue _function;
            }
          } else if ('value' in desc) {
            return desc.value;
          } else {
            var getter = desc.get;
            if (getter === undefined) {
              return undefined;
            }
            return getter.call(receiver);
          }
        }
      };
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }});
        if (superClass)
          Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
      }
      var React = __webpack_require__(33);
      var StaticContainer = (function(_React$Component) {
        _inherits(StaticContainer, _React$Component);
        function StaticContainer() {
          _classCallCheck(this, StaticContainer);
          _get(Object.getPrototypeOf(StaticContainer.prototype), 'constructor', this).apply(this, arguments);
        }
        _createClass(StaticContainer, [{
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps) {
            return !!nextProps.shouldUpdate;
          }
        }, {
          key: 'render',
          value: function render() {
            var child = this.props.children;
            if (child === null || child === false) {
              return null;
            }
            return React.Children.only(child);
          }
        }]);
        return StaticContainer;
      })(React.Component);
      module.exports = StaticContainer;
    }, function(module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_264__;
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var isObject = __webpack_require__(__webpack_module_template_argument_0__);
      module.exports = function(it) {
        if (!isObject(it))
          throw TypeError(it + ' is not an object!');
        return it;
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      var cof = __webpack_require__(__webpack_module_template_argument_0__),
          TAG = __webpack_require__(__webpack_module_template_argument_1__)('toStringTag'),
          ARG = cof(function() {
            return arguments;
          }()) == 'Arguments';
      module.exports = function(it) {
        var O,
            T,
            B;
        return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof(T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var aFunction = __webpack_require__(__webpack_module_template_argument_0__);
      module.exports = function(fn, that, length) {
        aFunction(fn);
        if (that === undefined)
          return fn;
        switch (length) {
          case 1:
            return function(a) {
              return fn.call(that, a);
            };
          case 2:
            return function(a, b) {
              return fn.call(that, a, b);
            };
          case 3:
            return function(a, b, c) {
              return fn.call(that, a, b, c);
            };
        }
        return function() {
          return fn.apply(that, arguments);
        };
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      module.exports = !__webpack_require__(__webpack_module_template_argument_0__)(function() {
        return Object.defineProperty({}, 'a', {get: function() {
            return 7;
          }}).a != 7;
      });
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
      var global = __webpack_require__(__webpack_module_template_argument_0__),
          core = __webpack_require__(__webpack_module_template_argument_1__),
          ctx = __webpack_require__(__webpack_module_template_argument_2__),
          PROTOTYPE = 'prototype';
      var $export = function(type, name, source) {
        var IS_FORCED = type & $export.F,
            IS_GLOBAL = type & $export.G,
            IS_STATIC = type & $export.S,
            IS_PROTO = type & $export.P,
            IS_BIND = type & $export.B,
            IS_WRAP = type & $export.W,
            exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
            target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
            key,
            own,
            out;
        if (IS_GLOBAL)
          source = name;
        for (key in source) {
          own = !IS_FORCED && target && key in target;
          if (own && key in exports)
            continue;
          out = own ? target[key] : source[key];
          exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? (function(C) {
            var F = function(param) {
              return this instanceof C ? new C(param) : C(param);
            };
            F[PROTOTYPE] = C[PROTOTYPE];
            return F;
          })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
          if (IS_PROTO)
            (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
        }
      };
      $export.F = 1;
      $export.G = 2;
      $export.S = 4;
      $export.P = 8;
      $export.B = 16;
      $export.W = 32;
      module.exports = $export;
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
      var $ = __webpack_require__(__webpack_module_template_argument_0__),
          createDesc = __webpack_require__(__webpack_module_template_argument_1__);
      module.exports = __webpack_require__(__webpack_module_template_argument_2__) ? function(object, key, value) {
        return $.setDesc(object, key, createDesc(1, value));
      } : function(object, key, value) {
        object[key] = value;
        return object;
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var cof = __webpack_require__(__webpack_module_template_argument_0__);
      module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it) {
        return cof(it) == 'String' ? it.split('') : Object(it);
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      var Iterators = __webpack_require__(__webpack_module_template_argument_0__),
          ITERATOR = __webpack_require__(__webpack_module_template_argument_1__)('iterator'),
          ArrayProto = Array.prototype;
      module.exports = function(it) {
        return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var anObject = __webpack_require__(__webpack_module_template_argument_0__);
      module.exports = function(iterator, fn, value, entries) {
        try {
          return entries ? fn(anObject(value)[0], value[1]) : fn(value);
        } catch (e) {
          var ret = iterator['return'];
          if (ret !== undefined)
            anObject(ret.call(iterator));
          throw e;
        }
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {
      'use strict';
      var $ = __webpack_require__(__webpack_module_template_argument_0__),
          descriptor = __webpack_require__(__webpack_module_template_argument_1__),
          setToStringTag = __webpack_require__(__webpack_module_template_argument_2__),
          IteratorPrototype = {};
      __webpack_require__(__webpack_module_template_argument_3__)(IteratorPrototype, __webpack_require__(__webpack_module_template_argument_4__)('iterator'), function() {
        return this;
      });
      module.exports = function(Constructor, NAME, next) {
        Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
        setToStringTag(Constructor, NAME + ' Iterator');
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__, __webpack_module_template_argument_5__, __webpack_module_template_argument_6__, __webpack_module_template_argument_7__, __webpack_module_template_argument_8__, __webpack_module_template_argument_9__) {
      'use strict';
      var LIBRARY = __webpack_require__(__webpack_module_template_argument_0__),
          $export = __webpack_require__(__webpack_module_template_argument_1__),
          redefine = __webpack_require__(__webpack_module_template_argument_2__),
          hide = __webpack_require__(__webpack_module_template_argument_3__),
          has = __webpack_require__(__webpack_module_template_argument_4__),
          Iterators = __webpack_require__(__webpack_module_template_argument_5__),
          $iterCreate = __webpack_require__(__webpack_module_template_argument_6__),
          setToStringTag = __webpack_require__(__webpack_module_template_argument_7__),
          getProto = __webpack_require__(__webpack_module_template_argument_8__).getProto,
          ITERATOR = __webpack_require__(__webpack_module_template_argument_9__)('iterator'),
          BUGGY = !([].keys && 'next' in [].keys()),
          FF_ITERATOR = '@@iterator',
          KEYS = 'keys',
          VALUES = 'values';
      var returnThis = function() {
        return this;
      };
      module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
        $iterCreate(Constructor, NAME, next);
        var getMethod = function(kind) {
          if (!BUGGY && kind in proto)
            return proto[kind];
          switch (kind) {
            case KEYS:
              return function keys() {
                return new Constructor(this, kind);
              };
            case VALUES:
              return function values() {
                return new Constructor(this, kind);
              };
          }
          return function entries() {
            return new Constructor(this, kind);
          };
        };
        var TAG = NAME + ' Iterator',
            DEF_VALUES = DEFAULT == VALUES,
            VALUES_BUG = false,
            proto = Base.prototype,
            $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
            $default = $native || getMethod(DEFAULT),
            methods,
            key;
        if ($native) {
          var IteratorPrototype = getProto($default.call(new Base));
          setToStringTag(IteratorPrototype, TAG, true);
          if (!LIBRARY && has(proto, FF_ITERATOR))
            hide(IteratorPrototype, ITERATOR, returnThis);
          if (DEF_VALUES && $native.name !== VALUES) {
            VALUES_BUG = true;
            $default = function values() {
              return $native.call(this);
            };
          }
        }
        if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
          hide(proto, ITERATOR, $default);
        }
        Iterators[NAME] = $default;
        Iterators[TAG] = returnThis;
        if (DEFAULT) {
          methods = {
            values: DEF_VALUES ? $default : getMethod(VALUES),
            keys: IS_SET ? $default : getMethod(KEYS),
            entries: !DEF_VALUES ? $default : getMethod('entries')
          };
          if (FORCED)
            for (key in methods) {
              if (!(key in proto))
                redefine(proto, key, methods[key]);
            }
          else
            $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
        }
        return methods;
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      module.exports = __webpack_require__(__webpack_module_template_argument_0__);
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
      var def = __webpack_require__(__webpack_module_template_argument_0__).setDesc,
          has = __webpack_require__(__webpack_module_template_argument_1__),
          TAG = __webpack_require__(__webpack_module_template_argument_2__)('toStringTag');
      module.exports = function(it, tag, stat) {
        if (it && !has(it = stat ? it : it.prototype, TAG))
          def(it, TAG, {
            configurable: true,
            value: tag
          });
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var global = __webpack_require__(__webpack_module_template_argument_0__),
          SHARED = '__core-js_shared__',
          store = global[SHARED] || (global[SHARED] = {});
      module.exports = function(key) {
        return store[key] || (store[key] = {});
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      var toInteger = __webpack_require__(__webpack_module_template_argument_0__),
          defined = __webpack_require__(__webpack_module_template_argument_1__);
      module.exports = function(TO_STRING) {
        return function(that, pos) {
          var s = String(defined(that)),
              i = toInteger(pos),
              l = s.length,
              a,
              b;
          if (i < 0 || i >= l)
            return TO_STRING ? '' : undefined;
          a = s.charCodeAt(i);
          return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
        };
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      var IObject = __webpack_require__(__webpack_module_template_argument_0__),
          defined = __webpack_require__(__webpack_module_template_argument_1__);
      module.exports = function(it) {
        return IObject(defined(it));
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {
      var toInteger = __webpack_require__(__webpack_module_template_argument_0__),
          min = Math.min;
      module.exports = function(it) {
        return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {
      var store = __webpack_require__(__webpack_module_template_argument_0__)('wks'),
          uid = __webpack_require__(__webpack_module_template_argument_1__),
          Symbol = __webpack_require__(__webpack_module_template_argument_2__).Symbol;
      module.exports = function(name) {
        return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__) {
      var classof = __webpack_require__(__webpack_module_template_argument_0__),
          ITERATOR = __webpack_require__(__webpack_module_template_argument_1__)('iterator'),
          Iterators = __webpack_require__(__webpack_module_template_argument_2__);
      module.exports = __webpack_require__(__webpack_module_template_argument_3__).getIteratorMethod = function(it) {
        if (it != undefined)
          return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
      };
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {
      'use strict';
      var addToUnscopables = __webpack_require__(__webpack_module_template_argument_0__),
          step = __webpack_require__(__webpack_module_template_argument_1__),
          Iterators = __webpack_require__(__webpack_module_template_argument_2__),
          toIObject = __webpack_require__(__webpack_module_template_argument_3__);
      module.exports = __webpack_require__(__webpack_module_template_argument_4__)(Array, 'Array', function(iterated, kind) {
        this._t = toIObject(iterated);
        this._i = 0;
        this._k = kind;
      }, function() {
        var O = this._t,
            kind = this._k,
            index = this._i++;
        if (!O || index >= O.length) {
          this._t = undefined;
          return step(1);
        }
        if (kind == 'keys')
          return step(0, index);
        if (kind == 'values')
          return step(0, O[index]);
        return step(0, [index, O[index]]);
      }, 'values');
      Iterators.Arguments = Iterators.Array;
      addToUnscopables('keys');
      addToUnscopables('values');
      addToUnscopables('entries');
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      'use strict';
      var $at = __webpack_require__(__webpack_module_template_argument_0__)(true);
      __webpack_require__(__webpack_module_template_argument_1__)(String, 'String', function(iterated) {
        this._t = String(iterated);
        this._i = 0;
      }, function() {
        var O = this._t,
            index = this._i,
            point;
        if (index >= O.length)
          return {
            value: undefined,
            done: true
          };
        point = $at(O, index);
        this._i += point.length;
        return {
          value: point,
          done: false
        };
      });
    }, function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {
      __webpack_require__(__webpack_module_template_argument_0__);
      var Iterators = __webpack_require__(__webpack_module_template_argument_1__);
      Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
    }])));
  });
  ;
})(require('process'));
