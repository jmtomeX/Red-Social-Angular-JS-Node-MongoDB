"use strict";
const moment = require("moment");
var mongoosePaginate = require("mongoose-pagination");

// cargar modelos
var Message = require("../models/message");
var User = require("../models/user");
var Follow = require("../models/follow");

function probandoMensaje(req, res) {
  res.status(200).send({
    message: "Desde la prueba de mensajes"
  });
}

function saveMessage(req, res) {
  var params = req.body;

  if (!params.text || !params.receiver) {
    return res.status(200).send({
      message: "Envia los datos necesarios."
    });
  }
  var message = new Message();
  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.created_at = moment().unix();
  message.save((err, messageStored) => {
    if (err) {
      return res.status(500).send({
        message: "Error en la petiición."
      });
    }
    if (!messageStored) {
      return res.status(500).send({
        message: "Error al enviar el mensaje."
      });
    }
    return res.status(200).send({
      message: messageStored
    });
  });
}

// mensajes recibidos
function getRecivedMessages(req, res) {
  var userId = req.user.sub;
  var page = 1;
  // si nos llega page por la url
  if (req.params.page) {
    page = req.params.page;
  }
  const ITEMS_PER_PAGE = 4;
  Message.find({
    receiver: userId //recoger mensajes recibidos
  })
    // para seleccionar solo unos campos en el populate hay que añadir como segundo parámetro los campos que se quieren recibir
    .populate("emitter", "name surname nick image _id")
    .sort('-created_at') // ordenado por la fecha más reciente
    .paginate(page, ITEMS_PER_PAGE, (err, messages, total) => {
      if (err) {
        return res.status(500).send({
          message: "Error en la petiición."
        });
      }
      if (!messages) {
        return res.status(404).send({
          message: "No hay mensajes."
        });
      }
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / ITEMS_PER_PAGE),
        messages
      });
    });
}

// mensajes mandados
function getEmitterMessages(req, res) {
  var userId = req.user.sub;
  var page = 1;
  // si nos llega page por la url
  if (req.params.page) {
    page = req.params.page;
  }
  const ITEMS_PER_PAGE = 4;
  Message.find({
    emitter: userId //recoger mensajes recibidos
  })
    // para seleccionar solo unos campos en el populate hay que añadir como segundo parámetro los campos que se quieren recibir
    .populate("emitter receiver", "name surname nick image _id")
    .sort('-created_at') // ordenado por la fecha más reciente, descendente
    .paginate(page, ITEMS_PER_PAGE, (err, messages, total) => {
      if (err) {
        return res.status(500).send({
          message: "Error en la petiición."
        });
      }
      if (!messages) {
        return res.status(404).send({
          message: "No hay mensajes."
        });
      }
      return res.status(200).send({
        total: total,
        pages: Math.ceil(total / ITEMS_PER_PAGE),
        messages
      });
    });
}

// devuelve mensajes no leiodos
function getUnviewedMessages(req, res) {
  var userId = req.user.sub;
  Message.countDocuments({
    receiver: userId,
    viewed: false
  }).exec((err, count) => {
    if (err) {
      return res.status(500).send({
        message: "Error en la petición."
      });
    }
    return res.status(200).send({
      unviewed: count
    });
  });
}

// actualizar los mensajes  no leidos a leidos
function setViewedMessages(req, res) {
  var userId = req.user.sub;
  Message.updateMany(
    {
      receiver: userId,
      viewed: false
    },
    { viewed: true }, // actualizamos los leidos a true
    { multi: true }, // para que actualize todos los documentos
  (err, messagesUpdated) => {
    if (err) {
      return res.status(500).send({
        message: "Error en la petición."
      });
    }
    return res.status(200).send({
      messages: messagesUpdated
    });
  });
}

module.exports = {
  probandoMensaje,
  saveMessage,
  getRecivedMessages,
  getEmitterMessages,
  getUnviewedMessages,
  setViewedMessages
};
