import objection from "objection";
const { Model } = objection;

class Code extends Model {
    static get tableName() {
      return "codes";
    }
 
    static get relationMappings() {
      return {
        persons: {
          relation: Model.HasManyRelation,
          modelClass: __dirname + "/Person.js",
          join: {
            from: "persons.person_uuid",
            to: "codes.code_uuid",
          },
        },
      }
    };
  
    static get idColumn() {
      return "codes.code_uuid";
    }
  }
  
  export default Code;