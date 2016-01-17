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
//
// import {MongoClient} from "mongodb";
// let db;
//
// MongoClient.connect(process.env.MONGO_URL, (err, database) => {
//   if (err) throw err;
//
//   db = database;
// })


// function idGen(){
//   return Math.floor(Math.random()*Date.now())
// };
// let store = {};
// store.spoons = [
//   {
//     _id: idGen(),
//     title: 'Fat Spoon',
//     price: 24.50
//   },
//   {
//     _id: idGen(),
//     title: 'Skinny Spoon',
//     price: 12.30
//   }
// ]

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
  },
  (obj) => {}
);



let planetType = new GraphQLObjectType({
  name: 'Planet',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj.url
    },
    name: { type: GraphQLString },
    rotation_period: { type: GraphQLInt },
    orbital_period: { type: GraphQLInt },
    diameter: { type: GraphQLInt },
    climate: { type: GraphQLString },
    gravity: { type: GraphQLString },
    terrain: { type: GraphQLString },
    surface_water: { type: GraphQLInt },
    population: { type: GraphQLInt },
    residents: {
      type: personConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) => {
        return connectionFromPromisedArray(async function() {
          // console.log(obj.residents.length);

          var residentsArray = [];
          // console.log('before for');
          for (var i = 0; i < obj.residents.length; i++){
            let residentUrl = obj.residents[i];
            let resident = await function(){
              var res;
              return new Promise(function(resolve, reject){
                request(residentUrl, function(err, resp, body){
                  res = JSON.parse(body);
                  // console.log('before resolve', res);
                  resolve(res);
                })
              })
            }()

            residentsArray.push(resident);
          }
          console.log('residentsarray', residentsArray);
          return residentsArray;
        }()


        //
        //   var objArray = obj.residents.map((residentUrl) => {
        //     var resident;
        //     return new Promise(function(resolve, reject){
        //       request(residentUrl, function(err, resp, body){
        //         resident = [JSON.parse(body)];
        //         // console.log('before resolve', resident);
        //         resolve(resident);
        //       });
        //     });
        //   });
        //   console.log(objArray);
        //   return objArray;
        // }()
        , args);
      }
    },
    // films: { type: GraphQLInt },
    // films: { type: GraphQLInt },
    created: { type: GraphQLString },
    edited: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
  interfaces: [nodeInterface]
})


let personType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj) => obj.url
    },
    name: { type: GraphQLString },
    height: { type: GraphQLInt },
    mass: { type: GraphQLInt },
    hair_color: { type: GraphQLString },
    skin_color: { type: GraphQLString },
    eye_color: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    gender: { type: GraphQLString },
    homeworld: {
      type: planetConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) => {
        return connectionFromPromisedArray(() => {
          var planet;
          var url = obj.homeworld
          return new Promise(function(resolve, reject){
            request(url, function(err, resp, body){
              var planet = [JSON.parse(body)];
              resolve(planet);
            });
          });
        }(), args);
      }
    },
    // films: { type: GraphQLString },
    // species: { type: GraphQLString },
    // vehicles: { type: GraphQLString },
    // starships: { type: GraphQLString },
    created: { type: GraphQLString },
    edited: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
  interfaces: [nodeInterface]
})


let {connectionType: planetConnection} =
  connectionDefinitions({name: 'Planet', nodeType: planetType})

let {connectionType: personConnection} =
  connectionDefinitions({name: 'Person', nodeType: personType})

//
// let storeType = new GraphQLObjectType({
//   name: 'Store',
//   fields: () => ({
//     id: globalIdField('Store'),
//     spoons: {
//       type: spoonConnection,
//       args: {
//         ...connectionArgs
//       },
//       resolve: (obj, args) => {
//         return connectionFromPromisedArray(db.collection('spoons').find({}).toArray(), args)
//       }
//     }
//   })
// })


let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    person: {
      type: personType,
      args: {
        number: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, {number}) => {
        var person;
        var url = 'http://swapi.co/api/people/' + number.toString();
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            person = JSON.parse(body);
            resolve(person);
          })
        })
      }
    },
    planet: {
      type: planetType,
      args: {
        number: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, {number}) => {
        var planet;
        var url = 'http://swapi.co/api/planets/' + number.toString();
        return new Promise(function(resolve, reject){
          request(url, function(err, resp, body){
            planet = JSON.parse(body);
            resolve(planet);
          })
        })
      }
    },
    people: {
      type: personConnection,
      args: {
        ...connectionArgs
      },
      resolve: (obj, args) => {
        console.log(args);
        return connectionFromPromisedArray(
          async function() {
            var done = false;
            var allPeople = [];
            var page;
            while (done === false){
              var {people, next} = await getPeoplePage(page);
              allPeople = allPeople.concat(people);
              if (!next){
                done = true
              } else {
                page = next;
              }
            }
            return allPeople;
          }(), args)
      }
    }
  })
})


function getPeoplePage(page) {
  var people;
  var next;

  var url = page || "http://swapi.co/api/people/";

  return new Promise(function(resolve, reject) {
    request(url, function(error, response, body) {
      var data = JSON.parse(body);
      people = data.results;
      next = data.next
      resolve({people: people, next: next});
    });
  })
}


// let Schema = new GraphQLSchema({
//   query: queryType
// })

  // mutation: new GraphQLObjectType({
  //  name : 'Mutation',
  //  fields: ({
  //    test: {
  //      type: GraphQLString,
  //      resolve: () => "Test"
  //    }
  //  })
  // })
  //});

export var Schema = new GraphQLSchema({
  query: queryType
});
