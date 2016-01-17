/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.astFromValue = astFromValue;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
var _languageKinds = require('../language/kinds');
var _typeDefinition = require('../type/definition');
var _typeScalars = require('../type/scalars');
function astFromValue(_x, _x2) {
  var _again = true;
  _function: while (_again) {
    var value = _x,
        type = _x2;
    itemType = stringNum = isIntValue = fields = undefined;
    _again = false;
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      _x = value;
      _x2 = type.ofType;
      _again = true;
      continue _function;
    }
    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return null;
    }
    if (Array.isArray(value)) {
      var itemType = type instanceof _typeDefinition.GraphQLList ? type.ofType : null;
      return {
        kind: _languageKinds.LIST,
        values: value.map(function(item) {
          return astFromValue(item, itemType);
        })
      };
    } else if (type instanceof _typeDefinition.GraphQLList) {
      _x = value;
      _x2 = type.ofType;
      _again = true;
      continue _function;
    }
    if (typeof value === 'boolean') {
      return {
        kind: _languageKinds.BOOLEAN,
        value: value
      };
    }
    if (typeof value === 'number') {
      var stringNum = String(value);
      var isIntValue = /^[0-9]+$/.test(stringNum);
      if (isIntValue) {
        if (type === _typeScalars.GraphQLFloat) {
          return {
            kind: _languageKinds.FLOAT,
            value: stringNum + '.0'
          };
        }
        return {
          kind: _languageKinds.INT,
          value: stringNum
        };
      }
      return {
        kind: _languageKinds.FLOAT,
        value: stringNum
      };
    }
    if (typeof value === 'string') {
      if (type instanceof _typeDefinition.GraphQLEnumType && /^[_a-zA-Z][_a-zA-Z0-9]*$/.test(value)) {
        return {
          kind: _languageKinds.ENUM,
          value: value
        };
      }
      return {
        kind: _languageKinds.STRING,
        value: JSON.stringify(value).slice(1, -1)
      };
    }
    (0, _jsutilsInvariant2['default'])(typeof value === 'object');
    var fields = [];
    Object.keys(value).forEach(function(fieldName) {
      var fieldType;
      if (type instanceof _typeDefinition.GraphQLInputObjectType) {
        var fieldDef = type.getFields()[fieldName];
        fieldType = fieldDef && fieldDef.type;
      }
      var fieldValue = astFromValue(value[fieldName], fieldType);
      if (fieldValue) {
        fields.push({
          kind: _languageKinds.OBJECT_FIELD,
          name: {
            kind: _languageKinds.NAME,
            value: fieldName
          },
          value: fieldValue
        });
      }
    });
    return {
      kind: _languageKinds.OBJECT,
      fields: fields
    };
  }
}
