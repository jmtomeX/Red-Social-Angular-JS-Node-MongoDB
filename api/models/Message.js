"use strict";

const mongoose = require("mongoose");
// definir nuevos schemas
var Schema = mongoose.Schema;

var MessageSchema = Schema({
  emmmited: {
    type: Schema.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.ObjectId,
    ref: "User"
  },
  text: String,
  created_at: String
});

module.exports = mongoose.model("Message", MessageSchema);
