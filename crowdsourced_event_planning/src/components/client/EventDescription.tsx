"use client";
import { useState } from "react";

interface Props {
  description: string;
}

export default function EventDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);

  // Cek panjang deskripsi (5 baris atau 400 karakter)
  const isLong = description.split("\n").length > 5 || description.length > 400;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">Description</h3>
      <div>
        <div
          className={`text-gray-700 whitespace-pre-line ${
            isLong && !expanded ? "line-clamp-5" : ""
          }`}
          style={
            isLong && !expanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }
              : {}
          }
        >
          {description}
        </div>
        {isLong && (
          <button
            className="text-blue-600 hover:text-blue-700 mt-2 cursor-pointer"
            onClick={() => setExpanded((prev) => !prev)}
            type="button"
          >
            {expanded ? "Show Less" : "View more"}
          </button>
        )}
      </div>
    </div>
  );
}
