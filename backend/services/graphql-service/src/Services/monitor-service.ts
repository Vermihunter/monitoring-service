import { HttpClient } from "@monitorapp/shared";
import Monitor from "../Models/monitor.model";

export class MonitorService {
  constructor(private readonly client: HttpClient) {}

  async getMonitorsByIds(ids: readonly string[]): Promise<Monitor[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const query = ids.map((id) => `_id=${id}`).join("&");
    const response = await this.client.get<any>(`/?${query}`);

    // console.log(`Monitors by ID -> ${ids}`);
    //console.log(response.data.data);

    return response.data.data;
  }
}
