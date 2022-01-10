
import Subject from "../model/Subject.js"; 
import Code from "../model/Code.js";
import codeGenerator from "./codeGenerator.js";
import moment from "moment";


export default async function getGenerateInfo(subjectId, userId, expirationTime) {
	const subject = await Subject.query().select().where({subject_uuid: subjectId}).withGraphFetched("programs");

	const code = await codeGenerator();
	
	let expTime = moment().add(Number(expirationTime), "minutes") ;

	await Code.query().insert({code: code, subject_uuid: subject[0].subject_uuid, expires_at: expTime});
	
	const generatedInfo = {
		"subjectName": subject[0].subject_name,
		"expirationTime": Number(expirationTime),
		"code": code
	};
	return generatedInfo;   

}


