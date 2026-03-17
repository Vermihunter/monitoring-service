import MonitoringHistoryView from "@/app/_components/MonitoringHistoryView";
import { getMonitorResults } from "@/app/_lib/api";

export default async function Page() {
  const RESULTS_PER_PAGE = 10;

  const results = await getMonitorResults();

  return (
    <MonitoringHistoryView
      results={results.data.data}
      resultsPerPage={RESULTS_PER_PAGE}
    />
  );
}
