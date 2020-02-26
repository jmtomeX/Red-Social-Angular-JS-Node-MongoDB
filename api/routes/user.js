// controlador de rutas del usuario
'user strict'
const express = require("express");
var UserController = require('../controllers/user');
// para tener acceso a los metodos GET,POST....
var api = express.Router();
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;