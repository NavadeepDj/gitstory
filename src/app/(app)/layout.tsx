import { AnimatedThemeToggler } from "@/components/custom/animated-theme-toggler";
import { GitHubLink } from "@/components/custom/github-link";
import { InfoDialog } from "@/components/custom/info-dialog";
import ShadTooltip from "@/components/custom/shad-tooltip";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="bg-background relative z-10 flex min-h-svh flex-col max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-end p-4 gap-2">
        <ShadTooltip content="View on GitHub">
          <GitHubLink />
        </ShadTooltip>
        <InfoDialog />
        <AnimatedThemeToggler />
      </div>
      <main className="flex flex-1 flex-col items-center justify-center">{children}</main>
    </div>
  );
}

