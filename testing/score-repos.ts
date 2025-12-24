import { calculateRepoScoreBreakdown } from "../src/services/scoringAlgorithms";
import * as fs from "fs";
import * as path from "path";

const GITHUB_API_BASE = "https://api.github.com";

async function main() {
  const username = process.argv[2];
  const token = process.env.GITHUB_TOKEN || process.argv[3];

  if (!username) {
    console.error("Usage: bun run testing/score-repos.ts <github-username> [token]");
    process.exit(1);
  }

  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=pushed&type=all`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`Failed to fetch repos: ${res.status} ${res.statusText}`);
    const body = await res.text();
    console.error(body.slice(0, 500));
    process.exit(1);
  }

  const repos: any[] = await res.json();
  if (!Array.isArray(repos) || repos.length === 0) {
    console.log("No repos found.");
    return;
  }

  // Filter to only repos owned by the user (exclude collaborator repos)
  const ownedRepos = repos.filter((repo) => repo.owner.login.toLowerCase() === username.toLowerCase());
  
  console.log(`\n📊 Found ${repos.length} total repos, ${ownedRepos.length} owned by ${username}`);
  if (repos.length !== ownedRepos.length) {
    console.log(`⚠️  Filtered out ${repos.length - ownedRepos.length} collaborator/org repos\n`);
  }

  const scored = ownedRepos.map((repo) => {
    const breakdown = calculateRepoScoreBreakdown(repo);
    return {
      name: repo.name,
      score: Number(breakdown.total.toFixed(2)),
      breakdown,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "Unknown",
      topics: Array.isArray(repo.topics) ? repo.topics.join(", ") : "",
      pushed: repo.pushed_at ? repo.pushed_at.slice(0, 10) : "",
      fork: repo.fork ? "yes" : "no",
      url: repo.html_url,
    };
  });

  scored.sort((a, b) => b.score - a.score);

  console.log(`\nRepo scores for ${username} (highest first):`);
  console.table(scored.slice(0, 25));

  console.log("\nTop 5:");
  scored.slice(0, 5).forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} -> ${r.score}`);
  });

  console.log("\nLowest 5:");
  scored.slice(-5).forEach((r, i) => {
    console.log(`${scored.length - 5 + i + 1}. ${r.name} -> ${r.score}`);
  });

  // Generate HTML dashboard
  const htmlFile = path.join(process.cwd(), "testing", "dashboard.html");
  const htmlContent = generateDashboard(username, scored);
  fs.writeFileSync(htmlFile, htmlContent);
  console.log(`\n✅ Dashboard generated: ${htmlFile}`);
  console.log(`Open it in your browser to see detailed score breakdowns!`);
}

function generateDashboard(username: string, repos: any[]) {
  const topRepos = repos.slice(0, 10);
  
  const repoRows = topRepos.map((repo) => `
    <tr onclick="toggleDetails(this)" class="cursor-pointer hover:bg-gray-700">
      <td class="px-4 py-2">${repo.name}</td>
      <td class="px-4 py-2 font-bold text-blue-400">${repo.score}</td>
      <td class="px-4 py-2">${repo.language}</td>
      <td class="px-4 py-2"><a href="${repo.url}" target="_blank" class="text-purple-400 hover:underline">→</a></td>
    </tr>
    <tr class="details-row hidden bg-gray-900">
      <td colspan="4" class="px-4 py-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Stars</div>
            <div class="font-bold text-yellow-400">${repo.breakdown.stars.toFixed(1)} pts</div>
            <div class="text-xs text-gray-500">${repo.stars} ⭐</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Forks</div>
            <div class="font-bold text-cyan-400">${repo.breakdown.forks.toFixed(1)} pts</div>
            <div class="text-xs text-gray-500">${repo.forks} 🔀</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Recency</div>
            <div class="font-bold text-green-400">${repo.breakdown.recency.toFixed(1)} pts</div>
            <div class="text-xs text-gray-500">Pushed: ${repo.pushed}</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Size</div>
            <div class="font-bold text-orange-400">${repo.breakdown.size.toFixed(1)} pts</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Original Work</div>
            <div class="font-bold ${repo.breakdown.originalWork > 0 ? 'text-green-400' : 'text-red-400'}">${repo.breakdown.originalWork} pts</div>
            <div class="text-xs text-gray-500">${repo.fork === 'no' ? '✓ Own repo' : '⚠ Fork'}</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Description</div>
            <div class="font-bold text-blue-400">${repo.breakdown.description} pts</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Topics</div>
            <div class="font-bold text-purple-400">${repo.breakdown.topics} pts</div>
          </div>
          <div class="bg-gray-800 p-3 rounded">
            <div class="text-gray-400 text-sm">Issues</div>
            <div class="font-bold text-red-400">${repo.breakdown.openIssues.toFixed(1)} pts</div>
          </div>
        </div>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GitStory Score Breakdown - ${username}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background-color: #0f0f0f; color: #e0e0e0; }
    .cursor-pointer { cursor: pointer; }
  </style>
</head>
<body class="p-8">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl font-bold mb-2 text-white">GitStory Score Breakdown</h1>
    <p class="text-gray-400 mb-8">User: <span class="font-mono text-cyan-400">@${username}</span></p>
    
    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-900 border-b border-gray-700">
            <th class="px-4 py-3 text-left text-gray-300">Repository</th>
            <th class="px-4 py-3 text-left text-gray-300">Total Score</th>
            <th class="px-4 py-3 text-left text-gray-300">Language</th>
            <th class="px-4 py-3 text-left text-gray-300">Link</th>
          </tr>
        </thead>
        <tbody>
          ${repoRows}
        </tbody>
      </table>
    </div>
    
    <div class="mt-8 p-4 bg-blue-900/30 border border-blue-700 rounded text-sm text-gray-300">
      <p><strong>💡 Tip:</strong> Click on any repository to see the detailed score breakdown for each component!</p>
    </div>
  </div>

  <script>
    function toggleDetails(row) {
      const details = row.nextElementSibling;
      if (details && details.classList.contains('details-row')) {
        details.classList.toggle('hidden');
      }
    }
  </script>
</body>
</html>`;
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
