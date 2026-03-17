import Status from "./status.model";

export default interface Monitor {
  identifier: string;
  periodicity: number;
  label: string;
  type: string;
  host?: string;
  url?: string;
  badgeUrl: string;
  statuses: [Status];
}
