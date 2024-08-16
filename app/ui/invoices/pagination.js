"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center space-x-2">
      <button
        className={clsx("p-2", currentPage === 1 && "cursor-not-allowed")}
        disabled={currentPage === 1}
        onClick={() => (currentPage > 1 ? window.location.href = createPageURL(currentPage - 1) : null)}
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={clsx(
            "px-3 py-1",
            page === currentPage && "font-bold text-blue-600"
          )}
          onClick={() => (window.location.href = createPageURL(page))}
        >
          {page}
        </button>
      ))}
      <button
        className={clsx(
          "p-2",
          currentPage === totalPages && "cursor-not-allowed"
        )}
        disabled={currentPage === totalPages}
        onClick={() => (currentPage < totalPages ? window.location.href = createPageURL(currentPage + 1) : null)}
      >
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
