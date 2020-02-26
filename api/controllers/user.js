"use strict";
var User = require("../models/User");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

// rutas

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
          if(check){
            // eliminar la propiedad del password para no devolverla y evitar que la reciba el frontend
            user.password = undefined;
            // dependiendo de si se requiere token o no 
            if(params.getToken) {
              // devuelve token con los datos del usuario encryptados
              // generar token
              return res.status(200).send({
                token: jwt.createToken(user)
              });
            } else {
              // devolver datos de usuario
              return res.status(200).send({user});  
            }
          }else {
            return res.status(404).send({ message: "El usuario no se ha podido idientificar" });
          }
        });
      } else{  // si el usuario no existe
        return res.status(404).send({ message: "El usuario no se ha podido encontrar¡¡" });
      }
    }
  );
}
//exportarla en modo de objeto
module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser
};
