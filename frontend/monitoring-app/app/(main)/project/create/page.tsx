"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateProjectForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    label: "",
    description: "",
    tags: [] as string[],
  });

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
    const tag = newTag.trim();

    if (!tag) return;

    if (!form.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setForm({
        ...form,
        tags: [...form.tags, tag],
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

    await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    toast.success("Project created successfully!");

    setTimeout(() => {
      router.push("/project");
    }, 1500);
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Create Project
        </h2>

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
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="My project"
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
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Describe the project"
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

            {/* tag input */}
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Type tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
