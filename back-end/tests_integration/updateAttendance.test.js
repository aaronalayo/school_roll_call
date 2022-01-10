/* eslint-disable no-undef */
import { expect } from "@jest/globals";
import Knex from "knex";
import objection from "objection";
import connection from "../knexfile.js";
import User from "../app/model/User";
import Subject from "../app/model/Subject.js";
import Code from "../app/model/Code.js";
import updateAttendance from "../app/middleware/updateAttendance.js";

const knex = Knex(connection.development);
const { Model } = objection;
Model.knex(knex);

afterAll(() => {
	knex.destroy();
});

test("Test updateAttendance correct student", async () => {
	const student = await User.query().select().where({email: "john0186@stud.kea.dk"});
	const code = await Code.query().select().where({});
	const subject = await Subject.query().select().where({subject_uuid: code[0].subject_uuid}).withGraphFetched("programs");

	const expected = {
		"userId" : student[0].user_uuid,
		"subjectName": subject[0].subject_name,
		"programName": subject[0].programs.program_name
	};

	const result = await updateAttendance(knex, code, student);

	expect(expected).toStrictEqual(result);
});

test("Test updateAttendance incorrect student", async () => {
	const student = [{person_uuid: "94d39594-e212-4057-8239-f82d007a4f6e"}];
	const code = await Code.query().select().where({});

	const expected = {
		"error": "You are not registered in the subject you tried to check the attendance for. Please, contact your local administrator if you think this is an error"
	};

	const result = await updateAttendance(knex, code, student);

	expect(expected).toStrictEqual(result);
});