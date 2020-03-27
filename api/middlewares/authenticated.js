"use strict";
const jwt = require("jwt-simple");
const moment = require("moment");
const secret = "clave_secreta_cualquira_6gsdfgl45C344_%ldsnalfkm";
// hasta que no se llegue al next no sale de la función
exports.ensureAuth = function(req, res, next) {
  // el token llega en una cabecera
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La petición no tiene la cabecera de autenticación." });
  }
  // reemplazamos cualquier comilla simple o doble que tenga el string por nada
  var token = req.headers.authorization.replace(/['"]+/g, "");
  // decoficar el token
  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment.unix()) {
      return res.status(401).send({
        message: "El token ha expirado"
      });
    }
  } catch (ex) {
    return res.status(404).send({
        message: "El token no es válido"
      });
  }
  // tenemos todos lo datos
  req.user = payload;
  next();
};
