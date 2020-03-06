// controlador de rutas de seguidores
'user strict'
const express = require("express");
var FollowController = require('../controllers/follow');
// router de express
var api = express.Router();
var middleware_auth = require('../middlewares/authenticated');

api.get('/prueba-follow', middleware_auth.ensureAuth, FollowController.prueba);
api.post('/follow', middleware_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', middleware_auth.ensureAuth, FollowController.deleteFollow);

module.exports = api;