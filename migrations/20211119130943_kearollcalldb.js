
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
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
    }
  

    export async function down(knex) {
        return knex.schema.dropTable('schools');
      }
