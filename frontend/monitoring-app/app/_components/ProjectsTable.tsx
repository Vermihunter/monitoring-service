import Link from "next/link";
import Project from "../_types/project";
import DeleteProjectButton from "@/app/_components/DeleteProjectButton";

export default async function ProjectsTable({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>

        <Link
          href="/project/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          + Create Project
        </Link>
      </div>

      {/* Existing table (UNCHANGED) */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Label</th>
              <th className="px-6 py-3 text-left font-semibold">Description</th>
              <th className="px-6 py-3 text-left font-semibold">Tags</th>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">
            {projects.map((project: Project) => (
              <tr key={project._id} className="hover:bg-gray-100 transition">
                <td className="px-6 py-4 font-semibold">
                  <Link href={`/project/${project._id}`}>{project.label}</Link>
                </td>

                <td className="px-6 py-4">{project.description}</td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-200 text-blue-900 text-xs font-semibold px-2 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 font-mono text-gray-700 text-xs">
                  {project._id}
                </td>
                <td className="px-6 py-4">
                  <DeleteProjectButton id={project._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
