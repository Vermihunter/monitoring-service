import pino from "pino";

export default function createLogger(serviceName: String) {
  return pino({
    level: process.env.LOG_LEVEL || "info",

    base: {
      service: serviceName,
      env: process.env.NODE_ENV || "development",
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    formatters: {
      level(label: String) {
        return { level: label };
      },
    },
  });
}
