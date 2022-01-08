import { router } from "../app/routes/router";
import  request  from "supertest";
import express from "express";
import Knex from "knex";
import connection from "../knexfile.js";
import objection from "objection";
import User from "../app/model/User";
import Registration from "../app/model/Registration";
import Subject from "../app/model/Subject";
import getGenerateInfo from "../app/middleware/getGenerateInfo"
import Code from "../app/model/Code";

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

describe('Generate Post Correct body', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserTeacher@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid});
    const subject = await Subject.query().select().where({subject_uuid: subject_registration[0].subject_uuid});

    const res = await request(app)
      .post('/generate')
      .send({
        "userId": test_user[0].user_uuid,
        "expirationTime": 1200,
        "subjectId": subject[0].subject_uuid,
        "programId": subject_registration[0].program_uuid
    });
    const code = await Code.query().select().where({subject_uuid: subject_registration[0].subject_uuid})
    const index = code.length -1 
    const expected_response = {
        "code": parseInt(code[index].code),
        "expirationTime": 1200,
        "subjectName": subject[0].subject_name
    }
    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});

describe('Generate Post incorrect user_uuid', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserTeacher@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid});
    const subject = await Subject.query().select().where({subject_uuid: subject_registration[0].subject_uuid});

    const res = await request(app)
      .post('/generate')
      .send({
        "userId": subject[0].subject_uuid,
        "expirationTime": 1200,
        "subjectId": test_user[0].user_uuid, 
        "programId": subject_registration[0].program_uuid
    });

    const expected_response = { "error": "An unexpected error has occurred, please try again later" }

    expect(res.statusCode).toEqual(500);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});

describe('Generate Post empty body', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserTeacher@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid});
    const subject = await Subject.query().select().where({subject_uuid: subject_registration[0].subject_uuid});

    const res = await request(app)
      .post('/generate')
      .send({
        "userId": "",
        "expirationTime": "",
        "subjectId": "", 
        "programId": ""
    });

    const expected_response = { "error": "An unexpected error has occurred, please try again later" }

    expect(res.statusCode).toEqual(500);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});