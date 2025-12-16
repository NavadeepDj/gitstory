export default function StoryLoading() {
    return (
        <main className="fixed inset-0 bg-black text-white overflow-hidden">
            <div className="flex flex-col items-center justify-center h-full">
                {/* Progress bar skeleton */}
                <div className="absolute top-4 left-4 right-4 flex gap-1.5 h-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-white/10 rounded-full overflow-hidden"
                        >
                            <div
                                className="h-full bg-white/30 animate-pulse"
                                style={{ animationDelay: `${i * 100}ms` }}
                            />
                        </div>
                    ))}
                </div>

                {/* Avatar skeleton */}
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/10 animate-pulse mb-8" />

                {/* Text skeletons */}
                <div className="w-48 h-8 bg-white/10 rounded-lg animate-pulse mb-4" />
                <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />

                {/* Loading text */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-white/40 font-mono tracking-widest uppercase">
                        Crafting your story...
                    </p>
                </div>
            </div>
        </main>
    );
}
