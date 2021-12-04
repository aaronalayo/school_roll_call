import objection from 'objection';
const { Model } = objection;

class Program extends Model {
	static get tableName () {
		return 'programs';
	}

	static get relationMappings () {
		return {
			departments: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + '/Department.js',
				join: {
					from: 'departments.department_uuid',
					to: 'programs.program_uuid'
				}
			}
		};
	}

	static get idColumn () {
		return 'programs.program_uuid';
	}
}

export default Program;
