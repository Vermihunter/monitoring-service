"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteProjectButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = confirm("Delete this project?");
    if (!confirmed) return;

    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 transition"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
