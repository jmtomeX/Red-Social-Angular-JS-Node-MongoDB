// controlador de rutas del usuario
'user strict'
const express = require("express");
var UserController = require('../controllers/user');
var middleware_auth = require('../middlewares/authenticated');
// trabajar con imagenes
var multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/users'}); // middleware ruta de las imgs

// para tener acceso a los metodos GET,POST.... No al delete
var api = express.Router();

api.get('/home', UserController.home);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
// peticiones con token
api.get('/pruebas', middleware_auth.ensureAuth, UserController.pruebas);
api.get('/user/:id', middleware_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', middleware_auth.ensureAuth, UserController.getUsers);
api.get('/search/:search', middleware_auth.ensureAuth, UserController.search);
api.get('/counters/:id?', middleware_auth.ensureAuth, UserController.getCounters);
api.put('/updateUser/:id', middleware_auth.ensureAuth, UserController.updateUser);
// cuando se pasan varios middelwares se pasa un array como 2º parámetro
api.post('/upload-image-user/:id', [middleware_auth.ensureAuth, md_upload], UserController.upLoadImage);

api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;