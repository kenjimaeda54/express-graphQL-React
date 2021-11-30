import express from "express";
import graphQl from "express-graphql";

class App {
  constructor() {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {}

  routes() {}
}

export default new App().app;
