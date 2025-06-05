"use client";

import { ReactNode, useState } from "react";

interface ShowMoreSectionProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => ReactNode;
  maxShow?: number;
  emptyText?: string;
}

export default function ShowMoreSection<T>({
  items,
  renderItem,
  maxShow = 5,
  emptyText = "No data.",
}: ShowMoreSectionProps<T>) {
  const [showAll, setShowAll] = useState(false);

  if (!items.length) return <p className="p-4 text-gray-500">{emptyText}</p>;

  const displayItems = showAll ? items : items.slice(0, maxShow);

  return (
    <>
      {displayItems.map(renderItem)}
      {items.length > maxShow && (
        <div className="flex justify-center">
          {!showAll ? (
            <button
              className="w-full py-2 text-blue-600 hover:underline cursor-pointer border border-gray-100 rounded"
              onClick={() => setShowAll(true)}
            >
              View More
            </button>
          ) : (
            <button
              className="w-full py-2 text-blue-600 hover:underline cursor-pointer border border-gray-100 rounded"
              onClick={() => setShowAll(false)}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </>
  );
}
