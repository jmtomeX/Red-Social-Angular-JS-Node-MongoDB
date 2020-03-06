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
// function deleteFollow(res, req) {
//   var userId = req.user.sub; // registrado
//   var followId = req.params.id; // seguido
//   Follow.find({
//     user: userId,
//     followed: followId
//   }).remove((err, seguimientoEliminado) => {
//     if (err)
//       return res.status(500).send({
//         message: "Error al dejar de seguir."
//       });
//     return res.status(200).send({
//       follow: followStored,
//       message: "El follow se ha eliminado."
//     });
//   });
// }
function deleteFollow(req, res) {
    var params = req.body;
    var usuarioId = req.usuario.sub;
    var seguidorId = params.seguidor;
    console.log("usuarioId::" + usuarioId + "     seguidorId" + seguidorId);
    Seguidor.findOneAndDelete({
        'user': usuarioId,
        'followed': seguidorId
    }, (err, seguimientoEliminado) => {
        if (err) {
            return res.status(500).send({
                message: 'Error al eliminar el seguimiento'+err
            });
        }
        return res.status(200).send({
            message: 'Se ha elimindo el seguimiento'
        });
    });
 
}

module.exports = {
  prueba,
  saveFollow,
  deleteFollow
};
