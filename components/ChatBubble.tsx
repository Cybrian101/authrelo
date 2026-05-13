"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/types";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.type === "ai";
  const isMicroReflect = message.type === "micro-reflect";

  if (isMicroReflect) {
    return (
      <div className="flex justify-start opacity-0 animate-fade-in-up px-2">
        <p className="text-sm italic text-accent/70 leading-relaxed max-w-[85%] py-2">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex opacity-0 animate-fade-in-up",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] px-4 py-3 text-[15px] leading-relaxed",
          isAI
            ? "bg-accent-muted border border-accent-border rounded-2xl rounded-tl-md text-text-primary"
            : "bg-bg-card border border-border rounded-2xl rounded-tr-md text-text-primary"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
