"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

type Props = {
  totalPages: number;
};

type PageItem = number | string;

function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1,
): PageItem[] {
  const pages = new Set<number>();

  // First pages
  for (let i = 1; i <= boundaryCount; i++) {
    pages.add(i);
  }

  // Last pages
  for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
    pages.add(i);
  }

  // Pages around current page
  for (
    let i = currentPage - siblingCount;
    i <= currentPage + siblingCount;
    i++
  ) {
    pages.add(i);
  }

  const sortedPages = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];

  for (let i = 0; i < sortedPages.length; i++) {
    const page = sortedPages[i];
    const previousPage = sortedPages[i - 1];

    if (i > 0) {
      const gap = page - previousPage;

      if (gap === 2) {
        items.push(previousPage + 1);
      } else if (gap > 2) {
        items.push(`dots-${previousPage}-${page}`);
      }
    }

    items.push(page);
  }

  return items;
}

export default function Pagination({ totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const rawPage = Number(searchParams.get("page") ?? 1);

  const page = Number.isFinite(rawPage)
    ? Math.min(Math.max(rawPage, 1), totalPages)
    : 1;

  const goToPage = (p: number) => {
    const nextPage = Math.min(Math.max(p, 1), totalPages);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="flex justify-center gap-2 pt-4">
      <button
        disabled={page === 1}
        onClick={() => goToPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {pageItems.map((item) => {
        if (typeof item === "string") {
          return (
            <span
              key={item}
              className="px-3 py-1 border rounded text-gray-500 select-none"
            >
              …
            </span>
          );
        }

        return (
          <button
            key={item}
            onClick={() => goToPage(item)}
            className={`px-3 py-1 border rounded ${
              item === page ? "bg-blue-600 text-white" : ""
            }`}
          >
            {item}
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
