import express from "express";
import http from "http";


const app = express();
const server = http.createServer(app);
import session from "express-session";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
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


let LocalStrategy = passportLocal.Strategy;

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false}
));

app.use(passport.initialize());
app.use(passport.session());
import User from "./app/model/User.js";
passport.serializeUser((user, done) => {
	// console.log(user)
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

// function adminLoggedIn(req, res, next) {
// 	if (req.user){
// 		if (req.user.role == "admin") {
// 			next();
// 		} else {
// 			res.send("you have to be an admin to access this page !");
// 		}
// 	}
// 	else {
// 		res.send("you have to be logged in as admin to access this page !");
// 	}
// }




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
