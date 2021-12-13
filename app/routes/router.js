"use strict";
import express from "express";
let router = express.Router();

router.use(express.static("public"));
import * as fs from "fs";
import School from "../model/School.js";
import getPublicIp from "../middleware/getPublicIp.js";
import checkIp from "../middleware/checkIp.js";
import passport from "passport";

const homePage = fs.readFileSync("./public/homepage.html", "utf8");

router.get("/", async (req, res) =>{
	return res.send(homePage);
});

router.get("/login", async (req, res) => {
	const studentIp = await getPublicIp();
	console.log(studentIp);
	if(!studentIp || typeof studentIp == undefined){
		res.send("There is no internet connection");
	}else{
		const school = await School.query().select().where({school_ip: studentIp});
		if(!school || typeof school == undefined ){
			res.send("This school doesnt exits").redirect("/");
		}else{
			const result = checkIp(studentIp, school[0].school_ip);
			console.log(result);
			if(result == false){
				res.send("You are not at school").redirect("/");
			}else{
				res.send("Welcome student");
			}
		}
	}
});
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }),
	function(req, res) {
		res.send("You are logged in");
		// console.log(req.user.username)
	});
export { router };