// IMPORT MONGOOSE
const mongoose = require("mongoose");

// IMPORT DATE FORMAT UTILITY
const dateFormat = require("../utils/dateFormat");

// DESTRUCTURE SCHEMA FROM MONGOOSE
const { Schema } = mongoose;

// DEFINE MESSAGE SCHEMA
const messageSchema = new Schema(
  {
    recipient: {            // RECIPIENT FIELD
      type: String,
    },
    sender: {               // SENDER FIELD
      type: String,
    },
    content: {              // CONTENT FIELD
      type: String,
    },
    isRead: {               // READ STATUS FIELD
      type: Boolean,
      default: false,       // DEFAULT VALUE
    },
    createdAt: {            // CREATED AT FIELD
      type: Date,
      default: Date.now,    // DEFAULT CURRENT DATE
      get: (timestamp) => dateFormat(timestamp), // FORMAT TIMESTAMP
    },
  }
  // OPTIONAL TIMESTAMP SETTINGS COMMENTED OUT
);

// CREATE MESSAGE MODEL
const Message = mongoose.model("Message", messageSchema);

// EXPORT MESSAGE MODEL
module.exports = Message;
