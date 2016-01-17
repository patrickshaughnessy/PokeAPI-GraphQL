/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.syntaxError = syntaxError;
var _languageLocation = require('../language/location');
var _GraphQLError = require('./GraphQLError');
function syntaxError(source, position, description) {
  var location = (0, _languageLocation.getLocation)(source, position);
  var error = new _GraphQLError.GraphQLError('Syntax Error ' + source.name + ' (' + location.line + ':' + location.column + ') ' + description + '\n\n' + highlightSourceAtLocation(source, location), undefined, undefined, source, [position]);
  return error;
}
function highlightSourceAtLocation(source, location) {
  var line = location.line;
  var prevLineNum = (line - 1).toString();
  var lineNum = line.toString();
  var nextLineNum = (line + 1).toString();
  var padLen = nextLineNum.length;
  var lines = source.body.split(/\r\n|[\n\r\u2028\u2029]/g);
  return (line >= 2 ? lpad(padLen, prevLineNum) + ': ' + lines[line - 2] + '\n' : '') + lpad(padLen, lineNum) + ': ' + lines[line - 1] + '\n' + Array(2 + padLen + location.column).join(' ') + '^\n' + (line < lines.length ? lpad(padLen, nextLineNum) + ': ' + lines[line] + '\n' : '');
}
function lpad(len, str) {
  return Array(len - str.length + 1).join(' ') + str;
}
