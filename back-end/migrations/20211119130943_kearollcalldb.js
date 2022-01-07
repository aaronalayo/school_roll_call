export async function up(knex) {
	await knex.schema
		.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
		.raw(`
	CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
	LANGUAGE plpgsql
	AS
	$$
	BEGIN
		NEW.created_at = CURRENT_TIMESTAMP;  
		NEW.updated_at = CURRENT_TIMESTAMP;
		RETURN NEW;
	END;
	$$;
  `);
	
	return knex.schema
		.createTable("schools", (table) => {
			table
				.uuid("school_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("school_name").notNullable();
			table.string("school_address").notNullable();
			table.string("school_ip").notNullable();
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.index(["school_uuid"], "index_schools");
		}).raw(`
	  CREATE TRIGGER update_timestamp
	  BEFORE UPDATE
	  ON schools
	  FOR EACH ROW
	  EXECUTE PROCEDURE update_timestamp();
	`)
		.createTable("departments", (table) => {
			table
				.uuid("department_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("department_name").notNullable();
			table.string("department_address").notNullable();
			table.uuid("school_uuid").notNullable();
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.foreign("school_uuid").references("schools.school_uuid");
			table.index(["department_uuid"], "index_department");
		})
		.createTable("programs", (table) => {
			table
				.uuid("program_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("program_name").notNullable();
			table.uuid("department_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.foreign("department_uuid").references("departments.department_uuid");
			table.index(["program_uuid"], "index_programs");
		})
		.createTable("subjects", (table) => {
			table
				.uuid("subject_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("subject_name").notNullable();
			table.string("subject_description");
			table.uuid("program_uuid");
			table.foreign("program_uuid").references("programs.program_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.index(["subject_uuid"], "index_subject");
		})
		.createTable("people", (table) => {
			table
				.uuid("person_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("person_first_name").notNullable();
			table.string("person_last_name").notNullable();
			table.string("person_phone_number").notNullable();
			table.uuid("department_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.index(["person_uuid"], "index_people");
		})
		.createTable("roles", (table) => {
			table
				.uuid("role_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("role").unique().notNullable();
		})
		.createTable("users", (table) => {
			table
				.uuid("user_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("username").notNullable();
			table.string("password").notNullable();
			table.string("email").notNullable();
			table.uuid("role_uuid").notNullable();
			table.uuid("person_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.foreign("role_uuid").references("roles.role_uuid");
			table.foreign("person_uuid").references("people.person_uuid");
			table.index(["person_uuid"], "index_users");		
		})
		.createTable("registrations", (table) => {
			table
				.uuid("person_uuid")
				.notNullable();
			table
				.uuid("subject_uuid")
				.notNullable();
			table.timestamps(false, true);
			table.foreign("person_uuid").references("people.person_uuid");
			table.foreign("subject_uuid").references("subjects.subject_uuid");
			table.unique(["person_uuid", "subject_uuid"]);
			table.index(["person_uuid", "subject_uuid"], "index_registrations");
		})
		.createTable("attendances", (table) => {
			table
				.uuid("attendance_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.uuid("user_uuid");
			table.uuid("subject_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw('now()'));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw('now()'));
			table.foreign("user_uuid").references("users.user_uuid");
			table.foreign("subject_uuid").references("subjects.subject_uuid");
			table.index(["attendance_uuid"], "index_attendances");
		})
		.createTable("codes", (table) => {
			table
				.uuid("code_uuid")
				.primary()
				.notNullable()
				.defaultTo(knex.raw("uuid_generate_v4()"));
			table.string("code").notNullable();
			table.uuid("subject_uuid");
			table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
			table.timestamp("updated_at").notNullable().defaultTo(knex.raw("now()"));
			table.timestamp("expires_at").defaultTo(null);
			table.foreign("subject_uuid").references("subjects.subject_uuid");
			table.index(["code_uuid"], "index_code");
		});
}

export async function down(knex) {
	await knex.schema
		.raw("DROP FUNCTION IF EXISTS update_timestamp() CASCADE;");
	return knex.schema
  
		.dropTable("codes")
		.dropTable("attendances")
		.dropTable("registrations")
		.dropTable("subjects")

		.dropTable("users")
		.dropTable("roles") 
		.dropTable("people")
		.dropTable("programs")
		.dropTable("departments")
		.dropTable("schools");
}