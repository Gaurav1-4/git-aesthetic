import { ProfileConfig } from "@/types/profile";
import { THEMES } from "./constants";

export function generateProfileMarkdown(config: ProfileConfig): string {
  const theme = THEMES[config.theme] || THEMES.tokyonight;
  const username = config.username.trim() || "github";
  const displayName = config.displayName.trim() || username;

  const typingEscaped = config.typingLines
    .filter((l) => l.trim().length > 0)
    .map((l) => encodeURIComponent(l.trim()))
    .join(";");

  const skillsCsv = config.selectedSkills.join(",");

  let md = `<div align="center">\n\n`;

  // 1. Header Banner
  md += `  <!-- Animated Header Banner -->\n`;
  md += `  <img src="https://capsule-render.vercel.app/api?type=${config.headerType}&color=gradient&customColorList=${theme.capsuleColors}&height=220&section=header&text=${encodeURIComponent(
    displayName
  )}&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=${encodeURIComponent(
    config.tagline
  )}&descSize=18&descAlignY=62" width="100%" />\n\n`;

  // 2. Typing SVG
  if (config.typingLines.length > 0) {
    md += `  <!-- Animated Typewriter -->\n`;
    md += `  <a href="https://github.com/${username}">\n`;
    md += `    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=21&pause=1200&color=${theme.typewriterColor}&center=true&vCenter=true&width=620&height=50&lines=${typingEscaped}" alt="Typing SVG" />\n`;
    md += `  </a>\n\n`;
  }

  // 3. Badges Row
  md += `  <!-- Profile Badges -->\n`;
  md += `  <p align="center">\n`;
  if (config.focus) {
    md += `    <img src="https://img.shields.io/badge/Focus-${encodeURIComponent(
      config.focus
    )}-${theme.badgeColor}?style=for-the-badge&logo=github&logoColor=white" alt="Focus" />\n`;
  }
  if (config.location) {
    md += `    <img src="https://img.shields.io/badge/Location-${encodeURIComponent(
      config.location
    )}-10B981?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Location" />\n`;
  }
  if (config.enableVisitorCounter) {
    md += `    <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20Views&color=${theme.badgeColor}&style=for-the-badge" alt="Profile Views" />\n`;
  }
  md += `  </p>\n\n</div>\n\n---\n\n`;

  // 4. About Me
  if (config.aboutText) {
    md += `### 👨‍💻 About Me\n\n`;
    md += `\`\`\`yaml\n`;
    md += `name: ${displayName}\n`;
    md += `role: ${config.tagline}\n`;
    md += `location: ${config.location || "Global"}\n`;
    md += `bio: ${config.aboutText}\n`;
    md += `\`\`\`\n\n---\n\n`;
  }

  // 5. Tech Stack
  if (config.selectedSkills.length > 0) {
    md += `### 🛠️ Tech Stack & Ecosystem\n\n`;
    md += `<div align="center">\n`;
    md += `  <img src="https://skillicons.dev/icons?i=${skillsCsv}" alt="Tech Stack" />\n`;
    md += `</div>\n\n---\n\n`;
  }

  // 6. Analytics Cards
  if (config.enableStatsCard || config.enableTopLangs) {
    md += `### 📊 Real-Time GitHub Analytics\n\n<div align="center">\n  <table border="0">\n    <tr>\n`;
    if (config.enableStatsCard) {
      md += `      <td>\n        <a href="https://github.com/${username}">\n          <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${theme.statsTheme}&hide_border=true&bg_color=0d1117&title_color=58a6ff&icon_color=${theme.badgeColor}" height="195" alt="GitHub Stats" />\n        </a>\n      </td>\n`;
    }
    if (config.enableTopLangs) {
      md += `      <td>\n        <a href="https://github.com/${username}">\n          <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${theme.statsTheme}&hide_border=true&bg_color=0d1117&title_color=58a6ff" height="195" alt="Top Languages" />\n        </a>\n      </td>\n`;
    }
    md += `    </tr>\n  </table>\n</div>\n\n---\n\n`;
  }

  // 7. Snake Animation
  if (config.enableSnake) {
    md += `### 🐍 Contribution Activity Snake\n\n`;
    md += `<div align="center">\n  <picture>\n`;
    md += `    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake-dark.svg?v=2" />\n`;
    md += `    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake.svg?v=2" />\n`;
    md += `    <img alt="Contribution Snake" src="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake-dark.svg?v=2" width="100%" />\n`;
    md += `  </picture>\n</div>\n\n`;
  }

  // 8. 3D Isometric Graph
  if (config.enable3dGraph) {
    md += `<div align="center">\n  <details>\n    <summary><strong>🧊 Click to Expand 3D Isometric Contribution Graph</strong></summary>\n    <br/>\n`;
    md += `    <img src="https://raw.githubusercontent.com/${username}/${username}/main/profile-3d-contrib/profile-night-rainbow.svg?v=2" alt="3D Profile Graph" width="100%" />\n`;
    md += `  </details>\n</div>\n\n---\n\n`;
  }

  // 9. Featured Repos
  if (config.featuredRepos.length > 0) {
    md += `### 🚀 Featured Projects\n\n<div align="center">\n  <table border="0">\n`;
    for (let i = 0; i < config.featuredRepos.length; i += 2) {
      md += `    <tr>\n`;
      const r1 = config.featuredRepos[i];
      md += `      <td>\n        <a href="https://github.com/${username}/${r1.name}">\n          <img src="https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${r1.name}&theme=${theme.statsTheme}&hide_border=true&bg_color=0d1117" alt="${r1.name}" />\n        </a>\n      </td>\n`;
      if (i + 1 < config.featuredRepos.length) {
        const r2 = config.featuredRepos[i + 1];
        md += `      <td>\n        <a href="https://github.com/${username}/${r2.name}">\n          <img src="https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${r2.name}&theme=${theme.statsTheme}&hide_border=true&bg_color=0d1117" alt="${r2.name}" />\n        </a>\n      </td>\n`;
      }
      md += `    </tr>\n`;
    }
    md += `  </table>\n</div>\n\n---\n\n`;
  }

  // 10. Footer Wave
  md += `<div align="center">\n`;
  md += `  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${theme.capsuleColors}&height=120&section=footer" width="100%" />\n`;
  md += `</div>\n`;

  return md;
}

export function generateSnakeWorkflow(username: string): string {
  return `name: Generate Snake Animation

on:
  schedule:
    # Run every 12 hours
    - cron: "0 */12 * * *"
  workflow_dispatch:
  push:
    branches:
      - main

jobs:
  generate:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Generate snake SVG
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${username}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark

      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Commit snake SVGs to assets folder
        run: |
          mkdir -p assets
          cp dist/*.svg assets/
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add assets/
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: update contribution snake SVGs [skip ci]" && git push origin main)
`;
}

export function generateProfile3dWorkflow(username: string): string {
  return `name: GitHub Profile 3D Contrib

on:
  schedule:
    - cron: "0 18 * * *" # every day at 18:00 UTC
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-github-profile-3d-contrib
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: yoshi389111/github-profile-3d-contrib@0.7.2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          USERNAME: ${username}
      - name: Commit & Push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add profile-3d-contrib/
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: update 3D profile contribution graph [skip ci]" && git pull --rebase origin main && git push origin main)
`;
}
