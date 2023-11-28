// LOAD AWS SDK
const AWS = require("aws-sdk");

// LOAD .env VARIABLES
require("dotenv").config();

// SET AWS CONFIG
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,         // ACCESS KEY
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // SECRET KEY
    region: process.env.AWS_REGION                       // REGION
});

// EXPORT AWS
module.exports = AWS;
