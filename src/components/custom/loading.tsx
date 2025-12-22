export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="relative">
                {/* Animated logo placeholder */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />

                {/* Spinner ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground font-mono tracking-widest uppercase animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}
