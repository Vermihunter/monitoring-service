import { HttpClient } from "@monitorapp/shared";
import Project from "../Models/project.model";

export class ProjectService {
  constructor(private readonly client: HttpClient) {}

  async getProjects(): Promise<Project[]> {
    // 1. Get the full response from Express
    const response = await this.client.get<any>("/");

    console.log(response.data.data);

    // 2. Extract the array from your JSend-style envelope
    // Based on your controller: res.status(200).json({ status: 'success', data: { data: doc } });
    return response.data.data;
  }

  async getProjectByIdentifier(identifier: string): Promise<Project | null> {
    console.log(`Getting project for ${identifier}`);

    return this.client.get<Project>(`/${identifier}`);
  }
}
