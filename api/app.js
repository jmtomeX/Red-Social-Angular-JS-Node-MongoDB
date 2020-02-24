// configuaració del servidor
"use strict";
// configurar express
const express = require("express");

const bodyParser = require("body-parser");

var app = express();
//cargar rutas

//middelwares
app.use(bodyParser.urlencoded({ extended: false }));
// para que convierta a json cada petición a nuestro backend
app.use(bodyParser.json());
//Cors

//rutas
app.get('/', (req, res) => {
    res.status(200).send({
        message: "Hola mundo desde la ráiz de NodeJS"
    })
});

app.get('/pruebas', (req, res) => {
    res.status(200).send({
        message: "Acción en pruebas en el servidor"
    })
});
//exportar
module.exports = app;
