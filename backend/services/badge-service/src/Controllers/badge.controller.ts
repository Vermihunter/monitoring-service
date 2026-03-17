import { Request, Response, NextFunction } from "express";
import { BadgeService } from "../Services/badge.service";
import { HttpClient, catchAsync } from "@monitorapp/shared";

export const getMonitor = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { monitorId } = req.params;
    console.log(`Processing monitor id ${monitorId}`);

    const jwt = req?.cookies.jwt;
    console.log("HEADERS:", jwt);

    const httpClient = new HttpClient({
      baseURL: "http://monitor-service:3000",
      ...(jwt && {
        jwt,
      }),
    });

    const monitor = await httpClient.get<any>(`/${monitorId}`);
    res.locals.badgeLabel = monitor["data"]["data"]["badge_label"];
    res.locals.lastStatus = "up";

    console.log(req.query);
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
