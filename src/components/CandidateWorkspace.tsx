import React, { useState, useRef } from "react";
import { 
  Upload, FileText, Sparkles, BookOpen, Clock, Target, AlertCircle, CheckCircle2,
  ListRestart, Compass, ChevronRight, GraduationCap, Building2, HelpCircle, ArrowRight
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ResumeAnalysis } from "../types";
import { SAMPLE_RESUMES, MOCK_CANDIDATE_ANALYSED } from "../mockData";

// Dynamically extract text from PDF in the clientside browser via PDF.js CDN
async function extractTextFromPdf(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        
        // Check if PDFJS global library is active, if not inject it from CDN
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((res, rej) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
            script.onload = () => {
              (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
              res();
            };
            script.onerror = () => rej(new Error("Failed to load PDF.js engine CDN."));
            document.head.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(" ");
          fullText += pageText + "\n";
        }
        
        if (!fullText.trim()) {
          reject(new Error("Successfully parsed PDF pages, but no readable text was found. This might be a scanned image-only PDF. Please try copy-pasting your resume text inside the raw field instead."));
        } else {
          resolve(fullText);
        }
      } catch (err: any) {
        reject(new Error("PDF Engine Error: " + err.message));
      }
    };
    fileReader.onerror = () => reject(new Error("Failed to read loaded file buffer."));
    fileReader.readAsArrayBuffer(file);
  });
}

export default function CandidateWorkspace() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("AI & Machine Learning Infrastructure Systems");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(MOCK_CANDIDATE_ANALYSED);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pasteMode, setPasteMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File loading router handling
  const handleFile = async (file: File) => {
    setErrorMsg(null);
    setFileName(file.name);
    
    if (file.type === "application/pdf") {
      try {
        setIsLoading(true);
        const text = await extractTextFromPdf(file);
        setResumeText(text);
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to parse PDF file.");
        setFileName("");
      } finally {
        setIsLoading(false);
      }
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target?.result as string || "");
      };
      reader.readAsText(file);
    } else {
      setErrorMsg("Unsupported file format. Please upload a .pdf or .txt file, or copy-paste your text directly.");
      setFileName("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Load a demo profile from the mock database
  const loadDemoResume = (key: keyof typeof SAMPLE_RESUMES, label: string) => {
    setResumeText(SAMPLE_RESUMES[key]);
    setFileName(`demo_${key}_resume.txt`);
    setPasteMode(false);
    if (key === "managerPivot") {
      setTargetRole("Technical Product Manager / AI Product Director");
    } else {
      setTargetRole("AI & Machine Learning Infrastructure Systems");
    }
  };

  // Trigger server-side AI resume analysis
  const executeAiAnalysis = async () => {
    if (!resumeText.trim()) {
      setErrorMsg("Please upload your resume file or paste your resume content in the text box.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const actualRole = customRoleInput.trim() || targetRole;

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole: actualRole
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Server rejected resume parsing request.");
      }

      const result: ResumeAnalysis = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to consult Gemini API. Pleased make sure your GEMINI_API_KEY is configured.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process data for Recharts hours-by-category visual diagram
  const getCategoryChartData = () => {
    if (!analysis) return [];
    const map: { [key: string]: number } = {};
    analysis.missingSkills.forEach(s => {
      map[s.category] = (map[s.category] || 0) + s.estimatedHoursToLearn;
    });
    return Object.keys(map).map(cat => ({
      category: cat.length > 20 ? cat.substring(0, 18) + ".." : cat,
      Hours: map[cat]
    }));
  };

  const hasMissingSkills = analysis && analysis.missingSkills && analysis.missingSkills.length > 0;
  const matchRatio = analysis ? Math.round(
    (analysis.matchingSkills.length / (analysis.matchingSkills.length + (analysis.missingSkills?.length || 0))) * 100
  ) || 75 : 0;

  return (
    <div className="space-y-10" id="candidate-hub-container">
      
      {/* Introduction Banner */}
      <div className="bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-indigo-950/35 border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-blue-500/10 blur-[80px] rounded-full -mr-12 -mt-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" /> For Job Seekers & Industry Pivoters
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              AI Skill-Gap & Career Architect
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Upload your current resume and specify your career goals. TalentAI uses real-time Gemini reasoning to parse your skills, map professional gaps, build step-by-step roadmaps, and recommend target companies.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadDemoResume("pivotToAI", "Alexander Chen")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer border border-white/10 hover:border-white/20"
            >
              Demo: Dev to AI Pivot
            </button>
            <button
              onClick={() => loadDemoResume("managerPivot", "Sarah Jenkins")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer border border-white/10 hover:border-white/20"
            >
              Demo: PM to Technical PM
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input panel (Left - 5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-6 shadow-sm space-y-6 transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" /> 1. Input Resume
              </span>
              <button 
                onClick={() => setPasteMode(!pasteMode)} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
              >
                {pasteMode ? "Switch to File Drop" : "Switch to Paste Field"}
              </button>
            </div>

            {/* ERROR ALERT BOX */}
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Resume Processing Alert</p>
                  <p className="opacity-90">{errorMsg}</p>
                </div>
              </div>
            )}

            {!pasteMode ? (
              /* DRAG AND DROP ZONE */
              <div
                id="resume-drag-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-blue-500 bg-blue-500/10 dark:bg-blue-950/20"
                    : "border-slate-200 hover:border-blue-400 dark:border-white/15 dark:hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-white/5"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt"
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 dark:border dark:border-white/10 dark:glowing-primary-element">
                  <Upload className="h-6 w-6" id="upload-icon" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {fileName ? fileName : "Drag & Drop Resume PDF / TXT"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    or click to search locally
                  </p>
                </div>
                {resumeText && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 dark:border dark:border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Content parsed ({resumeText.length} chars)
                  </span>
                )}
              </div>
            ) : (
              /* RAW TEXT PASTE AREA */
              <div className="space-y-1.5" id="pasted-resume-box">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pasted Resume Text Editor</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your comprehensive resume or write employment summaries here..."
                  rows={8}
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-700 dark:text-white"
                />
              </div>
            )}

            {/* ROLE GOAL SELECTION */}
            <div className="space-y-3 pt-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" /> 2. Target Pivot / Career Goal
              </span>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  "AI & Machine Learning Infrastructure Systems",
                  "Technical Product Manager / AI Product Director",
                  "Principal Cloud Architect & Scalability lead"
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      setCustomRoleInput("");
                    }}
                    className={`text-left text-xs p-2.5 rounded-lg border transition ${
                      targetRole === role && !customRoleInput
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-semibold"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Custom pivot goal */}
              <div className="pt-1.5 space-y-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Or specify custom pivot goal:</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Decentralized Web Lead, Quantitative Dev"
                  value={customRoleInput}
                  onChange={(e) => {
                    setCustomRoleInput(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={executeAiAnalysis}
              disabled={isLoading || !resumeText.trim()}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white p-3.5 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none dark:glowing-primary-element"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Gemini Model Context Reasoning...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Analyse Skill Gaps & Map Roadmap
                </>
              )}
            </button>

          </div>

          <div className="rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 text-xs space-y-2 text-slate-600 dark:text-slate-400 backdrop-blur-md">
            <h4 className="font-bold text-slate-800 dark:text-slate-300">How to use:</h4>
            <p>1. Copy sample triggers from the top-right button cards, or browse/upload a personal PDF file.</p>
            <p>2. Select the sector to analyze against.</p>
            <p>3. TalentAI calls the Google Gemini API to produce an actionable strategy catalog.</p>
          </div>

        </div>

        {/* Output Panel (Right - 7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {isLoading ? (
            /* Loading State Shimmers */
            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-8 space-y-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-white/10 rounded" />
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-xl" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-11/12 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 dark:bg-white/5 rounded" />
              </div>
              <div className="space-y-2 pt-4">
                <p className="text-center text-xs text-slate-500 font-mono">
                  Prompt engineering: Asking Gemini to return structured taxonomy of career pivots...
                </p>
              </div>
            </div>
          ) : analysis ? (
            /* ACTIVE RESULTS SECTION */
            <div className="space-y-8" id="active-results-section">
              
              {/* Profile Card Header */}
              <div className="bg-white dark:bg-white/5  rounded-xl border border-slate-200/60 dark:border-white/10 p-6 shadow-sm space-y-4 transition-all duration-300 backdrop-blur-xl hover:border-slate-350 dark:hover:border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                      {analysis.candidateName}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Pivot Target: {analysis.professionalTitle}
                    </p>
                  </div>
                  <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-xl px-4 py-3 text-center sm:min-w-[124px] border border-blue-500/20 dark:border-blue-500/30 dark:glowing-primary-element">
                    <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      {matchRatio}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Initial Alignment
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest">AI Profile Summary</label>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-1 text-slate-600 dark:text-slate-300 font-mono border dark:border-white/5">
                    Experience: {analysis.experienceYears} Years
                  </span>
                  
                  {/* Matching skills Pill box */}
                  <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-550/20 px-3 py-1 text-emerald-700 dark:text-emerald-300 font-mono">
                    Matching skills count: {analysis.matchingSkills.length} Checked
                  </span>
                </div>
              </div>

              {/* Skill Gap Analysis Dashboard */}
              <div className="space-y-4 font-display">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-blue-500" /> Skill Gap Dashboard
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Missing VS Matching Matrix</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matching List Card */}
                  <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 space-y-3 backdrop-blur-xl">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Strong Matching Assets
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.matchingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs transition duration-150 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantitative Learning Timeline Chart */}
                  <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 flex flex-col justify-between backdrop-blur-xl">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider pb-2">
                      Est. Training Hours by Category
                    </h4>
                    <div className="h-32 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCategoryChartData()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="category" tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                          <YAxis tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} width={24} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.12)" }} />
                          <Bar dataKey="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Gaps / Missing list detail */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detailed Gap Diagnosis</h4>
                  
                  {hasMissingSkills ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.missingSkills.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 space-y-3 shadow-xs hover:border-slate-350 dark:hover:border-blue-500/50 transition backdrop-blur-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.skill}</h5>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.category}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              item.relevance === "High"
                                ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                                : item.relevance === "Medium"
                                ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                : "bg-slate-150 border-slate-200 text-slate-650 dark:bg-white/5 dark:border-white/10 dark:text-slate-300"
                            }`}>
                              {item.relevance} Priority
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10 pt-2 pb-1">
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <Clock className="h-3 w-3 text-blue-500" /> {item.estimatedHoursToLearn}h study
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-slate-400" /> {item.recommendedCourses.length} tools
                            </span>
                          </div>

                          <div className="space-y-1 bg-slate-50 dark:bg-black/40 p-2 rounded-lg border dark:border-white/5">
                            <span className="block text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Recommended Syllabi</span>
                            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-600 dark:text-slate-300">
                              {item.recommendedCourses.map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Perfect Fit! No noticeable skill gaps found for the target role description.
                    </div>
                  )}
                </div>
              </div>

              {/* Personalized Career Learning Roadmap Timeline */}
              <div className="space-y-4 font-display">
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" /> Personalized Learning Roadmap
                </h3>

                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-8 pl-6">
                  {analysis.roadmap.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot Marker */}
                      <span className="absolute -left-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-4 ring-white dark:ring-slate-900 shadow">
                        {idx + 1}
                      </span>

                      <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 space-y-3.5 shadow-xs transition hover:border-blue-500/50 dark:hover:border-white/15 backdrop-blur-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.phase}</h4>
                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{step.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 animate-pulse">
                            <span className="font-mono text-[10px] bg-blue-500/10 dark:bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/25 text-blue-600 dark:text-blue-400">
                              Goal: {step.objective}
                            </span>
                          </div>
                        </div>

                        {/* List Topics */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 tracking-wider">Concept Focus Areas</span>
                          <div className="flex flex-wrap gap-1.5">
                            {step.topics.map((t, tIdx) => (
                              <span key={tIdx} className="bg-slate-50 dark:bg-white/5 text-slate-650 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="space-y-1 px-3 py-2 bg-blue-500/5 dark:bg-blue-500/10 rounded-lg border dark:border-white/5">
                          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider">Milestone Projects & Labs</span>
                          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                            {step.actionItems.map((act, actIdx) => (
                              <li key={actIdx} className="leading-relaxed">
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resource link */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                          <span>Main Guide: <span className="text-slate-800 dark:text-slate-200 font-semibold">{step.learningResource}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Companies fitting candidate */}
              <div className="space-y-4 font-display">
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" id="building-target-icon" /> Current High-Fit Target Companies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.targetCompanies.map((com, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 space-y-3 hover:border-slate-300 dark:hover:border-blue-500/50 transition backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                          {com.companyName}
                        </span>
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20">
                          {com.matchPercent}% Match
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-450 dark:text-slate-400">Position Path</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{com.role}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-450 dark:text-slate-400">Est. Salary Range</span>
                        <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">{com.salary}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-50 dark:border-white/10 pt-2">
                        {com.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-96 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
              <Compass className="h-12 w-12 text-slate-300" />
              <p className="text-sm font-semibold">No active Career Architecture is loaded</p>
              <p className="text-xs max-w-sm">Use the left workspace parameters or load a mock baseline from the presets list above to begin.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
