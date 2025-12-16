import { Suspense } from "react";
import { Globe } from "@/components/ui/globe";
import { Skeleton } from "@/components/ui/skeleton";

function GlobeSkeleton() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[600px] flex items-center justify-center">
      <Skeleton className="size-[80%] rounded-full" />
      {/* Inner glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="size-[60%] rounded-full opacity-50" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="size-[40%] rounded-full opacity-30" />
      </div>
    </div>
  );
}

export default function RightSection() {
  return (
    <div className="relative w-full h-full">
      <Suspense fallback={<GlobeSkeleton />}>
        <Globe />
      </Suspense>
    </div>
  );
}
