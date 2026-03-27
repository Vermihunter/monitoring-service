import { HttpClient } from "@monitorapp/shared";

export class BadgeService {
  constructor(private httpClient: HttpClient) {}

  async getBadgeForMonitor(monitorId: string): Promise<string | null> {
    try {
      return await this.httpClient.get<string>(`/formonitor/${monitorId}`);

      //   , {
      //     responseType: "text",
      //     headers: {
      //       Accept: "image/svg+xml",
      //     },
      //   }
    } catch (error) {
      console.log(JSON.stringify(error));
      return null;
    }
  }
}
