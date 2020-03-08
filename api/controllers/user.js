"use strict";
var User = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const pagination = require("mongoose-pagination");
var path = require("path");
var fs = require("fs");

// rutas
// métodos de pruebas
function home(req, res) {
  res.status(200).send({
    message: "Hola mundo desde la ráiz de NodeJS"
  });
}

function pruebas(req, res) {
  res.status(200).send({
    message: "Acción en pruebas en el servidor"
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
    user.role = "ROLE_USER";
    user.image = null;
    user.password = params.password;
    // comprobar si existe el email o el nick
    User.find({
      $or: [
        { email: user.email.toLowerCase() },
        { nick: user.nick.toLowerCase() }
      ]
    }).exec((err, users) => {
      if (err)
        return res.status(500).send({
          ok: false,
          message: "Error en la petición de usuario."
        });
      if (users && users.length >= 1) {
        return res.status(200).send({
          ok: false,
          message: "El usuario que intentas registrar ya existe."
        });
      } else {
        // cifrar password y guardar
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              return res.status(500).send({
                ok: false,
                message: "Error al guardar el usuario."
              });
            }
            if (userStored) {
              res.status(200).send({
                user: userStored
              });
            } else {
              res.status(404).send({
                ok: false,
                message: "No se ha registrado el usuario."
              });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: "Envia todos los campos necesarios¡¡"
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
      email: email
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
                token: jwt.createToken(user)
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

    return res.status(200).send({ user });
  });
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
  const ITEMS_PER_PAGE = 5;

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
      return res.status(200).send({
        // esto sería redundante
        users: users,
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE) // número de páginas que va a haber
      });
    });
}

//Edición de datos de usuario
function updateUser(req, res) {
  var userId = req.params.id;
  // recoger el body de la request, para actualizar
  var update = req.body;
  console.log({ update });
  console.log("userid " + userId + " id: " + req.user.sub);
  // borrar la propiedad password
  delete update.password;

  // compobar que son sus propios datos comprobando los ids
  if (userId != req.user.sub) {
    return res
      .status(500)
      .send({ message: "No tienes permiso para actualizar esta cuenta." });
  }
  // Para que devuelva el objeto acualizado se le pasa como 3º parámetro {new:true}
  User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
    if (err) return res.status(500).send({ message: "Error en la petición" });
    if (!userUpdated) {
      return res
        .status(404)
        .send({ message: "No se ha podido actualizar el usuario" });
    }

    return res.status(200).send({
      // si todo fue bien
      // devolvemos el usuario actualizado
      user: userUpdated
    });
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
      fs.exists(file_path,function(exists){  
        if(exists){
               // actualizar documento de usuario
      User.findByIdAndUpdate(
        userId,
        { image: filename },
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
            user: userUpdated
          });
        }
      );
        }else{
          return res
          .status(500)
          .send({ message: "La imagen no existe." });
        }
      }); 

 
    } else {
      // borrar archivo si ha habido error
      return removeFilesOfUploads(res, file_path, "La extensión no es válida.");
    }
  } else {
    return res.status(200).send({
      message: "No se han subido imagenes"
    });
  }
}

// devolver imagen usuario
function getImageFile(req, res) {
  // parámetro que recibe por la url
  var image_file = req.params.imageFile;
  var path_file = './uploads/users/' + image_file;

  console.log(path_file);
  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      return res.status(200).send({
        message: "No existe la imagen..."
      });
    }
  });
}

function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(200).send({ message: message });
  });
}


//exportarla en modo de objeto
module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  upLoadImage,
  getImageFile
};
