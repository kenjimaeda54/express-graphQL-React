import app from "./app";
const { graphqlHTTP } = require("express-graphql");

app.listen(4001, () => {
  console.log("http://localhost:4001");
  console.log("Server is running on port 4001");
});
