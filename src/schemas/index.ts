import graphql, { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import _ from 'lodash';
import { User } from '../models';
import jsonServer from '../apis/jsonServer';

const users: User[] = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21 },
];

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.get(`/users/${args.id}`);
        return response.data;
        // return _.find(users, { id: args.id });
      }
    },
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery
});

// /**
//  * Construct a GraphQL schema and define the necessary resolvers.
//  *
//  * type Query {
//  *   hello: String
//  * }
//  */
// export const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'Query',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: () => 'world',
//       },
//     },
//   }),
// });
