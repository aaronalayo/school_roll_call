import objection from "objection";
const { Model } = objection;

class User extends Model {
    static get tableName() {
      return "users";
    }
 
    static get relationMappings() {
      return {
        persons: {
          relation: Model.HasOneRelation,
          modelClass: __dirname + "/Person.js",
          join: {
            from: "persons.person_uuid",
            to: "users.user_uuid",
          },
        },
      }
    };
  
    static get idColumn() {
      return "users.user_uuid";
    }
  }
  
  export default User;