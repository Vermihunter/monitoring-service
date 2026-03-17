import Link from "next/link";
import { getProjects } from "../../_lib/api";
import Project from "../../_types/project";
import DeleteProjectButton from "@/app/_components/DeleteProjectButton";
import Pagination from "../../_components/Pagination";
import ProjectsTable from "../../_components/ProjectsTable";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

export default async function Page() {
  const projects: Project[] = await getProjects();

  return (
    <div className="flex flex-col h-full">
      <ProjectsTable projects={projects} />

      <div className="mt-auto flex justify-center py-6">
        <Pagination totalPages={1} />
      </div>
    </div>
  );
}
