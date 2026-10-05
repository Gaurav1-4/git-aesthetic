import { ProfileConfig } from "@/types/profile";
import {
  generateProfile3dWorkflow,
  generateProfileMarkdown,
  generateSnakeWorkflow,
} from "./markdownGenerator";

export interface DeployResult {
  success: boolean;
  message: string;
  repoUrl?: string;
}

export async function deployToGitHub(
  token: string,
  config: ProfileConfig
): Promise<DeployResult> {
  const username = config.username.trim();
  if (!username) {
    return { success: false, message: "GitHub username is required" };
  }
  if (!token) {
    return { success: false, message: "Personal Access Token is required" };
  }

  const headers = {
    Authorization: `Bearer ${token.trim()}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  try {
    // 1. Verify User Token
    const userRes = await fetch("https://api.github.com/user", { headers });
    if (!userRes.ok) {
      return {
        success: false,
        message: "Invalid GitHub Token. Please ensure it has 'repo' scope.",
      };
    }
    const userData = await userRes.json();
    const authUsername = userData.login;

    // 2. Check if <username>/<username> repository exists
    const repoRes = await fetch(
      `https://api.github.com/repos/${authUsername}/${authUsername}`,
      { headers }
    );

    if (repoRes.status === 404) {
      // Create special repo
      const createRes = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: authUsername,
          description: "Config files for my GitHub profile",
          private: false,
          auto_init: true,
        }),
      });
      if (!createRes.ok) {
        return {
          success: false,
          message: `Failed to create special profile repo ${authUsername}/${authUsername}.`,
        };
      }
    }

    // Helper to upload or update a file in the repo
    const commitFile = async (path: string, content: string, message: string) => {
      let sha: string | undefined;
      const getFileRes = await fetch(
        `https://api.github.com/repos/${authUsername}/${authUsername}/contents/${path}`,
        { headers }
      );
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      const putRes = await fetch(
        `https://api.github.com/repos/${authUsername}/${authUsername}/contents/${path}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            message,
            content: encodedContent,
            sha,
          }),
        }
      );
      return putRes.ok;
    };

    // 3. Commit README.md
    const readmeContent = generateProfileMarkdown(config);
    await commitFile("README.md", readmeContent, "feat: update profile README via GitAesthetic");

    // 4. Commit Workflows if enabled
    if (config.enableSnake) {
      const snakeYml = generateSnakeWorkflow(authUsername);
      await commitFile(
        ".github/workflows/snake.yml",
        snakeYml,
        "ci: configure snake animation workflow"
      );
    }

    if (config.enable3dGraph) {
      const profile3dYml = generateProfile3dWorkflow(authUsername);
      await commitFile(
        ".github/workflows/profile-3d.yml",
        profile3dYml,
        "ci: configure 3D contribution workflow"
      );
    }

    return {
      success: true,
      message: "Successfully deployed your profile and automated workflows!",
      repoUrl: `https://github.com/${authUsername}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "An unexpected error occurred during deployment.",
    };
  }
}
