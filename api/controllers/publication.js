"use strict";
var path = require("path");
var fs = require("fs");
var moment = require("moment");
var mongoosePaginate = require("mongoose-pagination");

// cargar modelos
var Publication = require("../models/publication");
var User = require("../models/user");
var Follow = require("../models/follow");

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
  publication.user = req.user.sub;
  publication.created_at = moment().unix();

  publication.save((err, publicationStored) => {
    if (err)
      return res
        .status(500)
        .send({ message: "Error al guardar la publicación." });

    if (!publicationStored)
      return res
        .status(404)
        .send({ message: "La publicación no ha sido guardada." });
    return res.status(200).send({ publication: publicationStored });
  });
}

function getPublictions(req, res) {
  // oaginación
  var page = 1;
  if (req.params.page) {
    // si existe un valor por la url, se lo damos a page
    page = req.params.page;
  }
  var itemsPerPage = 4;
  // recoger el ususario identificado
  const user_id = req.user.sub;

  // hacer una busqueda de todos los usuarios que sigo
  Follow.find({
    user: user_id
  })
    .populate("followed") // sustituimos el id del usuario por el objeto completo. que se carguen los datos del objetoque está relacionado
    .exec((err, follows) => {
      if (err)
        return res.status(500).send({
          message: "Error al devolver el seguimiento."
        });
      var follows_clean = [];
      follows.forEach(follow => {
        follows_clean.push(follow.followed);
      });
      // buscar las publicaciones de los usuarios que sigo
      Publication.find({
        user: { $in: follows_clean } // busca las coincidencias dentro de un  array del usuario
      })
        .sort("-created_at") // ordenar en orden inverso
        .populate("user")
        .paginate(page, itemsPerPage, (err, publications, total) => {
          if (err)
            return res.status(500).send({
              message: "Error al devolver las publicaciones."
            });
          if (!publications)
            return res.status(404).send({
              message: "No hay publicaciones."
            });
          return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page,
            publications
          });
        });
    });

  // buscar todas las publicaciones de los usuarios que sigo

  // devolverlas a la vista
}
// function getPublictions(req, res) {
//   // oaginación
//   var page = 1;
//   if (req.params.page) {
//     // si existe un valor por la url, se lo damos a page
//     page = req.params.page;
//   }
//   var itemsPerPage = 4;
//   // recoger el ususario identificado
//   const user_id = req.user.sub;

//   // hacer una busqueda de todos los usuarios que sigo
//   Follow.find({
//     user: user_id
//   })
//     .populate("followed") // sustituimos el id del usuario por el objeto completo. que se carguen los datos del objetoque está relacionado
//     .exec((err, follows) => {
//       if (err) {
//         return res.status(500).send({
//           message: "Error al devolver el seguimiento."
//         });
//       }
//       var follows_clean = [];
//       follows.forEach(follow => {
//         follows_clean.push(follow.followed);
//       });
//       //console.log(follows_clean);
//       // buscar las publicaciones de los usuarios que sigo
//       getPublicationFollowed(user_id, follows_clean, page,itemsPerPage).then((value) => {
//         console.log(value);
//         return res.status(200).send({value});
//     })

//     });
// }

// const getPublicationFollowed = async (user_id, follows_clean,page,itemsPerPage) => {
//   try {
//     Publication.find({
//       user: { $in: follows_clean } // busca las coincidencias dentro de un  array del usuario
//     })
//       .sort("-created_at") // ordenar en orden inverso
//       .populate("user")
//       .paginate(page, itemsPerPage, (err, publications, total) => {
//         if (err)
//           return res.status(500).send({
//             message: "Error al devolver las publicaciones."
//           });
//         if (!publications)
//           return res.status(404).send({
//             message: "No hay publicaciones."
//           });
//         return {
//           total_items: total,
//           pages: Math.ceil(total / itemsPerPage),
//           page,
//           publications
//         }
//       });

//   } catch (e) {
//     console.log(e);
//   }
// };

function getPublications(req, res) {
  // oaginación
  var page = 1;
  if (req.params.page) {
    // si existe un valor por la url, se lo damos a page
    page = req.params.page;
  }
  var itemsPerPage = 4;
  // recoger el ususario identificado
  const user_id = req.user.sub;
  console.log("Usuario activo: " + user_id);

  // hacer una busqueda de todos los usuarios que sigo
  Follow.find({
    user: user_id
  })
    .populate( "followed" ) // sustituimos el id del usuario por el objeto completo. que se carguen los datos del objeto que está relacionado
    .exec((err, follows) => {
      if (err)
        return res.status(500).send({
          message: "Error al devolver el seguimiento."
        });
      var follows_clean = [];
      follows.forEach(follow => {
        follows_clean.push(follow.followed);
      });
      console.log("Seguidos: \n" + follows_clean);
      // buscar las publicaciones de los usuarios que sigo
      Publication.find({
        user: { $in: follows_clean } // busca las coincidencias dentro de un  array del usuario
      })
        .sort("-created_at") // ordenar en orden inverso
        .populate("user")
        .paginate(page, itemsPerPage, (err, publications, total) => {
          if (err)
            return res.status(500).send({
              message: "Error al devolver las publicaciones."
            });
          if (!publications)
            return res.status(404).send({
              message: "No hay publicaciones."
            });
          return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / itemsPerPage),
            page,
            publications
          });
        });
    });
}

function getPublication(req, res) {
  var publicationId = req.params.id;
  Publication.findById(publicationId, (err, publication) => {
    if (err)
      return res.status(500).send({
        message: "Error al devolver las publicaciones."
      });
    if (!publication)
      return res.status(404).send({
        message: "No existe la publicación."
      });
    return res.status(200).send({
      publication
    });
  });
}

function deletePublication(req, res) {
  var publicationId = req.params.id;

  Publication.find({
    user: req.user.sub,
    _id: publicationId
  })
  .deleteOne((err, publicationRemoved) => {
    if (err)
      return res.status(500).send({
        message: "Error al borrar la publicación."
      });
    if (!publicationRemoved)
      return res.status(404).send({
        message: "No se ha borrado la publicación."
      });
    return res.status(200).send({
      publication: publicationRemoved
    });
  });
}

module.exports = {
  prueba,
  savePublication,
  getPublications,
  getPublication,
  deletePublication
};
