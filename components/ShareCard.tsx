"use client";

import { Share2 } from "lucide-react";
import { Button } from "./ui/button";

interface ShareCardProps {
  patternName: string;
  previewLine: string;
}

export default function ShareCard({
  patternName,
  previewLine,
}: ShareCardProps) {
  const handleShare = async () => {
    const shareText = `My relationship pattern: "${patternName}"\n\n"${previewLine}"\n\nDiscover yours at authrelo.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AuthRelo — My Pattern",
          text: shareText,
          url: "https://authrelo.com",
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="w-full gap-2"
    >
      <Share2 className="w-4 h-4" />
      Share your pattern
    </Button>
  );
}
