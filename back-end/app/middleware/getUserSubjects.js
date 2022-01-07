import Registration from "../model/Registration.js"
import Subject from "../model/Subject.js" 

export default async function getUserSubjects(knex, user){

    const registrations = await Registration.query().select().where({person_uuid: user[0].person_uuid});
    const subjects = [];

    for (const registration of registrations) {

        let subject_info_raw = await Subject.query().select().where({subject_uuid: registration.subject_uuid}).withGraphFetched("programs");

        let subject_info = {
            id: registration.subject_uuid,
            name: subject_info_raw[0].subject_name,
            description: subject_info_raw[0].subject_description,
            programName: subject_info_raw[0].programs.program_name
        }
        subjects.push(subject_info); 
    }

    return subjects;
}