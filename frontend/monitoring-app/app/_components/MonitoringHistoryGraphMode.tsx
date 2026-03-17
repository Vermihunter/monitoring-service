"use client";

import { useMemo } from "react";
import type { MonitorResult } from "@/app/_lib/monitoring-history";

const CHART_WIDTH = 1000;
const CHART_HEIGHT = 380;
const PADDING = { top: 24, right: 24, bottom: 56, left: 64 };

function formatTimeLabel(timestamp: number) {
  const date = new Date(timestamp);

  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function MonitoringHistoryGraphMode({
  results,
}: {
  results: MonitorResult[];
}) {
  const sorted = useMemo(
    () =>
      [...results].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      ),
    [results],
  );

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-gray-300 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
        No monitor results match the current filters.
      </div>
    );
  }

  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const xValues = sorted.map((r) => new Date(r.start).getTime());
  const yValues = sorted.map((r) => r.responseInMs);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues, 1);

  const xRange = Math.max(maxX - minX, 1);

  const xScale = (value: number) =>
    PADDING.left + ((value - minX) / xRange) * innerWidth;

  const yScale = (value: number) =>
    PADDING.top + innerHeight - (value / maxY) * innerHeight;

  const polylinePoints = sorted
    .map(
      (r) => `${xScale(new Date(r.start).getTime())},${yScale(r.responseInMs)}`,
    )
    .join(" ");

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = Math.round((maxY / 4) * i);
    return {
      value,
      y: yScale(value),
    };
  });

  const xTicks = Array.from({ length: 5 }, (_, i) => {
    const value = minX + (xRange / 4) * i;
    return {
      value,
      x: xScale(value),
    };
  });

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Response Time Graph
        </h3>
        <p className="text-sm text-gray-500">
          Y axis = response time, X axis = time of start
        </p>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="min-w-[900px] w-full"
          role="img"
          aria-label="Response time over time"
        >
          {/* horizontal grid */}
          {yTicks.map((tick) => (
            <g key={`y-${tick.value}`}>
              <line
                x1={PADDING.left}
                y1={tick.y}
                x2={CHART_WIDTH - PADDING.right}
                y2={tick.y}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
              />
              <text
                x={PADDING.left - 10}
                y={tick.y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6B7280"
              >
                {tick.value} ms
              </text>
            </g>
          ))}

          {/* axes */}
          <line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={CHART_HEIGHT - PADDING.bottom}
            stroke="#9CA3AF"
          />
          <line
            x1={PADDING.left}
            y1={CHART_HEIGHT - PADDING.bottom}
            x2={CHART_WIDTH - PADDING.right}
            y2={CHART_HEIGHT - PADDING.bottom}
            stroke="#9CA3AF"
          />

          {/* x ticks */}
          {xTicks.map((tick, index) => (
            <g key={`x-${index}`}>
              <line
                x1={tick.x}
                y1={CHART_HEIGHT - PADDING.bottom}
                x2={tick.x}
                y2={CHART_HEIGHT - PADDING.bottom + 6}
                stroke="#9CA3AF"
              />
              <text
                x={tick.x}
                y={CHART_HEIGHT - PADDING.bottom + 22}
                textAnchor="middle"
                fontSize="12"
                fill="#6B7280"
              >
                {formatTimeLabel(tick.value)}
              </text>
            </g>
          ))}

          {/* line */}
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
            points={polylinePoints}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* points */}
          {sorted.map((result) => {
            const x = xScale(new Date(result.start).getTime());
            const y = yScale(result.responseInMs);
            const fill = result.status === "success" ? "#16A34A" : "#DC2626";

            return (
              <circle key={result._id} cx={x} cy={y} r="4" fill={fill}>
                <title>
                  {`${new Date(result.start).toLocaleString()} • ${result.responseInMs} ms • ${result.status}`}
                </title>
              </circle>
            );
          })}

          {/* axis labels */}
          <text
            x={CHART_WIDTH / 2}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            fontSize="13"
            fill="#374151"
            fontWeight="600"
          >
            Time of start
          </text>

          <text
            x="18"
            y={CHART_HEIGHT / 2}
            textAnchor="middle"
            fontSize="13"
            fill="#374151"
            fontWeight="600"
            transform={`rotate(-90 18 ${CHART_HEIGHT / 2})`}
          >
            Response time
          </text>
        </svg>
      </div>
    </div>
  );
}
