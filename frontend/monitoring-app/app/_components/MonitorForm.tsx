"use client";

import { useState } from "react";
import Monitor from "@/app/_types/monitor";
import { handleMonitorUpdate } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PingMonitorForm = Monitor & {
  type: "PingMonitor";
  hostname: string;
  port: string;
};

type WebsiteMonitorForm = Monitor & {
  type: "WebsiteMonitor";
  url: string;
  check_status: boolean;
  keywords: string[];
};

type MonitorFormState = PingMonitorForm | WebsiteMonitorForm;

export default function MonitorForm({
  monitor,
}: {
  monitor: MonitorFormState;
}) {
  const [form, setForm] = useState<MonitorFormState>(monitor);
  const [newKeyword, setNewKeyword] = useState("");
  const router = useRouter();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "periodicity"
            ? Number(value)
            : value,
    }));
  }

  function addKeyword() {
    if (form.type !== "WebsiteMonitor") return;

    const keyword = newKeyword.trim();
    if (!keyword) return;

    const exists = form.keywords.some(
      (k) => k.toLowerCase() === keyword.toLowerCase(),
    );

    if (!exists) {
      setForm((prev) =>
        prev.type === "WebsiteMonitor"
          ? { ...prev, keywords: [...prev.keywords, keyword] }
          : prev,
      );
    }

    setNewKeyword("");
  }

  function removeKeyword(keyword: string) {
    setForm((prev) =>
      prev.type === "WebsiteMonitor"
        ? {
            ...prev,
            keywords: prev.keywords.filter((k) => k !== keyword),
          }
        : prev,
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const response = JSON.parse(await handleMonitorUpdate(form._id, form));

    if (response.status !== "success") {
      toast.error(response.statusText);
      return;
    }

    toast.success("Monitor successfully updated!");

    setTimeout(() => {
      router.push("/monitor");
    }, 1500);
  }

  return (
    <div>
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Edit Monitor</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Label
            </label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Badge
            </label>
            <input
              name="badge_label"
              value={form.badge_label}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Periodicity (seconds)
            </label>
            <input
              type="number"
              name="periodicity"
              value={form.periodicity}
              onChange={handleChange}
              min={5}
              max={300}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Monitor Type
            </label>
            <select
              name="type"
              value={form.type}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm outline-none"
            >
              <option value="PingMonitor">PingMonitor</option>
              <option value="WebsiteMonitor">WebsiteMonitor</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Type changes are disabled for existing monitors.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
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

          {form.type === "PingMonitor" && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Ping Monitor Settings
              </h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Hostname
                </label>
                <input
                  name="hostname"
                  value={form.hostname}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Port
                </label>
                <input
                  name="port"
                  value={form.port}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                />
              </div>
            </div>
          )}

          {form.type === "WebsiteMonitor" && (
            <div className="space-y-4 rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Website Monitor Settings
              </h3>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  URL
                </label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Check Status Code
                  </p>
                  <p className="text-xs text-gray-500">
                    Verify the HTTP response status
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="check_status"
                  checked={form.check_status}
                  onChange={handleChange}
                  className="h-5 w-5 accent-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Keywords
                </label>

                <div className="mb-3 flex flex-wrap gap-2">
                  {form.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="flex items-center gap-1 rounded-md bg-blue-200 px-2 py-1 text-xs font-semibold text-blue-900"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-blue-900 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Type keyword and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
