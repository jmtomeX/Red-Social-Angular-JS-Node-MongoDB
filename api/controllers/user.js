"use strict";
var User = require("../models/user");
var Follow = require("../models/follow");
var Publication = require("../models/publication");

const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const pagination = require("mongoose-pagination");
var path = require("path");
var fs = require("fs");

// rutas
// métodos de pruebas
function home(req, res) {
  res.status(200).send({
    message: "Hola mundo desde la ráiz de NodeJS",
  });
}

function pruebas(req, res) {
  res.status(200).send({
    message: "Acción en pruebas en el servidor",
  });
}
// registro
function saveUser(req, res) {
  // todos los campos que llegan por post los recogemos en params
  var params = req.body;
  var user = new User();
  if (
    params.name &&
    params.surname &&
    params.nick &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;

    // asignar el virtual password_confirmation
    //user.password_confirmation = params.password_confirmation;
    user.role = "ROLE_USER";
    user.image = null;
    user.description = null;

    // comprobar si existe el email o el nick
    User.find({
      $or: [
        { email: user.email.toLowerCase() },
        { nick: user.nick.toLowerCase() },
      ],
    }).exec((err, users) => {
      if (err)
        return res.status(500).send({
          ok: false,
          message: "Error en la petición de usuario.",
        });
      if (users && users.length >= 1) {
        return res.status(200).send({
          ok: false,
          message: "El usuario que intentas registrar ya existe.",
        });
      } else {
        // cifrar password y guardar
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              return res.status(500).send({
                ok: false,
                message: "Error al guardar el usuario.",
                err,
              });
            }
            // ok
            if (userStored) {
              res.status(200).send({
                user: userStored,
              });
            } else {
              res.status(404).send({
                ok: false,
                message: "No se ha registrado el usuario.",
              });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: "Envia todos los campos necesarios¡¡",
    });
  }
}
// login
function loginUser(req, res) {
  //recoger los parámetros que llegan en el body
  var params = req.body;
  var email = params.email;
  var password = params.password;
  //  sería como en sql un ...where email = 'email'
  User.findOne(
    {
      email: email,
    },
    (err, user) => {
      // si ha habido error
      if (err) return res.status(500).send({ message: "Error en la petición" });
      if (user) {
        // comprobar la passw con la bcrypt
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            // dependiendo de si se requiere token o no
            if (params.gettoken) {
              // devuelve token con los datos del usuario encryptados
              // generar token
              return res.status(200).send({
                token: jwt.createToken(user),
              });
            } else {
              // devolver datos de usuario
              // eliminar la propiedad del password para no devolverla y evitar que la reciba el frontend
              user.password = undefined;
              return res.status(200).send({ user });
            }
          } else {
            return res
              .status(404)
              .send({ message: "El usuario no se ha podido idientificar" });
          }
        });
      } else {
        // si el usuario no existe
        return res
          .status(404)
          .send({ message: "El usuario no se ha podido encontrar¡¡" });
      }
    }
  );
}

// devolver datos de un usuario
function getUser(req, res) {
  // cuando recogemos datos por la url se recoge de params y cuando llegan por post o put se usa body.
  var userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({ message: "Error en la petición" });

    if (!user)
      return res.status(404).send({ message: "El usuario no existe." });
    // Comprobar seguimiento de usuarios si seguimos o nos siguen.
    // comprobamos que el usuario actual sigue al usuario que llega por la url
    // al ser una promesa lo que devuelve usamos then
    followThisUser(req.user.sub, userId).then((value) => {
      user.password = undefined;
      return res.status(200).send({
        user,
        following: value.following,
        followed: value.followed,
      }); // si follow devuleve null no le sigo
    });
  });
}

// función asincrona para ver quién nos sigue o quién seguimos
async function followThisUser(identity_user_id, user_id) {
  try {
    // si le sigo a un  usuario me sigue.
    // await hace que se convierta en una llamada sincrona, espera a que le llegue un resultado.
    // si me sigue un  usuario.
    var following = await Follow.findOne({
      user: identity_user_id,
      followed: user_id,
    })
      .exec()
      .then((following) => {
        return following;
      })
      .catch((err) => {
        return handleerror(err);
      });
    var followed = await Follow.findOne({
      user: user_id,
      followed: identity_user_id,
    })
      .exec()
      .then((followed) => {
        return followed;
      })
      .catch((err) => {
        return handleerror(err);
      });
    //devolvemos una promesa al ser async, con un objeto
    return {
      following: following,
      followed: followed,
    };
  } catch (e) {
    console.log(e);
  }
}

// Devovlver un listado de usuarios paginado
function getUsers(req, res) {
  // id del usuario logueado
  var identity_user_id = req.user.sub;
  let page = 1;
  if (req.params.page) {
    // página que estamos recogiendo
    page = req.params.page;
  }
  // número de usuario por página
  const ITEMS_PER_PAGE = 4;

  // lista todos los usuarios con  paginación.
  User.find()
    .sort("_id") // ordenados por _id
    .paginate(page, ITEMS_PER_PAGE, (err, users, total) => {
      // pagina actual, users por página, (error, todos los usuarios, total de usuarios)
      if (err) return res.status(500).send({ message: "Error en la petición" });
      if (!users)
        return res
          .status(404)
          .send({ message: "No hay usuarios disponibles." });
      followUsersIds(identity_user_id).then((value) => {
        return res.status(200).send({
          // esto sería redundante
          users: users,
          users_following: value.following,
          users_followed: value.followed,
          total,
          pages: Math.ceil(total / ITEMS_PER_PAGE), // número de páginas que va a haber
        });
      });
    });
}

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
    following: following,
    followed: followed,
  };
}

// contador de usuarios
const getCounters = (req, res) => {
  let userId = req.user.sub;
  if (req.params.id) {
    userId = req.params.id;
  }
  getCountFollow(userId).then((value) => {
    return res.status(200).send(value);
  });
};

const getCountFollow = async (user_id) => {
  try {
    let following = await Follow.countDocuments(
      { user: user_id },
      (err, count) => {
        return count;
      }
    );
    let followed = await Follow.countDocuments({ followed: user_id }).then(
      (count) => count
    );

    // devolver las publicaciones
    let publications = await Publication.countDocuments({
      user: user_id,
    }).then((count) => count);

    return { following, followed, publications };
  } catch (e) {
    console.log(e);
  }
};

//Edición de datos de usuario
function updateUser(req, res) {
  var userId = req.params.id;
  // recoger el body de la request, para actualizar
  var update = req.body;

  // borrar la propiedad password
  delete update.password;

  // compobar que son sus propios datos comprobando los ids
  if (userId != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes permiso para actualizar esta cuenta." });
  }
  // comprobar que no exista el nick o mail
  User.find({
    $or: [
      { email: update.email.toLowerCase() },
      { nick: update.nick.toLowerCase() },
    ],
  }).exec((error, users) => {
    // En el caso de que exista una coincidencia
    var user_isset = false;
    users.forEach((user) => {
      if (user && user._id != userId) user_isset = true;
    });
    // si existe
    if (user_isset) {
      return res
        .status(404)
        .send({ message: "El email o el nick ya está en uso." });
    }

    // Para que devuelva el objeto acualizado se le pasa como 3º parámetro {new:true}
    User.findByIdAndUpdate(
      userId,
      update,
      { new: true },
      (err, userUpdated) => {
        if (err)
          return res.status(500).send({ message: "Error en la petición" });
        if (!userUpdated) {
          return res
            .status(404)
            .send({ message: "No se ha podido actualizar el usuario" });
        }

        return res.status(200).send({
          // si todo fue bien
          // devolvemos el usuario actualizado
          user: userUpdated,
        });
      }
    );
  });
}

function upLoadImage(req, res) {
  var userId = req.params.id;

  if (req.files) {
    var file_path = req.files.image.path;
    // nombre imagen
    var filename = path.basename(file_path);
    var ext_split = filename.split(".");
    var file_ext = ext_split[1];
    // compobar que son sus propios datos comprobando los ids
    if (userId != req.user.sub) {
      return res
        .status(500)
        .send({ message: "No tienes permiso para actualizar esta cuenta." });
    }

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      // comprobar si existe la imagen
      fs.exists(file_path, function (exists) {
        if (exists) {
          // actualizar documento de usuario
          User.findByIdAndUpdate(
            userId,
            { image: filename },
            { new: true },
            (err, userUpdated) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "Error en la petición" });
              if (!userUpdated) {
                return res
                  .status(404)
                  .send({ message: "No se ha podido actualizar el usuario" });
              }
              return res.status(200).send({
                // si todo fue bien
                // devolvemos el usuario actualizado
                user: userUpdated,
              });
            }
          );
        } else {
          return res.status(500).send({ message: "La imagen no existe." });
        }
      });
    } else {
      // borrar archivo si ha habido error
      return removeFilesOfUploads(res, file_path, "La extensión no es válida.");
    }
  } else {
    return res.status(200).send({
      message: "No se han subido imagenes",
    });
  }
}

// devolver imagen usuario
function getImageFile(req, res) {
  // parámetro que recibe por la url
  var image_file = req.params.imageFile;
  var path_file = "./uploads/users/" + image_file;

  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      return res.status(200).send({
        message: "No existe la imagen...",
      });
    }
  });
}

function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, (err) => {
    return res.status(200).send({ message: message });
  });
}

// buscar usuarios
function search(req, res) {
  // Sacar string a buscar de la url
  var searchString = req.params.search;

  // Find or
  User.find({
    $or: [
      { nick: { $regex: searchString, $options: "i" } },
      { name: { $regex: searchString, $options: "i" } },
      { surname: { $regex: searchString, $options: "i" } },
    ]
  }).exec((err, users) => {
    if(err){
      return res.status(500).send({
        status:'error',
        message:'Error en la petición'
      });
    }
    if(!users || users.length < 1){
      return res.status(404).send({
        status:'error',
        message:'No hay usuarios con ese nombre'
      });
    }
    return res.status(200).send({
      status:'succes',
      users
    });
  })
}

//exportarla en modo de objeto
module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  getCounters,
  updateUser,
  upLoadImage,
  getImageFile,
  search,
};
