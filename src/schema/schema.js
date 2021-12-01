import {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

const users = [
  { id: 21, name: "John", age: 25 },
  { id: 15, name: "Sara", age: 24 },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return users.find((user) => user.id == args.id);
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
