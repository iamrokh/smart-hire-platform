import React, { useState, useEffect } from "react";
import { Sparkles, Sun, Moon, Info, ShieldCheck, Zap } from "lucide-react";
import Header from "./components/Header";
import CandidateWorkspace from "./components/CandidateWorkspace";
import EmployerWorkspace from "./components/EmployerWorkspace";

export default function App() {
  const [activeModule, setActiveModule] = useState<"candidate" | "employer">("candidate");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [hasApiKey, setHasApiKey] = useState(false);

  // Synchronize dark-mode class toggles
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Check API configuration on backend
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === "boolean") {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => console.error("Error retrieving API state from backend:", err));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:immersive-gradient-bg text-slate-900 dark:text-slate-200 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Brand Header */}
      <Header 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        hasApiKey={hasApiKey} 
      />

      {/* Floating Dark/Light Toggle & Info Bar */}
      <div className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 transition-all duration-350">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-medium">
          
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline">Active Workspace:</span>
            <span className="text-slate-900 dark:text-white bg-white/85 dark:bg-slate-700/85 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600 font-mono text-[11px]">
              {activeModule === "candidate" ? "Candidate-Centric Gap Analyzer & Interactive Roadmap" : "Employer Bulk Screener Simulator & Tenure Assessor"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Mode Indicator */}
            {!hasApiKey && (
              <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
                <Zap className="h-3 w-3 shrink-0" /> Simulation Mode
              </span>
            )}
            
            {/* Dark Mode Lever Button */}
            <button
              onClick={toggleDarkMode}
              id="theme-mode-toggle"
              aria-label="Toggle Light and Dark Slate Themes"
              className="flex items-center gap-1.5 cursor-pointer rounded-lg px-2.5 py-1 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition"
            >
              {darkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[11px] font-semibold">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-[11px] font-semibold">Dark Mode</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Arena */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
        
        {/* Dynamic workspace renderer */}
        {activeModule === "candidate" ? (
          <CandidateWorkspace />
        ) : (
          <EmployerWorkspace />
        )}

      </main>

      {/* Modern Footer bar */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition duration-300 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Google AI Studio Powered - Enterprise Content Security Enabled</span>
          </div>
          <div>
            <p className="font-mono text-slate-400 dark:text-slate-500 text-[10px]">
              Platform Release v3.5 (Flash Model Engine)
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
