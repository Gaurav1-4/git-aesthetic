"use client";

import React from "react";
import { Sparkles, Github, Rocket, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  onOpenDeploy: () => void;
  onCopyMarkdown: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeploy,
  onCopyMarkdown,
  copied,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0d1117]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Git<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Aesthetic</span>
              </span>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              The 1-Click GitHub Profile Engine & Automation Platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onCopyMarkdown}
            className="flex items-center space-x-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3.5 py-2 text-xs font-medium text-neutral-200 transition-all hover:bg-neutral-700 hover:text-white"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenDeploy}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <Rocket className="h-4 w-4" />
            <span>1-Click Deploy</span>
          </button>

          <a
            href="https://github.com/Gaurav1-4/git-aesthetic"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 p-2 text-neutral-400 transition hover:bg-white/5 hover:text-white"
            title="View on GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
