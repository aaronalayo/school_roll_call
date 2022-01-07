import objection from "objection";
import Person from "./People.js";
const { Model } = objection;

class Code extends Model {
	static get tableName () {
		return "codes";
	}

	static get relationMappings () {
		return {
			people: {
				relation: Model.HasManyRelation,
				modelClass: Person,
				join: {
					from: "people.person_uuid",
					to: "codes.code_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "codes.code_uuid";
	}
}

export default Code;
