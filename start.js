/*
 *
 * Server React-related task
 * 
 */


//Dependencies
const express = require('express');
const path = require('path');
const app = express();
const server = require('./lib/server')

const reactServer = {}

const dotenv = require('dotenv');
dotenv.config();
console.log(`Your port is ${process.env.PORT}`)

app.use(express.static(path.join(__dirname, './build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});



//Init script
  server.init()
  app.listen(5100, () => console.log(`React listening on port 5100!`))

//Export the module
module.exports = reactServer;