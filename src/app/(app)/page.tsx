"use client";

import { Icons } from "@/components/custom/icons";
import RightSection from "@/components/RightSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/auth-context";
import { LogOut, Loader2, Wand } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const {
    user,
    provider,
    isLoading: authLoading,
    isAuthenticated,
    logout,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<{
    message: string;
    type: "rate_limit" | "not_found" | "auth" | "generic";
  } | null>(null);

  // Track when component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-fill username when authenticated via OAuth
  useEffect(() => {
    if (isAuthenticated && user?.login && !username) {
      setUsername(user.login);
    }
  }, [isAuthenticated, user?.login, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    // Navigate to story page - token is now handled via cookie, not URL
    router.push(`/${username}` as `/${string}`);
  };

  const handleConnectGitHub = () => {
    // Redirect to OAuth initiation endpoint
    window.location.href = "/api/auth/github";
  };

  const handleConnectGitLab = () => {
    // Redirect to GitLab OAuth initiation endpoint
    window.location.href = "/api/auth/gitlab";
  };

  const handleDisconnect = async () => {
    await logout();
    setUsername("");
  };

  // Get provider display info
  const getProviderInfo = () => {
    if (provider === "gitlab") {
      return { name: "GitLab", Icon: Icons.gitLab };
    }
    return { name: "GitHub", Icon: Icons.gitHub };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Icons.gitHub className="size-16! mx-auto mb-4" />
          <h1 className="text-5xl md:text-7xl font-serif italic mb-3 tracking-tight">
            GitStory
          </h1>
          <p className="text-muted-foreground font-sans tracking-widest text-sm uppercase">
            Every Commit Tells a Story
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <Input
                id="github-username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={
                  isAuthenticated && provider === "gitlab"
                    ? "Enter GitLab username"
                    : "Enter GitHub username"
                }
                className="px-6 py-6 text-lg! font-mono text-center placeholder:text-muted-foreground/70"
                autoFocus={!isAuthenticated}
                disabled={isAuthenticated}
                required
              />
            </Field>

            {/* OAuth Connect Section */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                {authLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center justify-evenly gap-2">
                      <Skeleton className="h-8 w-24 rounded-full" />
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                    <Separator orientation="vertical" className="my-1" />
                    <Skeleton className="h-3 w-32" />
                  </motion.div>
                ) : isAuthenticated && user ? (
                  <motion.div
                    key="authenticated"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="status-banner status-banner--success text-center w-full"
                  >
                    <Avatar className="size-5">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>
                        {user.login.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">
                      Connected to <strong>{getProviderInfo().name}</strong> as{" "}
                      <strong>@{user.login}</strong>
                    </span>
                    <Button
                      type="button"
                      onClick={handleDisconnect}
                      variant="ghost"
                      size="icon-sm"
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      title="Disconnect"
                    >
                      <LogOut size={14} />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unauthenticated"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center justify-evenly gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleConnectGitHub}
                        className="gap-2 rounded-full px-6"
                      >
                        <Icons.gitHub className="size-3.5" />
                        GitHub
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleConnectGitLab}
                        className="gap-2 rounded-full px-6"
                      >
                        <Icons.gitLab className="size-3.5" />
                        GitLab
                      </Button>
                    </div>
                    <Separator orientation="vertical" className="my-1" />
                    <p className="text-center text-xs text-muted-foreground/60">
                      Private repos & higher limits
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!username.trim()}
              className="w-full px-6! py-6! font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Generate Story{" "}
              <Wand className="size-4 group-hover:rotate-5 transition-transform" />
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-4 text-center text-xs text-muted-foreground font-mono">
          <p className="mt-2 opacity-70">
            Curious? Try &apos;demo&apos; to preview ✨
          </p>
        </div>

        {/* Featured Badges */}
        <div className="mt-6 flex flex-col items-center gap-3">
          {/* Product Hunt Badge - Top Center */}
          <a
            href="https://www.producthunt.com/products/gitstory-2?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-gitstory-2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src={`https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1051707&theme=${
                mounted && resolvedTheme === "light" ? "light" : "dark"
              }&period=daily`}
              alt="GitStory - Top Post on Product Hunt"
              className="w-[190px] sm:w-[220px] h-auto"
            />
          </a>

          {/* Other Badges - Below */}
          <div className="flex justify-center items-center gap-3">
            <a
              href="https://twelve.tools"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={`https://twelve.tools/badge0-${
                  mounted && resolvedTheme === "light" ? "light" : "dark"
                }.svg`}
                alt="Featured on Twelve Tools"
                width="200"
                height="54"
                className="w-[150px] sm:w-[180px] h-auto"
              />
            </a>
            <a
              href="https://startupfa.me/s/gitstory-1?utm_source=gitstory.sitestash.org"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={
                  mounted && resolvedTheme === "light"
                    ? "https://startupfa.me/badges/featured-badge.webp"
                    : "https://startupfa.me/badges/featured/dark.webp"
                }
                alt="GitStory - Featured on Startup Fame"
                width="171"
                height="54"
                className="w-[140px] sm:w-[171px] h-auto"
              />
            </a>
            <a
              href="https://findly.tools/gitstory?utm_source=gitstory"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={`https://findly.tools/badges/findly-tools-badge-${
                  mounted && resolvedTheme === "light" ? "light" : "dark"
                }.svg`}
                alt="Featured on findly.tools"
                width="150"
                className="w-[120px] sm:w-[150px] h-auto"
              />
            </a>
            <a
              href="https://wired.business"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={`https://wired.business/badge0-${
                  mounted && resolvedTheme === "light" ? "light" : "dark"
                }.svg`}
                alt="Featured on Wired Business"
                width="200"
                height="54"
                className="w-[150px] sm:w-[180px] h-auto"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-full aspect-square">
        <RightSection />
      </div>
    </div>
  );
}
