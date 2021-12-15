"--unhandled-rejections=strict";

import dotenv from "dotenv";
import objection from "objection";
const { knexSnakeCaseMappers } = objection;
dotenv.config();
// Database connection
export default {
	development: {
		client: "pg",

		connection: {
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false
			}
		},

		pool: {
			afterCreate: function (conn, done) {
			// in this example we use pg driver's connection API
				conn.query("SET timezone= 'UTC+2';", function (err) {
					if (err) {
					// first query failed, return error and don't try to make next query
						done(err, conn);
					} else {
					// do the second query...
					
						// if err is not falsy, connection is discarded from pool
						// if connection aquire was triggered by a query the error is passed to query promise
						done(err, conn);
					
					}
				});
			}
		},
		"": knexSnakeCaseMappers()
	},
};
