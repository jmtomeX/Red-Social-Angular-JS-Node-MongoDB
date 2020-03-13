"use strict";
var path = require("path");
var fs = require("fs");
var moment = require("moment");
var mongoosePaginate = require("mongoose-pagination");

// cargar modelos
var Publication = require("../models/Publication");
var User = require("../models/User");
var Follow = require("../models/Follow");

function prueba(req, res) {
  res.status(200).send({
    message: "Desde controlador Publication"
  });
}

function savePublication(req, res) {
  var params = req.body;
  if (!params.text) {
    res.status(200).send({
      message: "Debes enviar un texto."
    });
  }
  var publication = new Publication();
  publication.text = params.text;
  publication.file = "null";
  publication.use = req.user.sub;
  publication.created_at = moment().unix();

  publication.save((err, publicationStored) => {
    if (err) return res.status(500).send({ message: "Error al guardar la publicación."});

    if (!publicationStored) return res.status(404).send({ message: "La publicación no ha sido guardada." });
    return res.status(200).send({publication: publicationStored});
  });
}

module.exports = {
  prueba,
  savePublication
};
