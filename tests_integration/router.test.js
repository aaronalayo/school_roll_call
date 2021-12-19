/* eslint-disable no-undef */

import { router } from "../app/routes/router";
import  request  from "supertest";
import express from "express";
import Knex from "knex";
import * as fs from "fs";
import connection from "../knexfile.js";
import objection from "objection";
import User from "../app/model/User.js";
import Code from "../app/model/Code";
import { compareSync } from "bcrypt";


const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const loginPage = fs.readFileSync("./public/loginpage.html", "utf8");
const studentPage = fs.readFileSync("./public/studentpage.html", "utf8");
const teacherPage = fs.readFileSync("./public/teacherpage.html", "utf8");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const { Model } = objection;
const knex = Knex(connection.development);

Model.knex(knex);

app.use(express.urlencoded({ extended: false }));
app.use(router);

afterAll(() => {
	knex.destroy();
});

test("index route works", done => {
	request(app)
		.get("/")
		.expect(homePage)
		.expect(200, done);
});

test("login route works", done => {
	request(app)
		.get("/login")
		.expect(loginPage)
		.expect(200, done);
});

test("incorrect-code route works", done => {
	request(app)
		.get("/incorrect-code")
		.expect("Incorrect Code")
		.expect(200, done);
});

test("code-ok route works", done => {
	request(app)
		.get("/code-ok")
		.expect("You are checked in!")
		.expect(200, done);
});

test("students logged-in", async () => {
	const student_uuid = await User.query().select("user_uuid").where({username: "Test-user-student"});

	request(app)
		.get("/logged-in/students/" + student_uuid[0].user_uuid)
		.expect(studentPage)
		.expect(200);

});

test("teachers logged-in", async () => {
	const teacher_uuid = await User.query().select("user_uuid").where({username: "Test-user-teacher"});
	request(app)
		.get("/logged-in/teachers/" + teacher_uuid[0].user_uuid)
		.expect(200);	
});

// test("log-in function student", async () => {
// 	const data = { username: "Test-user-student", password: "test" };
// 	const student_uuid = await User.query().select("user_uuid").where({username: "Test-user-student"});
// 	return request(app)
// 		.post("/login")
// 		.set("Content-type", "application/json")
// 		.send(data)
// 		.expect("Location", "/logged-in/students/" + student_uuid[0].user_uuid);
// });

// test("log-in function teacher", async () => {
// 	const data = { username: "Test-user-teacher", password: "test" };
// 	const teacher_uuid = await User.query().select("user_uuid").where({username: "Test-user-teacher"});
// 	return request(app)
// 		.post("/login")
// 		.set("Content-type", "application/json")
// 		.send(data)
// 		.expect("Location", "/logged-in/teachers/" + teacher_uuid[0].user_uuid);
// });

// test("posting code for students", async () => {
// 	const code = await Code.query().select("code");
// 	const data = { code: code[0].code};

// 	return request(app)
// 		.post("/post-code")
// 		.set("Content-type", "application/json")
// 		.send(data)
// 		.expect("Location", "/code-ok");
// });