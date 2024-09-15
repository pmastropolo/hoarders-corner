// IMPORT MONGOOSE
const mongoose = require("mongoose");

// CONNECT TO MONGODB
mongoose.connect(
  process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/smell-o-scope` // DB URI OR DEFAULT
);

// EXPORT CONNECTION
module.exports = mongoose.connection;
