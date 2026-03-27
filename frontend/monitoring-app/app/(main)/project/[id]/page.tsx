import ProjectForm from "@/app/_components/ProjectForm";
import { getProjectByID } from "@/app/_lib/api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectByID(id);
  console.log(project);

  return (
    <div className="flex justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-2xl">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
