import objection from "objection";
import Subject from "../model/Subject.js";
const { Model } = objection;

class Attendance extends Model {
	static get tableName () {
		return "attendances";
	}

	static get relationMappings () {
		return {
			subjects: {
				relation: Model.HasManyRelation,
				modelClass: Subject,
				join: {
					from: "subjects.subject_uuid",
					to: "attendances.attendance_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "attendances.attendance_uuid";
	}
}

export default Attendance;
