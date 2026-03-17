import Monitor from "./monitor";

export type GraphQLMonitor = Pick<
  Monitor,
  "label" | "periodicity" | "type" | "badge_label" | "active"
> & {
  identifier: string;
};
