import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './db/index.js';
import { models, typeDefs, resolvers } from "./shcema/index.js";
import jwt from "jsonwebtoken";
import { GraphQLError } from 'graphql';
import loginRouter from './Routes/Login/login.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', loginRouter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

async function startServer() {
  await connectDB();

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let me = null;
        const token = req?.headers["x-token"];
        if (token) {
          const userData = await jwt.verify(token, process.env.SECRET);
          me = await models.User.findById(userData.id);
          if (!me) throw new GraphQLError("your session is expired", { extensions: { code: "UNAUTHENTICATED" } });
        }
        return {
          models,
          secret: process.env.SECRET,
          me,
        };
      },
    })
  );

  const PORT = process.env.PORT || 4000;

  httpServer.listen({ port: PORT }, () => {

    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
