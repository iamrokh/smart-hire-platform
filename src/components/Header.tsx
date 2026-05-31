import React from "react";
import { Compass, Briefcase, FileText, User, Sparkles, Building2 } from "lucide-react";

interface HeaderProps {
  activeModule: "candidate" | "employer";
  setActiveModule: (module: "candidate" | "employer") => void;
  hasApiKey: boolean;
}

export default function Header({ activeModule, setActiveModule, hasApiKey }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-250/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-black/30 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-indigo-200 dark:shadow-none dark:glowing-primary-element">
            <Sparkles className="h-5 w-5" id="sparkles-logo-icon" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
              TalentAI <span className="text-blue-500 dark:text-blue-400 font-light italic text-xs">NEXUS</span>
            </h1>
            <p className="text-[10px] font-mono text-indigo-600 dark:text-slate-400">
              Career & Recruitment Pivot Platform
            </p>
          </div>
        </div>

        {/* Primary Toggle Navigation */}
        <nav className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-900/50 dark:border dark:border-white/10 transition-colors">
          <button
            id="nav-candidate-toggle"
            onClick={() => setActiveModule("candidate")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeModule === "candidate"
                ? "bg-white text-slate-900 shadow-sm dark:bg-blue-600 dark:text-white dark:shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Candidate Hub</span>
          </button>
          
          <button
            id="nav-employer-toggle"
            onClick={() => setActiveModule("employer")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeModule === "employer"
                ? "bg-white text-slate-900 shadow-sm dark:bg-blue-600 dark:text-white dark:shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Building2 className="h-4 w-4" id="employer-nav-icon" />
            <span className="hidden sm:inline">Employer Recruiting</span>
          </button>
        </nav>

        {/* API Key Status Signet */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono border ${
              hasApiKey
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30 dark:glowing-emerald-element"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${hasApiKey ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {hasApiKey ? "AI Cloud Live" : "AI Simulation Active"}
          </div>
          
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
          >
            AI Studio App
          </a>
        </div>

      </div>
    </header>
  );
}
