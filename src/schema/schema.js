import api from "../services/api";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} from "graphql";

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

//este root query e quem fara a consulta no banco de dados
//e retornara o resultado
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return api.get(`/users/${args.id}`).then((res) => res.data);
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
});
