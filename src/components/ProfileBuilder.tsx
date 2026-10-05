"use client";

import React, { useState } from "react";
import {
  User,
  Sparkles,
  Palette,
  Code2,
  FolderGit2,
  Eye,
  FileCode,
  Plus,
  Trash2,
  Check,
  Zap,
  Globe,
  MapPin,
  Flame,
  LayoutTemplate,
} from "lucide-react";
import { ProfileConfig, ThemeId } from "@/types/profile";
import { DEFAULT_PROFILE, SKILL_CATEGORIES, THEMES } from "@/lib/constants";
import { generateProfileMarkdown } from "@/lib/markdownGenerator";

interface ProfileBuilderProps {
  config: ProfileConfig;
  onChange: (config: ProfileConfig) => void;
  onOpenDeploy: () => void;
}

type TabId = "identity" | "animations" | "theme" | "skills" | "modules";

export const ProfileBuilder: React.FC<ProfileBuilderProps> = ({
  config,
  onChange,
  onOpenDeploy,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("identity");
  const [previewMode, setPreviewMode] = useState<"visual" | "markdown">("visual");

  const updateField = <K extends keyof ProfileConfig>(
    field: K,
    val: ProfileConfig[K]
  ) => {
    onChange({ ...config, [field]: val });
  };

  const handleAddTypingLine = () => {
    updateField("typingLines", [...config.typingLines, "New specialization 🚀"]);
  };

  const handleUpdateTypingLine = (index: number, val: string) => {
    const updated = [...config.typingLines];
    updated[index] = val;
    updateField("typingLines", updated);
  };

  const handleRemoveTypingLine = (index: number) => {
    const updated = config.typingLines.filter((_, i) => i !== index);
    updateField("typingLines", updated);
  };

  const handleToggleSkill = (skillId: string) => {
    const exists = config.selectedSkills.includes(skillId);
    if (exists) {
      updateField(
        "selectedSkills",
        config.selectedSkills.filter((s) => s !== skillId)
      );
    } else {
      updateField("selectedSkills", [...config.selectedSkills, skillId]);
    }
  };

  const activeTheme = THEMES[config.theme] || THEMES.tokyonight;
  const markdownOutput = generateProfileMarkdown(config);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "identity", label: "Identity", icon: <User className="h-4 w-4" /> },
    { id: "animations", label: "Animations", icon: <Sparkles className="h-4 w-4" /> },
    { id: "theme", label: "Theme", icon: <Palette className="h-4 w-4" /> },
    { id: "skills", label: "Tech Stack", icon: <Code2 className="h-4 w-4" /> },
    { id: "modules", label: "Modules", icon: <FolderGit2 className="h-4 w-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* LEFT COLUMN: Controls */}
      <div className="lg:col-span-5 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-white/10 bg-[#161b22] p-5 shadow-xl space-y-5">
          {/* TAB 1: Identity */}
          {activeTab === "identity" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <User className="h-4 w-4 text-cyan-400" />
                <span>Profile Identity & Details</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-mono">@</span>
                  <input
                    type="text"
                    value={config.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0d1117] pl-7 pr-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Gaurav1-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={config.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Gaurav"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Role / Tagline
                </label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => updateField("tagline", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="AI & Machine Learning Engineer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Primary Focus Badge
                  </label>
                  <input
                    type="text"
                    value={config.focus}
                    onChange={(e) => updateField("focus", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="AI & Computer Vision"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Location Badge
                  </label>
                  <input
                    type="text"
                    value={config.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="India"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    YouTube Channel / Handle
                  </label>
                  <input
                    type="text"
                    value={config.youtube || ""}
                    onChange={(e) => updateField("youtube", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="@Semlyhq"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={config.website || ""}
                    onChange={(e) => updateField("website", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="https://www.semly.in"
                  />
                </div>
              </div>


              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  About Me / Bio
                </label>
                <textarea
                  rows={3}
                  value={config.aboutText}
                  onChange={(e) => updateField("aboutText", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="Building intuitive, AI-driven interactive products..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: Animations */}
          {activeTab === "animations" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span>Animated Header & Typewriter</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Header Banner Wave Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "waving", label: "Dynamic Wave" },
                    { id: "soft", label: "Soft Glow" },
                    { id: "slice", label: "Cyber Slice" },
                    { id: "rect", label: "Clean Rect" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateField("headerType", style.id as any)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition ${
                        config.headerType === style.id
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                          : "border-white/10 bg-[#0d1117] text-neutral-300 hover:border-white/20"
                      }`}
                    >
                      <span>{style.label}</span>
                      {config.headerType === style.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-neutral-300">
                    Cycling Typewriter Text Lines
                  </label>
                  <button
                    onClick={handleAddTypingLine}
                    className="flex items-center space-x-1 text-[11px] text-cyan-400 hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Line</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {config.typingLines.map((line, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[11px] text-neutral-500 font-mono w-4">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={line}
                        onChange={(e) => handleUpdateTypingLine(idx, e.target.value)}
                        className="flex-1 rounded-lg border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveTypingLine(idx)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Theme */}
          {activeTab === "theme" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <Palette className="h-4 w-4 text-cyan-400" />
                <span>Color Theme Presets</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {Object.values(THEMES).map((th) => (
                  <button
                    key={th.id}
                    onClick={() => updateField("theme", th.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      config.theme === th.id
                        ? "border-cyan-400 bg-cyan-500/10 shadow-md"
                        : "border-white/10 bg-[#0d1117] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-7 w-7 rounded-lg border border-white/20 shadow-inner flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: th.previewBg }}
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: `#${th.badgeColor}` }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {th.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          stats: {th.statsTheme}
                        </div>
                      </div>
                    </div>
                    {config.theme === th.id && (
                      <Check className="h-4 w-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Skills */}
          {activeTab === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-bold text-white">
                  <Code2 className="h-4 w-4 text-emerald-400" />
                  <span>Tech Stack Badges</span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  {config.selectedSkills.length} selected
                </span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.title} className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {cat.title}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((skill) => {
                        const isSelected = config.selectedSkills.includes(skill.id);
                        return (
                          <button
                            key={skill.id}
                            onClick={() => handleToggleSkill(skill.id)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                              isSelected
                                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                                : "bg-[#0d1117] border-white/10 text-neutral-400 hover:text-white"
                            }`}
                          >
                            {skill.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Modules */}
          {activeTab === "modules" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <FolderGit2 className="h-4 w-4 text-indigo-400" />
                <span>Automation Modules & Repos</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "enableSnake",
                    label: "Contribution Activity Snake",
                    desc: "Automated daily retro snake eating your commit squares",
                  },
                  {
                    key: "enable3dGraph",
                    label: "3D Isometric Contribution Graph",
                    desc: "Interactive 3D isometric city view in collapsible drawer",
                  },
                  {
                    key: "enableStatsCard",
                    label: "Real-time Stats Card",
                    desc: "Overall commits, stars, PRs, and rating",
                  },
                  {
                    key: "enableTopLangs",
                    label: "Top Programming Languages",
                    desc: "Visual breakdown of your most used languages",
                  },
                  {
                    key: "enableVisitorCounter",
                    label: "Dynamic Visitor Counter Badge",
                    desc: "Real-time profile view tracker",
                  },
                ].map((mod) => (
                  <label
                    key={mod.key}
                    className="flex items-start space-x-3 p-2.5 rounded-lg border border-white/10 bg-[#0d1117] cursor-pointer hover:border-white/20 transition"
                  >
                    <input
                      type="checkbox"
                      checked={(config as any)[mod.key]}
                      onChange={(e) =>
                        updateField(mod.key as any, e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {mod.label}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {mod.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Featured Repository Cards (comma separated)
                </label>
                <input
                  type="text"
                  value={config.featuredRepos.map((r) => r.name).join(", ")}
                  onChange={(e) =>
                    updateField(
                      "featuredRepos",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((name) => ({ name }))
                    )
                  }
                  className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="air-canvas, ai-air-tiles, biology-tutor-app"
                />
              </div>
            </div>
          )}

          {/* Quick Action Button */}
          <button
            onClick={onOpenDeploy}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110 active:scale-95"
          >
            <Zap className="h-4 w-4" />
            <span>Deploy to GitHub in 1-Click</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Split-Screen Preview */}
      <div className="lg:col-span-7 space-y-4">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#161b22] px-4 py-2.5">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-neutral-400 pl-2">
              github.com/{config.username || "username"}
            </span>
          </div>

          <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/10">
            <button
              onClick={() => setPreviewMode("visual")}
              className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition ${
                previewMode === "visual"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setPreviewMode("markdown")}
              className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-md transition ${
                previewMode === "markdown"
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>Markdown</span>
            </button>
          </div>
        </div>

        {/* Live Container */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl min-h-[600px] overflow-hidden">
          {previewMode === "visual" ? (
            <div className="space-y-6 text-neutral-200">
              {/* Header Banner */}
              <div className="text-center overflow-hidden rounded-xl border border-white/5 bg-gradient-to-r from-cyan-900/20 via-indigo-900/20 to-purple-900/20 py-8 px-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  {config.displayName || config.username}
                </h1>
                <p className="text-sm text-cyan-300 font-medium">
                  {config.tagline}
                </p>
              </div>

              {/* Typing Text Simulation */}
              {config.typingLines.length > 0 && (
                <div className="flex items-center justify-center font-mono text-sm py-2 px-4 rounded-lg bg-black/40 border border-white/5 text-cyan-400">
                  <span className="mr-2">✦</span>
                  <span className="animate-pulse">{config.typingLines[0]}</span>
                </div>
              )}

              {/* Badges Row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {config.focus && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Focus: {config.focus}
                  </span>
                )}
                {config.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Location: {config.location}
                  </span>
                )}
                {config.enableVisitorCounter && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Views: 1,284
                  </span>
                )}
              </div>

              {/* About Section */}
              {config.aboutText && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <span>👨‍💻 About Me</span>
                  </h3>
                  <div className="rounded-lg bg-black/40 p-3 font-mono text-xs text-neutral-300 border border-white/5">
                    <p>{config.aboutText}</p>
                  </div>
                </div>
              )}

              {/* Tech Stack Preview */}
              {config.selectedSkills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">
                    🛠️ Tech Stack & Ecosystem
                  </h3>
                  <div className="flex justify-center p-3 rounded-lg bg-black/20 border border-white/5">
                    <img
                      src={`https://skillicons.dev/icons?i=${config.selectedSkills.join(
                        ","
                      )}`}
                      alt="Tech Stack"
                      className="max-w-full"
                    />
                  </div>
                </div>
              )}

              {/* Stats Preview */}
              {(config.enableStatsCard || config.enableTopLangs) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">
                    📊 Real-Time GitHub Analytics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.enableStatsCard && (
                      <div className="flex items-center justify-center rounded-xl bg-black/30 p-2 border border-white/5">
                        <img
                          src={`https://github-readme-stats.vercel.app/api?username=${config.username}&show_icons=true&theme=${activeTheme.statsTheme}&hide_border=true&bg_color=0d1117`}
                          alt="Stats"
                          className="w-full"
                        />
                      </div>
                    )}
                    {config.enableTopLangs && (
                      <div className="flex items-center justify-center rounded-xl bg-black/30 p-2 border border-white/5">
                        <img
                          src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${config.username}&layout=compact&theme=${activeTheme.statsTheme}&hide_border=true&bg_color=0d1117`}
                          alt="Languages"
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contribution Snake */}
              {config.enableSnake && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">
                    🐍 Contribution Activity Snake
                  </h3>
                  <div className="rounded-xl border border-white/5 bg-black/30 p-3 overflow-hidden">
                    <img
                      src={`https://raw.githubusercontent.com/${config.username}/${config.username}/main/assets/github-contribution-grid-snake-dark.svg?v=2`}
                      alt="Snake Activity"
                      className="w-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Featured Repos */}
              {config.featuredRepos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white">
                    🚀 Featured Projects
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.featuredRepos.map((r) => (
                      <div
                        key={r.name}
                        className="rounded-xl border border-white/5 bg-black/30 p-2"
                      >
                        <img
                          src={`https://github-readme-stats.vercel.app/api/pin/?username=${config.username}&repo=${r.name}&theme=${activeTheme.statsTheme}&hide_border=true&bg_color=0d1117`}
                          alt={r.name}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <pre className="font-mono text-xs text-neutral-300 whitespace-pre-wrap overflow-x-auto max-h-[650px] p-2 bg-black/40 rounded-lg">
                {markdownOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
