"use client";

import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRef, useCallback, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import confetti from "canvas-confetti";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function OutroSlide({ data, isActive }: SlideProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (isActive) {
            // Check window width directly for reliable mobile detection
            const isMobileView = window.innerWidth < 768;

            if (isMobileView) {
                // Realistic Look for Mobile
                const count = 70;
                const defaults = {
                    origin: { y: 0.7 },
                    colors: ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]
                };

                const fire = (particleRatio: number, opts: confetti.Options) => {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio)
                    });
                };

                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            } else {
                // School Pride for Desktop
                const end = Date.now() + 3 * 1000; // 3 seconds
                const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

                (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0, y: 0.8 },
                        colors: colors,
                    });
                    confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1, y: 0.8 },
                        colors: colors,
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }
        }
    }, [isActive]);

    const handleDownload = useCallback(async () => {
        if (cardRef.current && !isDownloading) {
            setIsDownloading(true);
            try {
                const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
                const link = document.createElement("a");
                link.download = `gitstory-${data.username}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error("Failed to download image", err);
            } finally {
                // Small delay to show completion state
                setTimeout(() => setIsDownloading(false), 500);
            }
        }
    }, [data.username, isDownloading]);

    const topLang = data.topLanguages && data.topLanguages.length > 0 ? data.topLanguages[0].name : "Polyglot";
    // Theme-aware barcode colors
    const barcodeColors = [
        "bg-foreground",
        "bg-foreground/50",
        "bg-foreground/80",
        "bg-foreground/30"
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-background text-foreground relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-primary/5 pointer-events-none" />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={isActive ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, type: "spring" }}
                className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md"
            >
                {/* The Card Snapshot */}
                <div
                    ref={cardRef}
                    className="w-full aspect-[4/5] bg-card text-card-foreground p-6 md:p-8 relative rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col justify-between transform scale-95 md:scale-100"
                >
                    <BorderBeam duration={8} size={100} />
                    {/* Card ambient glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="relative">
                            <div className="absolute inset-0 bg-foreground/10 rounded-full blur-md scale-110" />
                            <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-border bg-muted">
                                <AvatarImage src={data.avatarUrl} />
                                <AvatarFallback>{data.username[0]}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="text-right">
                            <h1 className="font-serif italic text-3xl md:text-4xl leading-none">GitStory</h1>
                            <p className="font-sans text-lg md:text-xl text-muted-foreground font-light tracking-wide">{new Date().getFullYear()}</p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-border my-4" />

                    {/* Main Stats */}
                    <div className="space-y-6 md:space-y-8">
                        {/* Starring */}
                        <div>
                            <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">Starring</p>
                            <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-tight">@{data.username}</h2>
                            <p className="font-serif italic text-xl md:text-2xl text-primary mt-1">{data.archetype}</p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                            <div>
                                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">Commits</p>
                                <p className="font-serif italic text-2xl md:text-3xl">{data.totalCommits.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">Top Lang</p>
                                <p className="font-serif italic text-2xl md:text-3xl capitalize">{topLang}</p>
                            </div>
                        </div>

                        {/* Magnum Opus */}
                        <div>
                            <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">Magnum Opus</p>
                            <p className="font-sans font-bold text-xl md:text-2xl truncate text-foreground">
                                {data.topRepo ? data.topRepo.name : "Top Secret Project"}
                            </p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-border mt-auto mb-6" />

                    {/* Footer */}
                    <div className="flex justify-between items-end">
                        {/* Barcode */}
                        <div className="flex items-end h-8 md:h-12 gap-0.5">
                            {Array.from({ length: 24 }).map((_, i) => {
                                const seed = (data.username || "user").charCodeAt(i % (data.username?.length || 4));
                                const height = (seed * (i + 1)) % 60 + 40;
                                return (
                                    <div
                                        key={i}
                                        className={`w-0.5 md:w-1 ${barcodeColors[i % barcodeColors.length]}`}
                                        style={{ height: `${height}%` }}
                                    />
                                );
                            })}
                        </div>
                        <div className="text-right">
                            <p className="font-sans text-[8px] md:text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Written & Directed by You</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 w-full">
                    <Button
                        variant="default"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="px-6 min-w-[180px] transition-all"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="size-4" />
                                Download Snapshot
                            </>
                        )}
                    </Button>

                    <Link href="/" >
                        <Button variant="outline" className="px-6">
                            <RefreshCw className="size-4" />
                            Create Another
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
