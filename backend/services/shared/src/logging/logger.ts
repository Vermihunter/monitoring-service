import createLogger from "./loggerFactory";

const logger = createLogger(process.env.SERVICE_NAME!);

export default logger;
