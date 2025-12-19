"use client";

import { Icons } from "@/components/custom/icons";
import { motion, AnimatePresence } from "motion/react";
import {
  Key,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  RefreshCw,
  AlertCircle,
  Play,
  ArrowBigRight,
  Wand,
  CheckIcon,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchUserStory } from "@/services/githubService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ShadTooltip from "@/components/custom/shad-tooltip";
import { Badge } from "@/components/ui/badge";
import { GitStoryData } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RightSection from "@/components/RightSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

export default function HomePage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [storyData, setStoryData] = useState<GitStoryData | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [error, setError] = useState<{
    message: string;
    type: "rate_limit" | "not_found" | "auth" | "generic";
  } | null>(null);

  // Token validation state
  const [tokenStatus, setTokenStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [tokenUser, setTokenUser] = useState<{
    login: string;
    avatar_url: string;
  } | null>(null);

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate token when it changes
  useEffect(() => {
    if (!token || token.length < 10) {
      setTokenStatus("idle");
      setTokenUser(null);
      return;
    }

    const validateToken = async () => {
      setTokenStatus("validating");
      try {
        const res = await fetch("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          setTokenUser({ login: user.login, avatar_url: user.avatar_url });
          setTokenStatus("valid");
          // Auto-fill username if empty
          if (!username) setUsername(user.login);
        } else {
          setTokenStatus("invalid");
          setTokenUser(null);
        }
      } catch {
        setTokenStatus("invalid");
        setTokenUser(null);
      }
    };

    const debounce = setTimeout(validateToken, 500);
    return () => clearTimeout(debounce);
  }, [token, username]);

  const { mutate: mutateFetchUserStory, isPending } = useMutation({
    mutationFn: async () => {
      setError(null);
      try {
        const data = await fetchUserStory(
          username.trim(),
          token.trim() || undefined
        );
        setStoryData(data);
        setShowStory(true);
      } catch (err: unknown) {
        console.error(err);

        // Parse error type for better UX
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate story.";
        let errorType: "rate_limit" | "not_found" | "auth" | "generic" =
          "generic";

        if (errorMessage.toLowerCase().includes("rate limit")) {
          errorType = "rate_limit";
        } else if (errorMessage.toLowerCase().includes("not found")) {
          errorType = "not_found";
        } else if (
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("401")
        ) {
          errorType = "auth";
        }

        setError({ message: errorMessage, type: errorType });
      }
    },
  });

  const isLoading = isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    // Optional: Pass token via query param if it exists (simplest for now)
    // Ideally we'd store this in a context or cookie, but for this prototype query param is fine
    // Or just rely on public API if no token. 
    // SECURITY WARNING: Putting token in URL is not secure for production. 
    // Using a more persistent store in a real app would be better.
    // For this 'fun' app, we'll strip it if we can or just use it.

    // Better approach: use useMutation to just check if valid, then push.
    // Actually, let's just push and let the next page handle fetching.

    let url = `/${username}`;
    if (token) {
      url += `?token=${token}`;
    }

    router.push(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-12">
          {/* <Github size={64} className="mx-auto mb-6 text-white" /> */}
          <Icons.gitHub className="size-16! mx-auto mb-6" />
          <h1 className="text-5xl md:text-7xl font-serif italic mb-2 tracking-tight">
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
                placeholder="Enter GitHub username"
                className="px-6 py-6 text-lg! font-mono text-center placeholder:text-muted-foreground/70"
                required
              />
            </Field>

            {/* Optional Token Section */}
            <div>
              <button
                type="button"
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-xs font-mono py-2 transition-colors"
              >
                <Key size={12} />
                {showTokenInput ? (
                  "Hide Token"
                ) : tokenStatus === "valid" ? (
                  <div className="status-banner status-banner--success text-center py-1! px-2!">
                    <Avatar className="size-4">
                      <AvatarImage src={tokenUser?.avatar_url || ""} />
                      <AvatarFallback>
                        {tokenUser?.login.charAt(0).toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      Connected as <strong>@{tokenUser?.login || ""}</strong>
                    </span>
                  </div>
                ) : (
                  `Add GitHub Token (Recommended${isMobile ? "" : " for richer insights"})`
                )}{" "}

                {showTokenInput ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>

              <AnimatePresence>
                {showTokenInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="pt-2 space-y-2">
                      <div className="relative">
                        <Field>
                          <Input
                            id="github-token"
                            type="password"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            placeholder="ghp_xxxxxxxxxxxx"
                            className="px-6 py-5 font-mono text-center placeholder:text-muted-foreground/70"
                            required
                          />
                        </Field>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-50 pointer-events-auto">
                          {token?.length > 0 && tokenStatus !== "idle" ? (
                            <>
                              {tokenStatus === "valid" ? (
                                <ShadTooltip content={<p>Token verified</p>}>
                                  <Badge
                                    className="h-5 w-5 rounded-full px-1 bg-blue-600 text-white pointer-events-none"
                                    variant="secondary"
                                    aria-label="Token verified"
                                  >
                                    <CheckIcon
                                      className="w-3 h-3"
                                      strokeWidth={3}
                                    />
                                  </Badge>
                                </ShadTooltip>
                              ) : tokenStatus === "invalid" ? (
                                <ShadTooltip
                                  content={<p>Please enter a valid token</p>}
                                >
                                  <Badge
                                    className="h-5 w-5 rounded-full px-1 pointer-events-none"
                                    variant="destructive"
                                    aria-label="Invalid token"
                                  >
                                    <AlertCircle
                                      className="w-3 h-3"
                                      strokeWidth={3}
                                    />
                                  </Badge>
                                </ShadTooltip>
                              ) : (
                                <ShadTooltip
                                  content={<p>Validating token...</p>}
                                >
                                  <Badge
                                    className="h-5 w-5 rounded-full px-1 pointer-events-none"
                                    variant="secondary"
                                    aria-label="Validating token"
                                  >
                                    <Loader2
                                      className="w-3 h-3 animate-spin"
                                      strokeWidth={3}
                                    />
                                  </Badge>
                                </ShadTooltip>
                              )}
                            </>
                          ) : null}
                        </div>
                      </div>

                      {/* Auth status badge */}
                      <AnimatePresence>
                        {tokenStatus === "valid" && tokenUser && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="status-banner status-banner--success text-center w-fit mx-auto"
                          >
                            <Avatar className="size-5">
                              <AvatarImage src={tokenUser.avatar_url} />
                              <AvatarFallback>
                                {tokenUser.login.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              Connected as <strong>@{tokenUser.login}</strong>
                            </span>
                            <Button
                              onClick={() => {
                                setToken("");
                                setTokenStatus("idle");
                                setTokenUser(null);
                              }}
                              variant="ghost"
                              size="icon"
                              className="ml-auto"
                            >
                              <Trash2 />
                            </Button>
                          </motion.div>
                        )}
                        {tokenStatus === "invalid" && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="status-banner status-banner--error py-2!"
                          >
                            <XCircle size={14} className="text-red-400" />
                            <span>Invalid token - check and try again</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-1 sm:gap-2 text-muted-foreground/50 text-xs pt-2">
                        <div className="flex items-center gap-1.5">
                          <Lock size={12} className="shrink-0" />
                          <span>Stored in browser.</span>
                        </div>
                        <span className="hidden sm:inline text-muted-foreground/20">|</span>
                        <span>
                          Enables private/org repos, 5K calls/hr.{" "}
                          <a
                            href="https://github.com/settings/tokens/new?scopes=repo,read:org,read:user&description=GitStory"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pl-2 text-accent-foreground hover:underline inline-flex items-center gap-0.5"
                          >
                            Create <ExternalLink className="size-3" />
                          </a>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !username.trim()}
              className="w-full px-6! py-6! font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin size-6" /> Generating...
                </>
              ) : (
                <>
                  Generate Story{" "}
                  <Wand className="size-4 group-hover:rotate-5 transition-transform" />
                </>
              )}
            </Button>

            {/* Enhanced Error Display */}
            {/* <AnimatePresence>
              {errorDetails && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl border ${
                    error?.type === 'rate_limit' 
                      ? 'bg-orange-900/20 border-orange-800/50' 
                      : error?.type === 'not_found'
                      ? 'bg-yellow-900/20 border-yellow-800/50'
                      : 'bg-red-900/20 border-red-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className={`shrink-0 mt-0.5 ${
                      error?.type === 'rate_limit' ? 'text-orange-400' : 
                      error?.type === 'not_found' ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <div className="flex-1">
                      <p className="font-bold text-sm text-white mb-1">{errorDetails.title}</p>
                      <p className="text-xs text-neutral-400 mb-2">{errorDetails.message}</p>
                      <p className="text-xs text-neutral-500">{errorDetails.suggestion}</p>
                      
                      {errorDetails.showTokenHint && !showTokenInput && (
                        <button
                          type="button"
                          onClick={() => setShowTokenInput(true)}
                          className="mt-2 text-xs text-hero-blue hover:underline flex items-center gap-1"
                        >
                          <Key size={10} /> Add Token for Higher Limits
                        </button>
                      )}
                      
                      {error?.type === 'rate_limit' && (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="mt-2 text-xs text-hero-purple hover:underline flex items-center gap-1"
                        >
                          <RefreshCw size={10} /> Try Again
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence> */}
          </FieldGroup>
        </form>

        <div className="mt-8 text-center text-xs text-muted-foreground font-mono">
          <p className="mt-2 opacity-70">
            Curious? Try &apos;demo&apos; to preview the experience ✨
          </p>
        </div>

        {/* Product Hunt Badge */}
        <div className="mt-6 flex justify-center h-[54px]">
          {mounted && (
            <a
              href="https://www.producthunt.com/products/gitstory-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-gitstory-2"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img
                src={`https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1051707&theme=${resolvedTheme === 'light' ? 'light' : 'dark'}`}
                alt="Featured on Product Hunt"
                className="w-[200px] sm:w-[250px] h-auto"
              />
            </a>
          )}
        </div>
      </div>
      <div className="hidden lg:block relative w-full aspect-square">
        <RightSection />
      </div>
    </div>
  );
}
