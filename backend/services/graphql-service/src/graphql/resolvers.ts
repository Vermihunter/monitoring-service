import { GraphQLContext } from "./context";

export const resolvers = {
  Query: {
    projects: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      return ctx.services.projects.getProjects();
    },

    status: async (
      _: unknown,
      args: { monitorIdentifier: string; from?: number; to?: number },
      ctx: GraphQLContext,
    ) => {
      return ctx.services.status.getStatusByMonitor(
        args.monitorIdentifier,
        args.from,
        args.to,
      );
    },
  },

  Project: {
    // 'parent' is the raw document from your Express service
    identifier: (parent: any) => parent.id || parent._id,
    monitors: async (parent: any, _: unknown, ctx: GraphQLContext) => {
      console.log("Project:", parent.label);
      console.log("Monitor IDs:", parent.monitors);

      return ctx.services.monitors.getMonitorsByIds(parent.monitors);
    },
  },

  Monitor: {
    identifier: (parent: any) => parent.id ?? parent._id,

    statuses: async (parent: any, _: any, ctx: GraphQLContext) => {
      const id = parent.id ?? parent._id;

      if (!id) return [];

      return ctx.loaders.statusByMonitorId.load(id);
    },

    badge: async (parent: any, _: any, ctx: GraphQLContext) => {
      const id = parent.id ?? parent._id;
      if (!id) return null;
      return ctx.loaders.badgeByMonitorId.load(String(id));
    },
  },
};
