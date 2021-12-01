import api from "../services/api";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} from "graphql";

const CompanyType = new GraphQLObjectType({
  name: "CompanyType",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      //parentValue retorna o objeto que está sendo acessado
      resolve(parentValue, args) {
        return (
          api
            //parentValue vai retornar{   id: "1",   firstName: "John",   age: 30,companyId: "1" }
            //esse companyId vai ser o id da empresa
            .get(`/companies/${parentValue.companyId}`)
            .then((res) => res.data)
        );
      },
    },
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
