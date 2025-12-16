import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import {
    Flame,
    GitCommit,
    GitPullRequest,
    MessageSquare,
    Star,
    Users,
    AlertCircle,
    BookOpen,
    Trophy,
    Clock,
    Zap
} from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function StatsSlide({ data, isActive }: SlideProps) {
    const stats = [
        {
            label: "Total Commits",
            value: data.totalCommits,
            icon: GitCommit,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            className: "col-span-2 row-span-1 md:row-span-2", // Big hero card on desktop, smaller on mobile
            showGraph: true
        },
        {
            label: "Longest Streak",
            value: data.longestStreak,
            suffix: " Days",
            icon: Flame,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            className: "col-span-2 md:col-span-2 row-span-1" // Wide card for streak
        },
        {
            label: "Total PRs",
            value: data.contributionBreakdown.prs,
            icon: GitPullRequest,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            className: "col-span-1 row-span-1"
        },
        {
            label: "Code Reviews",
            value: data.contributionBreakdown.reviews,
            icon: MessageSquare,
            color: "text-pink-500",
            bg: "bg-pink-500/10",
            border: "border-pink-500/20",
            className: "col-span-1 row-span-1"
        },
        {
            label: "Issues Opened",
            value: data.contributionBreakdown.issues,
            icon: AlertCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            className: "col-span-1 row-span-1"
        },
        {
            label: "Stars Earned",
            value: data.community.totalStars,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            className: "col-span-1 row-span-1"
        },
        {
            label: "Total Followers",
            value: data.community.followers,
            icon: Users,
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            className: "col-span-1 row-span-1"
        },
        {
            label: "Public Repos",
            value: data.community.publicRepos,
            icon: BookOpen,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20",
            className: "col-span-1 row-span-1"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                bounce: 0.3,
                duration: 0.6
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 bg-background text-foreground relative overflow-hidden">

            {/* Background Effects */}
            <DotPattern className="opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] animate-pulse delay-700" />

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center z-10 mb-4 md:mb-10"
            >
                <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 tracking-tight">
                    Your Impact at a Glance
                </h2>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isActive ? "show" : "hidden"}
                className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-2 md:gap-4 w-full max-w-5xl z-10 p-2 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-none no-scrollbar"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        variants={itemVariants}
                        className={`
                            relative overflow-hidden rounded-2xl md:rounded-3xl border backdrop-blur-xl p-3 md:p-4
                            flex flex-col justify-between group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                            ${stat.bg} ${stat.border} ${stat.className}
                        `}
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Icon & Label */}
                        <div className="flex justify-between items-start mb-1 md:mb-2 relative z-10">
                            <div className={`p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-background/40 backdrop-blur-md shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-transform group-hover:rotate-6`}>
                                <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                            </div>
                            {stat.showGraph && (
                                <div className="text-[10px] md:text-xs font-medium px-2 py-0.5 md:py-1 rounded-full bg-background/30 backdrop-blur-sm border border-white/10 text-muted-foreground">
                                    All Time
                                </div>
                            )}
                        </div>

                        {/* Value */}
                        <div className="relative z-10 mt-1 md:mt-2">
                            <div className="flex items-baseline gap-0.5 md:gap-1 flex-wrap">
                                <span className={`text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter ${stat.color} brightness-110`}>
                                    {typeof stat.value === 'number' ? (
                                        <NumberTicker value={stat.value} />
                                    ) : (
                                        stat.value
                                    )}
                                </span>
                                {stat.suffix && (
                                    <span className="text-xs md:text-lg font-medium text-muted-foreground/80 mb-0.5 md:mb-1">{stat.suffix}</span>
                                )}
                            </div>
                            <p className="text-[10px] md:text-sm font-medium text-muted-foreground/70 uppercase tracking-widest mt-0.5 md:mt-1 truncate">
                                {stat.label}
                            </p>
                        </div>

                        {/* Decorative background icon for large cards */}
                        {stat.showGraph && (
                            <stat.icon className="absolute -bottom-6 -right-6 w-32 h-32 md:w-48 md:h-48 opacity-[0.03] rotate-12" />
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
