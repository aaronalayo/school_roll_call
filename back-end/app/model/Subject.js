import objection from "objection";
const { Model } = objection;
import Program from "../model/Program.js";
class Subject extends Model {
	static get tableName () {
		return "subjects";
	}

	static get relationMappings () {
		return {
			programs: {
				relation: Model.HasOneRelation,
				modelClass: Program,
				join: {
					from: "programs.program_uuid",
					to: "subjects.program_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "subjects.subject_uuid";
	}
}

export default Subject;
