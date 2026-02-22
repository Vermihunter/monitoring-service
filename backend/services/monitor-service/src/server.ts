import app from "./app";
import { addGlobalProcessHandlers, run, dbConnect } from "@monitorapp/shared";

dbConnect();

const port = Number(process.env.PORT) || 3000;
const server = run(app, port);

addGlobalProcessHandlers(server);
