import publicIp from "public-ip";
export default async function getPublicIp() {
	const studentIp = await publicIp.v4();
	return studentIp;
}