import express from "express";
import graphQLroutes from "./src/routes/graphQLroutes";

class App {
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {}

  routes() {
    this.app.use("/graphql", graphQLroutes);
  }
}

export default new App().app;
