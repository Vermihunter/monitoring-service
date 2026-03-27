import { Request, Response, NextFunction } from "express";
import { BadgeService } from "../Services/badge.service";
import { HttpClient, catchAsync } from "@monitorapp/shared";

export const getMonitor = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { monitorId } = req.params;
    const authHeader = req.headers.authorization;

    const jwt = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : (req.cookies?.jwt ?? null);

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

    let [monitor, status] = await Promise.all([
      monitorHttpClient.get<any>(`/${monitorId}`),
      statusHttpClient.get<any>(`/${monitorId}/latest-result`),
    ]);

    res.locals.badgeLabel = monitor.data.data.badge_label;
    res.locals.lastStatus = status.status;

    next();
  },
);

export const getBadge = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    console.log(req.params);
    const svg = BadgeService.generateBadge({
      badgeLabel: res.locals.badgeLabel || req.query.badgeLabel,
      lastStatus: res.locals.lastStatus || req.query.lastStatus,
    });

    res.set("Content-Type", "image/svg+xml");
    res.set("Cache-Control", "no-store");
    res.send(svg);
  },
);
