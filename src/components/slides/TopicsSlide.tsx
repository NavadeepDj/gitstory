import { GitStoryData } from "@/types";
import { motion } from "motion/react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function TopicsSlide({ data, isActive }: SlideProps) {
    // Aggregate topics from top repos
    // In a real app, we'd probably want this pre-calculated in the service
    // But for now we'll just grab unique topics from the top 5 repos
    const allTopics = data.topRepos.flatMap(repo => repo.topics);
    const uniqueTopics = Array.from(new Set(allTopics)).slice(0, 15); // Show top 15 unique topics

    // If no topics, maybe show top languages as "interests"
    const displayItems = uniqueTopics.length > 3 ? uniqueTopics : data.topLanguages.map(l => l.name).slice(0, 5);
    const title = uniqueTopics.length > 3 ? "What Drives You 🧠" : "Your Tech DNA 🎯";

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-background text-foreground relative overflow-hidden">

            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className="text-4xl font-bold mb-12 text-center z-10 font-serif"
            >
                {title}
            </motion.h2>

            <div className="flex flex-wrap justify-center gap-4 max-w-md z-10 content-center perspective-1000">
                {displayItems.map((topic, index) => {
                    // Randomize size slightly for "cloud" feel
                    const size = index % 3 === 0 ? "text-2xl" : index % 2 === 0 ? "text-xl" : "text-lg";
                    const weight = index % 3 === 0 ? "font-bold" : "font-medium";

                    return (
                        <motion.span
                            key={topic}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isActive ? { scale: 1, opacity: 1 } : {}}
                            transition={{
                                delay: index * 0.05 + 0.3,
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                            }}
                            className={`px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md ${size} ${weight}`}
                            style={{
                                transform: `rotate(${Math.random() * 10 - 5}deg)`
                            }}
                        >
                            #{topic}
                        </motion.span>
                    );
                })}
            </div>

            {displayItems.length === 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    className="text-muted-foreground text-center"
                >
                    Working on something secret... 🕵️
                </motion.p>
            )}
        </div>
    );
}
