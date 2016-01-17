/* */ 
'use strict';
exports.__esModule = true;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _diffBase = require('./diff/base');
var _diffBase2 = _interopRequireDefault(_diffBase);
var _diffCharacter = require('./diff/character');
var _diffWord = require('./diff/word');
var _diffLine = require('./diff/line');
var _diffSentence = require('./diff/sentence');
var _diffCss = require('./diff/css');
var _diffJson = require('./diff/json');
var _patchApply = require('./patch/apply');
var _patchParse = require('./patch/parse');
var _patchCreate = require('./patch/create');
var _convertDmp = require('./convert/dmp');
var _convertXml = require('./convert/xml');
exports.Diff = _diffBase2['default'];
exports.diffChars = _diffCharacter.diffChars;
exports.diffWords = _diffWord.diffWords;
exports.diffWordsWithSpace = _diffWord.diffWordsWithSpace;
exports.diffLines = _diffLine.diffLines;
exports.diffTrimmedLines = _diffLine.diffTrimmedLines;
exports.diffSentences = _diffSentence.diffSentences;
exports.diffCss = _diffCss.diffCss;
exports.diffJson = _diffJson.diffJson;
exports.structuredPatch = _patchCreate.structuredPatch;
exports.createTwoFilesPatch = _patchCreate.createTwoFilesPatch;
exports.createPatch = _patchCreate.createPatch;
exports.applyPatch = _patchApply.applyPatch;
exports.applyPatches = _patchApply.applyPatches;
exports.parsePatch = _patchParse.parsePatch;
exports.convertChangesToDMP = _convertDmp.convertChangesToDMP;
exports.convertChangesToXML = _convertXml.convertChangesToXML;
exports.canonicalize = _diffJson.canonicalize;
