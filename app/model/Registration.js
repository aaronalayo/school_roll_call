import objection from "objection";
const { Model } = objection;

class Registration extends Model {
  static get tableName() {
    return "registrations";
  }



  static get idColumn() {
    return "persons.person_uuid";
  }
}

export default Registration;