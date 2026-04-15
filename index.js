require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
//const { useServer } = require('graphql-ws/lib/use/ws');
const { useServer } = require('graphql-ws/use/ws');
const mongoose = require('mongoose');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connecté à MongoDB');

  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Serveur WebSocket pour les subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });
  useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
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
  //j'ai fait ça pour option 1
  /*const { validateCredentials } = require('./middleware/auth');

  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
        // Les subscriptions WebSocket n'ont pas de req HTTP
        if (req) {
        validateCredentials(req);
        }
        return {};
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
    });*/

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`API GraphQL : http://localhost:${PORT}/graphql`);
    console.log(`Subscriptions : ws://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);