import { getMonitorByID } from "@/app/_lib/api";
import Monitor from "@/app/_types/monitor";
import MonitorForm from "../../../_components/MonitorForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monitor: Monitor = (await getMonitorByID(id)).data.data;

  return (
    <div className="flex w-full justify-center pt-16">
      <div className="w-full max-w-4xl">
        <MonitorForm monitor={monitor} />
      </div>
    </div>
  );
}
