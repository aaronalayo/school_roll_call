/* eslint-disable no-undef */
import { expect } from "@jest/globals";
import codeGenerator from "../app/middleware/codeGenerator";
import Knex from "knex";
import objection from "objection";
import connection from "../knexfile.js";


const knex = Knex(connection.development);
const { Model } = objection;
Model.knex(knex);

afterAll(() => {
	knex.destroy();
});

test("codeGenerator test", async () => {
	const code = await codeGenerator();
	expect(code !== 0);
});