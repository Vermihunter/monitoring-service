import app from "./app";
import { addGlobalProcessHandlers, run } from "@monitorapp/shared";

const port = Number(process.env.PORT) || 3000;
const server = run(app, port);

addGlobalProcessHandlers(server);
