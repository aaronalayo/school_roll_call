import Code from "../model/Code.js";


const codeGenerator = async () => {
	let code = Math.floor(100000 + Math.random() * 900000);
	const res = await Code.query().select("codes").where({code: code});
	if (res.length === 0)
	{
		return code;
	} else {
		codeGenerator();
	}
};

export default codeGenerator;