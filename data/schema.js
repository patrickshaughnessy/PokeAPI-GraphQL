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
        // use connection args for front end pagination?

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
      resolve: (pokemon) => pokemon.national_id;
    },
    abilities: {
      type: abilityConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'abilities'), args);
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
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'descriptions'), args);
      }
    },
    egg_cycles: {type: GraphQLInt},
    egg_groups: {
      type: eggConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'egg_groups'), args);
      }
    },
    ev_yield: {type: GraphQLString},
    evolutions: {
      type: new GraphQLList(evolutionType),
      resolve: (pokemon) => pokemon.evolutions.map((evolution) => evolution)
    },
    exp: {type: GraphQLInt},
    growth_rate: {type: GraphQLString},
    happiness: {type: GraphQLInt},
    height: {type: GraphQLString},
    hp: {type: GraphQLInt},
    male_female_ratio: {type: GraphQLString},
    modified: {type: GraphQLString},
    moves: {
      type: moveConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'moves'), args);
      }
    },
    name: {type: GraphQLString},
    national_id: {type: GraphQLInt},
    pkdx_id: {type: GraphQLInt},
    resource_uri: {type: GraphQLString},
    sp_atk: {type: GraphQLInt},
    sp_def: {type: GraphQLInt},
    species: {type: GraphQLString},
    speed: {type: GraphQLInt},
    sprites: {
      type: spriteConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'sprites'), args);
      }
    },
    total: {type: GraphQLInt},
    types: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (pokemon, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(pokemon, 'types'), args);
      }
    },
    weight: {type: GraphQLString}
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
    games: {
      type: gameConnection,
      args: {
        ...connectionArgs
      },
      resolve: (description, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(description, 'games'), args);
      }
    },
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

let eggType = new GraphQLObjectType({
  name: 'Egg',
  fields: () => ({
    created: {type: GraphQLString},
    id: {type: new GraphQLNonNull(GraphQLID)},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    pokemon: {
      type: pokemonConnection,
      args: {
        ...connectionArgs
      },
      resolve: (egg, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(egg, 'pokemon'), args);
      }
    },
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let evolutionType = new GraphQLObjectType({
  name: 'Evolution',
  fields: () => ({
    level: {type: GraphQLInt},
    method: {type: GraphQLString},
    pokemon: {
      type: pokemonType,
      resolve: (evolution) => {
        let pokemon;
        let url = `http://pokeapi.co/${evolution.resource_uri}`;
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            pokemon = JSON.parse(body);
            resolve(pokemon);
          })
        });
      }
    },
    to: {type: GraphQLString},
  }),
})

let gameType = new GraphQLObjectType({
  name: 'Game',
  fields: () => ({
    created: {type: GraphQLString},
    generation: {type: GraphQLInt},
    id: {type: new GraphQLNonNull(GraphQLID)},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    release_year: {type: GraphQLInt},
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let moveType = new GraphQLObjectType({
  name: 'Move',
  fields: () => ({
    accuracy: {type: GraphQLInt},
    category: {type: GraphQLString},
    created: {type: GraphQLString},
    description: {type: GraphQLString},
    id: {type: new GraphQLNonNull(GraphQLID)},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    power: {type: GraphQLInt},
    pp: {type: GraphQLInt},
    resource_uri: {type: GraphQLString}
  }),
  interfaces: [nodeInterface]
})

let spriteType = new GraphQLObjectType({
  name: 'Sprite',
  fields: () => ({
    created: {type: GraphQLString},
    id: {type: new GraphQLNonNull(GraphQLID)},
    image: {type: GraphQLString},
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    pokemon: {
      type: pokemonType,
      resolve: (obj) => {
        let pokemon;
        let url = `http://pokeapi.co/${obj.pokemon.resource_uri}`;
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

let typeType = new GraphQLObjectType({
  name: 'Type',
  fields: () => ({
    created: {type: GraphQLString},
    id: {type: new GraphQLNonNull(GraphQLID)},
    ineffective: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (type, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(type, 'ineffective'), args);
      }
    },
    modified: {type: GraphQLString},
    name: {type: GraphQLString},
    no_effect: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (type, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(type, 'no_effect'), args);
      }
    },
    resistance: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (type, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(type, 'resistance'), args);
      }
    },
    resource_uri: {type: GraphQLString},
    super_effective: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (type, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(type, 'super_effective'), args);
      }
    },
    weakness: {
      type: typeConnection,
      args: {
        ...connectionArgs
      },
      resolve: (type, args) => {
        return connectionFromPromisedArray(generateResolvedPromisedArray(type, 'weakness'), args);
      }
    }
  }),
  interfaces: [nodeInterface]
})

let {connectionType: pokemonConnection} =
  connectionDefinitions({name: 'Pokemon', nodeType: pokemonType})

let {connectionType: abilityConnection} =
  connectionDefinitions({name: 'Ability', nodeType: abilityType})

let {connectionType: descriptionConnection} =
  connectionDefinitions({name: 'Description', nodeType: descriptionType})

let {connectionType: eggConnection} =
  connectionDefinitions({name: 'Egg', nodeType: eggType})

let {connectionType: gameConnection} =
  connectionDefinitions({name: 'Game', nodeType: gameType})

let {connectionType: moveConnection} =
  connectionDefinitions({name: 'Move', nodeType: moveType})

let {connectionType: spriteConnection} =
  connectionDefinitions({name: 'Sprite', nodeType: spriteType})

let {connectionType: typeConnection} =
  connectionDefinitions({name: 'Type', nodeType: typeType})


// RESOLVE FUNCTION FOR ARRAYS IN POKEMON TYPE
function generateResolvedPromisedArray(obj, category){
  return async function() {
    let categoryArray = [];
    for (let i = 0; i < obj[category].length; i++){
      let typeURL = `http://pokeapi.co/${obj[category][i].resource_uri}`;
      let type = await function(){
        let type;
        return new Promise((resolve, reject) => {
          request(typeURL, (err, resp, body) => {
            type = JSON.parse(body);
            resolve(type);
          });
        });
      }();
      categoryArray.push(type);
    }
    return categoryArray;
  }()
}



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
