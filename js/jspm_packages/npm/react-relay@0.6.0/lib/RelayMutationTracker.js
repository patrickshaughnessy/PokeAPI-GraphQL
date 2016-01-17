/* */ 
'use strict';
var GraphQLStoreDataHandler = require('./GraphQLStoreDataHandler');
var clientIDToServerIDMap = {};
var mutationIDToClientNodeIDMap = {};
var clientMutationIDToErrorNodeID = {};
var clientNodeIDToErrorMutationID = {};
var RelayMutationTracker = {
  isClientOnlyID: function isClientOnlyID(dataID) {
    return GraphQLStoreDataHandler.isClientID(dataID) && !clientIDToServerIDMap[dataID];
  },
  updateClientServerIDMap: function updateClientServerIDMap(clientID, serverID) {
    clientIDToServerIDMap[clientID] = serverID;
  },
  getServerIDForClientID: function getServerIDForClientID(clientID) {
    return clientIDToServerIDMap[clientID] || null;
  },
  putClientIDForMutation: function putClientIDForMutation(clientID, clientMutationID) {
    mutationIDToClientNodeIDMap[clientMutationID] = clientID;
    var errorNodeID = RelayMutationTracker.getErrorNodeForMutation(clientMutationID);
    if (errorNodeID) {
      RelayMutationTracker.deleteMutationForErrorNode(errorNodeID);
      RelayMutationTracker.putErrorNodeForMutation(clientID, clientMutationID);
    }
  },
  getClientIDForMutation: function getClientIDForMutation(clientMutationID) {
    return mutationIDToClientNodeIDMap[clientMutationID];
  },
  deleteClientIDForMutation: function deleteClientIDForMutation(clientMutationID) {
    delete mutationIDToClientNodeIDMap[clientMutationID];
  },
  putErrorNodeForMutation: function putErrorNodeForMutation(clientID, clientMutationID) {
    clientNodeIDToErrorMutationID[clientID] = clientMutationID;
    clientMutationIDToErrorNodeID[clientMutationID] = clientID;
  },
  getMutationForErrorNode: function getMutationForErrorNode(clientID) {
    return clientNodeIDToErrorMutationID[clientID];
  },
  getErrorNodeForMutation: function getErrorNodeForMutation(clientMutationID) {
    return clientMutationIDToErrorNodeID[clientMutationID];
  },
  deleteMutationForErrorNode: function deleteMutationForErrorNode(clientID) {
    delete clientNodeIDToErrorMutationID[clientID];
  },
  deleteErrorNodeForMutation: function deleteErrorNodeForMutation(clientMutationID) {
    delete clientMutationIDToErrorNodeID[clientMutationID];
  }
};
module.exports = RelayMutationTracker;
