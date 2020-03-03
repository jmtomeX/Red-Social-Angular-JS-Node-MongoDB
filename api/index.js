// conexion a mongod y creación del server.
"use strict";
const mongoose = require("mongoose");
const app = require("./app");
const port = 3000;
// utizamos las promesas para conectarnos mediante promesas
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
// para conectar a mongoose
mongoose
  .connect("mongodb://localhost:27017/curso_mean_social", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(
      "La conexión a la base de datos se ha realizado correctamente."
    );

    // crear servidor
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto http://localhost:3000");
    });
  })
  .catch(err => console.log(err));

// Hasta aquí ya se puede trabajar con lo base de datos

//arrancar --> cd api/ --> npm start
