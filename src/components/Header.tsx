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
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight pr-1">
              TalentAI <span className="text-blue-500 dark:text-blue-400 font-light italic text-xs">Nexus</span>
            </h1>
            <p className="text-[10px] font-sans text-indigo-600 dark:text-slate-400">
              پلتفرم هوشمند توسعه کریر و بهینه‌سازی استخدام
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
            <span className="hidden sm:inline">داشبورد کارجویان (Candidate)</span>
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
            <span className="hidden sm:inline">پنل کارفرمایان (Employer)</span>
          </button>
        </nav>

        {/* API Key Status Signet */}
        <div className="flex items-center gap-3">
          <div
            className={`hidden md:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-sans border ${
              hasApiKey
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-500/30 dark:glowing-emerald-element"
                : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-500/30"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${hasApiKey ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {hasApiKey ? "اتصال به Live AI" : "حالت Simulation"}
          </div>
          
          <a
            href="https://ai.studio/build"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
          >
            برنامه AI Studio
          </a>
        </div>

      </div>
    </header>
  );
}
