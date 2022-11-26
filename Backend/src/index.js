require('dotenv').config({path: './.env'});
const colors = require('colors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(require('./routes/index.js'));

const puerto = process.env.PUERTO;
const puerto_container = process.env.PUERTO_CONTAINER;

//routes
app.listen(puerto);
console.log('** SERVER READY **'.blue);
console.log('Server Listening On Port:'.magenta + puerto.yellow);
console.log('Port Backend Container: '.green + puerto_container.yellow);