import bcrypt from "bcrypt";
const saltRounds = 12;

export async function seed(knex) {
	const hashedPassword = await bcrypt.hash("gambetta", saltRounds);
	// Deletes ALL existing entries
	return knex("users").del()
		.then(function () {
			return knex("roles").del();
		}).then(function () {
			return knex("people").del();
		})
		.then(function () {
			return knex("subjects").del();
		})
		.then(function () {
			return knex("programs").del();
		})
		.then(function () {
			return knex("departments").del();
		})
		.then(function () {
			return knex("schools").del();
		})
		.then(function () {
			return knex("roles").insert([
				{role: "ADMIN"},
				{role: "TEACHER"},
				{role: "STUDENT"}
			])
				.then(function () {
					// Inserts seed entries
					return knex("schools").insert([
						{ school_name: "Kobenhavn E Academie", school_address: "Guldbergsgade 29N 2200 København N", school_ip: "80.208.65.80" }
					]).returning("school_uuid")
						.then(([school_uuid]) => {
							return knex("departments").insert([
								{ department_name: "IT", department_address: "Guldbergsgade 29N 2200 København N", school_uuid: school_uuid }
							]).returning("department_uuid")
								.then(([department_uuid]) => {
									return knex("programs").insert([
										{ program_name: "Software Development", department_uuid: department_uuid }
									]).returning("program_uuid")
										.then(([program_uuid]) => {
											return knex("subjects").insert([
												{ subject_name: "Database for developers", subject_description: "Working with multiple databases", program_uuid: program_uuid }
											]);
										}).then(function () {
											return knex("people").insert([
												{ person_full_name: "Aaron ALAYO", person_phone_number: "50571216", department_uuid:department_uuid }
											]).returning("person_uuid")
												.then(([person_uuid])  =>  {
													return knex("roles").select().then(roles =>{
														return knex("users").insert([  
															{username: "aaro0186", password: hashedPassword, email: "aaro0186@stud.kea.dk", role_uuid: roles.find(role => role.role ==="STUDENT").role_uuid, 
																person_uuid:person_uuid}   
														]);
													});
												});
                      
										});
								});
						});
				});
		});
    
}