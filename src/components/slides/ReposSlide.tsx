import { GitStoryData, Repository } from "@/types";
import { motion } from "motion/react";
import { Book, Star, ExternalLink } from "lucide-react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function ReposSlide({ data, isActive }: SlideProps) {
    const repos = data.topRepos.slice(0, 3);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-background text-foreground relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-gradient-to-bl from-primary/10 to-transparent blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-50%] w-full h-full bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col w-full max-w-5xl z-10 gap-6 md:gap-8">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    className="text-3xl md:text-5xl font-bold text-center font-serif tracking-tight"
                >
                    Your Masterpieces 🏆
                </motion.h2>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isActive ? "show" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                    {repos.map((repo, index) => (
                        <motion.div
                            key={repo.name}
                            variants={itemVariants}
                            className="group relative h-full"
                        >
                            {/* Shine border effect */}
                            <div
                                className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                                aria-hidden="true"
                            />

                            {/* Card content */}
                            <div className="relative bg-card border border-border/50 p-4 md:p-5 rounded-xl h-full flex flex-col transition-all duration-300 group-hover:border-transparent">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-base md:text-lg truncate flex items-center gap-2 text-foreground group-hover:text-primary transition-colors flex-1 min-w-0">
                                        <Book size={16} className="text-primary shrink-0" />
                                        <span className="truncate">{repo.name}</span>
                                    </h3>
                                    <div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400 shrink-0 ml-2">
                                        <Star size={13} fill="currentColor" />
                                        <span className="text-xs font-mono font-medium">{repo.stars}</span>
                                    </div>
                                </div>

                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 md:line-clamp-4 leading-relaxed flex-grow mb-3">
                                    {repo.description || "A project that speaks through its code."}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted-foreground/80 mt-auto pt-2 border-t border-border/30">
                                    <span className="flex items-center gap-1.5 rounded-full">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>
                                        {repo.language}
                                    </span>
                                    {repo.url && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                            <span className="text-[10px] font-medium uppercase tracking-wider">Visit</span>
                                            <ExternalLink size={12} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {repos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isActive ? { opacity: 1 } : {}}
                        className="text-center py-10"
                    >
                        <p className="text-muted-foreground">No repositories discovered yet.</p>
                        <p className="text-sm text-muted-foreground/70 mt-2">Every masterpiece starts with a blank canvas 🎨</p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="text-center"
                >
                    <p className="text-xs md:text-sm text-muted-foreground italic tracking-wide">
                        {repos.length > 0 ? "Great code is never finished, only released." : ""}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
