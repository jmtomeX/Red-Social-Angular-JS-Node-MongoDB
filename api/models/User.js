"use strict";

const mongoose = require("mongoose");
// definir nuevos schemas
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  surname: String,
  nick: String,
  email: String,
  password: String,
  role: String,
  image: String,
  description:String
});

// UserSchema.virtual("password_confirmation") // video 20
//   .get(() => {
//     return this.password_confirm;
//   })
//   .set(password => {
//     this.password_confirm = password;
//   });

module.exports = mongoose.model("User", UserSchema);
