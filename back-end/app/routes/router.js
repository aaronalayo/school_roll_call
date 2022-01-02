"use strict";
import express from "express";
import session from "express-session";
import School from "../model/School.js";
import Role from "../model/Role.js";
import User from "../model/User.js";
import Code from "../model/Code.js";
import getPublicIp from "../middleware/getPublicIp.js";
import codeGenerator from "../middleware/codeGenerator.js";
import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connection from "../../knexfile.js";
import Knex from "knex";
import getUserCredentials from "../middleware/getUserCredentials.js"

let router = express.Router();
router.use(express.static("public"));
dotenv.config();

const knex = Knex(connection.development);

let LocalStrategy = passportLocal.Strategy;

router.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false}
));

router.use(passport.initialize());
router.use(passport.session());

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
		if(username.length === 0 || password.length === 0){
			return done(null, false, { message: "Incorrect username and/or password." });
		}else {
			const user = await User.query().select().where({ username: username });
			if (!user.length){			
				return done(null, false, { message: "Incorrect username and/or password." });
			}
			bcrypt.compare(password, user[0].password, function (err, result) {
				if (!user || result == false) {
					return done(null, false, { message: "Incorrect username and/or password." });
				} else {
					return done(null, user[0]);
				}
			});
		}
	}
));

router.get("/", async (req, res) =>{
	return res.send(homePage);
});

router.post('/login', async (req, res) => {
	const email = req.body.email;
	const pass = req.body.pass;
	const credentials = await getUserCredentials(knex, email, pass)
	return res.status(200).send(credentials);
});


async function access (req, res, next) {
	const studentIp = await getPublicIp();
	// console.log(studentIp);
	if(!studentIp || studentIp === undefined || studentIp.length === 0 ){
		res.send("There is no internet connection");
	}else{
		const school = await School.query().select().where({school_ip: studentIp});
		// console.log(school.length);
		if(!school || school === undefined || school.length === 0 ){
			res.send("No school found");
		}else {
			next();
		}
	}
}

// router.get("/login", access, (req, res) =>{
// 	res.send(loginPage);
// });

// router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }),
// 	async function(req, res) {
// 		const role = await Role.query().select("role").where({role_uuid: req.user.role_uuid});
// 		if(role[0].role === "STUDENT"){
// 			res.redirect("/logged-in/students/"+ req.user.user_uuid);
// 		}
// 		else if((role[0].role === "TEACHER")){
// 			res.redirect("/logged-in/teachers/" + req.user.user_uuid);
// 		}
// 	});


// router.get("/logged-in/teachers/:uuid", async (req, res) => {
	
// 	const code = await codeGenerator();
// 	await knex("codes").insert({code: code, user_uuid: req.params.uuid});
// 	res.send("<h1>Generated code: " + code.toString() + "</h1>");

// });

// router.get("/logged-in/students/:uuid", async (req, res) => {
	// 	res.send(studentPage);
	// });
	
	// router.post("/post-code", async (req, res) => {
		// 	const isOK = await Code.query().select("code").where({code: req.body.code});
		// 	if (isOK.length === 0){
			// 		res.redirect("/incorrect-code");
			// 	}else {
				// 		res.redirect("/code-ok");
				// 	}
				// });
				
				// router.get("/incorrect-code", (req, res) => {
					// 	res.send("Incorrect Code");
					// });
					
					// router.get("/code-ok", (req, res) => {
						// 	res.send("You are checked in!");
						// });
						// 
export { router };