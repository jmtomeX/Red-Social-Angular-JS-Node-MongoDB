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

// function deleteFollow(req, res) {
//   var params = req.body;
//   var userId = req.user.sub; // registrado
//   //var usuarioId = '5e5abe93194fa6240413e55d';
//   var followId = req.params.id; // seguido
//   Follow.findOneAndRemove (
//     {
//       user: userId,
//       followed: followId
//     },
//     (err, followDelete) => {
//       if (err) {
//         return res.status(500).send({
//           message: "Error al eliminar el seguimiento. ERROR " + err
//         });
//       }
//       return res.status(200).send({
//         followedDeleted: followDelete,
//         message: "Se ha elimindo el seguimiento"
//       });
//     }
//   );
// }

function getFollowingUsers(req, res) {

}

module.exports = {
  prueba,
  saveFollow,
  deleteFollow
};
