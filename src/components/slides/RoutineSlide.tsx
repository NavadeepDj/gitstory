import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { BarChart, Bar, ResponsiveContainer, XAxis, Cell } from "recharts";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function RoutineSlide({ data, isActive }: SlideProps) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = days.map((day, index) => ({
        day,
        commits: data.weekdayStats[index]
    }));

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-background text-foreground relative overflow-hidden">

            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className="text-4xl font-bold mb-4 text-center z-10 font-serif"
            >
                Daily Pulse 📅
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-12 z-10"
            >
                Your most active day was <span className="font-bold text-primary">{data.busiestDay}</span>
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={isActive ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="w-full h-64 z-10"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="day"
                            stroke="var(--color-muted-foreground)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.day === data.busiestDay.substring(0, 3) ? 'var(--color-primary)' : 'var(--color-secondary)'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}
