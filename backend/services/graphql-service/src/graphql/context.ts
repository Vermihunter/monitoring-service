import { HttpClient } from "@monitorapp/shared";
import { ProjectService } from "../Services/project-service";
import { MonitorService } from "../Services/monitor-service";
import { StatusService } from "../Services/status-service";
import DataLoader from "dataloader";
import Monitor from "../Models/monitor.model";

export interface GraphQLContext {
  services: {
    projects: ProjectService;
    status: StatusService;
    monitors: MonitorService;
  };
  loaders: {
    monitorById: DataLoader<string, Monitor>;
    statusByMonitorId: DataLoader<string, any[]>;
  };
}

const createMonitorByIdLoader = (monitorService: MonitorService) =>
  new DataLoader<string, Monitor>(async (ids: any) => {
    const monitors = await monitorService.getMonitorsByIds(ids);

    const map = new Map(monitors.map((m: any) => [m._id || m.identifier, m]));

    return ids.map((id: any) => map.get(id));
  });

export async function buildContext({
  req,
}: {
  req: any;
}): Promise<GraphQLContext> {
  //const token = req.headers.authorization; // "Bearer eyJhbGciOi..."
  console.log("REQ:", typeof req);

  const jwt = req?.cookies.jwt;
  console.log("HEADERS:", jwt);

  const projectHttpClient = new HttpClient({
    baseURL: "http://project-service:3000",
    ...(jwt && {
      jwt,
    }),
  });

  const monitorHttpClient = new HttpClient({
    baseURL: "http://monitor-service:3000",
    ...(jwt && {
      jwt,
    }),
  });

  const statusHttpClient = new HttpClient({
    baseURL: "http://monitoring-service:3000",
    ...(jwt && {
      jwt,
    }),
  });

  const projectService = new ProjectService(projectHttpClient);
  const monitorService = new MonitorService(monitorHttpClient);
  const statusService = new StatusService(statusHttpClient);

  const statusLoader = new DataLoader<string, any[]>(async (ids) => {
    console.log("status loader");
    const map = await statusService.getStatusBatch(ids as string[]);
    return ids.map((id) => map.get(id) ?? []);
  });

  return {
    services: {
      projects: projectService,
      monitors: monitorService,
      status: statusService,
    },
    loaders: {
      monitorById: createMonitorByIdLoader(monitorService),
      statusByMonitorId: statusLoader,
    },
  };
}
