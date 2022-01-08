/* eslint-disable no-undef */
import { expect } from "@jest/globals";
import Knex from "knex";
import objection from "objection";
import connection from "../knexfile.js";
import codeGenerator from "../app/middleware/codeGenerator.js";
import Subject from "../app/model/Subject"
import Code from "../app/model/Code"
import getGenerateInfo from "../app/middleware/getGenerateInfo.js";

const knex = Knex(connection.development);
const { Model } = objection;
Model.knex(knex);

afterAll(() => {
	knex.destroy();
});

test("Test getGenerateInfo", async () => {
    
    const subject = await Subject.query().select().where({subject_name: "Test-subject1"}).withGraphFetched("programs");
    const expirationTime = 1000
    const code = await codeGenerator();
    let date = new Date().getTime();
    let expTime = date + Number(expirationTime) * 1000 + new Date().getTimezoneOffset();
    expTime =  new Date(expTime)
    let duration = expTime - date
    duration = Math.round(duration / 1000)
    await Code.query().insert({code: code, subject_uuid: subject[0].subject_uuid, expires_at: expTime});
	
    const expected = {
        "subjectName": subject[0].subject_name,
        "expirationTime": duration,
        "code": code
    }

    const result = await getGenerateInfo(subject[0].subject_uuid, subject[0].subject_uuid, expirationTime);

	expect(expected === result);
});