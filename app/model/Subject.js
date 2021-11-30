import objection from "objection";
const { Model } = objection;

class Subject extends Model {
  static get tableName() {
    return "subjects";
  }


  static get relationMappings() {
    return {
      programs: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/Program.js",
        join: {
          from: "programs.program_uuid",
          to: "subjects.subject_uuid",
        },
      },
    }
  };


  static get idColumn() {
    return "subjects.subject_uuid";
  }
}

export default Subject;