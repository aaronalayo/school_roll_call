import objection from "objection";
const { Model } = objection;

class Role extends Model {
	static get tableName () {
		return "roles";
	}

	static get relationMappings () {
		return {
			users: {
				relation: Model.HasOneRelation,
				modelClass: __dirname + "/Users.js",
				join: {
					from: "users.user_uuid",
					to: "roles.role_uuid"
				}
			}
		};
	}

	static get idColumn () {
		return "roles.role_uuid";
	}
}

export default Role;