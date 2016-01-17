/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.getVariableValues = getVariableValues;
exports.getArgumentValues = getArgumentValues;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _error = require('../error/index');
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
var _jsutilsKeyMap = require('../jsutils/keyMap');
var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);
var _utilitiesTypeFromAST = require('../utilities/typeFromAST');
var _utilitiesValueFromAST = require('../utilities/valueFromAST');
var _utilitiesIsValidJSValue = require('../utilities/isValidJSValue');
var _languagePrinter = require('../language/printer');
var _typeDefinition = require('../type/definition');
function getVariableValues(schema, definitionASTs, inputs) {
  return definitionASTs.reduce(function(values, defAST) {
    var varName = defAST.variable.name.value;
    values[varName] = getVariableValue(schema, defAST, inputs[varName]);
    return values;
  }, {});
}
function getArgumentValues(argDefs, argASTs, variableValues) {
  if (!argDefs || !argASTs) {
    return {};
  }
  var argASTMap = (0, _jsutilsKeyMap2['default'])(argASTs, function(arg) {
    return arg.name.value;
  });
  return argDefs.reduce(function(result, argDef) {
    var name = argDef.name;
    var valueAST = argASTMap[name] ? argASTMap[name].value : null;
    var value = (0, _utilitiesValueFromAST.valueFromAST)(valueAST, argDef.type, variableValues);
    if ((0, _jsutilsIsNullish2['default'])(value)) {
      value = argDef.defaultValue;
    }
    if (!(0, _jsutilsIsNullish2['default'])(value)) {
      result[name] = value;
    }
    return result;
  }, {});
}
function getVariableValue(schema, definitionAST, input) {
  var type = (0, _utilitiesTypeFromAST.typeFromAST)(schema, definitionAST.type);
  var variable = definitionAST.variable;
  if (!type || !(0, _typeDefinition.isInputType)(type)) {
    throw new _error.GraphQLError('Variable "$' + variable.name.value + '" expected value of type ' + ('"' + (0, _languagePrinter.print)(definitionAST.type) + '" which cannot be used as an input type.'), [definitionAST]);
  }
  var inputType = type;
  var errors = (0, _utilitiesIsValidJSValue.isValidJSValue)(input, inputType);
  if (!errors.length) {
    if ((0, _jsutilsIsNullish2['default'])(input)) {
      var defaultValue = definitionAST.defaultValue;
      if (defaultValue) {
        return (0, _utilitiesValueFromAST.valueFromAST)(defaultValue, inputType);
      }
    }
    return coerceValue(inputType, input);
  }
  if ((0, _jsutilsIsNullish2['default'])(input)) {
    throw new _error.GraphQLError('Variable "$' + variable.name.value + '" of required type ' + ('"' + (0, _languagePrinter.print)(definitionAST.type) + '" was not provided.'), [definitionAST]);
  }
  var message = errors ? '\n' + errors.join('\n') : '';
  throw new _error.GraphQLError('Variable "$' + variable.name.value + '" got invalid value ' + (JSON.stringify(input) + '.' + message), [definitionAST]);
}
function coerceValue(_x, _x2) {
  var _again = true;
  _function: while (_again) {
    var type = _x,
        value = _x2;
    nullableType = itemType = fields = parsed = undefined;
    _again = false;
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var nullableType = type.ofType;
      _x = nullableType;
      _x2 = value;
      _again = true;
      continue _function;
    }
    if ((0, _jsutilsIsNullish2['default'])(value)) {
      return null;
    }
    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (Array.isArray(value)) {
        return value.map(function(item) {
          return coerceValue(itemType, item);
        });
      }
      return [coerceValue(itemType, value)];
    }
    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      var fields = type.getFields();
      return Object.keys(fields).reduce(function(obj, fieldName) {
        var field = fields[fieldName];
        var fieldValue = coerceValue(field.type, value[fieldName]);
        if ((0, _jsutilsIsNullish2['default'])(fieldValue)) {
          fieldValue = field.defaultValue;
        }
        if (!(0, _jsutilsIsNullish2['default'])(fieldValue)) {
          obj[fieldName] = fieldValue;
        }
        return obj;
      }, {});
    }
    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLScalarType || type instanceof _typeDefinition.GraphQLEnumType, 'Must be input type');
    var parsed = type.parseValue(value);
    if (!(0, _jsutilsIsNullish2['default'])(parsed)) {
      return parsed;
    }
  }
}
