"use strict";
// crear el token
const jwt = require("jwt-simple");
var moment = require("moment");
const secret = "clave_secreta_cualquira_6gsdfgl45C344_%ldsnalfkm";

exports.createToken = function(user) {
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(), // fecha en la que se crea formato unix
    exp: moment(moment.unix()).add(30, "days").unix()//expiración de la fecha en 30 días

    //.startOf('month');
  };
  // generar el token, codifica y genera un hash
  return jwt.encode(payload, secret);
};
