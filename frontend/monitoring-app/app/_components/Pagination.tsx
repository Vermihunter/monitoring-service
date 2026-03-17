"use client";

import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  totalPages: number;
};

export default function Pagination({ totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 pt-4">
      <button
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1;

        return (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 border rounded ${
              p === page ? "bg-blue-600 text-white" : ""
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => goToPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
