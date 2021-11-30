import objection from "objection";
const { Model } = objection;

class Department extends Model {
  static get tableName() {
    return "departments";
  }


  static get relationMappings() {
    return {
      schools: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/School.js",
        join: {
          from: "schools.school_uuid",
          to: "departments.department_uuid",
        },
      },
    }
  };
  static get idColumn() {
    return "departments.department_uuid";
  }
}

export default Department;