"use client";

import { useState } from "react";
import Monitor from "@/app/_types/monitor";
import { handleMonitorUpdate } from "../actions";

export default function MonitorForm({ monitor }: { monitor: Monitor }) {
  const [form, setForm] = useState(monitor);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await handleMonitorUpdate(monitor._id, form);
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 w-full">
        <h2 className="text-lg font-semibold mb-6">Edit Monitor</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Label
            </label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Badge
            </label>
            <input
              name="badge_label"
              value={form.badge_label}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Periodicity */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Periodicity (seconds)
            </label>
            <input
              type="number"
              name="periodicity"
              value={form.periodicity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Monitor Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>PingMonitor</option>
              <option>WebsiteMonitor</option>
            </select>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Monitor Active
              </p>
              <p className="text-xs text-gray-500">
                Enable or disable monitoring
              </p>
            </div>

            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-5 w-5 accent-green-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg border border-gray-300
                         hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
