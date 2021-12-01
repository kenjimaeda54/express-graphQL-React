import api from "../services/api";
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";

const CompanyType = new GraphQLObjectType({
  name: "CompanyType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      //aqui e relacao de 1 para N entre Company e User
      //pode ter muitos users e uma company
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        //nosso users nao tem args, entao nao precisamos passar nada
        return (
          api
            //no resolve, pega o id da company e busca os users relacionados
            //seria fazer no navegador /companies/3/users
            .get(`/companies/${parentValue.id}/users`)
            .then((res) => res.data)
        );
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      //parentValue retorna o objeto que está sendo acessado
      //aqui e relacao de 1 para 1, so pode ter um usuario por empresa
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
  }),
});

//este root query e quem fara a consulta no banco de dados
//e retornara o resultado
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      //de preferencia usar args no RootQuery
      resolve(parentValue, args) {
        return api.get(`/users/${args.id}`).then((res) => res.data);
      },
    },
    companies: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return api.get(`/companies/${args.id}`).then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        //id e auto gerado pelo graphql
        return api.post("/users", { firstName, age }).then((res) => res.data);
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }) {
        return api.delete(`/users/${id}`).then((res) => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        //o args ja e um objeto,por ser bastante valores optou passar direto args
        return api.patch(`/users/${args.id}`, args).then((res) => res.data);
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation,
});
