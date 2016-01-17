/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
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
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};
    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
          newObj[key] = obj[key];
      }
    }
    newObj['default'] = obj;
    return newObj;
  }
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _languageKinds = require('../language/kinds');
var Kind = _interopRequireWildcard(_languageKinds);
var _typeDefinition = require('../type/definition');
var _typeIntrospection = require('../type/introspection');
var _typeFromAST = require('./typeFromAST');
var _jsutilsFind = require('../jsutils/find');
var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);
var TypeInfo = (function() {
  function TypeInfo(schema, getFieldDefFn) {
    _classCallCheck(this, TypeInfo);
    this._schema = schema;
    this._typeStack = [];
    this._parentTypeStack = [];
    this._inputTypeStack = [];
    this._fieldDefStack = [];
    this._directive = null;
    this._argument = null;
    this._getFieldDef = getFieldDefFn || getFieldDef;
  }
  _createClass(TypeInfo, [{
    key: 'getType',
    value: function getType() {
      if (this._typeStack.length > 0) {
        return this._typeStack[this._typeStack.length - 1];
      }
    }
  }, {
    key: 'getParentType',
    value: function getParentType() {
      if (this._parentTypeStack.length > 0) {
        return this._parentTypeStack[this._parentTypeStack.length - 1];
      }
    }
  }, {
    key: 'getInputType',
    value: function getInputType() {
      if (this._inputTypeStack.length > 0) {
        return this._inputTypeStack[this._inputTypeStack.length - 1];
      }
    }
  }, {
    key: 'getFieldDef',
    value: function getFieldDef() {
      if (this._fieldDefStack.length > 0) {
        return this._fieldDefStack[this._fieldDefStack.length - 1];
      }
    }
  }, {
    key: 'getDirective',
    value: function getDirective() {
      return this._directive;
    }
  }, {
    key: 'getArgument',
    value: function getArgument() {
      return this._argument;
    }
  }, {
    key: 'enter',
    value: function enter(node) {
      var schema = this._schema;
      switch (node.kind) {
        case Kind.SELECTION_SET:
          var namedType = (0, _typeDefinition.getNamedType)(this.getType());
          var compositeType;
          if ((0, _typeDefinition.isCompositeType)(namedType)) {
            compositeType = namedType;
          }
          this._parentTypeStack.push(compositeType);
          break;
        case Kind.FIELD:
          var parentType = this.getParentType();
          var fieldDef;
          if (parentType) {
            fieldDef = this._getFieldDef(schema, parentType, node);
          }
          this._fieldDefStack.push(fieldDef);
          this._typeStack.push(fieldDef && fieldDef.type);
          break;
        case Kind.DIRECTIVE:
          this._directive = schema.getDirective(node.name.value);
          break;
        case Kind.OPERATION_DEFINITION:
          var type = undefined;
          if (node.operation === 'query') {
            type = schema.getQueryType();
          } else if (node.operation === 'mutation') {
            type = schema.getMutationType();
          } else if (node.operation === 'subscription') {
            type = schema.getSubscriptionType();
          }
          this._typeStack.push(type);
          break;
        case Kind.INLINE_FRAGMENT:
        case Kind.FRAGMENT_DEFINITION:
          var typeConditionAST = node.typeCondition;
          var outputType = typeConditionAST ? (0, _typeFromAST.typeFromAST)(schema, typeConditionAST) : this.getType();
          this._typeStack.push(outputType);
          break;
        case Kind.VARIABLE_DEFINITION:
          var inputType = (0, _typeFromAST.typeFromAST)(schema, node.type);
          this._inputTypeStack.push(inputType);
          break;
        case Kind.ARGUMENT:
          var argDef;
          var argType;
          var fieldOrDirective = this.getDirective() || this.getFieldDef();
          if (fieldOrDirective) {
            argDef = (0, _jsutilsFind2['default'])(fieldOrDirective.args, function(arg) {
              return arg.name === node.name.value;
            });
            if (argDef) {
              argType = argDef.type;
            }
          }
          this._argument = argDef;
          this._inputTypeStack.push(argType);
          break;
        case Kind.LIST:
          var listType = (0, _typeDefinition.getNullableType)(this.getInputType());
          this._inputTypeStack.push(listType instanceof _typeDefinition.GraphQLList ? listType.ofType : undefined);
          break;
        case Kind.OBJECT_FIELD:
          var objectType = (0, _typeDefinition.getNamedType)(this.getInputType());
          var fieldType;
          if (objectType instanceof _typeDefinition.GraphQLInputObjectType) {
            var inputField = objectType.getFields()[node.name.value];
            fieldType = inputField ? inputField.type : undefined;
          }
          this._inputTypeStack.push(fieldType);
          break;
      }
    }
  }, {
    key: 'leave',
    value: function leave(node) {
      switch (node.kind) {
        case Kind.SELECTION_SET:
          this._parentTypeStack.pop();
          break;
        case Kind.FIELD:
          this._fieldDefStack.pop();
          this._typeStack.pop();
          break;
        case Kind.DIRECTIVE:
          this._directive = null;
          break;
        case Kind.OPERATION_DEFINITION:
        case Kind.INLINE_FRAGMENT:
        case Kind.FRAGMENT_DEFINITION:
          this._typeStack.pop();
          break;
        case Kind.VARIABLE_DEFINITION:
          this._inputTypeStack.pop();
          break;
        case Kind.ARGUMENT:
          this._argument = null;
          this._inputTypeStack.pop();
          break;
        case Kind.LIST:
        case Kind.OBJECT_FIELD:
          this._inputTypeStack.pop();
          break;
      }
    }
  }]);
  return TypeInfo;
})();
exports.TypeInfo = TypeInfo;
function getFieldDef(schema, parentType, fieldAST) {
  var name = fieldAST.name.value;
  if (name === _typeIntrospection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.SchemaMetaFieldDef;
  }
  if (name === _typeIntrospection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.TypeMetaFieldDef;
  }
  if (name === _typeIntrospection.TypeNameMetaFieldDef.name && (parentType instanceof _typeDefinition.GraphQLObjectType || parentType instanceof _typeDefinition.GraphQLInterfaceType || parentType instanceof _typeDefinition.GraphQLUnionType)) {
    return _typeIntrospection.TypeNameMetaFieldDef;
  }
  if (parentType instanceof _typeDefinition.GraphQLObjectType || parentType instanceof _typeDefinition.GraphQLInterfaceType) {
    return parentType.getFields()[name];
  }
}
