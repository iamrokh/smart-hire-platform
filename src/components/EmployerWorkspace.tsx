import React, { useState, useEffect } from "react";
import { 
  Briefcase, Activity, ShieldAlert, Sparkles, AlertCircle, FileText, 
  CheckCircle2, Search, Sliders, ChevronRight, UserCheck, HelpCircle, ArrowRight
} from "lucide-react";
import { ScreeningResult, BulkCandidateSim } from "../types";
import { MOCK_JOB_DESCRIPTION, MOCK_SCREENED_CANDIDATES, MOCK_BULK_STATS, generateBulkProfiles, SAMPLE_RESUMES } from "../mockData";

export default function EmployerWorkspace() {
  const [jobDescription, setJobDescription] = useState(MOCK_JOB_DESCRIPTION);
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(100);
  const [candidates, setCandidates] = useState<BulkCandidateSim[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningResult | null>(MOCK_SCREENED_CANDIDATES[0]);
  
  // Custom screen interface states
  const [isScreening, setIsScreening] = useState(false);
  const [screenedList, setScreenedList] = useState<ScreeningResult[]>(MOCK_SCREENED_CANDIDATES);
  const [pastedResume, setPastedResume] = useState("");
  const [customCandidateName, setCustomCandidateName] = useState("");
  const [customCandidateTitle, setCustomCandidateTitle] = useState("");
  const [screenerErrorMsg, setScreenerErrorMsg] = useState<string | null>(null);

  // Initialize candidates list once
  useEffect(() => {
    setCandidates(generateBulkProfiles());
  }, []);

  // Simulate algorithmic profile reduction from 500 to 10
  const triggerBulkSimulation = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setActiveStep(0);
    
    // Reset candidates state
    const pool = generateBulkProfiles();
    setCandidates(pool);

    const steps = [
      { maxScore: 100, risk: ["High", "Medium", "Low"], limit: 24 }, // Step 0 (500)
      { maxScore: 100, risk: ["High", "Medium", "Low"], limit: 18 }, // Step 1 (320)
      { minScore: 50, risk: ["High", "Medium", "Low"], limit: 12 },  // Step 2 (180) - Skill Screen
      { minScore: 50, risk: ["Medium", "Low"], limit: 8 },           // Step 3 (65)  - Stability filter
      { minScore: 65, risk: ["Low"], limit: 4 },                      // Step 4 (22)  - Deep AI audit
      { minScore: 80, risk: ["Low"], limit: 2 }                       // Step 5 (10)  - Champions
    ];

    let currentStepNum = 0;
    
    const interval = setInterval(() => {
      currentStepNum++;
      if (currentStepNum < MOCK_BULK_STATS.length) {
        setActiveStep(currentStepNum);
        
        // Filter elements visually
        const stepFilter = steps[currentStepNum];
        setCandidates(prev => 
          prev.map((c, i) => {
            const meetsScore = !stepFilter.minScore || c.matchScore >= stepFilter.minScore;
            const meetsRisk = !stepFilter.risk || stepFilter.risk.includes(c.riskScore);
            const isInsideLimit = i < stepFilter.limit;
            
            return {
              ...c,
              isFiltered: !(meetsScore && meetsRisk && isInsideLimit)
            };
          })
        );
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1500);
  };

  // Run a real-time Gemini screen API on a custom resume pasted in by recruiters
  const executePastedScreen = async () => {
    if (!pastedResume.trim()) {
      setScreenerErrorMsg("Please paste a resume block or type employment summaries to evaluate.");
      return;
    }

    setIsScreening(true);
    setScreenerErrorMsg(null);

    const nameToUse = customCandidateName.trim() || `Applicant #${screenedList.length + 1}`;
    const titleToUse = customCandidateTitle.trim() || `Specialist Pivot`;

    try {
      const response = await fetch("/api/screen-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: pastedResume,
          jobDescription,
          candidateName: nameToUse,
          candidateTitle: titleToUse
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Server rejected screening execution request.");
      }

      const result: ScreeningResult = await response.json();
      result.candidateId = `cand-custom-${Date.now()}`;
      
      // Prepend to current screened candidates list
      setScreenedList(prev => [result, ...prev]);
      setSelectedCandidate(result);
      
      // Clear inputs
      setPastedResume("");
      setCustomCandidateName("");
      setCustomCandidateTitle("");

    } catch (err: any) {
      console.error(err);
      setScreenerErrorMsg(err.message || "Failed to screen with Gemini. Check your cloud secret keys.");
    } finally {
      setIsScreening(false);
    }
  };

  const loadPresetJob = (title: string, desc: string) => {
    setJobDescription(desc);
  };

  const loadPresetResumeScreener = (key: keyof typeof SAMPLE_RESUMES, name: string, title: string) => {
    setPastedResume(SAMPLE_RESUMES[key]);
    setCustomCandidateName(name);
    setCustomCandidateTitle(title);
  };

  return (
    <div className="space-y-10" id="employer-recruiter-hub font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-indigo-950/35 border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/10 blur-[80px] rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl font-display">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
              <Activity className="h-3.5 w-3.5" /> Recruiter Screening Dashboard
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Recruiters Cohort Screening Studio
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              Design screening criteria and run bulk processing pipelines simulating candidate risk pruning. Use server-side Gemini intelligence to verify employment stability, parse tenure liabilities, score alignments, and generate deep qualifying interview templates.
            </p>
          </div>
          <div>
            <button
              onClick={triggerBulkSimulation}
              disabled={isSimulating}
              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 text-xs font-semibold shadow-lg transition duration-200 flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 dark:glowing-primary-element font-display"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              {isSimulating ? "Pruning Pool..." : "Run Simulated Recruiter Funnel"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column (Job Desc & Simulation Stats - 5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Job Requirements Form */}
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm space-y-4 transition backdrop-blur-xl">
            <div className="flex items-center justify-between font-display">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-500" /> Screening Criteria / Requirements
              </span>
              <span className="text-[10px] font-mono text-slate-400">Editable Target</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste custom recruiting descriptions, required skills lists, stability expectations or cultural conditions..."
              className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => loadPresetJob("Fullstack Dev", MOCK_JOB_DESCRIPTION)}
                className="text-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Insert Fullstack Dev Target
              </button>
              <button
                type="button"
                onClick={() => loadPresetJob("Data Eng", "Machine Learning Platform Engineer.\nRequires core distributed systems, Kubeflow, 4+ yrs Python, PyTorch, CUDA core. Tenure constraint: Must stay on roles minimum 2 years.")}
                className="text-[10px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Insert MLOps Eng Target
              </button>
            </div>
          </div>

          {/* Bulk Reduction Funnel Widget (Simulates 500 candidate filtering) */}
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between font-display">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-blue-500" /> Funnel Reduction Analysis (Bulk 500)
              </h4>
              {isSimulating && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400 animate-pulse font-bold">
                  Funnel processing...
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Simulates candidate screen constraints: starting with 500 database pool documents and applying keyword check, tenure metrics, and deep AI scoring.
            </p>

            {/* Stages vertical funnel */}
            <div className="space-y-2 pt-2">
              {MOCK_BULK_STATS.map((stat, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <div 
                    key={idx}
                    className={`p-2.5 rounded-lg border transition duration-300 flex items-center justify-between gap-4 ${
                      isActive 
                        ? "bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-500/30 text-slate-800 dark:text-blue-300 dark:glowing-primary-element"
                        : isPassed
                        ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-990/10 dark:border-emerald-500/20 opacity-75"
                        : "bg-slate-50/50 border-slate-100 dark:bg-white/5 dark:border-white/5 opacity-55"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isActive
                          ? "bg-blue-600 text-white animate-pulse"
                          : isPassed
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      }`}>
                        {stat.count}
                      </span>
                      <div>
                        <span className="text-xs font-bold block">{stat.step}</span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block">{stat.label}</span>
                      </div>
                    </div>
                    {isPassed && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
            
            {/* Run simulate helper */}
            <div className="pt-2 text-center">
              <button
                onClick={triggerBulkSimulation}
                disabled={isSimulating}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50"
              >
                {isSimulating ? "Recalibrating constraints..." : "Re-launch bulk funnel analysis"}
              </button>
            </div>
          </div>

        </div>

        {/* Right Columns (Simulation Candidates & Detail Visualizers - 7 Columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* LIVE SCREENER PASTE MODULE */}
          <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-200/50 dark:border-white/10 space-y-4 backdrop-blur-xl">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider font-display">
                <Sparkles className="text-blue-505 h-4 w-4" /> Screen New Candidate with Gemini
              </h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 font-sans">
                Pasting a specific custom resume will run a live, detailed Google GenAI assessment against criteria.
              </p>
            </div>

            {screenerErrorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{screenerErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 font-sans">
                <label className="text-[10px] text-slate-500 font-bold uppercase block dark:text-slate-400">Candidate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Chen"
                  value={customCandidateName}
                  onChange={(e) => setCustomCandidateName(e.target.value)}
                  className="w-full text-xs border border-slate-200/85 rounded-lg p-2 bg-white dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1 session-inputs font-sans">
                <label className="text-[10px] text-slate-500 font-bold uppercase block dark:text-slate-400">Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Architect"
                  value={customCandidateTitle}
                  onChange={(e) => setCustomCandidateTitle(e.target.value)}
                  className="w-full text-xs border border-slate-200/85 rounded-lg p-2 bg-white dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1 font-sans">
              <div className="flex justify-between items-center font-display">
                <label className="text-[10px] text-slate-500 font-bold uppercase block dark:text-slate-400">Paste Resume Content Text</label>
                <span className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => loadPresetResumeScreener("pivotToAI", "Alexander Chen", "Senior Full-stack Developer")}
                    className="text-[9px] text-blue-500 hover:underline cursor-pointer font-semibold"
                  >
                    Insert Alexander (Stable)
                  </button>
                  <button 
                    type="button"
                    onClick={() => loadPresetResumeScreener("unstableResume", "John Smith", "Frontend Developer")}
                    className="text-[9px] text-blue-500 hover:underline cursor-pointer font-semibold"
                  >
                    Insert John (Unstable)
                  </button>
                </span>
              </div>
              <textarea
                value={pastedResume}
                onChange={(e) => setPastedResume(e.target.value)}
                placeholder="Paste the resume lines to assess risk scores..."
                rows={4}
                className="w-full text-xs border border-slate-200 rounded-lg p-3 bg-white dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={executePastedScreen}
              disabled={isScreening || !pastedResume.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition duration-150 disabled:opacity-50 dark:glowing-primary-element font-display"
            >
              {isScreening ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Gemini Auditing Employment Dates & Tenure Indicators...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" /> Inject Candidates to Screening list
                </>
              )}
            </button>
          </div>

          {/* TWO PANEL CANDIDATES WORKSPACE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-display">
            
            {/* Screened candidates list (Left) */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  Screened Applicants ({screenedList.length})
                </h4>
                <span className="text-[10px] text-blue-600 font-bold dark:text-blue-400">Low-Risk Champions focus</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {screenedList.map((cand, idx) => {
                  const isSelected = selectedCandidate?.candidateId === cand.candidateId;
                  const scoreColor = cand.matchScore >= 80 ? "text-emerald-500" : cand.matchScore >= 60 ? "text-amber-500" : "text-rose-500";
                  
                  return (
                    <div
                      key={cand.candidateId || idx}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition flex justify-between gap-3 items-start ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex gap-2 items-center">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{cand.candidateName}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                            cand.riskScore === "Low"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-355"
                              : cand.riskScore === "Medium"
                              ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-355"
                              : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-355"
                          }`}>
                            {cand.riskScore} Risk
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-555 block truncate font-sans">{cand.professionalTitle}</p>
                      </div>

                      <div className="text-right">
                        <span className={`text-sm font-extrabold ${scoreColor}`}>
                          {cand.matchScore}%
                        </span>
                        <span className="text-[8px] text-slate-400 block font-sans">Match Score</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Deep details Inspection Panel (Right) */}
            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm backdrop-blur-xl">
              {selectedCandidate ? (
                <div className="space-y-4 font-sans" id="deep-inspection-card">
                  
                  {/* Title block */}
                  <div className="border-b border-slate-100 dark:border-white/10 pb-3 font-display">
                    <h4 className="text-sm font-bold text-slate-955 dark:text-white">
                      {selectedCandidate.candidateName}
                    </h4>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                      {selectedCandidate.professionalTitle}
                    </p>
                  </div>

                  {/* Matching rating & Alert bar */}
                  <div className="flex gap-4">
                    <div className="bg-blue-500/5 dark:bg-black/30 p-2.5 rounded-lg flex-1 border border-blue-500/15 text-center">
                      <span className="block text-xs text-slate-400">Match score</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-display">{selectedCandidate.matchScore}%</span>
                    </div>

                    <div className="bg-amber-500/5 dark:bg-black/30 p-2.5 rounded-lg flex-1 border border-amber-500/15 text-center">
                      <span className="block text-xs text-slate-400">Hiring Risk</span>
                      <span className={`text-lg font-extrabold block truncate font-display ${
                        selectedCandidate.riskScore === "Low" ? "text-emerald-500" : selectedCandidate.riskScore === "Medium" ? "text-amber-500" : "text-rose-500"
                      }`}>{selectedCandidate.riskScore}</span>
                    </div>
                  </div>

                  {/* Tenure stability assessment */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-display">Tenure Stability Assessment</span>
                    <p className="text-xs text-slate-655 dark:text-slate-300 leading-normal font-sans bg-slate-50 dark:bg-black/25 p-2.5 rounded-lg border dark:border-white/5">
                      {selectedCandidate.stabilityAnalysis}
                    </p>
                  </div>

                  {/* Risk reasoning explanation */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block flex items-center gap-1 font-display">
                      <ShieldAlert className="h-3 w-3 shrink-0 text-blue-500" /> Tenure / Technical Risk Reasoning
                    </span>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                      {selectedCandidate.riskReasoning}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses checklists */}
                  <div className="grid grid-cols-1 gap-3.5 pt-1">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-display">Core Strengths</span>
                      <ul className="list-inside list-disc space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {selectedCandidate.strengths.slice(0, 3).map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest block font-display">Technical Gaps / Weaknesses</span>
                      <ul className="list-inside list-disc space-y-1 text-xs text-rose-800 dark:text-rose-300">
                        {selectedCandidate.weaknesses.slice(0, 2).map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Tailored qualifying questions */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/10">
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block flex items-center gap-1 font-display">
                      <HelpCircle className="h-3.5 w-3.5" /> Tailored Qualifying Interview Questions
                    </span>
                    <div className="space-y-1 ml-1 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside">
                      {selectedCandidate.interviewQuestions.map((q, qidx) => (
                        <div key={qidx} className="bg-slate-50 dark:bg-black/30 p-2 rounded text-[11px] leading-relaxed select-all border dark:border-white/5">
                          <span className="font-semibold text-slate-500 mr-1">{qidx+1}.</span> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall recommendation */}
                  <div className="space-y-1 bg-blue-500/5 border-blue-500/20 border p-2.5 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-display">Recruiter Decision Verdict</span>
                    <p className="text-[11px] text-slate-655 dark:text-slate-300 leading-normal font-sans">
                      {selectedCandidate.overallRecommendation}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 text-center text-xs">
                  <UserCheck className="h-10 w-10 text-slate-200 mb-2" />
                  Select a candidate from the left panel to inspect tenure assessment details.
                </div>
              )}
            </div>

          </div>

          {/* VISUAL CANDIDATES POOL MATRIX IN CHRONOLOGICAL ORDER */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Live Automated Pool Filter List (Visualized)
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Check how each candidate performs in real-time as they go through the filters. High-threat risks and poor skill alignments are greyed out to highlight the best fits. Click on any profile to screen them immediately.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => {
                    const found = screenedList.find(s => s.candidateName === cand.name);
                    if (found) {
                      setSelectedCandidate(found);
                    } else {
                      // Generate a mock quick-score on click if not parsed
                      setSelectedCandidate({
                        candidateId: cand.id,
                        candidateName: cand.name,
                        professionalTitle: cand.title,
                        matchScore: cand.matchScore,
                        riskScore: cand.riskScore,
                        riskReasoning: cand.riskScore === "High" ? "Unstable work spans. Stays of shorter spans found on resume profiles." : cand.riskScore === "Medium" ? "Adequate staying spans, minor technological shift gaps." : "Solid tenure. Dual Multi-year stay with stable projects.",
                        stabilityAnalysis: cand.isFiltered ? "Filtered out during current simulation parameters." : "Strong stability with sequential tech progressions.",
                        strengths: ["Strong engineering backgrounds.", "Familiar with modular structures."],
                        weaknesses: ["Fewer cloud container audits."],
                        interviewQuestions: [`Can you outline your contribution inside ${cand.experience}?`],
                        overallRecommendation: "Selected low risk champion. Matches the bulk recruitment thresholds."
                      });
                    }
                  }}
                  className={`p-2 rounded border cursor-pointer text-left select-none transition-all duration-300 ${
                    cand.isFiltered
                      ? "opacity-25 bg-slate-100 border-slate-200 dark:bg-slate-900/10 dark:border-slate-800 pointer-events-none scale-95"
                      : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:-translate-y-0.5 hover:shadow-xs shadow-none border"
                  }`}
                >
                  <span className="block text-[10px] font-bold text-slate-900 dark:text-white truncate">
                    {cand.name}
                  </span>
                  <span className="block text-[8px] text-slate-400 truncate">
                    {cand.title}
                  </span>
                  
                  <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-slate-50 dark:border-slate-700">
                    <span className={`text-[9px] font-extrabold ${cand.matchScore >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                      {cand.matchScore}%
                    </span>
                    <span className={`text-[7px] font-bold px-1 rounded uppercase ${
                      cand.riskScore === "Low" ? "bg-emerald-50 text-emerald-700" : cand.riskScore === "Medium" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {cand.riskScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
