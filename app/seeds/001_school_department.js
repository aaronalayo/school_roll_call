
export function seed(knex) {
  // Deletes ALL existing entries
  return knex('subjects').del()
    .then(function () {
      return knex('programs').del()
    })
    .then(function () {
      return knex('departments').del()
    })
    .then(function () {
      return knex('schools').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('schools').insert([
        { school_name: 'Kobenhavn E Academie', school_address: "Guldbergsgade 29N 2200 København N", school_ip: '94.18.243.162' }
      ]).returning("school_uuid")
        .then(([school_uuid]) => {
          return knex('departments').insert([
            { department_name: 'IT', department_address: "Guldbergsgade 29N 2200 København N", school_uuid: school_uuid }
          ]).returning("department_uuid")
            .then(([department_uuid]) => {
              return knex('programs').insert([
                { program_name: 'Software Development', department_uuid: department_uuid }
              ]).returning("program_uuid")
                .then(([program_uuid]) => {
                  return knex('subjects').insert([
                    { subject_name: 'Database for developers', subject_description: "Working with multiple databases", program_uuid: program_uuid }
                  ]);
                });
            });
        });
      })
    }
