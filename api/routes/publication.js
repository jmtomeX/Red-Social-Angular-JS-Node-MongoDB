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
api.get('/publications-user/:user/:page?', middleware_auth.ensureAuth, PublicationController.getPublicationsOfUser);
api.get('/publication/:id', middleware_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', middleware_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [middleware_auth.ensureAuth, md_upload], PublicationController.upLoadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = api;