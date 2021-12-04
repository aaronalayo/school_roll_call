import objection from 'objection';
const { Model } = objection;

class School extends Model {
	static get tableName() {
		return 'schools';
	}
 
  
  
	static get idColumn() {
		return 'schools.school_uuid';
	}
}
  
export default School;