import { Suspense } from "react";
import { Globe } from "@/components/ui/globe";

function GlobeSkeleton() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center">
      {/* Main skeleton circle with theme-aware background */}
      <div className="size-[80%] rounded-full bg-muted/50 dark:bg-zinc-800/50 animate-pulse" />
      {/* Inner glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-[60%] rounded-full bg-muted/30 dark:bg-zinc-700/30 animate-pulse" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="size-[40%] rounded-full bg-muted/20 dark:bg-zinc-600/20 animate-pulse" />
      </div>
    </div>
  );
}

export default function RightSection() {
  return (
    <div className="relative w-full h-full bg-transparent">
      <Suspense fallback={<GlobeSkeleton />}>
        <Globe />
      </Suspense>
    </div>
  );
}

