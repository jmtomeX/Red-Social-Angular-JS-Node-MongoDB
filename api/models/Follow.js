"use strict";

const mongoose = require("mongoose");
// definir nuevos schemas
var Schema = mongoose.Schema;

var FollowSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  followed: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("Follow", FollowSchema);
