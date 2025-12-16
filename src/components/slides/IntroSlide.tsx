import { GitStoryData } from "@/types";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import { Meteors } from "@/components/ui/meteors";
import { RetroGrid } from "@/components/ui/retro-grid";
import { HyperText } from "@/components/ui/hyper-text";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { WordRotate } from "@/components/ui/word-rotate";

interface SlideProps {
    data: GitStoryData;
    isActive: boolean;
}

export default function IntroSlide({ data, isActive }: SlideProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background text-foreground relative overflow-hidden">
            {/* Magic Background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-black z-0" /> */}
            <RetroGrid />
            <Meteors number={30} className="bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-[5]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-0" />

            {/* Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-40 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full opacity-40 animate-pulse" style={{ animationDelay: "2s" }} />

            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={isActive ? { scale: 1, opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
                className="mb-12 relative z-10"
            >
                {/* Avatar Container with Border Beam */}
                <div className="relative rounded-full p-1 overflow-hidden">
                    <BorderBeam size={200} duration={8} delay={9} borderWidth={2} colorFrom="#ffaa40" colorTo="#9c40ff" />
                    <Avatar className="w-32 h-32 md:w-48 md:h-48 border-[4px] md:border-[6px] border-background shadow-2xl relative z-10">
                        <AvatarImage src={data.avatarUrl} alt={data.username} className="object-cover" />
                        <AvatarFallback className="text-4xl">{data.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Floating Badge */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isActive ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-foreground text-background text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg border-2 border-background z-20"
                >
                    WRAPPED
                </motion.div>
            </motion.div>

            <motion.div
                className="z-10 flex flex-col items-center"
                initial={{ y: 20, opacity: 0 }}
                animate={isActive ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="opacity-50 text-lg md:text-xl font-light">@</span>
                    <HyperText
                        className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600"
                        duration={1500}
                    >
                        {data.username}
                    </HyperText>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={isActive ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="z-10 h-8 md:h-12 overflow-hidden flex items-center justify-center mt-4"
            >
                <WordRotate
                    words={["365 Days of Creation", "Millions of Keystrokes", "One Epic Story"]}
                    className="text-lg md:text-xl text-muted-foreground font-mono tracking-[0.2em] uppercase"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-16 z-[60] flex flex-col items-center gap-2 pointer-events-auto"
            >
                <button
                    className="flex items-center justify-center px-4 py-2 bg-white/5 border-2 border-white/20 rounded-full backdrop-blur-xl cursor-pointer hover:scale-105 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Simulate click on the right side to go to next slide
                        const rightNav = document.querySelector('[aria-label="Next Slide"]') as HTMLElement;
                        rightNav?.click();
                    }}
                >
                    <AnimatedShinyText className="inline-flex items-center justify-center text-base font-medium">
                        <span>Begin Your Story →</span>
                    </AnimatedShinyText>
                </button>
            </motion.div>
        </div>
    );
}
