import { GraphQLMonitor } from "./graphql-monitor";
import Project from "./project";

export type GraphQLProject = Pick<Project, "label" | "description"> & {
  identifier: string;
  monitors: GraphQLMonitor[];
};
