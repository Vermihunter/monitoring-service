import { HttpClient } from "@monitorapp/shared";
import Status from "../Models/status.model";

export class StatusService {
  constructor(private readonly client: HttpClient) {}

  async getStatusByMonitor(
    monitorIdentifier: string,
    from?: number,
    to?: number,
  ): Promise<Status[]> {
    return this.client.get<Status[]>(`/${monitorIdentifier}`, {
      params: { from, to },
    });
  }

  async getStatusBatch(
    monitorIdentifiers: string[],
  ): Promise<Map<string, Status[]>> {
    console.log("status batch result: ", monitorIdentifiers.join(","));

    try {
      const query = monitorIdentifiers.map((id) => `monitor=${id}`).join("&");

      const result = await this.client.get<any>(`/?${query}`);
      const docs = result.data.data;
      console.log(docs);
      const map = new Map<string, Status[]>();

      for (const doc of docs) {
        const monitorId = doc.monitor;

        if (!map.has(monitorId)) {
          map.set(monitorId, []);
        }

        map.get(monitorId)!.push({
          date: doc.start,
          ok: doc.status === "success",
          responseTime: doc.responseInMs,
        });
      }

      return map;
    } catch (e) {
      console.log("error: ", e);
    }

    return new Map();
  }
}
