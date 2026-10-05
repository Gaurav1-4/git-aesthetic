"use client";

import React, { useState } from "react";
import { X, Rocket, CheckCircle, AlertCircle, ExternalLink, ShieldCheck, Download, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { ProfileConfig } from "@/types/profile";
import { deployToGitHub } from "@/lib/githubDeployer";
import { generateProfile3dWorkflow, generateSnakeWorkflow } from "@/lib/markdownGenerator";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfileConfig;
  onCopyMarkdown: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  config,
  onCopyMarkdown,
}) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
    repoUrl?: string;
  }>({ type: "idle", message: "" });

  if (!isOpen) return null;

  const handleDeploy = async () => {
    if (!token.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your GitHub Personal Access Token.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const res = await deployToGitHub(token, config);

    setLoading(false);
    if (res.success) {
      setStatus({
        type: "success",
        message: res.message,
        repoUrl: res.repoUrl,
      });
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      setStatus({ type: "error", message: res.message });
    }
  };

  const handleDownloadWorkflows = () => {
    const snakeContent = generateSnakeWorkflow(config.username);
    const profile3dContent = generateProfile3dWorkflow(config.username);

    const blob = new Blob(
      [
        `# snake.yml\n${snakeContent}\n\n# --- profile-3d.yml ---\n${profile3dContent}`,
      ],
      { type: "text/yaml" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `github-workflows-${config.username}.yaml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">1-Click Profile Deploy</h3>
            <p className="text-xs text-neutral-400">
              Deploy to your special <code className="text-cyan-400 font-mono">{config.username}/{config.username}</code> repository
            </p>
          </div>
        </div>

        {status.type === "success" ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">
                Profile Deployed Successfully!
              </h4>
              <p className="mt-1 text-xs text-neutral-400">
                Your README and automated GitHub Actions workflows have been committed directly to your profile.
              </p>
            </div>
            {status.repoUrl && (
              <a
                href={status.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
              >
                <span>View Live Profile</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                GitHub Personal Access Token (Classic)
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0d1117] px-3.5 py-2.5 text-xs font-mono text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Requires <code>repo</code> scope</span>
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=GitAesthetic%20Profile%20Deployer"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <span>Generate Token</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {status.type === "error" && (
              <div className="flex items-center space-x-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            <button
              onClick={handleDeploy}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Deploying to GitHub...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  <span>Deploy to My GitHub Profile</span>
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#161b22] px-2 text-[10px] font-medium text-neutral-500">
                  Or Manual Setup
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onCopyMarkdown}
                className="flex items-center justify-center space-x-2 rounded-lg border border-white/10 bg-[#0d1117] py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Markdown</span>
              </button>
              <button
                onClick={handleDownloadWorkflows}
                className="flex items-center justify-center space-x-2 rounded-lg border border-white/10 bg-[#0d1117] py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Workflows</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
