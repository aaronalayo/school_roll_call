import express from 'express';
import http from  'http';
const app = express();
const server = http.createServer(app);

// Setup Objection + Knex

import objection from "objection";
const { Model } = objection;
import Knex from "knex";
import connection from "./knexfile.js"
const knex = Knex(connection.development);
knex.on("query", function (queryData) {
  console.log( queryData );
});
knex.on('query', console.log);

Model.knex(knex);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = "0.0.0.0";
server.listen(port, port2, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port);
});
