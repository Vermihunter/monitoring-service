import { getMonitors } from "@/app/_lib/api";
import Monitor from "@/app/_types/monitor";
import MonitorRow from "../_components/MonitorRow";
import { gql } from "@apollo/client";
import { client } from "@/app/_lib/apollo/client";
import Project from "../_types/project";
import Link from "next/link";
import { GraphQLProject } from "../_types/graphql-project";
import { MonitorProjectCombo } from "../_types/monitor-project-combo";

export default async function MonitorTable({
  data,
}: {
  data: MonitorProjectCombo[] | undefined;
}) {
  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Monitors</h2>

        <Link
          href="/monitor/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          + Create Monitor
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Label</th>
              <th className="px-6 py-3 text-left font-semibold">Badge</th>
              <th className="px-6 py-3 text-left font-semibold">Periodicity</th>
              <th className="px-6 py-3 text-left font-semibold">Type</th>
              <th className="px-6 py-3 text-left font-semibold">Project</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">
            {data?.map((combo: MonitorProjectCombo) => (
              <MonitorRow
                key={combo.monitor._id}
                monitor={combo.monitor}
                project={combo.project}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
