import { router } from "../app/routes/router";
import request  from "supertest";
import express from "express";
import Knex from "knex";
import connection from "../knexfile.js";
import objection from "objection";
import User from "../app/model/User";
import getUserSubjects from "../app/middleware/getUserSubjects";

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

describe("Subjects Get Correct userID", () => {
	it("should return expected json object", async () => {
		const test_user = await User.query().select().where({email: "john0186@stud.kea.dk"});
		const expected_response = await getUserSubjects(knex, test_user);

		const res = await request(app)
			.get("/subjects/" + test_user[0].user_uuid);

		expect(res.statusCode).toEqual(200);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});

describe("Subjects Get Correct incorrect userID", () => {
	it("should return expected error", async () => {

		const expected_response = {"error": "The user specified does not exist"};

		const res = await request(app)

			.get("/subjects/5a5512e4-347a-42c0-91f0-1bea99501233");//ac6d5779-8273-4b23-aa3e-e5467ed936dd
		expect(res.statusCode).toEqual(401);
		expect(res.body).toStrictEqual(expected_response);
	});
  
});