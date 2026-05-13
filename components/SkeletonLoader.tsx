"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-card bg-bg-card",
        className
      )}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-dvh bg-bg-primary p-5">
      <div className="w-full max-w-mobile mx-auto space-y-6">
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="h-dvh bg-bg-primary flex flex-col max-w-mobile mx-auto">
      <div className="px-4 pt-4 pb-3 space-y-3 border-b border-border">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
      <div className="flex-1 px-4 py-4 space-y-4">
        <div className="flex justify-start">
          <Skeleton className="h-20 w-[75%] rounded-2xl" />
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <Skeleton className="h-11 w-full rounded-input" />
      </div>
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="min-h-dvh bg-bg-primary pb-safe">
      <div className="w-full max-w-mobile mx-auto px-5 py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
