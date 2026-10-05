export type ThemeId = "tokyonight" | "cyberpunk" | "catppuccin" | "dracula" | "nord";

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  badgeColor: string;
  statsTheme: string;
  capsuleColors: string;
  typewriterColor: string;
  previewBg: string;
}

export interface SkillCategory {
  title: string;
  skills: { id: string; name: string }[];
}

export interface ProfileConfig {
  username: string;
  displayName: string;
  tagline: string;
  typingLines: string[];
  theme: ThemeId;
  headerType: "waving" | "soft" | "rect" | "slice";
  aboutText: string;
  focus: string;
  location: string;
  youtube?: string;
  website?: string;
  selectedSkills: string[];
  enableSnake: boolean;
  enable3dGraph: boolean;
  enableStatsCard: boolean;
  enableTopLangs: boolean;
  enableVisitorCounter: boolean;
  featuredRepos: { name: string; description?: string }[];
}

