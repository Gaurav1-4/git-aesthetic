#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

// ANSI color helpers
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
};

const BANNER = `
${c.cyan}   ____ _ _      ${c.magenta}_    ${c.blue}_____ _   _           _   _      ${c.reset}
${c.cyan}  / ___(_) |_   ${c.magenta}/ \\  ${c.blue}| ____| |_| |__   ___| |_(_) ___   ${c.reset}
${c.cyan} | |  _| | __| ${c.magenta}/ _ \\ ${c.blue}|  _| | __| '_ \\ / _ \\ __| |/ __|  ${c.reset}
${c.cyan} | |_| | | |_ ${c.magenta}/ ___ \\${c.blue}| |___| |_| | | |  __/ |_| | (__   ${c.reset}
${c.cyan}  \\____|_|\\__|${c.magenta}/_/   \\_${c.blue}|_____|\\__|_| |_|\\___|\\__|_|\\___|  ${c.reset}
${c.gray}   The 1-Click GitHub Profile Engine & Automation CLI v1.0.0${c.reset}
`;

console.log(BANNER);

// Helper to ask a question via readline
function ask(rl, query, defaultVal = "") {
  return new Promise((resolve) => {
    const promptText = defaultVal
      ? `${c.bold}${query}${c.reset} ${c.gray}(default: ${defaultVal})${c.reset}: `
      : `${c.bold}${query}${c.reset}: `;
    rl.question(promptText, (answer) => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

// Auto-detect git username
function detectUsername() {
  try {
    const ghUser = execSync("gh api user --jq .login 2>/dev/null", { encoding: "utf8" }).trim();
    if (ghUser) return ghUser;
  } catch (e) {}

  try {
    const gitUser = execSync("git config user.name 2>/dev/null", { encoding: "utf8" }).trim();
    if (gitUser && !gitUser.includes(" ")) return gitUser;
  } catch (e) {}

  return "";
}

// Markdown and workflow generators
function generateMarkdown(opts) {
  const themes = {
    tokyonight: { stats: "tokyonight", badge: "00F0FF", capsule: "0,2,20,40", text: "00F0FF" },
    cyberpunk: { stats: "radical", badge: "f72585", capsule: "10,20,30,40", text: "7209B7" },
    catppuccin: { stats: "catppuccin_mocha", badge: "cba6f7", capsule: "24,25,30,40", text: "89B4FA" },
    dracula: { stats: "dracula", badge: "bd93f9", capsule: "0,1,2,3", text: "50FA7B" },
    nord: { stats: "nord", badge: "88c0d0", capsule: "35,40,45,50", text: "88C0D0" },
  };

  const th = themes[opts.theme] || themes.tokyonight;
  const username = opts.username;
  const displayName = opts.displayName || username;
  const typingEscaped = opts.typingLines.map(l => encodeURIComponent(l.trim())).join(";");
  const skillsCsv = opts.skills.join(",");

  let md = `<div align="center">\n\n`;

  // Header Banner
  md += `  <!-- Animated Header Banner -->\n`;
  md += `  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${th.capsule}&height=220&section=header&text=${encodeURIComponent(displayName)}&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=${encodeURIComponent(opts.tagline)}&descSize=18&descAlignY=62" width="100%" />\n\n`;

  // Typing SVG
  if (opts.typingLines.length > 0) {
    md += `  <!-- Animated Typewriter -->\n`;
    md += `  <a href="https://github.com/${username}">\n`;
    md += `    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=21&pause=1200&color=${th.text}&center=true&vCenter=true&width=620&height=50&lines=${typingEscaped}" alt="Typing SVG" />\n`;
    md += `  </a>\n\n`;
  }

  // Badges
  md += `  <p align="center">\n`;
  if (opts.focus) {
    md += `    <img src="https://img.shields.io/badge/Focus-${encodeURIComponent(opts.focus)}-${th.badge}?style=for-the-badge&logo=github&logoColor=white" alt="Focus" />\n`;
  }
  if (opts.location) {
    md += `    <img src="https://img.shields.io/badge/Location-${encodeURIComponent(opts.location)}-10B981?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Location" />\n`;
  }
  md += `    <img src="https://komarev.com/ghpvc/?username=${username}&label=Profile%20Views&color=${th.badge}&style=for-the-badge" alt="Profile Views" />\n`;
  md += `  </p>\n\n</div>\n\n---\n\n`;

  // About Me
  if (opts.about) {
    md += `### 👨‍💻 About Me\n\n\`\`\`yaml\nname: ${displayName}\nrole: ${opts.tagline}\nlocation: ${opts.location || "Global"}\nbio: ${opts.about}\n\`\`\`\n\n---\n\n`;
  }

  // Tech Stack
  if (opts.skills.length > 0) {
    md += `### 🛠️ Tech Stack & Ecosystem\n\n<div align="center">\n  <img src="https://skillicons.dev/icons?i=${skillsCsv}" alt="Tech Stack" />\n</div>\n\n---\n\n`;
  }

  // Stats
  if (opts.enableStats) {
    md += `### 📊 Real-Time GitHub Analytics\n\n<div align="center">\n  <table border="0">\n    <tr>\n      <td>\n        <a href="https://github.com/${username}">\n          <img src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=${th.stats}&hide_border=true&bg_color=0d1117&title_color=58a6ff&icon_color=${th.badge}" height="195" alt="GitHub Stats" />\n        </a>\n      </td>\n      <td>\n        <a href="https://github.com/${username}">\n          <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&theme=${th.stats}&hide_border=true&bg_color=0d1117&title_color=58a6ff" height="195" alt="Top Languages" />\n        </a>\n      </td>\n    </tr>\n  </table>\n</div>\n\n---\n\n`;
  }

  // Snake
  if (opts.enableSnake) {
    md += `### 🐍 Contribution Activity Snake\n\n<div align="center">\n  <picture>\n    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake-dark.svg?v=2" />\n    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake.svg?v=2" />\n    <img alt="Contribution Snake" src="https://raw.githubusercontent.com/${username}/${username}/main/assets/github-contribution-grid-snake-dark.svg?v=2" width="100%" />\n  </picture>\n</div>\n\n`;
  }

  // 3D Graph
  if (opts.enable3d) {
    md += `<div align="center">\n  <details>\n    <summary><strong>🧊 Click to Expand 3D Isometric Contribution Graph</strong></summary>\n    <br/>\n    <img src="https://raw.githubusercontent.com/${username}/${username}/main/profile-3d-contrib/profile-night-rainbow.svg?v=2" alt="3D Profile Graph" width="100%" />\n  </details>\n</div>\n\n---\n\n`;
  }

  // Footer
  md += `<div align="center">\n  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=${th.capsule}&height=120&section=footer" width="100%" />\n</div>\n`;

  return md;
}

function generateSnakeYml(username) {
  return `name: Generate Snake Animation

on:
  schedule:
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

function generateProfile3dYml(username) {
  return `name: GitHub Profile 3D Contrib

on:
  schedule:
    - cron: "0 18 * * *"
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

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const detectedUser = detectUsername();

  console.log(`${c.green}⚡ Let's build your dream GitHub profile!${c.reset}\n`);

  const username = await ask(rl, "1. GitHub Username", detectedUser || "Gaurav1-4");
  const displayName = await ask(rl, "2. Display Name", username);
  const tagline = await ask(
    rl,
    "3. Role / Tagline",
    "Full-Stack Engineer & Open-Source Builder"
  );

  console.log(`\n${c.bold}Available Themes:${c.reset}`);
  console.log(`  1. ${c.cyan}Tokyo Night${c.reset} (Default - Electric Cyan & Indigo)`);
  console.log(`  2. ${c.magenta}Cyberpunk Neon${c.reset} (Magenta & Dark)`);
  console.log(`  3. ${c.blue}Catppuccin Mocha${c.reset} (Pastel Dark)`);
  console.log(`  4. ${c.green}Dracula Classic${c.reset} (High Contrast Gothic)`);
  console.log(`  5. ${c.gray}Nord Frost${c.reset} (Arctic Minimal)`);

  const themeChoice = await ask(rl, "4. Select Theme (1-5)", "1");
  const themeMap = {
    "1": "tokyonight",
    "2": "cyberpunk",
    "3": "catppuccin",
    "4": "dracula",
    "5": "nord",
  };
  const theme = themeMap[themeChoice] || "tokyonight";

  const skillsInput = await ask(
    rl,
    "5. Tech stack skills (comma-separated)",
    "python,react,nextjs,typescript,javascript,tailwind,nodejs,docker,git"
  );
  const skills = skillsInput.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

  const enableSnakeAns = await ask(rl, "6. Include Contribution Snake Animation? (Y/n)", "Y");
  const enableSnake = enableSnakeAns.toLowerCase() !== "n";

  const enable3dAns = await ask(rl, "7. Include 3D Isometric Contribution Graph? (Y/n)", "Y");
  const enable3d = enable3dAns.toLowerCase() !== "n";

  const deployNowAns = await ask(
    rl,
    "\n🚀 Deploy directly to your GitHub profile repository now? (Y/n)",
    "Y"
  );
  const deployNow = deployNowAns.toLowerCase() !== "n";

  rl.close();

  const options = {
    username,
    displayName,
    tagline,
    theme,
    focus: "Full-Stack & Cloud Architecture",
    location: "Global",
    about: "Building high-performance software and open-source tooling.",
    skills,
    typingLines: [
      `${tagline} 🚀`,
      "Open-Source Contributor ⚡",
      "Building Next-Gen Systems 🛠️",
    ],
    enableStats: true,
    enableSnake,
    enable3d,
  };

  const readme = generateMarkdown(options);
  const snakeYml = generateSnakeYml(username);
  const profile3dYml = generateProfile3dYml(username);

  if (!deployNow) {
    const outDir = path.join(process.cwd(), "git-aesthetic-profile");
    fs.mkdirSync(path.join(outDir, ".github", "workflows"), { recursive: true });
    fs.writeFileSync(path.join(outDir, "README.md"), readme);
    if (enableSnake) fs.writeFileSync(path.join(outDir, ".github", "workflows", "snake.yml"), snakeYml);
    if (enable3d) fs.writeFileSync(path.join(outDir, ".github", "workflows", "profile-3d.yml"), profile3dYml);

    console.log(`\n${c.green}✓ Profile files generated in ${outDir}!${c.reset}`);
    return;
  }

  // Automated Local Git Deployment
  console.log(`\n${c.cyan}📦 Deploying to GitHub profile repository ${username}/${username}...${c.reset}`);
  const tmpDir = path.join(require("os").tmpdir(), `git-aesthetic-${Date.now()}`);

  try {
    fs.mkdirSync(tmpDir, { recursive: true });

    // Check if repo exists remotely or clone it
    let cloned = false;
    try {
      execSync(`git clone git@github.com:${username}/${username}.git "${tmpDir}"`, {
        stdio: "ignore",
      });
      cloned = true;
    } catch (e) {
      try {
        execSync(`git clone https://github.com/${username}/${username}.git "${tmpDir}"`, {
          stdio: "ignore",
        });
        cloned = true;
      } catch (err) {}
    }

    if (!cloned) {
      // Initialize fresh git repo
      execSync(`git init "${tmpDir}"`, { stdio: "ignore" });
      execSync(
        `cd "${tmpDir}" && git remote add origin git@github.com:${username}/${username}.git`,
        { stdio: "ignore" }
      );
    }

    // Write generated files
    fs.mkdirSync(path.join(tmpDir, ".github", "workflows"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "README.md"), readme);
    if (enableSnake) {
      fs.writeFileSync(path.join(tmpDir, ".github", "workflows", "snake.yml"), snakeYml);
    }
    if (enable3d) {
      fs.writeFileSync(path.join(tmpDir, ".github", "workflows", "profile-3d.yml"), profile3dYml);
    }

    // Commit and push
    execSync(
      `cd "${tmpDir}" && git add . && git commit -m "feat: setup animated profile via git-aesthetic" --allow-empty && git branch -M main && git push -u origin main`,
      { stdio: "inherit" }
    );

    console.log(`\n${c.green}${c.bold}🎉 SUCCESS! Your profile is live at: https://github.com/${username}${c.reset}\n`);
  } catch (error) {
    console.error(`\n${c.yellow}⚠️ Could not automatically push via local git credentials.${c.reset}`);
    console.log(`Saved generated files to ./git-aesthetic-profile instead.\n`);
    const fallbackDir = path.join(process.cwd(), "git-aesthetic-profile");
    fs.mkdirSync(path.join(fallbackDir, ".github", "workflows"), { recursive: true });
    fs.writeFileSync(path.join(fallbackDir, "README.md"), readme);
    if (enableSnake) fs.writeFileSync(path.join(fallbackDir, ".github", "workflows", "snake.yml"), snakeYml);
    if (enable3d) fs.writeFileSync(path.join(fallbackDir, ".github", "workflows", "profile-3d.yml"), profile3dYml);
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

main().catch(console.error);
