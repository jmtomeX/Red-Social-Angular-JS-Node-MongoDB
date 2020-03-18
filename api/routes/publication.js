'user strict'
const express = require("express");
var api = express.Router();
var PublicationController = require('../controllers/publication');
var middleware_auth = require('../middlewares/authenticated');
// trabajar con imagenes
var multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/publications'}); // middleware ruta de las imgs

api.get('/probando-pub', middleware_auth.ensureAuth, PublicationController.prueba);
api.post('/publication', middleware_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', middleware_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', middleware_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', middleware_auth.ensureAuth, PublicationController.deletePublication);

module.exports = api;