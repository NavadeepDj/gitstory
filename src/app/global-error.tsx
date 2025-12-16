"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-black text-white">
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                    <div className="mb-8">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto text-red-500 mb-4"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-neutral-400 max-w-md mx-auto mb-6">
                            We encountered an unexpected error. Our team has been notified.
                        </p>
                        {error.digest && (
                            <p className="text-xs text-neutral-600 font-mono mb-4">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-white text-black font-medium rounded-full hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            className="px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:bg-white/10 transition-colors"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
