#!/usr/bin/env babel-node --optional es7.asyncFunctions

import request from 'request';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  connectionFromPromisedObject,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
  },
  (obj) => {}
);

let pokedexType = new GraphQLObjectType({
  name: 'Pokedex',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => 1
    },
    created: {type: GraphQLString},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    pokemon: {
      type: pokemonConnection,
      args: {
        start: {type: new GraphQLNonNull(GraphQLInt)},
        number: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (pokedex, args) => {
        // use conncetion args for front end pagination??
        console.log('args', args);

        return connectionFromPromisedArray(async function() {
          let pokemonArray = [];
          for (let i = args.start; i < (args.start + args.number); i++){
            let pokemonURL = `http://pokeapi.co/${pokedex.pokemon[i].resource_uri}`;
            let pokemon = await function(){
              let pokemon;
              return new Promise((resolve, reject) => {
                request(pokemonURL, (err, resp, body) => {
                  pokemon = JSON.parse(body);
                  resolve(pokemon);
                });
              });
            }();
            pokemonArray.push(pokemon);
          }
          return pokemonArray;
        }(), args)
      }
    },
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let pokemonType = new GraphQLObjectType({
  name: 'Pokemon',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => 1
    },
    name: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let {connectionType: pokemonConnection} =
  connectionDefinitions({name: 'Pokemon', nodeType: pokemonType})

// let {connectionType: personConnection} =
//   connectionDefinitions({name: 'Person', nodeType: personType})


let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    pokedex: {
      type: pokedexType,
      resolve: (_) => {
        let pokedex;
        let url = 'http://pokeapi.co/api/v1/pokedex/1/';
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            pokedex = JSON.parse(body);
            resolve(pokedex);
          })
        })
      }
    },
    pokemon: {
      type: pokemonType,
      args: {
        number: {
          type: GraphQLInt,
          resolve: (pokemon) => pokemon.resource_uri.split('/').pop()
        }
      },
      resolve: (_, args) => {
        let pokemon;
        let url = `http://pokeapi.co/api/v1/pokemon/${args.number}`;
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            pokemon = JSON.parse(body);
            resolve(pokemon);
          })
        })
      }
    }
  })
})

export var Schema = new GraphQLSchema({
  query: queryType
});
