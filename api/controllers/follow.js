"use strict";
//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require("mongoose-pagination");

// cargar modelos
var User = require("../models/User");
var Follow = require("../models/Follow");

function prueba(req, res) {
  res.status(200).send({
    message: "Desde controlador Follows"
  });
}

module.exports = {
  prueba
};

function saveFollow(req, res) {
  var params = req.body;
  var follow = new Follow();
  console.log(req.user.sub);
  // usuario que sigue, el identificado
  follow.user = req.user.sub;
  // el usuario seguido se le pasa por post
  follow.followed = params.followed;
  // guardamos el objeto que ha guardado followStored
  follow.save((err, followStored) => {
    if (err)
      return res.status(500).send({
        message: "Error al guardar el seguimiento"
      });

    if (!followStored)
      return res.status(404).send({
        message: "El seguimiento no se ha guardado."
      });
    return res.status(200).send({
      follow: followStored,
      message: "El seguimiento se ha guardado correctamente."
    });
  });
}

function deleteFollow(req, res) {
  var userId = req.user.sub; // registrado
  var followId = req.params.id; // seguido
  console.log("Seguidor " + userId + " Seguido " + followId);
  Follow.findOne({
    user: userId,
    followed: followId
  }).deleteOne((err, followDelete) => {
    if (err)
      return res.status(500).send({
        message: "Error al dejar de seguir." + err
      });
    return res.status(200).send({
      follow: followDelete,
      message: "El follow se ha eliminado."
    });
  });
}

function getFollowingUsers(req, res) {
  var userId = req.user.sub;
 
  // en el caso de que llegue uen la  url el usuario y la página se listan los usuarios
  if (req.params.id && req.params.page) {
     userId = req.params.id;
  }
  var page = 1;
  if (req.params.page) { // en el caso de que llegue solo la página
    page = req.params.page;
  } else { // si no hay páginas, para evitar errores se le pasa el id
    page = req.params.id;
  }
  var itemsPerPage = 4;
  Follow.find({
    user: userId
  })
    .populate({
      // sustituir el campo followed por el objeto entero
      path: "followed"
    })
    .paginate(page, itemsPerPage, (err, follows, totalDoc) => {
      if (err)
        return res.status(500).send({
          message: "Error en el servidor." + err
        });
      if (!follows)
        return res.status(404).send({
          message: "No estás siguiendo a ningun usuario." + err
        });
        return res.status(200).send({
          total: totalDoc,
          pages: Math.ceil(totalDoc/itemsPerPage),
           follows           
        });

    });

  // en el caso de que no llegue se usa el user._id del usuario identificado
}

module.exports = {
  prueba,
  saveFollow,
  deleteFollow,
  getFollowingUsers
};
