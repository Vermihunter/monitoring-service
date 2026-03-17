"use client";

import { useMemo, useState } from "react";
import MonitoringHistoryFilters from "@/app/_components/MonitoringHistoryFilters";
import MonitoringHistoryListMode from "@/app/_components/MonitoringHistoryListMode";
import MonitoringHistoryGraphMode from "@/app/_components/MonitoringHistoryGraphMode";
import {
  filterMonitorResults,
  initialMonitorResultFilters,
  type MonitorResult,
} from "@/app/_lib/monitoring-history";
import Calendar from "./Calendar";

type Mode = "list" | "graph" | "calendar";

type ModeConfig = {
  label: string;
  description?: string;
};

const modeConfig: Record<Mode, ModeConfig> = {
  list: {
    label: "List mode",
    description: "Show monitoring history in a table",
  },
  graph: {
    label: "Graph mode",
    description: "Show response time over time",
  },
  calendar: {
    label: "Calendar mode",
    description: "Show results in a calendar view",
  },
};

export default function MonitoringHistoryView({
  results,
  resultsPerPage,
}: {
  results: MonitorResult[];
  resultsPerPage: number;
}) {
  const [mode, setMode] = useState<Mode>("list");
  const [filters, setFilters] = useState(initialMonitorResultFilters);

  const filteredResults = useMemo(
    () => filterMonitorResults(results, filters),
    [results, filters],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring History
          </h1>
          <p className="text-sm text-gray-500">
            View monitor results as a list or as a response-time graph.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {/* {Object.entries(modeConfig).map((mode) => (
              <button></button>
            ))} */}

            <button
              type="button"
              onClick={() => setMode("list")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              List mode
            </button>
            <button
              type="button"
              onClick={() => setMode("graph")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "graph"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Graph mode
            </button>

            <button
              type="button"
              onClick={() => setMode("calendar")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "calendar"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Calendar mode
            </button>
          </div>

          <MonitoringHistoryFilters filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {mode === "list" ? (
        <MonitoringHistoryListMode
          results={filteredResults}
          resultsPerPage={resultsPerPage}
        />
      ) : mode === "graph" ? (
        <MonitoringHistoryGraphMode results={filteredResults} />
      ) : (
        // <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <Calendar results={filteredResults} />
        // </div>
      )}
    </div>
  );
}
