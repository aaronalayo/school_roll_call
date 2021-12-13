import ip from "ip";
export default async function checkIp(studentIp, schoolIp ){
	return ip.isEqual(studentIp, schoolIp);
	
} 