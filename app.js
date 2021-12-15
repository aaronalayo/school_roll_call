import express from "express";
import http from "http";


const app = express();
const server = http.createServer(app);
// import session from "express-session";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


import dotenv from "dotenv";
dotenv.config();

import connection from "./knexfile.js";
import objection from "objection";
import Knex from "knex";


// Setup Objection + Knex
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
