import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import jsonServer from '../apis/jsonServer';
import { Company, User } from '../models';

const CompanyType: any = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (source: Company, args, context, info) => {
        const response = await jsonServer.get<User[]>(`/companies/${source.id}/users`);
        return response.data;
      }
    }
  })
})

const UserType: any = new GraphQLObjectType({
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString,  },
      },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.post<User>('/users', { firstName: args.firstName, age: args.age, companyId: args.companyId });
        return response.data;
      }
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.get<User>(`/users/${args.id}`);
        const user = response.data;
        await jsonServer.delete(`/users/${user.id}`);
        return user;
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString,  },
      },
      resolve: async (source, args, context, info) => {
        const response = await jsonServer.patch<User>(`/users/${args.id}`, args);
        return response.data;
      }
    }
  }
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
