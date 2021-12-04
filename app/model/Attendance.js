import objection from 'objection';
const { Model } = objection;

class Attendance extends Model {
	static get tableName () {
		return 'attendances';
	}

	static get relationMappings () {
		return {
			subjects: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + '/Subject.js',
				join: {
					from: 'subjects.subject_uuid',
					to: 'attendances.attendance_uuid'
				}
			}
		};
	}

	static get idColumn () {
		return 'attendances.attendance_uuid';
	}
}

export default Attendance;
