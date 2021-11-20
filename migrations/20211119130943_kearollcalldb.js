
export async function up (knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
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
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.index(['school_uuid'], 'index_schools');
      })
      .createTable("departments", (table) => {
        table
          .uuid("department_uuid")
          .primary()
          .notNullable()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("department_name").notNullable();
        table.string("department_address").notNullable();
        table.uuid("school_uuid").notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign("school_uuid").references("schools.school_uuid");
        table.index(['department_uuid'], 'index_department');
      })
      .createTable("programs", (table) => {
        table
          .uuid("program_uuid")
          .primary()
          .notNullable()
          .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("program_name").notNullable();
        table.uuid("department_uuid");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign("department_uuid").references("departments.department_uuid");
        table.index(["program_uuid"], "index_programs");
      })
      .createTable("persons", (table) =>{
        table
        .uuid("person_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("person_full_name").notNullable();
        table.string("person_phone_number").notNullable();
        table.string("person_role").notNullable();
        table.uuid("department_uuid");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign("department_uuid").references("departments.department_uuid");
        table.index(['person_uuid'], 'index_persons');

      })
      .createTable("users", (table) =>{
        table
        .uuid("person_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("password").notNullable();
        table.string("email").notNullable();
        table.string("role").notNullable();
        table.uuid("subject_uuid");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign("person_uuid").references("persons.person_uuid");
        table.index(['person_uuid'], 'index_users');

      })
      .createTable("subjects", (table) =>{
        table
        .uuid("subject_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("subject_name").notNullable();
        table.string("subject_description");
        table.uuid("program_uuid");
        table.foreign("program_uuid").references("programs.program_uuid");        
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.index(['subject_uuid'], 'index_subject');
      })
   
      .createTable("persons_subjects", (table) => {
        table
          .uuid("person_uuid")
          .notNullable();
        table
          .uuid("subject_uuid")
          .notNullable();
        table.foreign("person_uuid").references("persons.person_uuid");
        table.foreign("subject_uuid").references("subjects.subject_uuid");
        table.unique(["person_uuid", "subject_uuid"]);
        table.index(["person_uuid", "subject_uuid"], 'index_persons_subjects');
      })
      .createTable("attendances", (table) =>{
        table
        .uuid("person_uuid")
        .primary()
        .notNullable();
        table.boolean("is_confirmed").notNullable();
        table.uuid("subject_uuid");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.foreign("person_uuid").references("persons.person_uuid");
        table.index(['person_uuid'], 'index_attendances');
      })
      .createTable("codes", (table) =>{
        table
        .uuid("code_uuid")
        .primary()
        .notNullable()
        .defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("code").notNullable();
        table.string("subject_description");
        table.uuid("person_uuid");
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at').defaultTo(knex.fn.now());
        table.foreign("person_uuid").references("persons.person_uuid");
        table.index(['code_uuid'], 'index_code');
      })

    }
  

    export async function down(knex) {
        return knex.schema
        // .dropTable('subjects')
        // .dropTable('codes')
        // .dropTable('deparments')
        // .dropTable('attendances')
        // .dropTable('persons')
        // .dropTable('users')
        .dropTable('schools');
        // .dropTable('programs')
        // .dropTable('persons_subjects');
      }
