import { graphqlHTTP } from "express-graphql";
import schema from "../schema/schema";

export default graphqlHTTP({
  schema,
  graphiql: true,
});
