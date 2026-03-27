"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MonitorType = "PingMonitor" | "WebsiteMonitor";

type ProjectOption = {
  _id: string;
  label: string;
};

export default function CreateMonitorForm() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  const [form, setForm] = useState({
    label: "",
    periodicity: 60,
    badge_label: "",
    active: true,
    type: "PingMonitor" as MonitorType,

    selectedProjects: [] as string[],

    hostname: "",
    port: "",

    url: "",
    check_status: true,
    keywords: [] as string[],
  });

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : (data.projects ?? []));
      } catch {
        toast.error("Failed to load projects");
      }
    }

    loadProjects();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox" && name !== "project-checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "periodicity" ? Number(value) : value,
    }));
  }

  function toggleProject(projectId: string) {
    setForm((prev) => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter((id) => id !== projectId)
        : [...prev.selectedProjects, projectId],
    }));
  }

  function addKeyword() {
    const keyword = newKeyword.trim();
    if (!keyword) return;

    const exists = form.keywords.some(
      (k) => k.toLowerCase() === keyword.toLowerCase(),
    );

    if (!exists) {
      setForm((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
      }));
    }

    setNewKeyword("");
  }

  function removeKeyword(keyword: string) {
    setForm((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.selectedProjects.length === 0) {
      toast.error("Select at least one project");
      return;
    }

    const commonPayload = {
      label: form.label,
      periodicity: form.periodicity,
      badge_label: form.badge_label,
      active: form.active,
      type: form.type,

      // primary project for Monitor.project
      project: form.selectedProjects[0],

      // all projects that should contain the monitor
      projects: form.selectedProjects,
    };

    const payload =
      form.type === "PingMonitor"
        ? {
            ...commonPayload,
            hostname: form.hostname,
            port: form.port,
          }
        : {
            ...commonPayload,
            url: form.url,
            check_status: form.check_status,
            keywords: form.keywords,
          };

    const res = await fetch("/api/monitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      toast.error("Failed to create monitor");
      return;
    }

    toast.success("Monitor created successfully!");
    router.push("/monitor");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          Create Monitor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Label
            </label>
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="My monitor"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Monitor Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="PingMonitor">Ping Monitor</option>
              <option value="WebsiteMonitor">Website Monitor</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Periodicity
            </label>
            <input
              type="number"
              name="periodicity"
              min={5}
              max={300}
              value={form.periodicity}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              Badge label
            </label>
            <input
              name="badge_label"
              value={form.badge_label}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Optional badge label"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={handleChange}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Projects
            </label>

            <div className="space-y-2 rounded-lg border border-gray-300 p-3">
              {projects.map((project) => (
                <label
                  key={project._id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={form.selectedProjects.includes(project._id)}
                    onChange={() => toggleProject(project._id)}
                  />
                  {project.label}
                </label>
              ))}
            </div>

            {form.selectedProjects.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Primary project:{" "}
                {
                  projects.find((p) => p._id === form.selectedProjects[0])
                    ?.label
                }
              </p>
            )}
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
                  required
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
                  required
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
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="check_status"
                  name="check_status"
                  type="checkbox"
                  checked={form.check_status}
                  onChange={handleChange}
                />
                <label htmlFor="check_status" className="text-sm text-gray-700">
                  Check status code
                </label>
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
              onClick={() => router.push("/monitor")}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 shadow-sm"
            >
              Create Monitor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
