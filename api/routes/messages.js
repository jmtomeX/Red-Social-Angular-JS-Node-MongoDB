'use strict'
const express = require('express');
const api = express.Router();
const MessageController = require('../controllers/message');
const middleware_auth = require('../middlewares/authenticated');

api.get('/probando-md', middleware_auth.ensureAuth, MessageController.probandoMensaje);
api.post('/message', middleware_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', middleware_auth.ensureAuth, MessageController.getRecivedMessages);
api.get('/my-send-messages', middleware_auth.ensureAuth, MessageController.getEmitterMessages);

module.exports = api;