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
    abilities: {
      type: abilityConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(async function() {
          let abilitiesArray = [];
          console.log('pokemon ablities', pokemon.abilities)
          for (let i = 0; i < pokemon.abilities.length; i++){
            let abilityURL = `http://pokeapi.co/${pokemon.abilities[i].resource_uri}`;
            let ability = await function(){
              let ability;
              return new Promise((resolve, reject) => {
                request(abilityURL, (err, resp, body) => {
                  ability = JSON.parse(body);
                  resolve(ability);
                });
              });
            }();
            abilitiesArray.push(ability);
          }
          return abilitiesArray;
        }(), args)
      }
    },
    attack: {type: GraphQLInt},
    catch_rate: {type: GraphQLInt},
    created: {type: GraphQLString},
    defense: {type: GraphQLInt},
    descriptions: {
      type: descriptionConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(async function() {
          let descriptionsArray = [];
          for (let i = 0; i < pokemon.descriptions.length; i++){
            let descriptionURL = `http://pokeapi.co/${pokemon.descriptions[i].resource_uri}`;
            let description = await function(){
              let description;
              return new Promise((resolve, reject) => {
                request(descriptionURL, (err, resp, body) => {
                  description = JSON.parse(body);
                  resolve(description);
                });
              });
            }();
            descriptionsArray.push(description);
          }
          return descriptionsArray;
        }(), args)
      }
    },
    name: {type: GraphQLString},

  }),
  interfaces: [nodeInterface]
})

let abilityType = new GraphQLObjectType({
  name: 'Ability',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: GraphQLString},
    created: {type: GraphQLString},
    modified: {type: GraphQLString},
    description: {type: GraphQLString},
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let descriptionType = new GraphQLObjectType({
  name: 'Description',
  fields: () => ({
    created: {type: GraphQLString},
    description: {type: GraphQLString},
    // games: {
    //   type: gameConnection,
    //   args: {
    //     ...connectionArgs
    //   },
    //   resolve: (description, args) => {
    //     // make game connection
    //     return
    //   }
    // },
    id: {type: new GraphQLNonNull(GraphQLID)},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    pokemon: {
      type: pokemonType,
      resolve: (pokeinfo) => {
        let pokemon;
        let url = `http://pokeapi.co/${pokeinfo.pokemon.resource_uri}`;
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            pokemon = JSON.parse(body);
            resolve(pokemon);
          })
        })
      }
    },
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let {connectionType: pokemonConnection} =
  connectionDefinitions({name: 'Pokemon', nodeType: pokemonType})

let {connectionType: abilityConnection} =
  connectionDefinitions({name: 'Ability', nodeType: abilityType})

let {connectionType: descriptionConnection} =
  connectionDefinitions({name: 'Description', nodeType: descriptionType})

// let {connectionType: gameConnection} =
//   connectionDefinitions({name: 'Game', nodeType: gameType})

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
        number: {type: new GraphQLNonNull(GraphQLInt)}
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
