import User from "../model/User.js"
import Role from "../model/Role.js"
import Subject from "../model/Subject.js" 
import Program from "../model/Program.js"
import Code from "../model/Code.js"
import codeGenerator from "./codeGenerator.js"
import moment from "moment";

export default async function getGenerateInfo(subjectId, userId, expirationTime) {
    const subject = await Subject.query().select().where({subject_uuid: subjectId}).withGraphFetched("programs");

    const code = await codeGenerator();
    let date = new Date().getTime();
    let expTime = date + Number(expirationTime) * 1000 + new Date().getTimezoneOffset();
    expTime =  new Date(expTime)
    let duration = expTime - date
    duration = Math.round(duration / 1000)
    expTime = moment((new Date(expTime).toISOString())).add(1,'hours');
    await Code.query().insert({code: code, user_uuid: userId, expires_at: expTime});
	
    const generatedInfo = {
        "subjectName": subject[0].subject_name,
        "expirationTime": duration,
        "code": code
    }
     return generatedInfo   

    
}


