"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ProfileBuilder } from "@/components/ProfileBuilder";
import { DeployModal } from "@/components/DeployModal";
import { DEFAULT_PROFILE } from "@/lib/constants";
import { ProfileConfig } from "@/types/profile";
import { generateProfileMarkdown } from "@/lib/markdownGenerator";
import { Sparkles, Heart } from "lucide-react";

export default function Home() {
  const [config, setConfig] = useState<ProfileConfig>(DEFAULT_PROFILE);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const md = generateProfileMarkdown(config);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#0d1117]">
      <Header
        onOpenDeploy={() => setIsDeployOpen(true)}
        onCopyMarkdown={handleCopyMarkdown}
        copied={copied}
      />

      {/* Hero Sub-header */}
      <div className="w-full border-b border-white/5 bg-gradient-to-b from-cyan-950/10 via-transparent to-transparent py-4 text-center">
        <div className="mx-auto flex items-center justify-center space-x-2 text-xs text-neutral-400">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>
            Build your ultimate animated developer profile • Live preview & 1-click CI/CD deployment
          </span>
        </div>
      </div>

      <div className="flex-1">
        <ProfileBuilder
          config={config}
          onChange={setConfig}
          onOpenDeploy={() => setIsDeployOpen(true)}
        />
      </div>

      <DeployModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        config={config}
        onCopyMarkdown={handleCopyMarkdown}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0d1117] py-6 text-center text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://github.com/Gaurav1-4"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold hover:underline"
            >
              Gaurav
            </a>
          </div>
          <div>
            <span>Open Source under MIT License • </span>
            <a
              href="https://github.com/Gaurav1-4/git-aesthetic"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
