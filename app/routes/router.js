"use strict";
import express from "express";
let router = express.Router();
import session from "express-session";
router.use(express.static("public"));
import * as fs from "fs";

import School from "../model/School.js";
import Role from "../model/Role.js";
import User from "../model/User.js";

import getPublicIp from "../middleware/getPublicIp.js";
// import checkIp from "../middleware/checkIp.js";

import passport from "passport";
import passportLocal from "passport-local";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import connection from "../../knexfile.js";
import Knex from "knex";
const knex = Knex(connection.development);
// knex.on("query", function (queryData) {
// 	console.log(queryData);
// });


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
const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const loginstudentsPage = fs.readFileSync("./public/loginstudents.html", "utf8");
const loginteachersPage = fs.readFileSync("./public/loginteachers.html", "utf8");

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
			// const result = checkIp(studentIp, school[0].school_ip);
			// // console.log(result);
			// if(result == false){
			// 	res.send("You are not at school").redirect("/");
			// }else{
			next();
			// }
		}
	}
}

router.get("/loginstudents",access, (req, res) =>{
	res.send(loginstudentsPage);
});
router.get("/loginteachers", (req, res) =>{
	res.send(loginteachersPage);
});
router.post("/loginstudents", passport.authenticate("local", { failureRedirect: "/loginstudents" }),
	async function(req, res) {
		const role = await Role.query().select("role").where({role_uuid: req.user.role_uuid});
		// console.log(role[0].role)
		if((role[0].role === "STUDENT")){
			res.send("WELCOME STUDENT "+ req.user.username); 
		}else {
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