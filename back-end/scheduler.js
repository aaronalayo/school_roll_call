import connection from "./knexfile.js";
import Knex from "knex";
import Code from "./app/model/Code.js";
const knex = Knex(connection.development);

deleteOldRows();
export default async function deleteOldRows() {
	console.log("executing scheduler");
	await knex.raw("DELETE FROM codes WHERE expires_at < NOW() - INTERVAL '1 minute';");

}