import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Flame, Trophy, Zap, Calendar } from "lucide-react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function StreakSlide({ data, isActive }: SlideProps) {
    const isMobile = useIsMobile();
    const { longestStreak, totalCommits, contributions } = data;

    // Calculate current streak (consecutive days from today backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    // Filter to only include dates up to today, then sort descending
    const sortedContributions = [...contributions]
        .filter(c => new Date(c.date).getTime() <= today.getTime())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    for (const contribution of sortedContributions) {
        if (contribution.count > 0) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Calculate consistency (days with contributions / total days)
    const activeDays = contributions.filter(c => c.count > 0).length;
    const consistency = Math.round((activeDays / contributions.length) * 100);

    // Get streak tier
    const getStreakTier = (streak: number) => {
        if (streak >= 100) return { tier: "Legendary", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" };
        if (streak >= 50) return { tier: "Epic", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" };
        if (streak >= 30) return { tier: "Rare", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" };
        if (streak >= 14) return { tier: "Uncommon", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
        return { tier: "Common", color: "text-gray-400", bg: "bg-gray-500/20", border: "border-gray-500/30" };
    };

    const streakTier = getStreakTier(longestStreak);

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 bg-background text-foreground relative overflow-hidden">
            {/* Fire gradient background */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-1/2 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent blur-3xl" />

            {/* Animated fire particles - desktop only */}
            {!isMobile && isActive && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Particles />
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
                {/* Flame icon with glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 50 }}
                    animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative mb-2"
                >
                    <motion.div
                        animate={isActive && !isMobile ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative"
                    >
                        <Flame className="w-16 h-16 md:w-24 md:h-24 text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]" />
                        <div className="absolute inset-0 blur-xl bg-orange-500/30 -z-10" />
                    </motion.div>
                </motion.div>

                {/* Streak number - massive */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
                    className="flex items-start justify-center gap-2"
                >
                    <span className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-orange-400 via-orange-500 to-red-600">
                        {longestStreak}
                    </span>
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-2xl font-bold text-orange-400/80 mt-2 md:mt-8"
                    >
                        days
                    </motion.span>
                </motion.div>

                {/* Label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl font-medium text-muted-foreground mt-2"
                >
                    Longest Streak 🔥
                </motion.p>

                {/* Tier badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className={`mt-4 md:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border ${streakTier.bg} ${streakTier.border}`}
                >
                    <Trophy className={`w-4 h-4 ${streakTier.color}`} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${streakTier.color}`}>
                        {streakTier.tier} Streak
                    </span>
                </motion.div>

                {/* Additional stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-12 w-full"
                >
                    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Current</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">{currentStreak}</p>
                        <p className="text-xs text-muted-foreground">day streak</p>
                    </div>

                    <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Consistency</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-bold">{consistency}%</p>
                        <p className="text-xs text-muted-foreground">active days</p>
                    </div>
                </motion.div>

                {/* Motivational text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                    className="mt-6 md:mt-8 text-sm md:text-base text-muted-foreground/70 italic"
                >
                    {longestStreak >= 30
                        ? "Dedication beyond measure. You're unstoppable! 💪"
                        : longestStreak >= 14
                            ? "Building momentum, one day at a time 🚀"
                            : "Every streak starts with day one. Keep going! ✨"
                    }
                </motion.p>
            </div>
        </div>
    );
}

function Particles() {
    const [particles, setParticles] = useState<Array<{
        left: string;
        bg: string;
        y: number[];
        x: number[];
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {
        setParticles(
            [...Array(15)].map(() => ({
                left: `${30 + Math.random() * 40}%`,
                bg: `hsl(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`,
                y: [-20, -200 - Math.random() * 100],
                x: [0, (Math.random() - 0.5) * 50],
                duration: 2 + Math.random() * 1.5,
                delay: Math.random() * 2
            }))
        );
    }, []);

    return (
        <>
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: p.left,
                        bottom: "10%",
                        background: p.bg
                    }}
                    animate={{
                        y: p.y,
                        x: p.x,
                        opacity: [0.8, 0],
                        scale: [1, 0.3]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeOut"
                    }}
                />
            ))}
        </>
    );
}
