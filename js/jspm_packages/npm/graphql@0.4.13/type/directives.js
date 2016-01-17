/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var _definition = require('./definition');
var _scalars = require('./scalars');
var GraphQLDirective = function GraphQLDirective(config) {
  _classCallCheck(this, GraphQLDirective);
  this.name = config.name;
  this.description = config.description;
  this.args = config.args || [];
  this.onOperation = Boolean(config.onOperation);
  this.onFragment = Boolean(config.onFragment);
  this.onField = Boolean(config.onField);
};
exports.GraphQLDirective = GraphQLDirective;
var GraphQLIncludeDirective = new GraphQLDirective({
  name: 'include',
  description: 'Directs the executor to include this field or fragment only when ' + 'the `if` argument is true.',
  args: [{
    name: 'if',
    type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
    description: 'Included when true.'
  }],
  onOperation: false,
  onFragment: true,
  onField: true
});
exports.GraphQLIncludeDirective = GraphQLIncludeDirective;
var GraphQLSkipDirective = new GraphQLDirective({
  name: 'skip',
  description: 'Directs the executor to skip this field or fragment when the `if` ' + 'argument is true.',
  args: [{
    name: 'if',
    type: new _definition.GraphQLNonNull(_scalars.GraphQLBoolean),
    description: 'Skipped when true.'
  }],
  onOperation: false,
  onFragment: true,
  onField: true
});
exports.GraphQLSkipDirective = GraphQLSkipDirective;
