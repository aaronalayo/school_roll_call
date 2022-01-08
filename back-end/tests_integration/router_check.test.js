import { router } from "../app/routes/router";
import  request  from "supertest";
import express from "express";
import Knex from "knex";
import connection from "../knexfile.js";
import objection from "objection";
import User from "../app/model/User";
import Registration from "../app/model/Registration";
import Subject from "../app/model/Subject";
import Code from "../app/model/Code";
import updateAttendance from "../app/middleware/updateAttendance";

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

describe('Check Post Correct body', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserStudent@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid})
    const code = await Code.query().select().where({subject_uuid: subject_registration[0].subject_uuid})

    const res = await request(app)
      .post('/check')
      .send({
        "userId": test_user[0].user_uuid,
        "code": code[0].code,
    });

    const expected_response = await updateAttendance(knex, code, test_user)

    expect(res.statusCode).toEqual(200);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});

describe('Check Post incorrect code', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserStudent@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid})
    const code = await Code.query().select().where({subject_uuid: subject_registration[0].subject_uuid})

    const res = await request(app)
      .post('/check')
      .send({
        "userId": test_user[0].user_uuid,
        "code": "000000",
    });

    const expected_response = {"error": "The code is incorrect"}

    expect(res.statusCode).toEqual(401);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});

describe('Check Post Incored user_uuid', () => {
    it('should return expected json object', async () => {

    const test_user = await User.query().select().where({email: "testUserStudent@test.dk"});
    const subject_registration = await Registration.query().select().where({person_uuid: test_user[0].person_uuid})
    const code = await Code.query().select().where({subject_uuid: subject_registration[0].subject_uuid})

    const res = await request(app)
      .post('/check')
      .send({
        "userId": subject_registration[0].subject_uuid,
        "code": code[0].code,
    });

    const expected_response = {
        "error": "An unexpected error has occurred, please try again later" 
    }

    expect(res.statusCode).toEqual(501);
    expect(res.body).toStrictEqual(expected_response);
  });
  
});