"use client";

import { useState } from "react";
import { Info, Sparkles, Share2, Palette, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";

const features = [
    {
        icon: Sparkles,
        title: "Cinematic Experience",
        description: "Your year in code, presented as an immersive story with stunning animations.",
    },
    {
        icon: Share2,
        title: "Shareable Snapshots",
        description: "Download your personalized story card and share it on social media.",
    },
    {
        icon: Palette,
        title: "Dynamic OG Images",
        description: "Social previews are auto-generated when you share your story link.",
    },
    {
        icon: Zap,
        title: "Real-time Stats",
        description: "Commits, streaks, languages, repos — all pulled fresh from GitHub.",
    },
];

export function InfoDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="About GitStory"
                >
                    <Info className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">About GitStory</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <span className="font-serif italic">GitStory</span>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {new Date().getFullYear()}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        Every commit tells a story. Transform your GitHub journey into a cinematic masterpiece.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                <feature.icon className="size-4" />
                            </div>
                            <div>
                                <h3 className="font-medium text-sm">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Open source & free forever
                    </p>
                    <a
                        href="https://github.com/vishkx/gitstory"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                        <Github className="size-3" />
                        View on GitHub
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}
