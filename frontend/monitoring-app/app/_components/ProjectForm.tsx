"use client";

import { useState } from "react";
import Project from "@/app/_types/project";

export default function ProjectForm({ project }: { project: Project }) {
  const [form, setForm] = useState(project);
  const [newTag, setNewTag] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function addTag() {
    if (!newTag.trim()) return;

    if (!form.tags.includes(newTag)) {
      setForm({
        ...form,
        tags: [...form.tags, newTag],
      });
    }

    setNewTag("");
  }

  function removeTag(tag: string) {
    setForm({
      ...form,
      tags: form.tags.filter((t) => t !== tag),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/projects/${project._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 w-full">
      <h2 className="text-lg font-semibold mb-6">Edit Project</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Tags
          </label>

          {/* existing tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-blue-200 text-blue-900 text-xs font-semibold px-2 py-1 rounded-md"
              >
                {tag}

                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-900 hover:text-red-600"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* add tag */}
          <div className="flex gap-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="New tag..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Monitors link */}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
          <div>
            <p className="text-sm font-medium text-gray-700">Linked Monitors</p>
            <p className="text-xs text-gray-500">
              Manage monitors belonging to this project
            </p>
          </div>

          <a
            href={`/projects/${project._id}/monitors`}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            View Monitors
          </a>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
