"use strict";
import express from "express";
import session from "express-session";
import Role from "../model/Role.js";
import User from "../model/User.js";
import Code from "../model/Code.js";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import connection from "../../knexfile.js";
import Knex from "knex";
import getUserCredentials from "../middleware/getUserCredentials.js"
import getGenerateInfo from "../middleware/getGenerateInfo.js"
import getUserSubjects from "../middleware/getUserSubjects.js";
import updateAttendance from "../middleware/updateAttendance.js";

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

router.get("/", async (req, res) => {
	// console.log(req.ip);
	return res.status(200).send("Hi User");
});

router.post('/login', async (req, res) => {
	try {
		const email = req.body.email;
		const user = await User.query().select().where({ email: email });
	
		if (user.length !== 0){
			if (bcrypt.compareSync(req.body.password, user[0].password)){
				const credentials = await getUserCredentials(knex, user);
				return res.status(200).send(credentials);
			}
		}
		return res.status(401).send( { "error": "Incorrect email address or password, please try again" } );	
	} catch (error) {
		// console.log(error);
		return res.status(501).send({  "error": "An unexpected error has occurred, please try again later" });
	}
	
});

router.get("/subjects/:userID", async (req, res) => {
	try {
		const user = await User.query().select().where({user_uuid: req.params.userID});
		if (user.length !== 0){
			const subjects = await getUserSubjects(knex, user);
			return res.status(200).send(subjects);
		} else {
			return res.status(401).send({"error": "The user specified does not exist"});
		}
	} catch (error) {
		// console.log(error);
		return res.status(501).send({"error": "An unexpected error has occurred, please try again later"})
	}
});

router.post("/generate", async (req, res) => {
	const { userId, expirationTime, subjectId } = req.body;
	// console.log(req.body)
	if (userId === "" || subjectId === "" || expirationTime.length === "") {
		return res.status(500).send({ "error": "An unexpected error has occurred, please try again later" });
	}else if (userId, subjectId, expirationTime) {
		const user = await User.query().select().where({ user_uuid: userId });
		// console.log(user.length)
		if (user.length == 0) {
			return res.status(500).send({ "error": "An unexpected error has occurred, please try again later" });
		}else if (user){
			const role = await Role.query().select("role").where({ role_uuid: user[0].role_uuid });
			if (role[0].role === "TEACHER") {
				const generatedInfo = await getGenerateInfo(subjectId, user[0].user_uuid, expirationTime);
				// console.log(generatedInfo)
				return res.status(200).send(generatedInfo)
			} else {
				return res.status(500).send({ "error": "An unexpected error has occurred, please try again later" });
			}
		}
	} else {
		return res.status(500).send({ "error": "An unexpected error has occurred, please try again later" });
	}
	});

router.post("/check", async (req, res) => {
	try {
		const {userId, code} = req.body;
		const userStudent = await User.query().select().where({user_uuid: userId});
		const codeDB = await Code.query().select().where({code: code});
	
		if (codeDB.length === 0){
			return res.status(401).send({"error": "The code is incorrect"});
		}
	
		const result = await updateAttendance(knex, codeDB, userStudent );
		return res.status(200).send(result);
		
	} catch (error) {
		// console.log(error);
		return res.status(501).send({
			"error": "An unexpected error has occurred, please try again later" 
		});
	}

});

export { router };