# Express with GrapqhQL

Aplicacao simples de express com grapql

## Motivacao
Aprofundar em express usando grapqhl,entender mutations,query e solucoues que o grapql traz.


## Feature
- Com json server simulei um banco de dados.
- Se editar, criar ou deletar refletia direto no arquivo db.json.
- Utilizei express puro com grapql sem nenhum cliente.
- Trabalhei com relação entre usuário e companhia.
- Um usuário pode ter apenas uma companhia.
- Companhia poderia ter N usuários.
- GrapqhQL utiliza o  root query para fazer toda relação entre os schemas.

```javascript



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


```

- Mutation server para edição, deletar e update dos dados
- Sempre opte por putch quando for atualizar, putch e útil quando deseja atualizar alguns valores.
-Ele preserva os valores anteriores caso não for passado.


```javascript


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



 ```


