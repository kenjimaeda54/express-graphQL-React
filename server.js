import app from "./app";
const { graphqlHTTP } = require("express-graphql");

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("http://localhost:4000");
  console.log("Server is running on port 4000");
});
