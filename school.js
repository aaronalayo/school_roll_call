

// const seed = async function(knex) {
//     return knex('school').select().then(school =>{
//         return knex('schools').insert([
//           {school_name: 'Kobenhavn E Academie', school_address: "Guldbergsgade 29N 2200 København N", school_ip: '192.168.1.166'},
//         ]).returning('school_uuid')
//         .into('school')
//         .then(function (school_uuid) {
//             return knex('department').insert([
//                 {department_name: 'IT', department_address: "Guldbergsgade 29N 2200 København N", school_uuid: school_uuid},
//               ]);
//         });
//     })
  
//   };

// // exports.seed = async function(knex) {
// //   return knex('people').select().then(people =>{
// //       return knex('people').insert([
// //         {person_full_name: 'admin', person_phone_number: hashedPassword, email: 'editoraaron@gmail.com', role_id:roles.find(role => role.role ==='ADMIN').id, 
// //         organization_uuid:'50d09dd8-fb37-4ede-b902-64a5c29d6536'},
// //       ]);
// //   })

// // };

// export default seed;