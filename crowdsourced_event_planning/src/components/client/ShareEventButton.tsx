// ShareEventButton.tsx
"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ShareEventButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Check out this event!",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleShare}
      className="w-full cursor-pointer"
    >
      {" "}
      {copied ? "Link Copied!" : "Share Event"}
    </Button>
  );
}
