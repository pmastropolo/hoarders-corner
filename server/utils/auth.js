// IMPORT JSON WEB TOKEN
const jwt = require("jsonwebtoken");

// IMPORT GRAPHQL ERROR
const { GraphQLError } = require("graphql");

// DEFINE SECRET KEY
const secret = "keepinonthedl";

// DEFINE TOKEN EXPIRATION
const expiration = "2h";

// EXPORT MODULE
module.exports = {
  // CUSTOM AUTHENTICATION ERROR
  AuthenticationError: new GraphQLError("Could not authenticate user.", {
    extensions: {
      code: "UNAUTHENTICATED",
    },
  }),

  // AUTH MIDDLEWARE FUNCTION
  authMiddleware: function ({ req }) {
    // GET TOKEN FROM REQUEST
    let token = req.body.token || req.query.token || req.headers.authorization;

    // EXTRACT TOKEN FROM AUTHORIZATION HEADER
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // RETURN REQUEST IF NO TOKEN
    if (!token) {
      return req;
    }

    // VERIFY TOKEN AND SET USER
    try {
      const { authenticatedPerson } = jwt.verify(token, secret, {
        maxAge: expiration,
      });
      req.user = authenticatedPerson;
    } catch {
      console.log("Invalid token");
    }

    // RETURN MODIFIED REQUEST
    return req;
  },

  // SIGN TOKEN FUNCTION
  signToken: function ({ email, username, _id }) {
    // CREATE PAYLOAD
    const payload = { email, username, _id };

    // SIGN AND RETURN TOKEN
    return jwt.sign({ authenticatedPerson: payload }, secret, {
      expiresIn: expiration,
    });
  },
};
