/* eslint-disable no-undef */
import checkIP from "../app/middleware/checkIp.js";
import getPublicIp from "../app/middleware/getPublicIp.js";

test("Test two identical IPs", async () => {
	const ip1 = await getPublicIp();
	const ip2 = await getPublicIp();

	expect(await checkIP(ip1, ip2)).toBe(true);
});

test("Test two different IPs", async () => {
	const ip1 = await getPublicIp();
	const ip2 = "0.0.0.0";

	expect(await checkIP(ip1, ip2)).toBe(false);
});