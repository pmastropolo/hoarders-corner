// IMPORT EXPRESS
const express = require("express");

// IMPORT APOLLO SERVER
const { ApolloServer } = require("@apollo/server");

// IMPORT APOLLO SERVER EXPRESS MIDDLEWARE
const { expressMiddleware } = require("@apollo/server/express4");

// IMPORT PATH MODULE
const path = require("path");

// IMPORT MULTER FOR FILE UPLOADS
const multer = require("multer"); 

// IMPORT TYPEDEFS AND RESOLVERS
const { typeDefs, resolvers } = require("./schemas");

// IMPORT DATABASE CONFIGURATION
const db = require("./config/connection");

// IMPORT AUTH MIDDLEWARE
const { authMiddleware } = require("./utils/auth");

// CONFIGURE MULTER FOR MEMORY STORAGE
const upload = multer({
  storage: multer.memoryStorage(),
});

// INITIALIZE EXPRESS APP
const app = express();

// SET PORT
const PORT = process.env.PORT || 3001;

// CONFIGURE APOLLO SERVER
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// ASYNC FUNCTION TO START APOLLO SERVER
const startApolloServer = async () => {
  await server.start();

  // USE EXPRESS MIDDLEWARE
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // APPLY GRAPHQL MIDDLEWARE
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // SERVE STATIC FILES IN PRODUCTION
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // HANDLE ALL GET REQUESTS
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // CONNECT TO DATABASE AND START SERVER
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// CALL FUNCTION TO START SERVER
startApolloServer();
