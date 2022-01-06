import objection from "objection";
import Person from "./People.js";
const { Model } = objection;

class Registration extends Model {
	static get tableName () {
		return "registrations";
	}

	static get relationMappings () {
		return {
			people: {
				relation: Model.HasManyRelation,
				modelClass: Person,
				join: {
					from: "people.person_uuid",
					to: "registrations.person_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "people.person_uuid";
	}
}

export default Registration;
