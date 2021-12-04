import express from 'express';
import http from  'http';
import ip from 'ip';
import publicIp from 'public-ip'
const app = express();
const server = http.createServer(app);

// Setup Objection + Knex

import objection from "objection";
const { Model } = objection;
import Knex from "knex";
import connection from "./knexfile.js"
const knex = Knex(connection.development);
knex.on("query", function (queryData) {
  console.log( queryData );
});
knex.on('query', console.log);

Model.knex(knex);

import School from "./model/School.js";

async function getPublicIp(){

   const myIp =  await publicIp.v4();
    //=> '46.5.21.123'
  
    // await publicIp.v6();
    //=> 'fe80::200:f8ff:fe21:67cf'
  return myIp;
}

app.get('/', async (req, res) => {
 const myIp = await getPublicIp();
 console.log(myIp)
const school = await School.query().select().where({school_ip : myIp});

// const result = ip.isEqual(myIp, school[0].school_ip)
// console.log(result)
if(school.length === 0 || typeof school === "undefined"){
  res.send("You are not at school")
}else{
  res.send("Hello")
}

});

const port = process.env.PORT ? process.env.PORT : 8080;
const port2 = "0.0.0.0";
server.listen(port, port2, (error) => {
  if (error) {
    console.log("error running the server");
  }
  console.log("App listening on port: ", server.address().port);
});
