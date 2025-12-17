<p align="center">
  <img src="./public/logo.svg" alt="GitStory Logo" height="80" />
</p>

<h1 align="center">GitStory</h1>

<p align="center">
  <strong>Your Code in Cinema — Every Commit Tells a Story</strong>
</p>

<p align="center">
  Transform your GitHub journey into a cinematic masterpiece with stunning visuals, personalized insights, and sharable snapshots.
</p>

<p align="center">
  <a href="https://nextjs.org">
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  </a>
  <a href="https://react.dev">
    <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  </a>
  <a href="https://tailwindcss.com">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8" />
  </a>
  <a href="https://ui.shadcn.com">
    <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn/ui-Components-020817?style=for-the-badge" />
  </a>
</p>

<p align="center">
  <a href="https://bun.sh">
    <img alt="Bun" src="https://img.shields.io/badge/Bun-Runtime-fbf0df?style=flat-square&logo=bun&logoColor=000" />
  </a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" />
  <a href="https://gitstory.sitestash.org">
    <img alt="Live Demo" src="https://img.shields.io/badge/demo-live-success?style=flat-square" />
  </a>
</p>

---

## ✨ What is GitStory?

**GitStory** is a beautiful, Instagram Stories-style web app that transforms any GitHub user's yearly activity into a cinematic, swipeable experience. Enter a GitHub username and watch your coding journey come alive through stunning animated slides showcasing:

- 📊 **Contribution Stats** — Total commits, longest streaks, busiest days
- 🔥 **Code Velocity** — Interactive charts showing commit frequency over time
- 💻 **Top Languages** — Beautifully visualized language breakdown with percentages
- 📁 **Top Repositories** — Highlight your most impactful projects
- ⏰ **Productivity Patterns** — Discover your peak coding hours and rhythm
- 🎭 **Developer Archetype** — Get assigned a fun coding persona based on your habits
- 👥 **Community Impact** — Followers, stars, and contribution breakdowns
- 📸 **Downloadable Snapshot** — Share your story as a stunning image

<p align="center">
  <img src="./public/image.png" alt="GitStory Preview" width="100%" />
</p>

---

## 🚀 Features

### 🎬 Story Experience
- **Swipeable Slides** — Navigate through your year like Instagram Stories
- **Auto-Progress** — Slides advance automatically with a progress bar
- **Pause on Hold** — Hold to pause and explore details
- **Smooth Animations** — Powered by Motion (Framer Motion)

### 📈 Data Insights
- **GitHub API Integration** — Fetches real data from GitHub's REST & GraphQL APIs
- **Private Repo Support** — Optional GitHub token for richer insights
- **Smart Caching** — Efficient data fetching with React Query
- **Contribution Calendar** — Full year activity heatmap

### 🎨 Visual Design
- **Dark/Light Mode** — Fully themed with animated toggle
- **Premium UI Components** — 60+ shadcn/ui components
- **Interactive Globe** — 3D globe visualization on homepage
- **Confetti Celebrations** — Fun effects on story completion
- **Responsive Design** — Works beautifully on mobile and desktop

### 🔗 Sharing & SEO
- **Dynamic OG Images** — Auto-generated social preview images per user
- **PWA Ready** — Installable as a Progressive Web App
- **SEO Optimized** — Full metadata, structured data, and sitemap

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com) |
| **Animations** | [Motion](https://motion.dev) (Framer Motion) |
| **Charts** | [Recharts](https://recharts.org) |
| **State** | [React Query](https://tanstack.com/query) (TanStack Query) |
| **Data Fetching** | GitHub REST API + GraphQL API |
| **Image Generation** | [@vercel/og](https://vercel.com/docs/functions/og-image-generation) |
| **Package Manager** | [Bun](https://bun.sh) |

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (app)/              # Main app layout with header
│   │   ├── layout.tsx      # App shell with theme toggle & GitHub link
│   │   └── page.tsx        # Homepage with username input & globe
│   ├── [githubId]/         # Dynamic user story route
│   │   ├── page.tsx        # Story page (SSR data fetching)
│   │   ├── loading.tsx     # Loading skeleton
│   │   └── opengraph-image/# Dynamic OG image generation
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── globals.css         # Tailwind + custom CSS variables
│   ├── manifest.ts         # PWA manifest
│   └── robots.ts           # SEO robots.txt
├── components/
│   ├── slides/             # Story slide components
│   │   ├── IntroSlide.tsx
│   │   ├── StatsSlide.tsx
│   │   ├── VelocitySlide.tsx
│   │   ├── ProductivitySlide.tsx
│   │   ├── LanguagesSlide.tsx
│   │   ├── ReposSlide.tsx
│   │   ├── CommunitySlide.tsx
│   │   ├── CompositionSlide.tsx
│   │   └── OutroSlide.tsx
│   ├── StoryView.tsx       # Main story container with navigation
│   ├── ui/                 # 60+ shadcn/ui components
│   └── custom/             # Custom components (icons, theme toggle)
├── services/
│   ├── githubService.ts    # GitHub API integration
│   └── scoringAlgorithms.ts # Archetype & scoring logic
├── context/
│   └── providers.tsx       # React providers (Theme, React Query)
├── hooks/
│   └── use-mobile.ts       # Mobile detection hook
├── lib/
│   ├── config.ts           # Site configuration
│   ├── constants.ts        # Demo/mock data
│   └── utils.ts            # Utility functions
└── types.ts                # TypeScript type definitions
```

---

## 🏃‍♂️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) (recommended) or Node.js ≥20
- A GitHub account (optional: Personal Access Token for enhanced features)

### Installation

```bash
# Clone the repository
git clone https://github.com/vishkx/gitstory.git
cd gitstory

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using a GitHub Token (Recommended)

For richer insights including private repositories and higher API rate limits:

1. [Create a Personal Access Token](https://github.com/settings/tokens/new?scopes=repo,read:org,read:user&description=GitStory)
2. Enter the token in the app when prompted
3. Token is stored locally in your browser — never sent to any server

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start development server with hot reload |
| `bun build` | Create optimized production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint for code quality |

---

## 🎨 Customization

### Site Configuration

Update `src/lib/config.ts` to customize:

```ts
export const siteConfig = {
  title: "GitStory",
  description: "Your GitStory is here...",
  links: {
    github: "https://github.com/vishkx/gitstory",
  },
}
```

### Theme Colors

Modify CSS variables in `src/app/globals.css` to change the color scheme.

### Adding Slides

1. Create a new component in `src/components/slides/`
2. Add it to the `slides` array in `src/components/StoryView.tsx`

---

## 🌐 Deployment

GitStory is optimized for deployment on **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vishkx/gitstory)

Also works on:
- Netlify
- Docker
- Any Node.js hosting platform

For platform-specific instructions, see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🙏 Credits

Created and maintained by [vishkx](https://github.com/vishkx).

**Special thanks to:**
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Motion](https://motion.dev) for smooth animations
- [Recharts](https://recharts.org) for chart components
- [cobe](https://github.com/shuding/cobe) for the 3D globe

---

## 📄 License & Community

- **License**: This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.
- **Code of Conduct**: By participating in this project, you agree to follow the guidelines in [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

---

<p align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</p>

<p align="center">
  <a href="https://gitstory.sitestash.org">Try GitStory Now →</a>
</p>
