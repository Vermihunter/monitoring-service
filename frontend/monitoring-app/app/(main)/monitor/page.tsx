import Monitor from "@/app/_types/monitor";
import { gql } from "@apollo/client";
import { client } from "@/app/_lib/apollo/client";
import Project from "../../_types/project";
import MonitorTable from "../../_components/MonitorTable";
import Pagination from "../../_components/Pagination";
import { cookies } from "next/headers";

const query = gql`
  query GetProjectsWithMonitors {
    projects {
      identifier
      label
      description
      monitors {
        identifier
        periodicity
        label
        badge_label
        type
        active
      }
    }
  }
`;

type GraphQLMonitor = Pick<
  Monitor,
  "label" | "periodicity" | "type" | "badge_label" | "active"
> & {
  identifier: string;
};

type GraphQLProject = Pick<Project, "label" | "description"> & {
  identifier: string;
  monitors: GraphQLMonitor[];
};

type GetProjectsWithMonitorsResponse = {
  projects: GraphQLProject[];
};

type MonitorProjectCombo = {
  project: Project;
  monitor: Monitor;
};

async function getTransformedData() {
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const { data } = await client.query<GetProjectsWithMonitorsResponse>({
    query,
    fetchPolicy: "no-cache",
    context: {
      credentials: "include",
      headers: {
        Cookie: `jwt=${jwt}`,
      },
    },
  });

  const combos: MonitorProjectCombo[] | undefined = data?.projects.flatMap(
    (project) =>
      project.monitors.map((monitor) => ({
        project: {
          _id: project.identifier,
          label: project.label,
          description: project.description,
          tags: [],
        } as Project,
        monitor: {
          _id: monitor.identifier,
          label: monitor.label,
          periodicity: monitor.periodicity,
          type: monitor.type,
          badge_label: monitor.badge_label,
          project: project.label,
          active: monitor.active,
        } as Monitor,
      })),
  );

  return combos;
}

export default async function Page() {
  const data = await getTransformedData();

  return (
    <div className="flex flex-col h-full">
      <MonitorTable data={data}></MonitorTable>

      <div className="mt-auto flex justify-center py-6">
        <Pagination totalPages={1} />
      </div>
    </div>
  );
  //return ;
}
