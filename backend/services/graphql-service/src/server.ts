import { Application } from "express";
import { addGlobalProcessHandlers, run } from "@monitorapp/shared";
import createApp from "./app";

async function bootstrap() {
  const app: Application = await createApp();

  const port = Number(process.env.PORT) || 3000;
  const server = run(app, port);

  addGlobalProcessHandlers(server);
}

bootstrap();
