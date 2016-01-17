/* */ 
'use strict';
var RelayNodeInterface = require('./RelayNodeInterface');
var RelayProfiler = require('./RelayProfiler');
var RelayQueryPath = require('./RelayQueryPath');
function writeRelayQueryPayload(writer, query, payload) {
  var store = writer.getRecordStore();
  var path = new RelayQueryPath(query);
  RelayNodeInterface.getResultsFromPayload(store, query, payload).forEach(function(_ref) {
    var dataID = _ref.dataID;
    var result = _ref.result;
    writer.writePayload(query, dataID, result, path);
  });
}
module.exports = RelayProfiler.instrument('writeRelayQueryPayload', writeRelayQueryPayload);
