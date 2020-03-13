// configuaració del servidor
"use strict";
// configurar express
const express = require("express");

const bodyParser = require("body-parser");

var app = express();
//cargar rutas
// cargar la configuración de rutas del user
const user_routes = require('./routes/user');
const follow_routes = require('./routes/follow');
const publication_routes = require('./routes/publication');
//middelwares
app.use(bodyParser.urlencoded({ extended: false }));
// para que convierta a json cada petición a nuestro backend
app.use(bodyParser.json());
//Cors

//rutas
// sobreiscribe la url 
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);

//exportar
module.exports = app;
