import axios from "axios";
import { MonitorHandlerFn } from "../Types/monitor.types";

export const handleWebsiteMonitor: MonitorHandlerFn = async (data) => {
  const { url, checkStatus, keywords } = data;

  const response = await axios.get(url!, {
    timeout: 15000,
    validateStatus: () => true,
    headers: {
      // Add a common User-Agent
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (checkStatus && (response.status < 200 || response.status >= 300)) {
    throw new Error(`HTTP Status ${response.status}`);
  }

  if (keywords && keywords.length > 0) {
    const body = response.data.toString();
    const missing = keywords.filter((word) => !body.includes(word));
    if (missing.length > 0) {
      throw new Error(`Missing keywords: ${missing.join(", ")}`);
    }
  }
};
