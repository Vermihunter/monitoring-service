"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Pagination from "@/app/_components/Pagination";
import {
  getMonitorId,
  type MonitorResult,
  type MonitorResultStatus,
} from "@/app/_lib/monitoring-history";

function formatDateParts(dateString: string) {
  const date = new Date(dateString);

  return {
    day: date.toLocaleDateString(undefined, { day: "2-digit" }),
    month: date.toLocaleDateString(undefined, { month: "short" }),
    year: date.toLocaleDateString(undefined, { year: "numeric" }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    full: date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };
}

function DateCell({ value }: { value: string }) {
  const formatted = formatDateParts(value);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5"
      title={formatted.full}
    >
      <div className="flex h-8 w-8 flex-col items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm">
        <span className="text-[8px] font-semibold uppercase leading-none tracking-wide text-gray-500">
          {formatted.month}
        </span>
        <span className="text-[11px] font-bold leading-none text-gray-900">
          {formatted.day}
        </span>
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-[11px] font-semibold text-gray-900">
          {formatted.year}
        </span>
        <span className="font-mono text-[11px] text-gray-500">
          {formatted.time}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MonitorResultStatus }) {
  const isSuccess = status === "success";

  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
        isSuccess
          ? "bg-green-100 text-green-800 ring-1 ring-green-200"
          : "bg-red-100 text-red-800 ring-1 ring-red-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function MonitoringHistoryListMode({
  results,
  resultsPerPage,
}: {
  results: MonitorResult[];
  resultsPerPage: number;
}) {
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const totalPages = Math.max(1, Math.ceil(results.length / resultsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const pageStart = (safePage - 1) * resultsPerPage;
  const pageEnd = pageStart + resultsPerPage;

  const pageResults = results.slice(pageStart, pageEnd);

  return (
    <div className="flex min-h-[560px] flex-col">
      <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Start</th>
              <th className="px-6 py-3 text-left font-semibold">
                Response Time
              </th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Monitor ID</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-800">
            {pageResults.length > 0 ? (
              pageResults.map((result) => (
                <tr key={result._id} className="transition hover:bg-gray-100">
                  <td className="px-6 py-2.5">
                    <DateCell value={result.start} />
                  </td>

                  <td className="px-6 py-2.5">
                    <span className="font-mono text-gray-800">
                      {result.responseInMs} ms
                    </span>
                  </td>

                  <td className="px-6 py-2.5">
                    <StatusBadge status={result.status} />
                  </td>

                  <td className="px-6 py-2.5 font-mono text-xs text-gray-700">
                    <Link
                      href={`/monitor/${getMonitorId(result.monitor)}`}
                      className="hover:text-blue-600"
                    >
                      {getMonitorId(result.monitor)}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No monitor results match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {results.length > 0 && totalPages > 1 && (
        <div className="mt-auto flex justify-center py-6">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
