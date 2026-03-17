"use client";

import { useState } from "react";

export interface ProjectInput {
  label: string;
  description: string;
  tags: string[];
}

export default function AddProjectModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<ProjectInput>({
    label: "",
    description: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");

  if (!open) return null;

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
    if (!tagInput.trim()) return;

    if (!form.tags.includes(tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, tagInput.trim()],
      });
    }

    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm({
      ...form,
      tags: form.tags.filter((t) => t !== tag),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    onCreated();
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 border border-gray-200">
        <h2 className="text-lg font-semibold mb-6">Create Project</h2>

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
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 outline-none"
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
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Tags
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-blue-200 text-blue-900
                             text-xs font-semibold px-2 py-1 rounded-md"
                >
                  {tag}

                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
