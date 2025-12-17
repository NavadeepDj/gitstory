import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sparkles } from "lucide-react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

// Archetype descriptions and emojis
// Must match the archetype names returned by calculateArchetype() in scoringAlgorithms.ts
const archetypeData: Record<string, { emoji: string; tagline: string; traits: string[] }> = {
    "The Collaboration Maestro": {
        emoji: "🤝",
        tagline: "Building bridges through pull requests",
        traits: ["Collaborative", "Communicative", "Team Player"]
    },
    "The Quality Guardian": {
        emoji: "🛡️",
        tagline: "Protecting codebases, one review at a time",
        traits: ["Meticulous", "Thorough", "Reliable"]
    },
    "The Midnight Architect": {
        emoji: "🦉",
        tagline: "When the world sleeps, you create",
        traits: ["Focused", "Independent", "Creative"]
    },
    "The Dawn Coder": {
        emoji: "🌅",
        tagline: "First light, first commit",
        traits: ["Disciplined", "Productive", "Organized"]
    },
    "The Passion Programmer": {
        emoji: "🔥",
        tagline: "Weekends are for side quests",
        traits: ["Passionate", "Dedicated", "Driven"]
    },
    "The Relentless Builder": {
        emoji: "🏗️",
        tagline: "Building the future, one commit at a time",
        traits: ["Prolific", "Unstoppable", "Visionary"]
    },
    "The Steady Craftsman": {
        emoji: "⚒️",
        tagline: "Consistency is your superpower",
        traits: ["Persistent", "Reliable", "Steady"]
    },
    "The Visionary Planner": {
        emoji: "🔮",
        tagline: "Seeing problems before they arise",
        traits: ["Strategic", "Thoughtful", "Proactive"]
    },
    "The Open Source Star": {
        emoji: "⭐",
        tagline: "Making the world a better place through code",
        traits: ["Influential", "Community-driven", "Impactful"]
    },
    "The Curious Explorer": {
        emoji: "🧭",
        tagline: "Every repository is a new adventure",
        traits: ["Curious", "Adventurous", "Versatile"]
    },
    // Default fallback
    "default": {
        emoji: "💻",
        tagline: "Code is your canvas",
        traits: ["Creative", "Dedicated", "Innovative"]
    }
};

export default function ArchetypeSlide({ data, isActive }: SlideProps) {
    const isMobile = useIsMobile();
    const { archetype, username } = data;

    // Get archetype info or fallback to default
    const archetypeInfo = archetypeData[archetype] || archetypeData["default"];

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 bg-background text-foreground relative overflow-hidden">
            {/* Animated background gradients */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)"
                    ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating particles effect - desktop only */}
            {!isMobile && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-primary/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="mb-4 md:mb-6"
                >
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative inline-flex items-center gap-2 px-6 py-2 bg-background/80 backdrop-blur-xl border border-white/10 rounded-full ring-1 ring-white/20">
                            <Sparkles className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                            <span className="text-xs md:text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase tracking-wider">
                                Your Developer Persona
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Large emoji */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                    animate={isActive ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                    transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
                    className="text-6xl md:text-9xl mb-4 md:mb-6"
                >
                    {archetypeInfo.emoji}
                </motion.div>

                {/* Archetype name */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                    className="text-4xl md:text-7xl font-black tracking-tight mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground"
                >
                    {archetype}
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-xl text-muted-foreground italic mb-6 md:mb-8"
                >
                    "{archetypeInfo.tagline}"
                </motion.p>

                {/* Traits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-2 md:gap-3"
                >
                    {archetypeInfo.traits.map((trait, index) => (
                        <motion.span
                            key={trait}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isActive ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="px-4 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full text-sm md:text-base font-medium"
                        >
                            {trait}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Username attribution */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="mt-8 md:mt-12 text-xs md:text-sm text-muted-foreground/60"
                >
                    Based on @{username}'s {data.year} coding patterns
                </motion.p>
            </div>
        </div>
    );
}
