/* eslint-disable no-undef */
import { expect } from "@jest/globals";
import Knex from "knex";
import objection from "objection";
import connection from "../knexfile.js";
import getUserSubjects from "../app/middleware/getUserSubjects";
import getUserCredentials from "../app/middleware/getUserCredentials";
import User from "../app/model/User";
import Role from "../app/model/Role";
import People from "../app/model/People";

const knex = Knex(connection.development);
const { Model } = objection;
Model.knex(knex);

afterAll(() => {
	knex.destroy();
});

test("Test getUserCredentials correct user", async () => {
	const user = await User.query().select().where({email: "john0186@stud.kea.dk"});
	const role = await Role.query().select("role").where({role_uuid: user[0].role_uuid});
	const person = await People.query().select().where({person_uuid: user[0].person_uuid});

	const subjects = await getUserSubjects(knex, user);

	const expected = {
		"userRole": role[0].role,
		"userDetails": {
			"id": person[0].person_uuid,
			"firstName": person[0].person_first_name,
			"lastName": person[0].person_last_name,
			"phoneNumber": person[0].person_phone_number,
			subjects
		}
	};
	const result = await getUserCredentials(knex, user);

	expect(expected === result);
});