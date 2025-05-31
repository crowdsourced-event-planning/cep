import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  padding = "md",
  onClick,
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 ${
        paddingClasses[padding]
      } ${className} ${
        onClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
