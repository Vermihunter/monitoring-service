import { makeBadge } from "badge-maker";

export class BadgeService {
  static generateBadge(monitor: any): string {
    const isUp = monitor.lastStatus === "success";

    return makeBadge({
      label: monitor.badgeLabel,
      message: isUp ? "up" : "down",
      color: isUp ? "green" : "red",
    });
  }
}
