import express, { Application } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import typeDefs from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { buildContext } from "./graphql/context";

import {
  addHealthCheck,
  addDefaultMiddlewares,
  globalErrorHandler,
  logger,
} from "@monitorapp/shared";

async function setupApollo(app: Application) {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use(
    "/",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => buildContext({ req }),
    }),
  );

  app.use(globalErrorHandler);
}

export async function createApp() {
  const app = express();

  addDefaultMiddlewares(app, logger);
  addHealthCheck(app);

  await setupApollo(app);

  return app;
}

export default createApp;
