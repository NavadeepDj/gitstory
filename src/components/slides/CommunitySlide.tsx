import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Users, UserPlus, Star, Heart } from "lucide-react";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function CommunitySlide({ data, isActive }: SlideProps) {
    const stats = [
        {
            label: "Followers",
            value: data.community.followers,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Following",
            value: data.community.following,
            icon: UserPlus,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "Stars Earned",
            value: data.community.totalStars,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-background text-foreground relative overflow-hidden">
            {/* Dynamic Orbs */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={isActive ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-8 p-4 bg-red-500/10 rounded-full text-red-500 z-10"
            >
                <Heart size={48} fill="currentColor" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={isActive ? { opacity: 1, y: 0 } : {}}
                className="text-4xl font-bold mb-12 text-center z-10 font-serif"
            >
                Your Network Effect
            </motion.h2>

            <div className="grid grid-cols-1 gap-3 md:gap-4 w-full max-w-xs z-10 w-full px-4 md:px-0">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                        animate={isActive ? { x: 0, opacity: 1 } : {}}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        className={`flex items-center justify-between p-3 md:p-4 rounded-xl backdrop-blur-md border border-border ${stat.bg}`}
                    >
                        <div className="flex items-center gap-3 md:gap-4">
                            <stat.icon size={20} className={`md:w-6 md:h-6 ${stat.color}`} />
                            <span className="text-xs md:text-sm font-medium uppercase tracking-wider opacity-80">{stat.label}</span>
                        </div>
                        <span className="text-xl md:text-2xl font-bold font-mono">{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
                className="mt-12 text-center z-10"
            >
                <p className="text-muted-foreground">
                    "Open source: where strangers become collaborators."
                </p>
            </motion.div>
        </div>
    );
}
