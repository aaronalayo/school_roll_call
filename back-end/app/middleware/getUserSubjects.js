import People from "../model/People.js"
import Subject from "../model/Subject.js" 
import Program from "../model/Program.js"

export default async function getUserSubjects(knex, user){

    const person = await People.query().select().where({person_uuid: user[0].person_uuid});
    const subjects = [];

    for (const subject of person[0].person_subjects) {
        let subject_info_raw = await Subject.query().select().where({subject_uuid: subject});
        let program = await Program.query().select().where({program_uuid: subject_info_raw[0].program_uuid});
 
        let subject_info = {
            id: subject,
            name: subject_info_raw[0].subject_name,
            description: subject_info_raw[0].subject_description,
            programName: program[0].program_name
        }
        subjects.push(subject_info); 
    }

    return subjects;
}