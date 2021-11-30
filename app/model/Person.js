import objection from "objection";
const { Model } = objection;

class Person extends Model {
  static get tableName() {
    return "persons";
  }
  static get relationMappings() {
    return {
      departments: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/Departement.js",
        join: {
          from: "departments.department_uuid",
          to: "persons.person_uuid",
        },
      },
    }
  };

  static get idColumn() {
    return "persons.person_uuid";
  }
}

export default Person;