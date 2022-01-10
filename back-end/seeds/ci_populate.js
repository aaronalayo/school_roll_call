import bcrypt from "bcrypt";
import publicIp from "public-ip";
const saltRounds = 12;

export async function seed(knex) {
	const hashedPassword = await bcrypt.hash("test", saltRounds);
	const hashedPassword2 = await bcrypt.hash("test", saltRounds);
	const publicIP = await publicIp.v4();
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
				{ role: "ADMIN" },
				{ role: "TEACHER" },
				{ role: "STUDENT" }
			])
				.then(function () {
					// Inserts seed entries
					return knex("schools").insert([
						{ school_name: "KØBENHAVNS ERHVERVSAKADEMI", school_address: "Guldbergsgade 29N 2200 København N", school_ip: publicIP }
					]).returning("school_uuid")
						.then(([school_uuid]) => {
							return knex("departments").insert([
								{ department_name: "IT-department", department_address: "Guldbergsgade 29N 2200 København N", school_uuid: school_uuid }
							]).returning("department_uuid")
								.then(([department_uuid]) => {
									return knex("programs").insert([
										{ program_name: "SOFTWARE DEVELOPMENT", department_uuid: department_uuid }
									]).returning("program_uuid")
										.then(([program_uuid]) => {
											return knex("subjects").insert([
												{ subject_name: "Development Large Systems", subject_description: "Desing large software systems", program_uuid: program_uuid },
												{ subject_name: "Software Testing", subject_description: "Fundamentals of testing", program_uuid: program_uuid },
												{ subject_name: "Database for Developers", subject_description: "Desing good databases", program_uuid: program_uuid }
											]);
										}).then(function () {
											return knex("subjects").select().then(subjects => {
												return knex("people").insert([
													{ person_first_name: "John", person_last_name: "Testerman", person_phone_number: "50574745", department_uuid: department_uuid }
												]).returning("person_uuid")
													.then(([person_uuid]) => {
														return knex("registrations").insert([
															{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Development Large Systems").subject_uuid},
															{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Software Testing").subject_uuid}
														]).returning("person_uuid");
													}).then(([person_uuid]) => {
														return knex("roles").select().then(roles => {
															return knex("users").insert([
																{ username: "john0186", password: hashedPassword, email: "john0186@stud.kea.dk", role_uuid: roles.find(role => role.role === "STUDENT").role_uuid, person_uuid: person_uuid }
															]);
														});
													});
											});
										}).then(function () {
											return knex("subjects").select().then(subjects => {
												return knex("people").insert([
													{ person_first_name: "William", person_last_name: "Hurt", person_phone_number: "27252415", department_uuid: department_uuid }
												]).returning("person_uuid")
													.then(([person_uuid]) => {
														return knex("registrations").insert([
															{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Development Large Systems").subject_uuid},
															{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Software Testing").subject_uuid}
														]).returning("person_uuid");
													}).then(([person_uuid]) => {
														return knex("roles").select().then(roles => {
															return knex("users").insert([
																{ username: "will0185", password: hashedPassword2, email: "will0185@teach.kea.dk", role_uuid: roles.find(role => role.role === "TEACHER").role_uuid, person_uuid: person_uuid }
															]);
														});

													});
											});

										}).then(function () {
											return knex("subjects").select().then(subjects => {
												return knex("people").insert([
													{ person_first_name: "Jack", person_last_name: "Rippers", person_phone_number: "64121514", department_uuid: department_uuid }
												]).returning("person_uuid")
													.then(([person_uuid]) => {
														return knex("registrations").insert([
															{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Database for Developers").subject_uuid}					
														]).returning("person_uuid");
													}).then(([person_uuid]) => {
														return knex("roles").select().then(roles => {
															return knex("users").insert([
																{ username: "jack0183", password: hashedPassword, email: "jack0183@stud.kea.dk", role_uuid: roles.find(role => role.role === "STUDENT").role_uuid, person_uuid: person_uuid }
															]);
														});
													});
											});
										});
								});
						});
				});
		});

}

