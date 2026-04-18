require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/use/ws');
const mongoose = require('mongoose');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

// 🔐 Keycloak middleware : y3aytelha men houni
const { authMiddleware } = require('./middleware/auth');

// 🔥 DataLoaders
const { reviewsLoader, ratingsLoader } = require('./loaders');

async function startServer() {
  // 🔹 Connexion MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connecté à MongoDB');

  const app = express();
  const httpServer = createServer(app);

  // 🔹 Schema GraphQL
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 🔹 WebSocket (Subscriptions)
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({ schema }, wsServer);

  // 🔹 Apollo Server avec contexte Keycloak
  const server = new ApolloServer({
    schema,

    // 🔐 Injection utilisateur + loaders dans chaque requête
    context: async ({ req }) => {
      if (!req) return {}; // pour les subscriptions

      const auth = await authMiddleware(req);

      return {
        ...auth,

        // 🔥 DataLoaders accessibles partout
        loaders: {
          reviewsLoader,
          ratingsLoader
        }
      };
    },

    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              wsServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
  });

  const PORT = process.env.PORT || 4000;

  httpServer.listen(PORT, () => {
    console.log(` API GraphQL : http://localhost:${PORT}/graphql`);
    console.log(` Subscriptions : ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);