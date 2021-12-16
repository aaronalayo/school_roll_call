import express from "express";
import http from "http";
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connection from "./knexfile.js";
import objection from "objection";
import Knex from "knex";
import User from "./app/model/User.js";
import { router } from "./app/routes/router.js";


const app = express();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


dotenv.config();

// Setup Objection + Knex
const { Model } = objection;
const knex = Knex(connection.development);

Model.knex(knex);

let LocalStrategy = passportLocal.Strategy;

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false}
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user.user_uuid);
});

passport.deserializeUser((user_uuid, done) => {
	knex("users").where({user_uuid}).first()
		.then((user) => { done(null, user); })
		.catch((err) => { done(err,null); });
});


passport.use(new LocalStrategy(
	async function (username, password, done) {
		// console.log(username, password);
		const user = await User.query().select().where({ username: username });
		// console.log(user)
		if (!user) {
			return done(null, false, { message: "Incorrect username." });
		}

		bcrypt.compare(password, user[0].password, function (err, result) {
			if (result == false) {
				return done(null, false, { message: "Incorrect password." });
			} else {
				return done(null, user[0]);
			}
		});
	}
));

app.use(router);

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = "0.0.0.0";
server.listen(port, port2, (error) => {
	if (error) {
		console.log("error running the server");
	}
	console.log("App listening on port: ", server.address().port);
});
