"use client";

export default function ToggleBadge({
  active,
  onToggle,
  loading,
}: {
  active: boolean;
  loading?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      className={`
        rounded-full px-3 py-1 text-xs font-semibold transition
        ${
          active
            ? "bg-green-200 text-green-900 hover:bg-green-300"
            : "bg-red-200 text-red-900 hover:bg-red-300"
        }
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}
