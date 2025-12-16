"use client";

import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function CompositionSlide({ data, isActive }: SlideProps) {
    const { resolvedTheme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Transform data for calendar: needs to be { date: string, count: number, level: number }
    // react-activity-calendar automatically calculates level if not provided? 
    // Actually, explicit levels are better for control, but let's try auto first or map counts.

    // Using the raw contributions which are ISO strings "YYYY-MM-DD"
    const calendarData = data.contributions ? data.contributions.map(day => ({
        date: day.date,
        count: day.count,
        level: day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 6 ? 2 : day.count < 10 ? 3 : 4
    })) : [];

    // Filter for the last 6 months or significantly recent data to make it look like "Recent Activity"
    // or just show the whole year. The user image shows a grid.
    // Let's grab the last 5-6 months to fill the slide nicely without scrolling.

    // 150 days ~ 5 months, 217 days ~ 7+ months
    const daysToShow = isMobile ? 150 : 217;
    const recentData = calendarData.slice(-daysToShow);

    const explicitTheme: ThemeInput = {
        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'], // GitHub dark theme greens
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-background text-foreground relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-green-500/20 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className="z-10 text-center mb-8 md:mb-12"
            >
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2 md:mb-3 tracking-tight">
                    Every Day Counts
                </h2>
                <p className="text-lg md:text-2xl text-green-600 dark:text-green-400 font-mono">
                    <span className="font-bold">{data.totalCommits}</span> moments of creation
                </p>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="z-10 p-6 md:p-12 rounded-3xl bg-background border border-border shadow-2xl overflow-hidden overflow-x-auto max-w-full md:max-w-5xl"
            >
                <div className="min-w-fit">
                    <ActivityCalendar
                        data={recentData}
                        theme={explicitTheme}
                        colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                        blockSize={10} // Reduced base size, will rely on scaling or just smaller blocks
                        blockRadius={3}
                        blockMargin={3}
                        fontSize={12}
                        labels={{
                            months: [
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ],
                            weekdays: [
                                'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
                            ],
                            totalCount: '{{count}} contributions in {{year}}',
                            legend: {
                                less: 'Less',
                                more: 'More',
                            },
                        }}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
            >
                <p className="text-xs font-mono text-gray-500 tracking-[0.2em] uppercase">
                    YOUR YEAR IN GREEN
                </p>
            </motion.div>
        </div>
    );
}
