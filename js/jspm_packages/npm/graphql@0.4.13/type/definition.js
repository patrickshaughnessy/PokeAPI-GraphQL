/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var _extends = Object.assign || function(target) {
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
exports.isType = isType;
exports.isInputType = isInputType;
exports.isOutputType = isOutputType;
exports.isLeafType = isLeafType;
exports.isCompositeType = isCompositeType;
exports.isAbstractType = isAbstractType;
exports.getNullableType = getNullableType;
exports.getNamedType = getNamedType;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
var _jsutilsKeyMap = require('../jsutils/keyMap');
var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);
var _languageKinds = require('../language/kinds');
function isType(type) {
  return type instanceof GraphQLScalarType || type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType || type instanceof GraphQLEnumType || type instanceof GraphQLInputObjectType || type instanceof GraphQLList || type instanceof GraphQLNonNull;
}
function isInputType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType || namedType instanceof GraphQLInputObjectType;
}
function isOutputType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLObjectType || namedType instanceof GraphQLInterfaceType || namedType instanceof GraphQLUnionType || namedType instanceof GraphQLEnumType;
}
function isLeafType(type) {
  var namedType = getNamedType(type);
  return namedType instanceof GraphQLScalarType || namedType instanceof GraphQLEnumType;
}
function isCompositeType(type) {
  return type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}
function isAbstractType(type) {
  return type instanceof GraphQLInterfaceType || type instanceof GraphQLUnionType;
}
function getNullableType(type) {
  return type instanceof GraphQLNonNull ? type.ofType : type;
}
function getNamedType(type) {
  var unmodifiedType = type;
  while (unmodifiedType instanceof GraphQLList || unmodifiedType instanceof GraphQLNonNull) {
    unmodifiedType = unmodifiedType.ofType;
  }
  return unmodifiedType;
}
var GraphQLScalarType = (function() {
  function GraphQLScalarType(config) {
    _classCallCheck(this, GraphQLScalarType);
    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    (0, _jsutilsInvariant2['default'])(typeof config.serialize === 'function', this + ' must provide "serialize" function. If this custom Scalar is ' + 'also used as an input type, ensure "parseValue" and "parseLiteral" ' + 'functions are also provided.');
    if (config.parseValue || config.parseLiteral) {
      (0, _jsutilsInvariant2['default'])(typeof config.parseValue === 'function' && typeof config.parseLiteral === 'function', this + ' must provide both "parseValue" and "parseLiteral" functions.');
    }
    this._scalarConfig = config;
  }
  _createClass(GraphQLScalarType, [{
    key: 'serialize',
    value: function serialize(value) {
      var serializer = this._scalarConfig.serialize;
      return serializer(value);
    }
  }, {
    key: 'parseValue',
    value: function parseValue(value) {
      var parser = this._scalarConfig.parseValue;
      return parser ? parser(value) : null;
    }
  }, {
    key: 'parseLiteral',
    value: function parseLiteral(valueAST) {
      var parser = this._scalarConfig.parseLiteral;
      return parser ? parser(valueAST) : null;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLScalarType;
})();
exports.GraphQLScalarType = GraphQLScalarType;
var GraphQLObjectType = (function() {
  function GraphQLObjectType(config) {
    _classCallCheck(this, GraphQLObjectType);
    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.isTypeOf) {
      (0, _jsutilsInvariant2['default'])(typeof config.isTypeOf === 'function', this + ' must provide "isTypeOf" as a function.');
    }
    this.isTypeOf = config.isTypeOf;
    this._typeConfig = config;
    addImplementationToInterfaces(this);
  }
  _createClass(GraphQLObjectType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
    }
  }, {
    key: 'getInterfaces',
    value: function getInterfaces() {
      return this._interfaces || (this._interfaces = defineInterfaces(this, this._typeConfig.interfaces));
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLObjectType;
})();
exports.GraphQLObjectType = GraphQLObjectType;
function resolveMaybeThunk(thingOrThunk) {
  return typeof thingOrThunk === 'function' ? thingOrThunk() : thingOrThunk;
}
function defineInterfaces(type, interfacesOrThunk) {
  var interfaces = resolveMaybeThunk(interfacesOrThunk);
  if (!interfaces) {
    return [];
  }
  (0, _jsutilsInvariant2['default'])(Array.isArray(interfaces), type + ' interfaces must be an Array or a function which returns an Array.');
  interfaces.forEach(function(iface) {
    (0, _jsutilsInvariant2['default'])(iface instanceof GraphQLInterfaceType, type + ' may only implement Interface types, it cannot ' + ('implement: ' + iface + '.'));
    if (typeof iface.resolveType !== 'function') {
      (0, _jsutilsInvariant2['default'])(typeof type.isTypeOf === 'function', 'Interface Type ' + iface + ' does not provide a "resolveType" function ' + ('and implementing Type ' + type + ' does not provide a "isTypeOf" ') + 'function. There is no way to resolve this implementing type ' + 'during execution.');
    }
  });
  return interfaces;
}
function defineFieldMap(type, fields) {
  var fieldMap = resolveMaybeThunk(fields);
  (0, _jsutilsInvariant2['default'])(isPlainObj(fieldMap), type + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  var fieldNames = Object.keys(fieldMap);
  (0, _jsutilsInvariant2['default'])(fieldNames.length > 0, type + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
  var resultFieldMap = {};
  fieldNames.forEach(function(fieldName) {
    assertValidName(fieldName);
    var field = _extends({}, fieldMap[fieldName], {name: fieldName});
    (0, _jsutilsInvariant2['default'])(!field.hasOwnProperty('isDeprecated'), type + '.' + fieldName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    (0, _jsutilsInvariant2['default'])(isOutputType(field.type), type + '.' + fieldName + ' field type must be Output Type but ' + ('got: ' + field.type + '.'));
    if (!field.args) {
      field.args = [];
    } else {
      (0, _jsutilsInvariant2['default'])(isPlainObj(field.args), type + '.' + fieldName + ' args must be an object with argument names ' + 'as keys.');
      field.args = Object.keys(field.args).map(function(argName) {
        assertValidName(argName);
        var arg = field.args[argName];
        (0, _jsutilsInvariant2['default'])(isInputType(arg.type), type + '.' + fieldName + '(' + argName + ':) argument type must be ' + ('Input Type but got: ' + arg.type + '.'));
        return {
          name: argName,
          description: arg.description === undefined ? null : arg.description,
          type: arg.type,
          defaultValue: arg.defaultValue === undefined ? null : arg.defaultValue
        };
      });
    }
    resultFieldMap[fieldName] = field;
  });
  return resultFieldMap;
}
function isPlainObj(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}
function addImplementationToInterfaces(impl) {
  impl.getInterfaces().forEach(function(type) {
    type._implementations.push(impl);
  });
}
var GraphQLInterfaceType = (function() {
  function GraphQLInterfaceType(config) {
    _classCallCheck(this, GraphQLInterfaceType);
    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _jsutilsInvariant2['default'])(typeof config.resolveType === 'function', this + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    this._typeConfig = config;
    this._implementations = [];
  }
  _createClass(GraphQLInterfaceType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = defineFieldMap(this, this._typeConfig.fields));
    }
  }, {
    key: 'getPossibleTypes',
    value: function getPossibleTypes() {
      return this._implementations;
    }
  }, {
    key: 'isPossibleType',
    value: function isPossibleType(type) {
      var possibleTypes = this._possibleTypes || (this._possibleTypes = (0, _jsutilsKeyMap2['default'])(this.getPossibleTypes(), function(possibleType) {
        return possibleType.name;
      }));
      return Boolean(possibleTypes[type.name]);
    }
  }, {
    key: 'getObjectType',
    value: function getObjectType(value, info) {
      var resolver = this.resolveType;
      return resolver ? resolver(value, info) : getTypeOf(value, info, this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLInterfaceType;
})();
exports.GraphQLInterfaceType = GraphQLInterfaceType;
function getTypeOf(value, info, abstractType) {
  var possibleTypes = abstractType.getPossibleTypes();
  for (var i = 0; i < possibleTypes.length; i++) {
    var type = possibleTypes[i];
    if (typeof type.isTypeOf === 'function' && type.isTypeOf(value, info)) {
      return type;
    }
  }
}
var GraphQLUnionType = (function() {
  function GraphQLUnionType(config) {
    var _this = this;
    _classCallCheck(this, GraphQLUnionType);
    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    if (config.resolveType) {
      (0, _jsutilsInvariant2['default'])(typeof config.resolveType === 'function', this + ' must provide "resolveType" as a function.');
    }
    this.resolveType = config.resolveType;
    (0, _jsutilsInvariant2['default'])(Array.isArray(config.types) && config.types.length > 0, 'Must provide Array of types for Union ' + config.name + '.');
    config.types.forEach(function(type) {
      (0, _jsutilsInvariant2['default'])(type instanceof GraphQLObjectType, _this + ' may only contain Object types, it cannot contain: ' + type + '.');
      if (typeof _this.resolveType !== 'function') {
        (0, _jsutilsInvariant2['default'])(typeof type.isTypeOf === 'function', 'Union Type ' + _this + ' does not provide a "resolveType" function ' + ('and possible Type ' + type + ' does not provide a "isTypeOf" ') + 'function. There is no way to resolve this possible type ' + 'during execution.');
      }
    });
    this._types = config.types;
    this._typeConfig = config;
  }
  _createClass(GraphQLUnionType, [{
    key: 'getPossibleTypes',
    value: function getPossibleTypes() {
      return this._types;
    }
  }, {
    key: 'isPossibleType',
    value: function isPossibleType(type) {
      var possibleTypeNames = this._possibleTypeNames;
      if (!possibleTypeNames) {
        this._possibleTypeNames = possibleTypeNames = this.getPossibleTypes().reduce(function(map, possibleType) {
          return (map[possibleType.name] = true, map);
        }, {});
      }
      return possibleTypeNames[type.name] === true;
    }
  }, {
    key: 'getObjectType',
    value: function getObjectType(value, info) {
      var resolver = this._typeConfig.resolveType;
      return resolver ? resolver(value, info) : getTypeOf(value, info, this);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLUnionType;
})();
exports.GraphQLUnionType = GraphQLUnionType;
var GraphQLEnumType = (function() {
  function GraphQLEnumType(config) {
    _classCallCheck(this, GraphQLEnumType);
    this.name = config.name;
    assertValidName(config.name);
    this.description = config.description;
    this._values = defineEnumValues(this, config.values);
    this._enumConfig = config;
  }
  _createClass(GraphQLEnumType, [{
    key: 'getValues',
    value: function getValues() {
      return this._values;
    }
  }, {
    key: 'serialize',
    value: function serialize(value) {
      var enumValue = this._getValueLookup().get(value);
      return enumValue ? enumValue.name : null;
    }
  }, {
    key: 'parseValue',
    value: function parseValue(value) {
      var enumValue = this._getNameLookup()[value];
      if (enumValue) {
        return enumValue.value;
      }
    }
  }, {
    key: 'parseLiteral',
    value: function parseLiteral(valueAST) {
      if (valueAST.kind === _languageKinds.ENUM) {
        var enumValue = this._getNameLookup()[valueAST.value];
        if (enumValue) {
          return enumValue.value;
        }
      }
    }
  }, {
    key: '_getValueLookup',
    value: function _getValueLookup() {
      if (!this._valueLookup) {
        var lookup = new Map();
        this.getValues().forEach(function(value) {
          lookup.set(value.value, value);
        });
        this._valueLookup = lookup;
      }
      return this._valueLookup;
    }
  }, {
    key: '_getNameLookup',
    value: function _getNameLookup() {
      if (!this._nameLookup) {
        var lookup = Object.create(null);
        this.getValues().forEach(function(value) {
          lookup[value.name] = value;
        });
        this._nameLookup = lookup;
      }
      return this._nameLookup;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLEnumType;
})();
exports.GraphQLEnumType = GraphQLEnumType;
function defineEnumValues(type, valueMap) {
  (0, _jsutilsInvariant2['default'])(isPlainObj(valueMap), type + ' values must be an object with value names as keys.');
  var valueNames = Object.keys(valueMap);
  (0, _jsutilsInvariant2['default'])(valueNames.length > 0, type + ' values must be an object with value names as keys.');
  return valueNames.map(function(valueName) {
    assertValidName(valueName);
    var value = valueMap[valueName];
    (0, _jsutilsInvariant2['default'])(isPlainObj(value), type + '.' + valueName + ' must refer to an object with a "value" key ' + ('representing an internal value but got: ' + value + '.'));
    (0, _jsutilsInvariant2['default'])(!value.hasOwnProperty('isDeprecated'), type + '.' + valueName + ' should provide "deprecationReason" instead ' + 'of "isDeprecated".');
    return {
      name: valueName,
      description: value.description,
      deprecationReason: value.deprecationReason,
      value: (0, _jsutilsIsNullish2['default'])(value.value) ? valueName : value.value
    };
  });
}
var GraphQLInputObjectType = (function() {
  function GraphQLInputObjectType(config) {
    _classCallCheck(this, GraphQLInputObjectType);
    (0, _jsutilsInvariant2['default'])(config.name, 'Type must be named.');
    assertValidName(config.name);
    this.name = config.name;
    this.description = config.description;
    this._typeConfig = config;
  }
  _createClass(GraphQLInputObjectType, [{
    key: 'getFields',
    value: function getFields() {
      return this._fields || (this._fields = this._defineFieldMap());
    }
  }, {
    key: '_defineFieldMap',
    value: function _defineFieldMap() {
      var _this2 = this;
      var fieldMap = resolveMaybeThunk(this._typeConfig.fields);
      (0, _jsutilsInvariant2['default'])(isPlainObj(fieldMap), this + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
      var fieldNames = Object.keys(fieldMap);
      (0, _jsutilsInvariant2['default'])(fieldNames.length > 0, this + ' fields must be an object with field names as keys or a ' + 'function which returns such an object.');
      var resultFieldMap = {};
      fieldNames.forEach(function(fieldName) {
        assertValidName(fieldName);
        var field = _extends({}, fieldMap[fieldName], {name: fieldName});
        (0, _jsutilsInvariant2['default'])(isInputType(field.type), _this2 + '.' + fieldName + ' field type must be Input Type but ' + ('got: ' + field.type + '.'));
        resultFieldMap[fieldName] = field;
      });
      return resultFieldMap;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.name;
    }
  }]);
  return GraphQLInputObjectType;
})();
exports.GraphQLInputObjectType = GraphQLInputObjectType;
var GraphQLList = (function() {
  function GraphQLList(type) {
    _classCallCheck(this, GraphQLList);
    (0, _jsutilsInvariant2['default'])(isType(type), 'Can only create List of a GraphQLType but got: ' + type + '.');
    this.ofType = type;
  }
  _createClass(GraphQLList, [{
    key: 'toString',
    value: function toString() {
      return '[' + String(this.ofType) + ']';
    }
  }]);
  return GraphQLList;
})();
exports.GraphQLList = GraphQLList;
var GraphQLNonNull = (function() {
  function GraphQLNonNull(type) {
    _classCallCheck(this, GraphQLNonNull);
    (0, _jsutilsInvariant2['default'])(isType(type) && !(type instanceof GraphQLNonNull), 'Can only create NonNull of a Nullable GraphQLType but got: ' + type + '.');
    this.ofType = type;
  }
  _createClass(GraphQLNonNull, [{
    key: 'toString',
    value: function toString() {
      return this.ofType.toString() + '!';
    }
  }]);
  return GraphQLNonNull;
})();
exports.GraphQLNonNull = GraphQLNonNull;
var NAME_RX = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
function assertValidName(name) {
  (0, _jsutilsInvariant2['default'])(NAME_RX.test(name), 'Names must match /^[_a-zA-Z][_a-zA-Z0-9]*$/ but "' + name + '" does not.');
}
