"use client";

import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Download,
  RefreshCw,
  Loader2,
  Star,
  Lock,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRef, useCallback, useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import confetti from "canvas-confetti";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/custom/icons";
import { siteConfig } from "@/lib/config";

interface SlideProps {
  data: GitStoryData;
  isActive: boolean;
}

export default function OutroSlide({ data, isActive }: SlideProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const shareUrl = `${siteConfig.url}/${data.username}`;
  const shareText = `Check out my GitHub Year in Review! 🚀 ${data.totalCommits.toLocaleString()} commits this year as "${
    data.archetype
  }" #GitStory #GitHub`;

  // Track when component has mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      // Check window width directly for reliable mobile detection
      const isMobileView = window.innerWidth < 768;

      if (isMobileView) {
        // Realistic Look for Mobile
        const count = 70;
        const defaults = {
          origin: { y: 0.7 },
          colors: ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"],
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
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
        })();
      }
    }
  }, [isActive]);

  const handleDownload = useCallback(async () => {
    if (cardRef.current && !isDownloading) {
      setIsDownloading(true);
      try {
        // skipFonts: true fixes Firefox font undefined error in html-to-image v1.11.13
        const dataUrl = await toPng(cardRef.current, {
          cacheBust: true,
          pixelRatio: 2,
          skipFonts: true,
        });

        // Convert data URL to blob for better cross-browser compatibility
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.download = `gitstory-${data.username}.png`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error("Failed to download image", err);
      } finally {
        // Small delay to show completion state
        setTimeout(() => setIsDownloading(false), 500);
      }
    }
  }, [data.username, isDownloading]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  }, [shareUrl]);

  // Native share with image support (for mobile/supported browsers)
  const handleNativeShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      // Generate the image
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
      });

      // Convert to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `gitstory-${data.username}.png`, {
        type: "image/png",
      });

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "My GitStory",
          text: shareText,
          url: shareUrl,
          files: [file],
        });
      } else if (navigator.share) {
        // Fallback to share without file
        await navigator.share({
          title: "My GitStory",
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback to copy link
        handleCopyLink();
      }
    } catch (err) {
      // User cancelled or error
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed", err);
      }
    }
  }, [data.username, shareText, shareUrl, handleCopyLink]);

  const handleShare = useCallback(
    (platform: string) => {
      // Use native share for mobile if available
      if (platform === "native") {
        handleNativeShare();
        return;
      }

      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedText = encodeURIComponent(shareText);

      const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
        whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      };

      if (shareUrls[platform]) {
        window.open(
          shareUrls[platform],
          "_blank",
          "noopener,noreferrer,width=600,height=400"
        );
      }
    },
    [shareUrl, shareText, handleNativeShare]
  );

  const topLang =
    data.topLanguages && data.topLanguages.length > 0
      ? data.topLanguages[0].name
      : "Polyglot";

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
          className="w-full aspect-[4/5] bg-card text-card-foreground p-6 md:p-8 pt-5 md:pt-6 relative rounded-3xl shadow-2xl border border-border flex flex-col justify-between scale-95 md:scale-100"
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
              <h1 className="font-serif italic text-3xl md:text-4xl leading-none">
                GitStory
              </h1>
              <p className="font-sans text-lg md:text-xl text-muted-foreground font-light tracking-wide">
                {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-border mt-1 mb-2" />

          {/* Main Stats */}
          <div className="space-y-4 md:space-y-6">
            {/* Starring */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">
                  Starring
                </p>
                <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-tight">
                  @{data.username}
                </h2>
                <p className="font-serif italic text-xl md:text-2xl text-green-600 dark:text-green-400 mt-1">
                  {data.archetype}
                </p>
              </div>

              <div>
                {data.joinedAt && (
                  <p className="font-sans text-[10px] md:text-xs text-muted-foreground italic">
                    Joined{" "}
                    {(() => {
                      const totalDays = Math.floor(
                        (new Date().getTime() -
                          new Date(data.joinedAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      );
                      const years = Math.floor(totalDays / 365);
                      const days = totalDays % 365;
                      if (years > 0) {
                        return `${years} Year${
                          years > 1 ? "s" : ""
                        }, ${days} Day${days !== 1 ? "s" : ""}`;
                      }
                      return `${days} Day${days !== 1 ? "s" : ""}`;
                    })()}{" "}
                    Ago
                  </p>
                )}
              </div>
            </div>

            {/* 2x2 Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Top-left: Commits */}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">
                  Commits
                </p>
                <p className="font-serif italic text-2xl md:text-3xl">
                  {data.totalCommits.toLocaleString()}
                </p>
              </div>
              {/* Top-right: Top Language */}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">
                  Top Language
                </p>
                <p className="font-serif italic text-2xl md:text-3xl capitalize">
                  {topLang}
                </p>
              </div>
              {/* Bottom-left: Top Project */}

              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground mb-1 uppercase">
                  Top Project
                </p>
                <div className="flex flex-col gap-1">
                  {data.topRepo ? (
                    <>
                      <p className="font-serif italic text-xl md:text-2xl truncate text-foreground leading-tight pr-2 -ml-1 pl-1">
                        {data.topRepo.name}
                      </p>
                      {data.topRepo.stars > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-full w-fit mt-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium">
                            {data.topRepo.stars.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground/60">
                      <Lock className="w-4 h-4" />
                      <p className="font-serif italic text-lg md:text-xl">
                        Top Secret
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Bottom-right: Activity */}
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  Activity
                </p>
                <div className="flex justify-start opacity-80 hover:opacity-100 transition-opacity">
                  {mounted && (
                    <ActivityCalendar
                      data={(() => {
                        const contributions = data.contributions || [];
                        // Show last 60 days for compact card view
                        return contributions.slice(-150).map((day) => ({
                          date: day.date,
                          count: day.count,
                          level:
                            day.count === 0
                              ? 0
                              : day.count < 3
                              ? 1
                              : day.count < 6
                              ? 2
                              : day.count < 10
                              ? 3
                              : 4,
                        }));
                      })()}
                      theme={{
                        light: [
                          "#ebedf0",
                          "#9be9a8",
                          "#40c463",
                          "#30a14e",
                          "#216e39",
                        ],
                        dark: [
                          "#161b22",
                          "#0e4429",
                          "#006d32",
                          "#26a641",
                          "#39d353",
                        ], // GitHub dark theme greens
                      }}
                      colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                      blockSize={4}
                      blockRadius={1}
                      blockMargin={2}
                      fontSize={0}
                      showWeekdayLabels={false}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border mt-auto my-3!" />

          {/* Footer */}
          <div className="flex justify-between items-end">
            {/* Velocity Graph - Real commit activity */}
            <div className="flex items-end h-8 md:h-10 gap-1">
              {(() => {
                // Aggregate into ~12 months for compact display
                const monthlyData: number[] = [];
                const velocityData = data.velocityData || [];
                const daysPerMonth = Math.ceil(velocityData.length / 12);
                for (let i = 0; i < velocityData.length; i += daysPerMonth) {
                  const monthCommits = velocityData
                    .slice(i, i + daysPerMonth)
                    .reduce((sum, d) => sum + d.commits, 0);
                  monthlyData.push(monthCommits);
                }
                const maxCommits = Math.max(...monthlyData, 1);

                return monthlyData.map((commits, i) => {
                  const height = Math.max(15, (commits / maxCommits) * 100);
                  const opacity =
                    commits > 0 ? 0.5 + (commits / maxCommits) * 0.5 : 0.2;
                  return (
                    <div
                      key={i}
                      className="w-1.5 md:w-2 rounded-t-sm bg-green-600 dark:bg-green-400"
                      style={{
                        height: `${height}%`,
                        opacity: opacity,
                      }}
                    />
                  );
                });
              })()}
            </div>
            <div className="text-right flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="GitStory"
                className="w-5 h-5 md:w-6 md:h-6"
              />
              <p className="font-sans text-[10px] md:text-xs tracking-wide text-muted-foreground">
                gitstory.sitestash.org
              </p>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-6">
                <Share2 className="size-4" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem
                onClick={() => handleShare("twitter")}
                className="cursor-pointer share-item"
                data-platform="twitter"
              >
                <Icons.xTwitter className="size-4" />X / Twitter
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("linkedin")}
                className="cursor-pointer share-item"
                data-platform="linkedin"
              >
                <Icons.linkedin className="size-4" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("facebook")}
                className="cursor-pointer share-item"
                data-platform="facebook"
              >
                <Icons.facebook className="size-4" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("reddit")}
                className="cursor-pointer share-item"
                data-platform="reddit"
              >
                <Icons.reddit className="size-4" />
                Reddit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleShare("whatsapp")}
                className="cursor-pointer share-item"
                data-platform="whatsapp"
              >
                <Icons.whatsapp className="size-4" />
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleShare("native")}
                className="cursor-pointer"
              >
                <Share2 className="size-4" />
                Share with Image
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCopyLink}
                className="cursor-pointer"
              >
                {copied ? (
                  <Check className="size-4 text-green-500" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/">
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
