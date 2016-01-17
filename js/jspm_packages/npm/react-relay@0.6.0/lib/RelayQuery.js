/* */ 
(function(process) {
  'use strict';
  var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];
  var _inherits = require('babel-runtime/helpers/inherits')['default'];
  var _extends = require('babel-runtime/helpers/extends')['default'];
  var _Object$freeze = require('babel-runtime/core-js/object/freeze')['default'];
  var QueryBuilder = require('./QueryBuilder');
  var RelayConnectionInterface = require('./RelayConnectionInterface');
  var RelayFragmentReference = require('./RelayFragmentReference');
  var RelayMetaRoute = require('./RelayMetaRoute');
  var RelayProfiler = require('./RelayProfiler');
  var RelayRouteFragment = require('./RelayRouteFragment');
  var areEqual = require('fbjs/lib/areEqual');
  var callsFromGraphQL = require('./callsFromGraphQL');
  var callsToGraphQL = require('./callsToGraphQL');
  var generateRQLFieldAlias = require('./generateRQLFieldAlias');
  var getWeakIdForObject = require('./getWeakIdForObject');
  var invariant = require('fbjs/lib/invariant');
  var printRelayQueryCall = require('./printRelayQueryCall');
  var shallowEqual = require('fbjs/lib/shallowEqual');
  var stableStringify = require('./stableStringify');
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
  if (process.env.NODE_ENV !== 'production') {
    _Object$freeze(EMPTY_CALLS);
    _Object$freeze(EMPTY_DIRECTIVES);
  }
  var RelayQueryNode = (function() {
    RelayQueryNode.create = function create(concreteNode, route, variables) {
      var node = createNode(concreteNode, route, variables);
      !(node instanceof RelayQueryNode) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryNode.create(): ' + 'Expected a GraphQL fragment, mutation, or query.') : invariant(false) : undefined;
      return node;
    };
    function RelayQueryNode(concreteNode, route, variables) {
      _classCallCheck(this, RelayQueryNode);
      !(this.constructor.name !== 'RelayQueryNode') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryNode: Abstract class cannot be instantiated.') : invariant(false) : undefined;
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
        !(children.length === 0) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryNode: Cannot add children to scalar field `%s`.', this instanceof RelayQueryField ? this.getSchemaName() : null) : invariant(false) : undefined;
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
      !query ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryRoot.create(): Expected a GraphQL `query { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
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
      !(this.constructor.name !== 'RelayQueryOperation') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryOperation: Abstract class cannot be instantiated.') : invariant(false) : undefined;
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
      !inputType ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQuery: Expected operation `%s` to be annotated with the type of ' + 'its argument. Either the babel transform was configured incorrectly, ' + 'or the schema failed to define an argument for this mutation.', this.getCall().name) : invariant(false) : undefined;
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
        !callVariable ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQuery: Expected mutation to have a single argument.') : invariant(false) : undefined;
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
      !subscription ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQuerySubscription.create(): ' + 'Expected a GraphQL `subscription { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
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
      !fragment ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryFragment.create(): ' + 'Expected a GraphQL `fragment { ... }`, got: %s', concreteNode) : invariant(false) : undefined;
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
      !field ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryField.create(): Expected a GraphQL field, got: %s', concreteNode) : invariant(false) : undefined;
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
      !this.isConnection() ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryField: Range behavior keys are associated exclusively with ' + 'connection fields. `getRangeBehaviorKey()` was called on the ' + 'non-connection field `%s`.', this.getSchemaName()) : invariant(false) : undefined;
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
        !(children.length === 0) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryField: Cannot add children to scalar fields.') : invariant(false) : undefined;
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
      !(typeof concreteNode === 'object' && concreteNode !== null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'RelayQueryNode: Expected a GraphQL object created with `Relay.QL`, got' + '`%s`.', concreteNode) : invariant(false) : undefined;
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
})(require('process'));
