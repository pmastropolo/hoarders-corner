// IMPORT MONGOOSE
const mongoose = require("mongoose");

// DESTRUCTURE SCHEMA FROM MONGOOSE
const { Schema } = mongoose;

// DEFINE COMMUNITY SCHEMA
const communitySchema = new Schema({
  name: {                             // NAME FIELD
    type: String,                     // TYPE STRING
    required: true,                   // REQUIRED FIELD
    trim: true,                       // TRIM WHITESPACE
    unique: true,                     // UNIQUE VALUE
  },
  
  tagline: { type: String, default: "" },                // TAGLINE FIELD WITH DEFAULT
  description: { type: String, default: "" },            // DESCRIPTION FIELD WITH DEFAULT
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // ITEMS ARRAY REFERENCE
  users: [{ type: Schema.Types.ObjectId, ref: "User" }], // USERS ARRAY REFERENCE
});

// CREATE COMMUNITY MODEL
const Community = mongoose.model("Community", communitySchema);

// EXPORT COMMUNITY MODEL
module.exports = Community;
