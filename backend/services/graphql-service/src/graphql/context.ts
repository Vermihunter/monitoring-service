import { HttpClient } from "@monitorapp/shared";
import { ProjectService } from "../Services/project-service";
import { MonitorService } from "../Services/monitor-service";
import { StatusService } from "../Services/status-service";
import { BadgeService } from "../Services/badge-service";
import DataLoader from "dataloader";
import Monitor from "../Models/monitor.model";

export interface GraphQLContext {
  services: {
    projects: ProjectService;
    status: StatusService;
    monitors: MonitorService;
    badges: BadgeService;
  };
  loaders: {
    monitorById: DataLoader<string, Monitor>;
    statusByMonitorId: DataLoader<string, any[]>;
    badgeByMonitorId: DataLoader<string, string | null>;
  };
}

const createMonitorByIdLoader = (monitorService: MonitorService) =>
  new DataLoader<string, Monitor>(async (ids: readonly string[]) => {
    const monitors = await monitorService.getMonitorsByIds([...ids]);
    const map = new Map(monitors.map((m: any) => [m._id || m.identifier, m]));
    return ids.map((id) => map.get(id) as Monitor);
  });

const createBadgeByMonitorIdLoader = (badgeService: BadgeService) =>
  new DataLoader<string, string | null>(async (ids: readonly string[]) => {
    return Promise.all(ids.map((id) => badgeService.getBadgeForMonitor(id)));
  });

export async function buildContext({
  req,
}: {
  req: any;
}): Promise<GraphQLContext> {
  const jwt = req?.cookies.jwt;

  const projectHttpClient = new HttpClient({
    baseURL: "http://project-service:3000",
    ...(jwt && { jwt }),
  });

  const monitorHttpClient = new HttpClient({
    baseURL: "http://monitor-service:3000",
    ...(jwt && { jwt }),
  });

  const statusHttpClient = new HttpClient({
    baseURL: "http://monitoring-service:3000",
    ...(jwt && { jwt }),
  });

  const badgeHttpClient = new HttpClient({
    baseURL: "http://badge-service:3000",
    ...(jwt && { jwt }),
  });

  const projectService = new ProjectService(projectHttpClient);
  const monitorService = new MonitorService(monitorHttpClient);
  const statusService = new StatusService(statusHttpClient);
  const badgeService = new BadgeService(badgeHttpClient);

  const statusLoader = new DataLoader<string, any[]>(async (ids) => {
    const map = await statusService.getStatusBatch(ids as string[]);
    return ids.map((id) => map.get(id) ?? []);
  });

  return {
    services: {
      projects: projectService,
      monitors: monitorService,
      status: statusService,
      badges: badgeService,
    },
    loaders: {
      monitorById: createMonitorByIdLoader(monitorService),
      statusByMonitorId: statusLoader,
      badgeByMonitorId: createBadgeByMonitorIdLoader(badgeService),
    },
  };
}
