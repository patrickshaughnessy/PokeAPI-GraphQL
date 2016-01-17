/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.execute = execute;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _error = require('../error/index');
var _jsutilsFind = require('../jsutils/find');
var _jsutilsFind2 = _interopRequireDefault(_jsutilsFind);
var _jsutilsInvariant = require('../jsutils/invariant');
var _jsutilsInvariant2 = _interopRequireDefault(_jsutilsInvariant);
var _jsutilsIsNullish = require('../jsutils/isNullish');
var _jsutilsIsNullish2 = _interopRequireDefault(_jsutilsIsNullish);
var _utilitiesTypeFromAST = require('../utilities/typeFromAST');
var _language = require('../language/index');
var _values = require('./values');
var _typeDefinition = require('../type/definition');
var _typeSchema = require('../type/schema');
var _typeIntrospection = require('../type/introspection');
var _typeDirectives = require('../type/directives');
function execute(schema, documentAST, rootValue, variableValues, operationName) {
  (0, _jsutilsInvariant2['default'])(schema, 'Must provide schema');
  (0, _jsutilsInvariant2['default'])(schema instanceof _typeSchema.GraphQLSchema, 'Schema must be an instance of GraphQLSchema. Also ensure that there are ' + 'not multiple versions of GraphQL installed in your node_modules directory.');
  var context = buildExecutionContext(schema, documentAST, rootValue, variableValues, operationName);
  return new Promise(function(resolve) {
    resolve(executeOperation(context, context.operation, rootValue));
  })['catch'](function(error) {
    context.errors.push(error);
    return null;
  }).then(function(data) {
    if (!context.errors.length) {
      return {data: data};
    }
    return {
      data: data,
      errors: context.errors
    };
  });
}
function buildExecutionContext(schema, documentAST, rootValue, rawVariableValues, operationName) {
  var errors = [];
  var operation;
  var fragments = {};
  documentAST.definitions.forEach(function(definition) {
    switch (definition.kind) {
      case _language.Kind.OPERATION_DEFINITION:
        if (!operationName && operation) {
          throw new _error.GraphQLError('Must provide operation name if query contains multiple operations.');
        }
        if (!operationName || definition.name && definition.name.value === operationName) {
          operation = definition;
        }
        break;
      case _language.Kind.FRAGMENT_DEFINITION:
        fragments[definition.name.value] = definition;
        break;
      default:
        throw new _error.GraphQLError('GraphQL cannot execute a request containing a ' + definition.kind + '.', definition);
    }
  });
  if (!operation) {
    if (!operationName) {
      throw new _error.GraphQLError('Unknown operation named "' + operationName + '".');
    } else {
      throw new _error.GraphQLError('Must provide an operation.');
    }
  }
  var variableValues = (0, _values.getVariableValues)(schema, operation.variableDefinitions || [], rawVariableValues || {});
  var exeContext = {
    schema: schema,
    fragments: fragments,
    rootValue: rootValue,
    operation: operation,
    variableValues: variableValues,
    errors: errors
  };
  return exeContext;
}
function executeOperation(exeContext, operation, rootValue) {
  var type = getOperationRootType(exeContext.schema, operation);
  var fields = collectFields(exeContext, type, operation.selectionSet, {}, {});
  if (operation.operation === 'mutation') {
    return executeFieldsSerially(exeContext, type, rootValue, fields);
  }
  return executeFields(exeContext, type, rootValue, fields);
}
function getOperationRootType(schema, operation) {
  switch (operation.operation) {
    case 'query':
      return schema.getQueryType();
    case 'mutation':
      var mutationType = schema.getMutationType();
      if (!mutationType) {
        throw new _error.GraphQLError('Schema is not configured for mutations', [operation]);
      }
      return mutationType;
    case 'subscription':
      var subscriptionType = schema.getSubscriptionType();
      if (!subscriptionType) {
        throw new _error.GraphQLError('Schema is not configured for subscriptions', [operation]);
      }
      return subscriptionType;
    default:
      throw new _error.GraphQLError('Can only execute queries, mutations and subscriptions', [operation]);
  }
}
function executeFieldsSerially(exeContext, parentType, sourceValue, fields) {
  return Object.keys(fields).reduce(function(prevPromise, responseName) {
    return prevPromise.then(function(results) {
      var fieldASTs = fields[responseName];
      var result = resolveField(exeContext, parentType, sourceValue, fieldASTs);
      if (result === undefined) {
        return results;
      }
      if (isThenable(result)) {
        return result.then(function(resolvedResult) {
          results[responseName] = resolvedResult;
          return results;
        });
      }
      results[responseName] = result;
      return results;
    });
  }, Promise.resolve({}));
}
function executeFields(exeContext, parentType, sourceValue, fields) {
  var containsPromise = false;
  var finalResults = Object.keys(fields).reduce(function(results, responseName) {
    var fieldASTs = fields[responseName];
    var result = resolveField(exeContext, parentType, sourceValue, fieldASTs);
    if (result === undefined) {
      return results;
    }
    results[responseName] = result;
    if (isThenable(result)) {
      containsPromise = true;
    }
    return results;
  }, {});
  if (!containsPromise) {
    return finalResults;
  }
  return promiseForObject(finalResults);
}
function collectFields(exeContext, runtimeType, selectionSet, fields, visitedFragmentNames) {
  for (var i = 0; i < selectionSet.selections.length; i++) {
    var selection = selectionSet.selections[i];
    switch (selection.kind) {
      case _language.Kind.FIELD:
        if (!shouldIncludeNode(exeContext, selection.directives)) {
          continue;
        }
        var name = getFieldEntryKey(selection);
        if (!fields[name]) {
          fields[name] = [];
        }
        fields[name].push(selection);
        break;
      case _language.Kind.INLINE_FRAGMENT:
        if (!shouldIncludeNode(exeContext, selection.directives) || !doesFragmentConditionMatch(exeContext, selection, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, selection.selectionSet, fields, visitedFragmentNames);
        break;
      case _language.Kind.FRAGMENT_SPREAD:
        var fragName = selection.name.value;
        if (visitedFragmentNames[fragName] || !shouldIncludeNode(exeContext, selection.directives)) {
          continue;
        }
        visitedFragmentNames[fragName] = true;
        var fragment = exeContext.fragments[fragName];
        if (!fragment || !shouldIncludeNode(exeContext, fragment.directives) || !doesFragmentConditionMatch(exeContext, fragment, runtimeType)) {
          continue;
        }
        collectFields(exeContext, runtimeType, fragment.selectionSet, fields, visitedFragmentNames);
        break;
    }
  }
  return fields;
}
function shouldIncludeNode(exeContext, directives) {
  var skipAST = directives && (0, _jsutilsFind2['default'])(directives, function(directive) {
    return directive.name.value === _typeDirectives.GraphQLSkipDirective.name;
  });
  if (skipAST) {
    var _getArgumentValues = (0, _values.getArgumentValues)(_typeDirectives.GraphQLSkipDirective.args, skipAST.arguments, exeContext.variableValues);
    var skipIf = _getArgumentValues['if'];
    return !skipIf;
  }
  var includeAST = directives && (0, _jsutilsFind2['default'])(directives, function(directive) {
    return directive.name.value === _typeDirectives.GraphQLIncludeDirective.name;
  });
  if (includeAST) {
    var _getArgumentValues2 = (0, _values.getArgumentValues)(_typeDirectives.GraphQLIncludeDirective.args, includeAST.arguments, exeContext.variableValues);
    var includeIf = _getArgumentValues2['if'];
    return Boolean(includeIf);
  }
  return true;
}
function doesFragmentConditionMatch(exeContext, fragment, type) {
  var typeConditionAST = fragment.typeCondition;
  if (!typeConditionAST) {
    return true;
  }
  var conditionalType = (0, _utilitiesTypeFromAST.typeFromAST)(exeContext.schema, typeConditionAST);
  if (conditionalType === type) {
    return true;
  }
  if ((0, _typeDefinition.isAbstractType)(conditionalType)) {
    return conditionalType.isPossibleType(type);
  }
  return false;
}
function promiseForObject(object) {
  var keys = Object.keys(object);
  var valuesAndPromises = keys.map(function(name) {
    return object[name];
  });
  return Promise.all(valuesAndPromises).then(function(values) {
    return values.reduce(function(resolvedObject, value, i) {
      resolvedObject[keys[i]] = value;
      return resolvedObject;
    }, {});
  });
}
function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}
function resolveField(exeContext, parentType, source, fieldASTs) {
  var fieldAST = fieldASTs[0];
  var fieldName = fieldAST.name.value;
  var fieldDef = getFieldDef(exeContext.schema, parentType, fieldName);
  if (!fieldDef) {
    return;
  }
  var returnType = fieldDef.type;
  var resolveFn = fieldDef.resolve || defaultResolveFn;
  var args = (0, _values.getArgumentValues)(fieldDef.args, fieldAST.arguments, exeContext.variableValues);
  var info = {
    fieldName: fieldName,
    fieldASTs: fieldASTs,
    returnType: returnType,
    parentType: parentType,
    schema: exeContext.schema,
    fragments: exeContext.fragments,
    rootValue: exeContext.rootValue,
    operation: exeContext.operation,
    variableValues: exeContext.variableValues
  };
  var result = resolveOrError(resolveFn, source, args, info);
  return completeValueCatchingError(exeContext, returnType, fieldASTs, info, result);
}
function resolveOrError(resolveFn, source, args, info) {
  try {
    return resolveFn(source, args, info);
  } catch (error) {
    return error instanceof Error ? error : new Error(error);
  }
}
function completeValueCatchingError(exeContext, returnType, fieldASTs, info, result) {
  if (returnType instanceof _typeDefinition.GraphQLNonNull) {
    return completeValue(exeContext, returnType, fieldASTs, info, result);
  }
  try {
    var completed = completeValue(exeContext, returnType, fieldASTs, info, result);
    if (isThenable(completed)) {
      return completed.then(undefined, function(error) {
        exeContext.errors.push(error);
        return Promise.resolve(null);
      });
    }
    return completed;
  } catch (error) {
    exeContext.errors.push(error);
    return null;
  }
}
function completeValue(exeContext, returnType, fieldASTs, info, result) {
  if (isThenable(result)) {
    return result.then(function(resolved) {
      return completeValue(exeContext, returnType, fieldASTs, info, resolved);
    }, function(error) {
      return Promise.reject((0, _error.locatedError)(error, fieldASTs));
    });
  }
  if (result instanceof Error) {
    throw (0, _error.locatedError)(result, fieldASTs);
  }
  if (returnType instanceof _typeDefinition.GraphQLNonNull) {
    var completed = completeValue(exeContext, returnType.ofType, fieldASTs, info, result);
    if (completed === null) {
      throw new _error.GraphQLError('Cannot return null for non-nullable ' + ('field ' + info.parentType + '.' + info.fieldName + '.'), fieldASTs);
    }
    return completed;
  }
  if ((0, _jsutilsIsNullish2['default'])(result)) {
    return null;
  }
  if (returnType instanceof _typeDefinition.GraphQLList) {
    (0, _jsutilsInvariant2['default'])(Array.isArray(result), 'User Error: expected iterable, but did not find one.');
    var itemType = returnType.ofType;
    var containsPromise = false;
    var completedResults = result.map(function(item) {
      var completedItem = completeValueCatchingError(exeContext, itemType, fieldASTs, info, item);
      if (!containsPromise && isThenable(completedItem)) {
        containsPromise = true;
      }
      return completedItem;
    });
    return containsPromise ? Promise.all(completedResults) : completedResults;
  }
  if (returnType instanceof _typeDefinition.GraphQLScalarType || returnType instanceof _typeDefinition.GraphQLEnumType) {
    (0, _jsutilsInvariant2['default'])(returnType.serialize, 'Missing serialize method on type');
    var serializedResult = returnType.serialize(result);
    return (0, _jsutilsIsNullish2['default'])(serializedResult) ? null : serializedResult;
  }
  var runtimeType;
  if (returnType instanceof _typeDefinition.GraphQLObjectType) {
    runtimeType = returnType;
  } else if ((0, _typeDefinition.isAbstractType)(returnType)) {
    var abstractType = returnType;
    runtimeType = abstractType.getObjectType(result, info);
    if (runtimeType && !abstractType.isPossibleType(runtimeType)) {
      throw new _error.GraphQLError('Runtime Object type "' + runtimeType + '" is not a possible type ' + ('for "' + abstractType + '".'), fieldASTs);
    }
  }
  if (!runtimeType) {
    return null;
  }
  if (runtimeType.isTypeOf && !runtimeType.isTypeOf(result, info)) {
    throw new _error.GraphQLError('Expected value of type "' + runtimeType + '" but got: ' + result + '.', fieldASTs);
  }
  var subFieldASTs = {};
  var visitedFragmentNames = {};
  for (var i = 0; i < fieldASTs.length; i++) {
    var selectionSet = fieldASTs[i].selectionSet;
    if (selectionSet) {
      subFieldASTs = collectFields(exeContext, runtimeType, selectionSet, subFieldASTs, visitedFragmentNames);
    }
  }
  return executeFields(exeContext, runtimeType, result, subFieldASTs);
}
function defaultResolveFn(source, args, _ref) {
  var fieldName = _ref.fieldName;
  var property = source[fieldName];
  return typeof property === 'function' ? property.call(source) : property;
}
function isThenable(value) {
  return value && typeof value === 'object' && typeof value.then === 'function';
}
function getFieldDef(schema, parentType, fieldName) {
  if (fieldName === _typeIntrospection.SchemaMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.SchemaMetaFieldDef;
  } else if (fieldName === _typeIntrospection.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
    return _typeIntrospection.TypeMetaFieldDef;
  } else if (fieldName === _typeIntrospection.TypeNameMetaFieldDef.name) {
    return _typeIntrospection.TypeNameMetaFieldDef;
  }
  return parentType.getFields()[fieldName];
}
