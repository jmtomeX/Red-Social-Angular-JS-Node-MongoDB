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
const messages_routes = require('./routes/messages');
//middelwares
app.use(bodyParser.urlencoded({ extended: false }));
// para que convierta a json cada petición a nuestro backend
app.use(bodyParser.json());

//Cors
//https://victorroblesweb.es/2017/11/09/configurar-cabeceras-acceso-cors-en-nodejs/
// configurar cabeceras http, sirve para poder hacer peticiones entre dominios de manera cruzada
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//rutas
// sobreiscribe la url 
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', messages_routes);

//exportar
module.exports = app;
