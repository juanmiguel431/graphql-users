import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import jsonServer from '../apis/jsonServer';
import { Company, User } from '../models';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString }
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    companyId: { type: GraphQLString },
    company: {
      type: CompanyType,
      resolve: async (source: User, args, context, info) => {
        const response = await jsonServer.get<Company[]>(`/companies/${source.companyId}`);
        return response.data;
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.get<User[]>(`/users/${args.id}`);
        return response.data;
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.get<Company[]>(`/companies/${args.id}`);
        return response.data
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery
});
