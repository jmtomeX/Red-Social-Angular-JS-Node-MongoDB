"use strict";

var mongoosePaginate = require("mongoose-pagination");

// cargar modelos
var User = require("../models/user");
var Follow = require("../models/follow");

function prueba(req, res) {
  res.status(200).send({
    message: "Desde controlador Follows",
  });
}

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
        message: "Error al guardar el seguimiento",
      });

    if (!followStored)
      return res.status(404).send({
        message: "El seguimiento no se ha guardado.",
      });
    return res.status(200).send({
      follow: followStored,
      message: "El seguimiento se ha guardado correctamente.",
    });
  });
}

function deleteFollow(req, res) {
  var userId = req.user.sub; // registrado
  var followId = req.params.id; // seguido
  Follow.findOne({
    user: userId,
    followed: followId,
  }).deleteOne((err, followDelete) => {
    if (err)
      return res.status(500).send({
        message: "Error al dejar de seguir." + err,
      });
    return res.status(200).send({
      follow: followDelete,
      message: "El follow se ha eliminado.",
    });
  });
}

// usuarios que seguimos
function getFollowingUsers(req, res) {
  var userId = req.user.sub;

  // en el caso de que llegue uen la  url el usuario y la página se listan los usuarios
  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }
  var page = 1;
  if (req.params.page) {
    // en el caso de que llegue solo la página
    page = req.params.page;
  } else {
    // si no hay páginas, para evitar errores se le pasa el id
    page = req.params.id;
  }
  const ITEMS_PER_PAGE = 4;
  Follow.find({
    user: userId,
  })
    .populate({
      // sustituir el campo followed por el objeto entero
      path: "followed",
    })
    .paginate(page, ITEMS_PER_PAGE, (err, follows, totalDoc) => {
      if (err)
        return res.status(500).send({
          message: "Error en el servidor." + err,
        });
      if (!follows)
        return res.status(404).send({
          message: "No estás siguiendo a ningún usuario.",
        });
        // seguimineto del usuario logueado
      followUsersIds(req.user.sub).then((value) => {
        return res.status(200).send({
          total: totalDoc,
          pages: Math.ceil(totalDoc / ITEMS_PER_PAGE),
          follows,
          users_following: value.following,
          users_followed: value.followed,
        });
      });
    });
}

function getFollowedUsers(req, res) {
  var userId = req.user.sub;

  // en el caso de que llegue en la  url el usuario y la página se listan los usuarios
  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }
  var page = 1;
  if (req.params.page) {
    // en el caso de que llegue solo la página, la cargamos
    page = req.params.page;
  } else {
    // si no hay páginas, para evitar errores se le pasa el id
    page = req.params.id;
  }
  const ITEMS_PER_PAGE = 4;
  Follow.find({
    // Comprobamos quien nos sigue
    followed: userId,
  })
    .populate(
      "user" // devuelve el objeto user en formato json
    )
    .paginate(page, ITEMS_PER_PAGE, (err, follows, totalDoc) => {
      if (err)
        return res.status(500).send({
          message: "Error en el servidor." + err,
        });
      if (!follows)
        return res.status(404).send({
          message: "No te sigue ningún usuario.",
        });
          // seguimineto del usuario logueado
          // usuarios que seguimos y dejamos de seguir para poder interactuar con los botones de seguimineto
          followUsersIds(req.user.sub).then((value) => {
            return res.status(200).send({
              total: totalDoc,
              pages: Math.ceil(totalDoc / ITEMS_PER_PAGE),
              follows,
              users_following: value.following,
              users_followed: value.followed,
            });
          });
    });
}
// devolver listados de usuarios que me siguen  o usuarios que sigo, sin paginar
function getTheFollows(req, res) {
  var userId = req.user.sub;

  var find = Follow.find({ user: userId }); // saca los usuarios que sigo
  // si vienen paámetros en la url
  if (req.params.followed) {
    find = Follow.find({ followed: userId }); // saca los usuarios que me siguen
  }
  find.populate("user followed").exec((err, follows) => {
    // con exec ejecutamos la consulta
    if (!follows)
      return res.status(404).send({
        message: "No sigues a ningún usuario.",
      });
    return res.status(200).send({ follows });
  });
}

// se puede hacer un servicio porque se está usando en user.js también
// función sincrona para devolver los ids de usuarios en un array: seguidores, seguidos y todos los usuarios como objetos
async function followUsersIds(user_id) {
  var following = await Follow.find({ user: user_id })
    //quitar campos no requeridos
    .select({ _id: 0, __uv: 0, user: 0 })
    .exec()
    .then((follows) => {
      var follows_clean = [];

      follows.forEach((follow) => {
        follows_clean.push(follow.followed);
      });

      return follows_clean;
    })
    .catch((err) => {
      return handleerror(err);
    });
  // a quien seguimos
  var followed = await Follow.find({ followed: user_id })
    .select({ _id: 0, __uv: 0, followed: 0 })
    .exec()
    .then((follows) => {
      var follows_clean = [];
      follows.forEach((follow) => {
        follows_clean.push(follow.user);
      });

      return follows_clean;
    })
    .catch((err) => {
      return handleerror(err);
    });
  return {
    // array de seguidos
    following: following,
    // array de seguidores
    followed: followed,
  };
}

module.exports = {
  prueba,
  saveFollow,
  deleteFollow,
  getFollowingUsers,
  getFollowedUsers,
  getTheFollows,
};
