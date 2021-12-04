import express from 'express';
import http from 'http';

// Setup Objection + Knex

import objection from 'objection';
import Knex from 'knex';
import connection from './knexfile.js';
const app = express();
const server = http.createServer(app);
const { Model } = objection;
const knex = Knex(connection.development);
knex.on('query', function (queryData) {
	console.log(queryData);
});

Model.knex(knex);

// import School from './model/School.js';

async function getPublicIp(){

//     console.log(await publicIp.v4());
//     //=> '46.5.21.123'

//     console.log(await publicIp.v6());
//     //=> 'fe80::200:f8ff:fe21:67cf'

// }

app.get('/', async (req, res) => {
//   const myIp = ip.address('public', 'ipv4')
//   const school = await School.query().select().where({school_ip : '94.18.243.162'});
//  getPublicIp().then((data)=>{
//   //  console.log(data)
//     const school = School.query().select().where({school_ip : data});
//     const result = ip.isEqual(data, school[0].school_ip)
//     console.log(result)

	res.send('Hello');
});

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = '0.0.0.0';
server.listen(port, port2, (error) => {
	if (error) {
		console.log('error running the server');
	}
	console.log('App listening on port: ', server.address().port);
});
