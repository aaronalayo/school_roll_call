/* eslint-disable no-undef */

import getPublicIp from "../app/middleware/getPublicIp";
import publicIp from "public-ip";

test("Test getPublicIP", async () => {
	const ip1 = await publicIp.v4();
	const ip2 = await getPublicIp();

	expect(ip1 === ip2).toBe(true);
    
});