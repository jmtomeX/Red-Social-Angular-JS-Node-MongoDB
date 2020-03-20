"use strict";

const mongoose = require("mongoose");
// definir nuevos schemas
var Schema = mongoose.Schema;

var MessageSchema = Schema({
  emitter: {
    type: Schema.ObjectId,
    ref: "User"
  },
  receiver: {
    type: Schema.ObjectId,
    ref: "User"
  },
  text: String,
  created_at: String,
  viewed: {
    type: Boolean,
    default: false,
}
});

module.exports = mongoose.model("Message", MessageSchema);
