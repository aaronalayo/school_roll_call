"use strict";
import express from "express";
import session from "express-session";
import * as fs from "fs";
import School from "../model/School.js";
import Role from "../model/Role.js";
import User from "../model/User.js";
import getPublicIp from "../middleware/getPublicIp.js";
import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const loginPage = fs.readFileSync("./public/loginpage.html", "utf8");
const wrongCred = fs.readFileSync("./public/wrongcred.html", "utf8");

let loginTries = 3;

let router = express.Router();
router.use(express.static("public"));
dotenv.config();

import connection from "../../knexfile.js";
import Knex from "knex";
const knex = Knex(connection.development);

let LocalStrategy = passportLocal.Strategy;

router.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false}
));

router.use(passport.initialize());
router.use(passport.session());
// import Role from "./app/model/Role.js";

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

router.get("/login", access, (req, res) =>{
	res.send(loginPage);
});

router.get("/api/incorrect-credentials", access, (req, res) => {
	if (loginTries === 0){
		console.log("Too many tries");
	} else {
		loginTries -= 1;
		res.send(wrongCred);
	}
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/api/incorrect-credentials" }),
	async function(req, res) {
		const role = await Role.query().select("role").where({role_uuid: req.user.role_uuid});
		// console.log(role[0].role)
		if(role[0].role === "STUDENT"){
			res.send("WELCOME STUDENT "+ req.user.username); 
		}
		else if((role[0].role === "TEACHER")){
			res.send("you have to be a student to access this page !");
		}
	});

router.post("/loginteachers", passport.authenticate("local", { failureRedirect: "/loginteachers" }),
	async function (req, res) {
		const role = await Role.query().select("role").where({ role_uuid: req.user.role_uuid });
		if (role[0].role === "TEACHER") {
			res.send("WELCOME TEACHER "+ req.user.username);
		} else {
			res.send("you have to be a teacher to access this page !");
		}
        
	});

export { router };