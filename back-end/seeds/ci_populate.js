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
						{ school_name: "Test-School", school_address: "Test-address", school_ip: publicIP }
					]).returning("school_uuid")
						.then(([school_uuid]) => {
							return knex("departments").insert([
								{ department_name: "Test-department", department_address: "Test-department-address", school_uuid: school_uuid }
							]).returning("department_uuid")
								.then(([department_uuid]) => {
									return knex("programs").insert([
										{ program_name: "Test-program", department_uuid: department_uuid }
									]).returning("program_uuid")
										.then(([program_uuid]) => {
											return knex("subjects").insert([
												{ subject_name: "Test-subject1", subject_description: "Test-description", program_uuid: program_uuid },
												{ subject_name: "Test-subject2", subject_description: "Test-description", program_uuid: program_uuid }
											])
										}).then(function () {
											return knex("subjects").select().then(subjects => {
												return knex("people").insert([
													{ person_first_name: "Test-people-firstname-student", person_last_name: "Test-people-lastname-student", person_phone_number: "Test-people-phonenumber-student", department_uuid: department_uuid }
												]).returning("person_uuid")
													.then(([person_uuid]) => {
															return knex("registrations").insert([
																{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Test-subject1").subject_uuid},
																{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Test-subject2").subject_uuid}
															]).returning("person_uuid")
														}).then(([person_uuid]) => {
														return knex("roles").select().then(roles => {
															return knex("users").insert([
																{ username: "Test-user-student", password: hashedPassword, email: "testUserStudent@test.dk", role_uuid: roles.find(role => role.role === "STUDENT").role_uuid, person_uuid: person_uuid }
															]);
														})
													})
											})
										}).then(function () {
											return knex("subjects").select().then(subjects => {
												return knex("people").insert([
													{ person_first_name: "Test-people-firstname-teacher", person_last_name: "Test-people-lastname-teacher", person_phone_number: "Test-people-phonenumber-teacher", department_uuid: department_uuid }
												]).returning("person_uuid")
												.then(([person_uuid]) => {
													return knex("registrations").insert([
														{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Test-subject1").subject_uuid},
														{ person_uuid: person_uuid, subject_uuid: subjects.find(subject => subject.subject_name === "Test-subject2").subject_uuid}
													]).returning("person_uuid")
												}).then(([person_uuid]) => {
														return knex("roles").select().then(roles => {
															return knex("users").insert([
																{ username: "Test-user-teacher", password: hashedPassword2, email: "testUserTeacher@test.dk", role_uuid: roles.find(role => role.role === "TEACHER").role_uuid, person_uuid: person_uuid }
															]);
														})

													});
											});

										});
								});
						});
				});
		});

}