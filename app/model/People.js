import objection from "objection";
const { Model } = objection;

class Person extends Model {
	static get tableName () {
		return "people";
	}

	static get relationMappings () {
		return {
			departments: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + "/Departement.js",
				join: {
					from: "departments.department_uuid",
					to: "people.person_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "people.person_uuid";
	}
}

export default Person;
