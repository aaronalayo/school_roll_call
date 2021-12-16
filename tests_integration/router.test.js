/* eslint-disable no-undef */

import { router } from "../app/routes/router";
import  request  from "supertest";
import express from "express";
import Knex from "knex";
import * as fs from "fs";
import connection from "../knexfile.js";
import objection from "objection";
// import { test } from "media-typer";

const homePage = fs.readFileSync("./public/homepage.html", "utf8");
const loginPage = fs.readFileSync("./public/loginpage.html", "utf8");

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
