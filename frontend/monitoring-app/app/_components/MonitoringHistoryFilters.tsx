"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { MonitorResultFilters } from "@/app/_lib/monitoring-history";

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ActiveFilterCount({ filters }: { filters: MonitorResultFilters }) {
  const count = Object.values(filters).filter((value) => value !== "").length;

  if (count === 0) return null;

  return (
    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
      {count}
    </span>
  );
}

export default function MonitoringHistoryFilters({
  filters,
  setFilters,
}: {
  filters: MonitorResultFilters;
  setFilters: Dispatch<SetStateAction<MonitorResultFilters>>;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const updateFilter = <K extends keyof MonitorResultFilters>(
    key: K,
    value: MonitorResultFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      monitor: "",
      startFrom: "",
      startTo: "",
      minResponseTime: "",
      maxResponseTime: "",
      search: "",
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
      >
        <span>Filters</span>
        <ActiveFilterCount filters={filters} />
        <span className="text-xs text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-[min(92vw,720px)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">
              Advanced Filters
            </h3>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <FilterSection title="Search">
              <input
                type="text"
                placeholder="Search id, monitor, status..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FilterSection>

            <FilterSection title="Status">
              <select
                value={filters.status}
                onChange={(e) =>
                  updateFilter(
                    "status",
                    e.target.value as MonitorResultFilters["status"],
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">All statuses</option>
                <option value="success">Success</option>
                <option value="fail">Fail</option>
              </select>
            </FilterSection>

            <FilterSection title="Monitor">
              <input
                type="text"
                placeholder="Monitor id..."
                value={filters.monitor}
                onChange={(e) => updateFilter("monitor", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FilterSection>

            <FilterSection title="Response Time Range">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ms"
                  value={filters.minResponseTime}
                  onChange={(e) =>
                    updateFilter("minResponseTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="number"
                  placeholder="Max ms"
                  value={filters.maxResponseTime}
                  onChange={(e) =>
                    updateFilter("maxResponseTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </FilterSection>

            <FilterSection title="Start From">
              <input
                type="date"
                value={filters.startFrom}
                onChange={(e) => updateFilter("startFrom", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FilterSection>

            <FilterSection title="Start To">
              <input
                type="date"
                value={filters.startTo}
                onChange={(e) => updateFilter("startTo", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  );
}
