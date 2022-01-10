import express from "express";
import http from "http";
import dotenv from "dotenv";
import connection from "./knexfile.js";
import objection from "objection";
import Knex from "knex";
import { router } from "./app/routes/router.js";

const app = express();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.all("*", function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	res.header(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});

dotenv.config();

// Setup Objection + Knex
const { Model } = objection;
const knex = Knex(connection.development);

Model.knex(knex);

app.use(router);

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = "0.0.0.0";
server.listen(port, port2, (error) => {
	if (error) {
		console.log("error running the server");
	}
	console.log("App listening on port: ", server.address().port);
});
