import { router } from "../app/routes/router";
import  request  from "supertest";
import express from "express";
import Knex from "knex";
import connection from "../knexfile.js";
import objection from "objection";
import getUserCredentials from "../app/middleware/getUserCredentials";
import User from "../app/model/User";

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

describe("Login Post Correct Credentials", () => {
	it("should return expected json object", async () => {
		const test_user = await User.query().select().where({email: "john0186@stud.kea.dk"});
		const expected_response = await getUserCredentials(knex, test_user);

		const res = await request(app)
			.post("/login")
			.send({
				"email": "john0186@stud.kea.dk",
				"password": "test"
			});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});

describe("Login Post Wrong Email", () => {
	it("should return expected json object", async () => {
		const expected_response = { "error": "Incorrect email address or password, please try again" };

		const res = await request(app)
			.post("/login")
			.send({
				"email": "Wrong@test.dk",
				"password": "test"
			});
		expect(res.statusCode).toEqual(401);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});

describe("Login Post Wrong Password", () => {
	it("should return expected json object", async () => {
		const expected_response = { "error": "Incorrect email address or password, please try again" };

		const res = await request(app)
			.post("/login")
			.send({
				"email": "john0186@stud.kea.dk",
				"password": "wrongpass"
			});
		expect(res.statusCode).toEqual(401);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});

describe("Login Post Wrong Body send", () => {
	it("should return expected json object", async () => {
		const expected_response =  {"error": "An unexpected error has occurred, please try again later"};

		const res = await request(app)
			.post("/login")
			.send({
				"wrong": "john0186@stud.kea.dk",
				"wrong": "wrongpass"
			});
		expect(res.statusCode).toEqual(501);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});
