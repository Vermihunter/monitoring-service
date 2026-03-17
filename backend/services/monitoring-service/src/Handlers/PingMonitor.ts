import net from "net";
import { MonitorHandlerFn } from "../Types/monitor.types";

export const handlePingMonitor: MonitorHandlerFn = async (data) => {
  const { hostname, port, label } = data;

  // Defaulting to 443 if port isn't provided, 5s timeout
  const targetPort = port || 443;
  const targetHost = hostname || "";
  const timeout = 5000;

  if (!targetHost) {
    throw new Error("No host provided for PingMonitor");
  }

  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    // Set the timeout at the socket level
    socket.setTimeout(timeout);

    socket.connect(targetPort, targetHost, () => {
      socket.destroy(); // Connection successful, hang up immediately
      resolve();
    });

    socket.on("error", (err: Error) => {
      socket.destroy();
      reject(new Error(`Connection failed: ${err.message}`));
    });

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error(`Connection timed out after ${timeout}ms`));
    });
  });
};
