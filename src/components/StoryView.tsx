"use client";

import { GitStoryData } from "@/types";
import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import IntroSlide from "./slides/IntroSlide";
import StatsSlide from "./slides/StatsSlide";
import LanguagesSlide from "./slides/LanguagesSlide";
import ReposSlide from "./slides/ReposSlide";
import OutroSlide from "./slides/OutroSlide";
import ProductivitySlide from "./slides/ProductivitySlide";
import VelocitySlide from "./slides/VelocitySlide";
import CompositionSlide from "./slides/CompositionSlide";
import TopicsSlide from "./slides/TopicsSlide";
import CommunitySlide from "./slides/CommunitySlide";
import ArchetypeSlide from "./slides/ArchetypeSlide";
import StreakSlide from "./slides/StreakSlide";
import { Button } from "./ui/button";
import { AnimatedThemeToggler } from "./custom/animated-theme-toggler";
import { Skeleton } from "./ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface StoryViewProps {
  data: GitStoryData;
}

const SLIDE_DURATION = 10 * 1000; // 10 seconds per slide

const slides = [
  { id: "intro", component: IntroSlide },
  { id: "stats", component: StatsSlide },
  { id: "streak", component: StreakSlide },
  { id: "heatmap", component: CompositionSlide },
  { id: "productivity", component: ProductivitySlide },
  { id: "velocity", component: VelocitySlide },
  { id: "languages", component: LanguagesSlide },
  { id: "topics", component: TopicsSlide },
  { id: "repos", component: ReposSlide },
  { id: "community", component: CommunitySlide },
  { id: "archetype", component: ArchetypeSlide },
  { id: "outro", component: OutroSlide },
];

export default function StoryView({ data }: StoryViewProps) {
  const isMobile = useIsMobile();
  const [slideParam, setSlideParam] = useQueryState(
    "slide",
    parseAsString.withDefault("intro")
  );
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  // Find the current index based on the slide param
  const currentIndex = useMemo(() => {
    const index = slides.findIndex((slide) => slide.id === slideParam);
    return index >= 0 ? index : 0;
  }, [slideParam]);

  // Update the URL when changing slides
  const setCurrentIndex = useCallback(
    (indexOrUpdater: number | ((prev: number) => number)) => {
      const newIndex =
        typeof indexOrUpdater === "function"
          ? indexOrUpdater(currentIndex)
          : indexOrUpdater;
      const slideId = slides[newIndex]?.id ?? "intro";
      setSlideParam(slideId);
    },
    [currentIndex, setSlideParam]
  );

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // End of story
      // Maybe show replay or exit?
      // For now, let's just loop or stay on last slide
    }
  }, [currentIndex, setCurrentIndex]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, setCurrentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, nextSlide]);

  const CurrentSlideComponent = slides[currentIndex].component;

  return (
    <div className="relative w-full h-[100dvh] mx-auto bg-background shadow-2xl overflow-hidden text-foreground">
      {/* Progress Bars */}
      <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 z-50 flex gap-1.5 h-1 mix-blend-difference">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-1 bg-white/30 rounded-full overflow-hidden h-full"
          >
            <motion.div
              key={index === currentIndex ? `${slide.id}-${currentIndex}` : slide.id}
              className="h-full bg-white"
              initial={{ width: index < currentIndex ? "100%" : "0%" }}
              animate={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                      ? "100%"
                      : "0%",
              }}
              transition={
                index === currentIndex && !isPaused
                  ? { duration: SLIDE_DURATION / 1000, ease: "linear" }
                  : { duration: 0 }
              }
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <Button
        variant="outline"
        size={isMobile ? "icon" : "sm"}
        className={cn(
          "absolute top-8 left-4 z-50 bg-background/20 backdrop-blur-md border-white/10 hover:bg-background/40"
        )}
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> <span className="hidden md:inline">Exit</span>
      </Button>

      {/* Animated Theme Toggle Button */}
      <Suspense fallback={<Skeleton />}>
        <AnimatedThemeToggler className="absolute top-8 right-4 z-50" />
      </Suspense>

      {/* Slide Content */}
      <div
        className="w-full h-full"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <CurrentSlideComponent data={data} isActive={currentIndex === currentIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Areas */}
      {/* Previous Slide Trigger */}
      {currentIndex > 0 && (
        <div
          className="absolute inset-y-0 left-0 w-[15%] md:w-[10%] z-40 outline-none focus:outline-none flex items-center justify-start group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          {/* Mobile indicator (faint line) */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-1 bg-foreground/10 rounded-full md:hidden opacity-0 group-active:opacity-100 transition-opacity" />

          <button
            className="ml-4 p-2 rounded-full bg-background/20 hover:bg-foreground/10 backdrop-blur-md text-foreground/50 hover:text-foreground transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={32} />
          </button>
        </div>
      )}

      {/* Next Slide Trigger */}
      {currentIndex < slides.length - 1 && (
        <div
          className="absolute inset-y-0 right-0 w-[15%] md:w-[10%] z-40 outline-none focus:outline-none flex items-center justify-end group cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          {/* Mobile indicator (faint line) */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-1 bg-foreground/10 rounded-full md:hidden opacity-0 group-active:opacity-100 transition-opacity" />

          <button
            className="mr-4 p-2 rounded-full bg-background/20 hover:bg-foreground/10 backdrop-blur-md text-foreground/50 hover:text-foreground transition-all opacity-0 group-hover:opacity-100 hidden md:block"
            aria-label="Next Slide"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
