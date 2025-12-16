import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Code2, Hash, Terminal } from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function LanguagesSlide({ data, isActive }: SlideProps) {
    // Take top 5 languages for the chart to look fuller
    const languages = [...data.topLanguages]
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5)
        .map(lang => ({
            ...lang,
            fill: lang.color
        }));

    const topLanguage = languages[0];

    // Aggregate topics from top repos
    const allTopics = data.topRepos.flatMap(repo => repo.topics);
    // Prioritize topics that are not languages? Or just unique ones.
    const uniqueTopics = Array.from(new Set(allTopics))
        .filter(t => !languages.some(l => l.name.toLowerCase() === t.toLowerCase())) // Filter out topic if it's a language name
        .slice(0, 10);

    const hasTopics = uniqueTopics.length > 2;

    // Get language quip
    const getLanguageQuip = () => {
        const topLang = languages[0]?.name;
        if (topLang === "TypeScript") return "Type Safety Artisan 🛡️";
        if (topLang === "JavaScript") return "The Web Weaver 💛";
        if (topLang === "Python") return "Elegance in Simplicity 🐍";
        if (topLang === "Rust") return "Fearless and Fast 🦀";
        if (topLang === "Go") return "Simplicity at Scale 🐹";
        if (topLang === "Java") return "Enterprise Architect ☕";
        if (topLang === "C++") return "Performance Alchemist ⚡";
        if (topLang === "HTML") return "Structure Sculptor 🏗️";
        if (topLang === "CSS") return "Pixel Perfectionist 🎨";
        return "Master of Many 🌍";
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-background text-foreground relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-primary/5 rounded-bl-[100px] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-tr-[100px] blur-3xl pointer-events-none" />

            {/* Content Container */}
            <div className="flex flex-col items-center w-full max-w-md gap-6 md:gap-8 z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center shrink-0"
                >
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Terminal size={18} className="text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Your Craft</h2>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{getLanguageQuip()}</p>
                </motion.div>

                {/* Chart Section */}
                <div className="relative w-full aspect-square max-h-[260px] md:max-h-[320px] shrink-0 flex items-center justify-center">
                    {isActive && (
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="35%"
                                outerRadius="90%"
                                barSize={18}
                                data={languages}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar
                                    background={{ fill: 'var(--secondary)', opacity: 0.1 }}
                                    dataKey="percentage"
                                    cornerRadius={12}
                                />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    )}

                    {/* Center Stats */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={isActive ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div
                            className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-xl ring-4 ring-opacity-10"
                            style={{ borderColor: `${topLanguage?.color}30`, boxShadow: `0 0 20px -5px ${topLanguage?.color}40` }}
                        >
                            <motion.span
                                initial={{ filter: "blur(10px)", opacity: 0 }}
                                animate={isActive ? { filter: "blur(0px)", opacity: 1 } : {}}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-2xl md:text-3xl font-bold"
                                style={{ color: topLanguage?.color }}
                            >
                                {topLanguage?.percentage}%
                            </motion.span>
                            <span className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1 text-center px-1 truncate w-full">
                                {topLanguage?.name}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Legend & Topics */}
                <div className="w-full flex flex-col items-center gap-4">
                    {/* Legend */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {languages.slice(1, 4).map((lang, index) => (
                            <motion.div
                                key={lang.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={isActive ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                                className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-secondary/30 border border-border/50 text-xs font-medium"
                            >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                                <span>{lang.name}</span>
                                <span className="text-muted-foreground">{lang.percentage}%</span>
                            </motion.div>
                        ))}
                        {languages.length > 4 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isActive ? { opacity: 1 } : {}}
                                transition={{ delay: 0.8 }}
                                className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground"
                            >
                                <span>+ {languages.length - 4} more</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Topics */}
                    <div className="w-full text-center">
                        <div className="flex items-center gap-2 mb-2 justify-center">
                            <Hash size={12} className="text-muted-foreground" />
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                                {hasTopics ? "Often Spotted In" : "Interests"}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                            {uniqueTopics.map((topic, index) => (
                                <motion.span
                                    key={topic}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={isActive ? { scale: 1, opacity: 1 } : {}}
                                    transition={{
                                        delay: 0.6 + (index * 0.05),
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                    className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-md bg-accent/50 text-accent-foreground text-[10px] md:text-[11px] font-medium border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-colors"
                                >
                                    #{topic}
                                </motion.span>
                            ))}
                            {!hasTopics && uniqueTopics.length === 0 && (
                                <span className="text-muted-foreground text-xs italic">
                                    Charting undiscovered territory... 🚀
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
