import objection from "objection";
const { Model } = objection;
import Deparment from "../model/Department.js";
import Subject from "../model/Subject.js" 
class Program extends Model {
	static get tableName () {
		return "programs";
	}

	// static get relationMappings () {
	// 	return {
	// 		departments: {
	// 			relation: Model.HasManyRelation,
	// 			modelClass: Deparment,
	// 			join: {
	// 				from: "departments.department_uuid",
	// 				to: "programs.program_uuid"
	// 			}
	// 		}
	// 	};
	// }
	static get relationMappings () {
		return {
			subjects: {
				relation: Model.HasManyRelation,
				modelClass: Subject,
				join: {
					from: "subjects.subject_uuid",
					to: "programs.program_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "programs.program_uuid";
	}
}

export default Program;
