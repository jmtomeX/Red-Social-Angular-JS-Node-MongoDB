// controlador de rutas del usuario
'user strict'
const express = require("express");
var UserController = require('../controllers/user');
var middleware_auth = require('../middlewares/authenticated');
// para tener acceso a los metodos GET,POST....
var api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', middleware_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

module.exports = api;