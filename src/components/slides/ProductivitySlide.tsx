import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Sun, Moon, Clock, Calendar, Flame } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell, Tooltip } from "recharts";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function ProductivitySlide({ data, isActive }: SlideProps) {
    const { productivity, busiestDay, weekdayStats, longestStreak } = data;

    // Determine icon based on time of day
    const TimeIcon = productivity.peakHour >= 6 && productivity.peakHour < 18 ? Sun : Moon;

    // Chart data
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = days.map((day, index) => ({
        day,
        commits: weekdayStats[index],
        isMax: day === busiestDay.substring(0, 3)
    }));

    // Find max for gradient calculation
    const maxCommits = Math.max(...weekdayStats);

    // Get persona badge
    const getPersonaBadge = () => {
        if (productivity.timeOfDay === "Late Night") return { emoji: "🦉", text: "Night Owl" };
        if (productivity.timeOfDay === "Morning") return { emoji: "🐦", text: "Early Bird" };
        if (productivity.timeOfDay === "Evening") return { emoji: "🌙", text: "Evening Coder" };
        return { emoji: "⚡", text: "Power Coder" };
    };

    const persona = getPersonaBadge();

    return (
        <div className="flex items-center justify-center h-full p-6 md:p-8 bg-background text-foreground overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)] opacity-5 blur-3xl pointer-events-none" />

            {/* Centered compact container */}
            <div className="flex flex-col w-full max-w-xl z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-5"
                >
                    <h2 className="text-2xl md:text-3xl font-bold font-serif italic tracking-tight">
                        Your Creative Rhythm
                    </h2>
                    <p className="text-muted-foreground text-xs mt-1">When inspiration strikes</p>
                </motion.div>

                {/* Metrics Grid - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 mb-4">
                    {/* Peak Time Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={isActive ? { y: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="bg-card/50 backdrop-blur-sm border border-border p-3 md:p-4 rounded-xl relative overflow-hidden flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start"
                    >
                        <div className="absolute right-2 top-2 opacity-10 hidden md:block">
                            <TimeIcon size={32} />
                        </div>
                        <div className="flex items-center gap-2 mb-0 md:mb-2">
                            <div className="p-1.5 bg-primary/20 rounded-lg">
                                <Clock size={14} className="text-primary" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Peak Time</span>
                        </div>
                        <div className="text-right md:text-left">
                            <p className="text-base md:text-xl font-bold">{productivity.timeOfDay}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground/70">~{productivity.peakHour}:00</p>
                        </div>
                    </motion.div>

                    {/* Busiest Day Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={isActive ? { y: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.3 }}
                        className="bg-card/50 backdrop-blur-sm border border-border p-3 md:p-4 rounded-xl relative overflow-hidden flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start"
                    >
                        <div className="absolute right-2 top-2 opacity-10 hidden md:block">
                            <Calendar size={32} />
                        </div>
                        <div className="flex items-center gap-2 mb-0 md:mb-2">
                            <div className="p-1.5 bg-secondary/50 rounded-lg">
                                <Calendar size={14} className="text-secondary-foreground" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Best Day</span>
                        </div>
                        <div className="text-right md:text-left">
                            <p className="text-base md:text-xl font-bold">{busiestDay}</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground/70">Most active</p>
                        </div>
                    </motion.div>

                    {/* Streak Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={isActive ? { y: 0, opacity: 1 } : {}}
                        transition={{ delay: 0.4 }}
                        className="bg-card/50 backdrop-blur-sm border border-border p-3 md:p-4 rounded-xl relative overflow-hidden flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start"
                    >
                        <div className="absolute right-2 top-2 opacity-10 hidden md:block">
                            <Flame size={32} />
                        </div>
                        <div className="flex items-center gap-2 mb-0 md:mb-2">
                            <div className="p-1.5 bg-orange-500/20 rounded-lg">
                                <Flame size={14} className="text-orange-500" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Streak</span>
                        </div>
                        <div className="text-right md:text-left">
                            <p className="text-base md:text-xl font-bold">{longestStreak} days</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground/70">Longest run</p>
                        </div>
                    </motion.div>
                </div>

                {/* Persona Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center mb-4 z-10"
                >
                    <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                        <span className="text-lg">{persona.emoji}</span>
                        <span className="text-sm font-medium text-accent-foreground">{persona.text}</span>
                    </div>
                </motion.div>

                {/* Weekly Activity Chart */}
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={isActive ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    style={{ transformOrigin: "bottom" }}
                    className="w-full h-[140px]"
                >
                    <p className="text-xs text-muted-foreground text-center mb-2 uppercase tracking-widest">Weekly Activity</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barCategoryGap="15%">
                            <defs>
                                <linearGradient id="barGradientProd" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" />
                                    <stop offset="100%" stopColor="var(--color-secondary)" />
                                </linearGradient>
                                <linearGradient id="barGradientMax" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="day"
                                stroke="var(--color-muted-foreground)"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={5}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--color-foreground)', opacity: 0.05 }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-popover/90 backdrop-blur-md border border-border px-3 py-2 rounded-lg shadow-xl">
                                                <p className="text-sm font-bold">
                                                    {payload[0].value} <span className="text-xs font-normal text-muted-foreground">commits</span>
                                                </p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="commits"
                                radius={[6, 6, 0, 0]}
                                animationDuration={1200}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isMax ? 'url(#barGradientMax)' : 'url(#barGradientProd)'}
                                        opacity={entry.isMax ? 1 : 0.7}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
