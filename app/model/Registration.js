import objection from "objection";
const { Model } = objection;

class Registration extends Model {
	static get tableName () {
		return "registrations";
	}

	static get relationMappings () {
		return {
			people: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + "/People.js",
				join: {
					from: "people.person_uuid",
					to: "registrations.registration_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "people.person_uuid";
	}
}

export default Registration;
