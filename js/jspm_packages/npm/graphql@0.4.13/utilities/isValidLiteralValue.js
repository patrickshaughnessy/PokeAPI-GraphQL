/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.isValidLiteralValue = isValidLiteralValue;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0,
        arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i];
    return arr2;
  } else {
    return Array.from(arr);
  }
}
var _languagePrinter = require('../language/printer');
var _languageKinds = require('../language/kinds');
var _typeDefinition = require('../type/definition');
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsKeyMap = require('../jsutils/keyMap');
var _jsutilsKeyMap2 = _interopRequireDefault(_jsutilsKeyMap);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
function isValidLiteralValue(_x, _x2) {
  var _again = true;
  _function: while (_again) {
    var type = _x,
        valueAST = _x2;
    ofType = itemType = fields = errors = fieldASTs = _iteratorNormalCompletion = _didIteratorError = _iteratorError = fieldASTMap = _iteratorNormalCompletion2 = _didIteratorError2 = _iteratorError2 = parseResult = undefined;
    _again = false;
    if (type instanceof _typeDefinition.GraphQLNonNull) {
      var ofType = type.ofType;
      if (!valueAST) {
        if (ofType.name) {
          return ['Expected "' + ofType.name + '!", found null.'];
        }
        return ['Expected non-null value, found null.'];
      }
      _x = ofType;
      _x2 = valueAST;
      _again = true;
      continue _function;
    }
    if (!valueAST) {
      return [];
    }
    if (valueAST.kind === _languageKinds.VARIABLE) {
      return [];
    }
    if (type instanceof _typeDefinition.GraphQLList) {
      var itemType = type.ofType;
      if (valueAST.kind === _languageKinds.LIST) {
        return valueAST.values.reduce(function(acc, itemAST, index) {
          var errors = isValidLiteralValue(itemType, itemAST);
          return acc.concat(errors.map(function(error) {
            return 'In element #' + index + ': ' + error;
          }));
        }, []);
      }
      _x = itemType;
      _x2 = valueAST;
      _again = true;
      continue _function;
    }
    if (type instanceof _typeDefinition.GraphQLInputObjectType) {
      if (valueAST.kind !== _languageKinds.OBJECT) {
        return ['Expected "' + type.name + '", found not an object.'];
      }
      var fields = type.getFields();
      var errors = [];
      var fieldASTs = valueAST.fields;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = fieldASTs[Symbol.iterator](),
            _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var providedFieldAST = _step.value;
          if (!fields[providedFieldAST.name.value]) {
            errors.push('In field "' + providedFieldAST.name.value + '": Unknown field.');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      var fieldASTMap = (0, _jsutilsKeyMap2['default'])(fieldASTs, function(fieldAST) {
        return fieldAST.name.value;
      });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;
      try {
        for (var _iterator2 = Object.keys(fields)[Symbol.iterator](),
            _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var fieldName = _step2.value;
          var result = isValidLiteralValue(fields[fieldName].type, fieldASTMap[fieldName] && fieldASTMap[fieldName].value);
          errors.push.apply(errors, _toConsumableArray(result.map(function(error) {
            return 'In field "' + fieldName + '": ' + error;
          })));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
      return errors;
    }
    (0, _jsutilsInvariant2['default'])(type instanceof _typeDefinition.GraphQLScalarType || type instanceof _typeDefinition.GraphQLEnumType, 'Must be input type');
    var parseResult = type.parseLiteral(valueAST);
    if ((0, _jsutilsIsNullish2['default'])(parseResult)) {
      return ['Expected type "' + type.name + '", found ' + (0, _languagePrinter.print)(valueAST) + '.'];
    }
    return [];
  }
}
