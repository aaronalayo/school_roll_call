import Attendance from "../model/Attendance.js";
import Registration from "../model/Registration.js";
import Subject from "../model/Subject.js";

export default async function updateAttendance(knex, code, student){
    
	const registrations = await Registration.query().select().where({person_uuid: student[0].person_uuid, subject_uuid: code[0].subject_uuid});
    
	if (registrations.length === 0){
		return {
			"error": "You are not registered in the subject you tried to check the attendance for. Please, contact your local administrator if you think this is an error"
		};
	}

	await Attendance.query().insert({user_uuid: student[0].user_uuid, subject_uuid: code[0].subject_uuid});

	const subject = await Subject.query().select().where({subject_uuid: code[0].subject_uuid}).withGraphFetched("programs");

	const response = {
		"userId" : student[0].user_uuid,
		"subjectName": subject[0].subject_name,
		"programName": subject[0].programs.program_name
	};

	return response;
}