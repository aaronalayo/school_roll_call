import express from "express";
import http from "http";

// Setup Objection + Knex


const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

import connection from "./knexfile.js";
import objection from "objection";
import Knex from "knex";

const { Model } = objection;
const knex = Knex(connection.development);
// knex.on("query", function (queryData) {
// 	console.log(queryData);
// });

Model.knex(knex);


import { router } from "./app/routes/router.js";
app.use(router);

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = "0.0.0.0";
server.listen(port, port2, (error) => {
	if (error) {
		console.log("error running the server");
	}
	console.log("App listening on port: ", server.address().port);
});
