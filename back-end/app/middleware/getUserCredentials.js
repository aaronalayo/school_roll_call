import Role from "../model/Role.js";
import People from "../model/People.js";
import getUserSubjects from "./getUserSubjects.js";

export default async function getUserCredentials(knex, user) {

	const role = await Role.query().select("role").where({role_uuid: user[0].role_uuid});
	const person = await People.query().select().where({person_uuid: user[0].person_uuid});

	const subjects = await getUserSubjects(knex, user);

	const credentials = {
		"userRole": role[0].role,
		"userDetails": {
			"id": user[0].user_uuid,
			"firstName": person[0].person_first_name,
			"lastName": person[0].person_last_name,
			"phoneNumber": person[0].person_phone_number,
			subjects
		}
	};
	return credentials;
}