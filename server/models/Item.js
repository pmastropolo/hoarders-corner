// IMPORT MONGOOSE
const mongoose = require("mongoose");

// DESTRUCTURE SCHEMA FROM MONGOOSE
const { Schema } = mongoose;

// DEFINE ITEM SCHEMA
const itemSchema = new Schema({
  name: {                         // NAME FIELD
    type: String,                 // TYPE STRING
    required: true,               // REQUIRED FIELD
    trim: true,                   // TRIM WHITESPACE
  },
  description: {                  // DESCRIPTION FIELD
    type: String,                 // TYPE STRING
  },
  owner: {                        // OWNER FIELD
    type: String,                 // TYPE STRING
    required: true,               // REQUIRED FIELD
    // REFERENCE USER OPTION COMMENTED
  },
  isPublic: {                     // PUBLIC STATUS FIELD
    type: Boolean,                // TYPE BOOLEAN
  },
  community: {                    // COMMUNITY FIELD
    type: String,                 // TYPE STRING
    required: true                // REQUIRED FIELD
  },
  imageUrl: {                     // IMAGE URL FIELD
    type: String,                 // TYPE STRING
    trim: true                    // TRIM WHITESPACE
  },
  ownerId: {                      // OWNER ID FIELD
    type: Schema.Types.ObjectId,  // TYPE OBJECT ID
    ref: "User"                   // REFERENCE USER MODEL
  },
});

// CREATE ITEM MODEL
const Item = mongoose.model("Item", itemSchema);

// EXPORT ITEM MODEL
module.exports = Item;
