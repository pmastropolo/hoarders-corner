// IMPORT MONGOOSE SCHEMA AND MODEL
const { Schema, model } = require("mongoose");

// IMPORT BCRYPT FOR PASSWORD HASHING
const bcrypt = require("bcrypt");

// DEFINE USER SCHEMA
const userSchema = new Schema({
  username: {                                  // USERNAME FIELD
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {                                     // EMAIL FIELD
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {                                  // PASSWORD FIELD
    type: String,
    required: true,
    minlength: 6,
  },
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],          // ITEMS ARRAY
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }],// COMMUNITIES ARRAY
  messagesSent: [{ type: Schema.Types.ObjectId, ref: "Message" }], // SENT MESSAGES ARRAY
  messagesReceived: [{ type: Schema.Types.ObjectId, ref: "Message" }], // RECEIVED MESSAGES ARRAY
});

// PASSWORD HASHING MIDDLEWARE
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10; // SALT ROUNDS FOR HASHING
    this.password = await bcrypt.hash(this.password, saltRounds); // HASH PASSWORD
  }

  next(); // PROCEED TO NEXT MIDDLEWARE
});

// PASSWORD VALIDATION METHOD
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password); // COMPARE PASSWORD WITH HASH
};

// CREATE USER MODEL
const User = model("User", userSchema);

// EXPORT USER MODEL
module.exports = User;
