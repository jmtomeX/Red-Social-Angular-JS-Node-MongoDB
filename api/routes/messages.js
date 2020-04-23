'use strict'
const express = require('express');
const api = express.Router();
const MessageController = require('../controllers/message');
const middleware_auth = require('../middlewares/authenticated');

api.get('/probando-md', middleware_auth.ensureAuth, MessageController.probandoMensaje);
api.post('/message', middleware_auth.ensureAuth, MessageController.saveMessage);

api.get('/my-messages/:page?', middleware_auth.ensureAuth, MessageController.getRecivedMessages);
api.get('/my-send-messages/:page?', middleware_auth.ensureAuth, MessageController.getEmitterMessages);
api.get('/unviewed-messages', middleware_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', middleware_auth.ensureAuth, MessageController.setViewedMessages);

module.exports = api;