import { GitStoryData } from "@/types";
import { motion, useSpring, useTransform, animate } from "motion/react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useEffect, useState, useMemo, useRef } from "react";
import { Zap, Activity } from "lucide-react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function VelocitySlide({ data, isActive }: SlideProps) {
    const dailyData = data.velocityData;
    const totalCommits = data.totalCommits;

    // Aggregate data by week
    const weeklyData = useMemo(() => {
        if (!dailyData || dailyData.length === 0) return [];

        const weeks: { weekStart: string; commits: number; sortDate: Date }[] = [];
        let currentWeekStart = new Date(dailyData[0].date);
        let currentWeekCommits = 0;

        // Align to Sunday/Monday? Let's just chunk by 7 days for simplicity
        dailyData.forEach((day, index) => {
            currentWeekCommits += day.commits;
            if ((index + 1) % 7 === 0 || index === dailyData.length - 1) {
                weeks.push({
                    weekStart: currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    commits: currentWeekCommits,
                    sortDate: currentWeekStart
                });
                if (index < dailyData.length - 1) {
                    currentWeekStart = new Date(dailyData[index + 1].date);
                    currentWeekCommits = 0;
                }
            }
        });
        return weeks;
    }, [dailyData]);

    const maxWeeklyCommits = Math.max(...weeklyData.map(d => d.commits));
    const busiestWeek = weeklyData.find(d => d.commits === maxWeeklyCommits);

    // Counter animation
    const count = useSpring(0, { duration: 2500, bounce: 0 });
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const countRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive) {
            const controls = animate(count, totalCommits, { duration: 2.5, ease: "circOut" });
            return controls.stop;
        }
    }, [isActive, totalCommits, count]);

    useEffect(() => {
        const unsubscribe = rounded.on("change", (latest) => {
            if (countRef.current) {
                countRef.current.textContent = String(latest);
            }
        });
        return unsubscribe;
    }, [rounded]);

    return (
        <div className="flex flex-col h-full w-full bg-background text-foreground relative overflow-hidden font-sans selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(6,182,212,0.1),_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(168,85,247,0.05),_transparent_40%)]" />
            <DotPattern className="opacity-30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)] fill-foreground/20" />

            {/* Content Container */}
            <div className="flex-1 flex flex-col items-center relative z-10 pt-20 md:pt-24 pb-12 md:pb-16 px-6 md:px-16 w-full max-w-6xl mx-auto h-full justify-between">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center w-full flex justify-between items-start"
                >
                    <div className="flex flex-col items-start gap-1 md:gap-2">
                        <div className="inline-flex items-center gap-2 px-2 md:px-3 py-1 rounded-full border border-border/50 bg-foreground/5 backdrop-blur-sm shadow-sm">
                            <Activity className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                            <span className="text-[10px] md:text-xs font-medium text-foreground/80 tracking-wide uppercase">Momentum</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black font-sans tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
                            Code Frequency
                        </h2>
                    </div>

                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Year Total</div>
                        <div ref={countRef} className="text-5xl font-black text-cyan-500 tabular-nums tracking-tighter">0</div>
                    </div>
                </motion.div>

                {/* Main Visualization: The Equalizer */}
                {/* Main Visualization: The Equalizer */}
                <div className="w-full flex-1 relative min-h-0 mt-4 md:mt-8">
                    {/* Floating Stats centered */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20 bg-background/30 backdrop-blur-sm p-4 rounded-3xl border border-white/5 shadow-2xl"
                    >
                        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mb-1">Weekly Max</p>
                        <p className="text-4xl md:text-5xl font-black text-foreground drop-shadow-lg">{maxWeeklyCommits} <span className="text-lg md:text-xl font-medium text-muted-foreground">commits</span></p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Week of {busiestWeek?.weekStart}</p>
                    </motion.div>

                    {/* Chart Container - Absolute to prevent layout thrashing */}
                    <div className="absolute inset-0 bottom-8">
                        <motion.div
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={isActive ? { opacity: 1, scaleY: 1 } : {}}
                            transition={{ delay: 0.4, duration: 0.8, ease: "backOut" }}
                            className="w-full h-full relative"
                            style={{ transformOrigin: "bottom" }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} barGap={2} barCategoryGap="20%" margin={{ top: 120 }}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22d3ee" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                        <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#ffffff" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        cursor={{ fill: 'var(--foreground)', opacity: 0.05 }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-popover/90 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl">
                                                        <p className="text-xs text-muted-foreground font-bold mb-1">{payload[0].payload.weekStart}</p>
                                                        <p className="text-lg font-bold text-cyan-400">
                                                            {payload[0].value} <span className="text-sm text-foreground">commits</span>
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="commits" animationDuration={1500} radius={[4, 4, 0, 0]}>
                                        {weeklyData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.commits === maxWeeklyCommits ? "url(#barGradientHover)" : "url(#barGradient)"}
                                                opacity={0.8}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Reflection Effect - positioned below the chart */}
                            <div
                                className="absolute left-0 w-full h-[30%] opacity-[0.15] blur-[2px] pointer-events-none"
                                style={{
                                    top: '100%',
                                    transform: 'scaleY(-1)',
                                    transformOrigin: 'top',
                                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={weeklyData} barGap={2} barCategoryGap="20%" margin={{ top: 120 }}>
                                        <Bar dataKey="commits" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="w-full flex justify-between items-end border-t border-border/30 pt-4"
                >
                    <div className="text-xs text-muted-foreground uppercase tracking-widest">
                        Consistency is Your Superpower
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">Active Weeks</div>
                            <div className="text-lg font-bold text-foreground">{weeklyData.filter(w => w.commits > 0).length}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground">Weekly Avg</div>
                            <div className="text-lg font-bold text-foreground">{Math.round(totalCommits / weeklyData.length)}</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
