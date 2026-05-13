"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start opacity-0 animate-fade-in">
      <div className="bg-accent-muted border border-accent-border rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full bg-accent animate-dot-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent animate-dot-bounce"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-accent animate-dot-bounce"
          style={{ animationDelay: "400ms" }}
        />
      </div>
    </div>
  );
}
