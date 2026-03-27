"use client";

import { useState } from "react";
import Monitor from "@/app/_types/monitor";
import ToggleBadge from "./ToggleBadge";
import Link from "next/link";
import Project from "../_types/project";
import Image from "next/image";

export default function MonitorRow({
  monitor,
  project,
}: {
  monitor: Monitor;
  project: Project;
}) {
  const [active, setActive] = useState(monitor.active);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    const action = active ? "deactivate" : "activate";

    await fetch(`/api/monitors/${monitor._id}/${action}`, {
      method: "POST",
    });

    setActive(!active);
    setLoading(false);
  }

  return (
    <tr className="hover:bg-gray-100 transition">
      <td className="px-6 py-4 font-semibold">
        <Link href={`/monitor/${monitor._id}`}>{monitor.label}</Link>
      </td>

      <td className="px-10 py-4">
        {/* <span className="rounded-md bg-blue-200 px-2 py-1 text-xs font-semibold text-blue-900"> */}

        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(monitor.badge!)}`}
          alt={`${monitor.label} badge`}
          className="h-5 w-auto"
        />
        {/* </span> */}
      </td>

      <td className="px-6 py-4">{monitor.periodicity}s</td>

      <td className="px-6 py-4">
        <span className="rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-900">
          {monitor.type}
        </span>
      </td>

      <td className="px-6 py-4 font-mono text-gray-700">
        <Link href={`/project/${project._id}`}>{monitor.project}</Link>
      </td>

      <td className="px-6 py-4">
        <ToggleBadge
          active={active}
          loading={loading}
          onToggle={handleToggle}
        />
      </td>
    </tr>
  );
}
