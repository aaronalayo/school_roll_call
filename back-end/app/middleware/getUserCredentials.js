import User from "../model/User.js"
import Role from "../model/Role.js"
import People from "../model/People.js"
import Subject from "../model/Subject.js" 
import Program from "../model/Program.js"
import bcrypt from "bcrypt"

export default async function getUserCredentials(knex, user) {
    
    if(user.length === 0){
        return {"error": "Incorrect email address or password, please try again" };
    }
    
    const subjects = []  

    // isPassCorrect = bcrypt.compare(pass, user[0].password, (err, res) => {
    //     return res;
    // });

    const role = await Role.query().select("role").where({role_uuid: user[0].role_uuid});
    const person = await People.query().select().where({person_uuid: user[0].person_uuid});
    
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

    const credentials = {
        "userRole": role[0].role,
        "userDetails": {
            "id": person[0].person_uuid,
            "firstName": person[0].person_first_name,
            "lastName": person[0].person_last_name,
            "phoneNumber": person[0].person_phone_number,
            "subjects": subjects
        }
    }
    return credentials;
}