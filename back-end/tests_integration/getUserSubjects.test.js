/* eslint-disable no-undef */
import { expect } from "@jest/globals";
import Knex from "knex";
import objection from "objection";
import connection from "../knexfile.js";
import getUserSubjects from "../app/middleware/getUserSubjects";
import User from "../app/model/User";
import Registration from "../app/model/Registration.js";
import Subject from "../app/model/Subject";

const knex = Knex(connection.development);
const { Model } = objection;
Model.knex(knex);

afterAll(() => {
	knex.destroy();
});

test("Test getUserSubjects", async () => {
	const user = await User.query().select().where({email: "john0186@stud.kea.dk"});
	const registrations = await Registration.query().select().where({person_uuid: user[0].person_uuid});
    
	const subjects = [];
	for (const registration of registrations) {

		let subject_info_raw = await Subject.query().select().where({subject_uuid: registration.subject_uuid}).withGraphFetched("programs");

		let subject_info = {
			id: registration.subject_uuid,
			name: subject_info_raw[0].subject_name,
			description: subject_info_raw[0].subject_description,
			programName: subject_info_raw[0].programs.program_name
		};
		subjects.push(subject_info); 
	}

	const result = getUserSubjects(knex, user);

	expect(expect === result);
});