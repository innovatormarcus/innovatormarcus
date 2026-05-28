import fs from "node:fs/promises";

const username = "innovatormarcus";
const token = process.env.GITHUB_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
};

async function github(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return res.json();
}

const user = await github(`/users/${username}`);
const repos = await github(`/users/${username}/repos?per_page=100&type=owner`);

const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
const forks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

const svg = `
<svg width="520" height="210" viewBox="0 0 520 210" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="520" height="210" rx="14" fill="#0d1117"/>
  <text x="28" y="42" fill="#c9d1d9" font-size="22" font-family="Arial, sans-serif" font-weight="700">
    Marcus's GitHub Stats
  </text>

  <text x="28" y="82" fill="#58a6ff" font-size="16" font-family="Arial, sans-serif">
    Public repos: ${user.public_repos}
  </text>
  <text x="28" y="112" fill="#58a6ff" font-size="16" font-family="Arial, sans-serif">
    Total stars: ${stars}
  </text>
  <text x="28" y="142" fill="#58a6ff" font-size="16" font-family="Arial, sans-serif">
    Total forks: ${forks}
  </text>
  <text x="28" y="172" fill="#58a6ff" font-size="16" font-family="Arial, sans-serif">
    Followers: ${user.followers}
  </text>
</svg>
`.trim();

await fs.mkdir("dist", { recursive: true });
await fs.writeFile("dist/github-stats.svg", svg);

console.log("Generated dist/github-stats.svg");
