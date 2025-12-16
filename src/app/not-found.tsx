import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
            <div className="mb-8">
                <h1 className="text-8xl font-bold font-serif italic text-primary/20 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-2">Story Not Found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Perhaps this story is yet to be written?
                </p>
            </div>
            <Link
                href="/"
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:opacity-90 transition-opacity"
            >
                Write Your Story
            </Link>
        </div>
    );
}
