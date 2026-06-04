import React, { useState, useRef } from "react";
import { 
  Upload, FileText, Sparkles, BookOpen, Clock, Target, AlertCircle, CheckCircle2,
  Compass, GraduationCap, Building2
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ResumeAnalysis } from "../types";
import { SAMPLE_RESUMES } from "../mockData";

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
          reject(new Error("متن خوانایی در فایل PDF یافت نشد. این ممکن است یک فایل اسکن‌شده تصویری باشد. لطفاً سابقه خود را مستقیماً کپی-پیست کنید."));
        } else {
          resolve(fullText);
        }
      } catch (err: any) {
        reject(new Error("خطای پردازشگر PDF: " + err.message));
      }
    };
    fileReader.onerror = () => reject(new Error("خطا در بارگذاری اولیه باینری فایل."));
    fileReader.readAsArrayBuffer(file);
  });
}

const MOCK_CANDIDATE_ANALYSED_FA: ResumeAnalysis = {
  candidateName: "Alexander Chen",
  professionalTitle: "Senior AI / ML Infrastructure Engineer",
  summary: "برنامه‌نویس ارشد و سینیور با بیش از ۶ سال تجربه حرفه‌ای در سیستم‌های توزیع‌شده، APIهای پرسرعت و مدیریت رویداد در بستر Kafka. آمادگی فوق‌العاده‌ای برای تغییر مسیر حرفه‌ای به ML Platform / Infrastructure Engineering بر اساس تخصص عمیق پایتون، داکر، System Design و بهینه‌سازی کارایی دارد.",
  experienceYears: 6,
  matchingSkills: ["Python", "Docker", "Kafka", "PostgreSQL", "معماری سیستم", "طراحی API", "متدولوژی‌های Agile", "Data Pipelines (Pandas/S3)"],
  missingSkills: [
    {
      skill: "Distributed DNN Orchestration (PyTorch & TensorFlow)",
      category: "فریم‌ورک‌های Machine Learning",
      description: "تجربه عملی در زمینه Optimization و Compilation مدلهای Deep Learning، مدیریت Tensor Computation Matrices و پیکربندی Weights شبکه های عصبی روی Hardware Accelerators.",
      relevance: "High",
      estimatedHoursToLearn: 80,
      recommendedCourses: ["Deep Learning تخصصی (Coursera - DeepLearning.AI)", "کارگاه تخصصی فریم‌ورک PyTorch (Udemy)"]
    },
    {
      skill: "ابزارهای Kubeflow و MLflow (MLOps)",
      category: "مدیریت و استقرار مدل (MLOps)",
      description: "Deployment و Auto-scaling خودکارِ ML Pipelines، Orchestration لاگهای آموزش مدل، Hyperparameter Optimization و Containerization مدلها در ابعاد Industrial-scale.",
      relevance: "High",
      estimatedHoursToLearn: 60,
      recommendedCourses: ["Machine Learning کاربردی در استقرار محصول (Coursera - Andrew Ng)", "مستندات شروع سریع و رسمی MLflow"]
    },
    {
      skill: "NVIDIA CUDA و ارتقاء کارایی محاسبات موازی روی GPU",
      category: "شتاب‌دهی سخت‌افزاری",
      description: "درک Memory Hierarchy در Multi-GPU Accelerators، پیادهسازی Parallel Computing Kernels و مدیریت Shared Memory در سطح Tasks.",
      relevance: "Medium",
      estimatedHoursToLearn: 40,
      recommendedCourses: ["موسسه آموزش عمیق انویدیا (DLI) - مبانی CUDA C/C++", "برنامه‌نویسی سیستم‌های موازی (Udacity)"]
    },
    {
      skill: "Vector Databases و سیستم‌های جستجوی معنایی",
      category: "معماری پایگاه‌داده‌های پیشرفته",
      description: "طراحی Architecture و Indexing موتورهای جستجوی Semantic Search بر بستر pgvector یا Vector Databases مانند Pinecone و Milvus جهت توسعه Advanced RAG Pipelines.",
      relevance: "High",
      estimatedHoursToLearn: 30,
      recommendedCourses: ["مدیریت داده‌های برداری بر بستر Pinecone و RAG پایپلین‌ها (DeepLearning.AI)"]
    }
  ],
  roadmap: [
    {
      phase: "فاز ۱: مبانی تخصصی ریاضی و برنامه‌نویسی Deep Learning",
      duration: "هفته‌های ۱ تا ۴",
      objective: "کسب دانش عمیق ریاضی و فرمول‌های دیفرانسیل شبکه‌های عصبی پیش‌خور و محاسبات تانسوری پیوسته.",
      topics: ["جبر خطی کاربردی و توابع زیان", "توسعه شبکه‌های عصبی چندلایه در PyTorch", "معماری مقدماتی شبکه‌های عصبی کانولوشنالی و عودکننده (CNN/RNN)", "تابع‌های ممیزی وزن (Adam و SGD)"],
      actionItems: [
        "پیاده‌سازی الگوریتم Backpropagation از صفر به کمک NumPy.",
        "توسعه یک سیستم طبقه‌بندی تصویر چندکلاسه با PyTorch روی دیتابست متن‌باز CIFAR-10.",
        "بررسی کارایی نرخ‌های یادگیری مختلف و مصورسازی زمان همگرایی دقت مدل."
      ],
      learningResource: "دوره تخصصی یادگیری عمیق Coursera یا آموزش‌های ویدیویی کاربردی Fast.ai"
    },
    {
      phase: "فاز ۲: ارکستراسیون MLOps و مهندسی خطوط لوله هوش مصنوعی",
      duration: "هفته‌های ۵ تا ۸",
      objective: "اعمال بهترین الگوهای توسعه نرم‌افزار بر مدیریت نسخه‌های داده، استقرار، مانیتورینگ کارایی و تست مدل‌ها.",
      topics: ["مدیریت تسک‌های آزمایشگاهی در MLflow", "مدیریت دقیق نسخه‌های داده (DVC)", "مفاهیم Feature Store پیشرفته", "معماری سیستم و کار با Kubeflow Pipelines"],
      actionItems: [
        "یکپارچه‌سازی MLflow در اسکریپت مدل‌سازی برای ثبت دائمی متریک‌های ارزیابی، ابرپارامترها و نمونه‌های تولیدشده.",
        "کانتینری‌سازی و داکرایز کردن سرور پیش‌بینی مدل PyTorch در قالب یک وب‌سرویس سریع FastAPI با خروجی JSON قانونمند.",
        "طراحی یک خط لوله تمام‌خودکار در گیت‌هاب اکشنز (GitHub Actions) جهت اجرای ارزیابی صحت پس از هر ویرایش کدهای پایتون."
      ],
      learningResource: "دوره تخصصی مهندسی خطوط لوله استقرار بهینه یادگیری ماشین (Coursera)"
    },
    {
      phase: "فاز ۳: ارکستراسیون پلتفرم هوش مصنوعی در ابعاد بزرگ",
      duration: "هفته‌های ۹ تا ۱۲",
      objective: "ترکیب تجارب مهندسی سیستم‌های توزیع‌شده با بهینه‌سازی شتاب‌دهنده‌های فیزیکی کارت گرافیک و ارتقاء پهنای باند.",
      topics: ["Triton Inference Server", "مدیریت تسک‌های محاسباتی سنگین با فریم‌ورک توزیع‌شده Ray", "موتور بهینه‌سازی کوانتیزه مدل مجدد", "پروفایل منابع رم کارت گرافیک"],
      actionItems: [
        "پیاده‌سازی یک پلاتفرم پاسخ‌دهی هوشمند به محتوا (RAG) با ادغام Pinecone و سیستم چندعاملی هوش مصنوعی مولد گوگل Gemini.",
        "راه‌اندازی کلاستر محلی شبیه‌سازی کارهای موازی Ray در بستر داکر و بررسی توزیع بار میان گره‌های محاسباتی.",
        "بهینه‌سازی مدل‌های لودشده با مکانیزم‌های کوانتیزه‌سازی استاندارد (مانند INT8 یا FP16) و مقایسه سرعت پرس‌وجو."
      ],
      learningResource: "مستندات توسعه و پیکربندی رسمی Triton Server و ساختارهای توزیع کار هوشمند Ray"
    }
  ],
  targetCompanies: [
    {
      companyName: "Anyscale",
      role: "Distributed ML Systems Engineer",
      salary: "$165,000 - $210,000",
      matchPercent: 82,
      reason: "تجربه درخشان شما در توسعه و مدیریت بستر توزیع‌شده Kafka و پایش پهنای باند، انطباق بالایی برای پرفورمنس تیونینگ کلاسترهای محاسباتی Ray دارد، اگرچه باید بر مهندسی ML Pipelines تمرکز بیشتری بگذارید."
    },
    {
      companyName: "Scale AI",
      role: "Data Infrastructure Engineer",
      salary: "$150,000 - $190,000",
      matchPercent: 85,
      reason: "آن‌ها نیازمند سیستم‌های توزیع‌یافته منعطف با قابلیتِ جابجایی ترابایت‌ها داده‌های آموزشی تصویری و ویدیویی در صف‌های توزیع‌شده هستند که تخصص PostgreSQL شما ارزش بسیار بالایی دارد."
    },
    {
      companyName: "Pinecone",
      role: "Backend Database Developer",
      salary: "$160,000 - $205,000",
      matchPercent: 78,
      reason: "بستری بی‌نظیر برای به کارگیری تجارب قبلی در بهینه‌سازی سریع پایگاه‌های داده، حافظه پنهان Redis و نمایه‌سازی سریع امبدینگ‌ها."
    }
  ]
};

export default function CandidateWorkspace() {
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("AI Infrastructure / ML Platform Engineer");
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(MOCK_CANDIDATE_ANALYSED_FA);
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
        setErrorMsg(err.message || "خطا در پردازش فایل PDF.");
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
      setErrorMsg("فرمت فایل مورد قبول نیست. لطفاً یک فایل با پسوند .pdf یا .txt آپلود نمایید یا متن خود را مستقیماً کپی-پیست کنید.");
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
    setFileName(`رزومه_پیش‌نمایش_${key}.txt`);
    setPasteMode(false);
    if (key === "managerPivot") {
      setTargetRole("Technical Product Manager / AI Product Manager");
    } else {
      setTargetRole("AI Infrastructure / ML Platform Engineer");
    }
  };

  // Trigger server-side AI resume analysis
  const executeAiAnalysis = async () => {
    if (!resumeText.trim()) {
      setErrorMsg("لطفاً ابتدا فایل رزومه خود را بارگذاری کنید یا متن آن را در خانه مربوطه کپی-پیست نمایید.");
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
        throw new Error(errJson.error || "سرور درخواست پردازش رزومه تجربی را رد کرد.");
      }

      const result: ResumeAnalysis = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "خطا در برقراری ارتباط با پلتفرم هوش مصنوعی. مطمئن شوید کلید GEMINI_API_KEY در اسرار توسعه پروژه ثبت شده باشد.");
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
    <div className="space-y-10" id="candidate-hub-container" dir="rtl">
      
      {/* Introduction Banner */}
      <div className="bg-gradient-to-br from-blue-950/30 via-slate-900/40 to-indigo-950/35 border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 h-48 w-48 bg-blue-500/10 blur-[80px] rounded-full -ml-12 -mt-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-right">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
              <Sparkles className="h-3.5 w-3.5" /> مخصوص کارجویان و توسعه‌دهندگان کریر
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              آنالیزر هوشمند Skill Gap و طراحی Roadmap مسیر شغلی
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              رزومه فعلی خود را آپلود کنید و عنوان شغلی هدف خود را مشخص نمایید. این پلتفرم با تحلیل هوشمند مدل هوشمند Gemini، مهارت‌های شما را تجزیه و تحلیل کرده، شکاف‌های شغلی را ممیزی می‌کند، نقشه‌راه‌های آموزشی (Roadmap) گام‌به‌گام ترسیم کرده و بهترین فرصت‌های بازار را به شما پیشنهاد می‌دهد.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => loadDemoResume("pivotToAI", "الکساندر چن")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer border border-white/10 hover:border-white/20"
            >
              نمونه رزومه: Shift به هوش مصنوعی
            </button>
            <button
              onClick={() => loadDemoResume("managerPivot", "سارا جنکینز")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition cursor-pointer border border-white/10 hover:border-white/20"
            >
              نمونه رزومه: Shift به Technical PM
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input panel (Right Column in Persian RTL - 5 columns) */}
        <div className="lg:col-span-12 lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-6 shadow-sm space-y-6 transition-all duration-300 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-display">
                <FileText className="h-4 w-4 text-blue-500" /> ۱. آپلود رزومه یا درج متن رزومه
              </span>
              <button 
                onClick={() => setPasteMode(!pasteMode)} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-pointer"
              >
                {pasteMode ? "آپلود فایل (Drag & Drop)" : "کپی/پیست متن"}
              </button>
            </div>

            {/* ERROR ALERT BOX */}
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="text-right">
                  <p className="font-bold">خطای پردازش رزومه (Resume Parsing Error)</p>
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
                    {fileName ? fileName : "فایل رزومه PDF یا TXT خود را به اینجا بکشید یا Drag & Drop کنید"}
                  </p>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 font-sans">
                    یا برای انتخاب فایل کلیک کنید
                  </p>
                </div>
                {resumeText && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 dark:border dark:border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> متن استخراج شد ({resumeText.length} کاراکتر)
                  </span>
                )}
              </div>
            ) : (
              /* RAW TEXT PASTE AREA */
              <div className="space-y-1.5 text-right" id="pasted-resume-box">
                <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">متن کپی‌شده رزومه (Resume Text):</label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="متن رزومه خود را در این کادر کپی-پیست کنید..."
                  rows={8}
                  className="w-full text-right rounded-lg border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            )}

            {/* ROLE GOAL SELECTION */}
            <div className="space-y-3 pt-2 text-right">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" /> ۲. موقعیت شغلی (Role) هدف یا تخصص مورد نظر
              </span>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  "AI Infrastructure / ML Platform Engineer",
                  "Technical Product Manager / AI Product Manager",
                  "Senior Cloud Architect / DevOps Lead"
                ].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      setCustomRoleInput("");
                    }}
                    className={`text-right text-xs p-2.5 rounded-lg border transition ${
                      targetRole === role && !customRoleInput
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-semibold"
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10 text-slate-755 dark:text-slate-300"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Custom pivot goal */}
              <div className="pt-1.5 space-y-1">
                <label className="text-xs font-semibold text-slate-550 dark:text-slate-400">یا خودتان یک عنوان شغلی سفارشی بنویسید:</label>
                <input
                  type="text"
                  placeholder="مثال: Big Data Engineer, CTO, DevOps..."
                  value={customRoleInput}
                  onChange={(e) => {
                    setCustomRoleInput(e.target.value);
                  }}
                  className="w-full text-right rounded-lg border border-slate-200 px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
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
                  در حال ممیزی رزومه و آنالیز توسط هوش مصنوعی (Gemini)...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" /> ممیزی Skillها و ترسیم Roadmap توسعه شغلی
                </>
              )}
            </button>

          </div>

          <div className="rounded-xl border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 text-xs space-y-2 text-slate-600 dark:text-slate-400 backdrop-blur-md text-right">
            <h4 className="font-bold text-slate-800 dark:text-slate-300">راهنمای استفاده:</h4>
            <p>۱. یکی از رزومه‌های دمو (Alex یا Sarah) را در بالای صفحه انتخاب کرده یا رزومه دلخواه خود را آپلود کنید.</p>
            <p>۲. موقعیت شغلی (Role) هدف خود را تعیین کنید.</p>
            <p>۳. روی دکمه ممیزی کلیک کنید تا هوش مصنوعی فورا یک تحلیل دقیق از خلاءهای مهارتی و Roadmap گام‌به‌گام ارائه دهد.</p>
          </div>

        </div>

        {/* Output Panel (Left Column in Persian RTL - 7 columns) */}
        <div className="lg:col-span-12 lg:col-span-7 space-y-8">
          
          {isLoading ? (
            /* Loading State Shimmers */
            <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-8 space-y-6 animate-pulse">
              <div className="flex items-center gap-4 flex-row-reverse text-right">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-white/10 rounded mr-auto" />
                  <div className="h-3 w-1/2 bg-slate-100 dark:bg-white/5 rounded mr-auto" />
                </div>
              </div>
              <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-xl" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-11/12 bg-slate-200 dark:bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 dark:bg-white/5 rounded" />
              </div>
              <div className="space-y-2 pt-4">
                <p className="text-center text-xs text-slate-500 font-sans">
                  طراحی مدل‌های یادگیری و ممیزی مهارت‌ها: درخواست تدوین ساختارمند تغییر مسیر شغلی از Google Gemini...
                </p>
              </div>
            </div>
          ) : analysis ? (
            /* ACTIVE RESULTS SECTION */
            <div className="space-y-8 text-right" id="active-results-section">
              
              {/* Profile Card Header */}
              <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-6 shadow-sm space-y-4 transition-all duration-300 backdrop-blur-xl hover:border-slate-350 dark:hover:border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4 flex-row-reverse">
                  <div className="text-right">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-start flex-row-reverse font-sans">
                      {analysis.candidateName}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium font-sans">
                      موقعیت شغلی هدف: {analysis.professionalTitle}
                    </p>
                  </div>
                  <div className="bg-blue-500/5 dark:bg-blue-500/10 rounded-xl px-4 py-3 text-center sm:min-w-[124px] border border-blue-500/20 dark:border-blue-500/30 dark:glowing-primary-element">
                    <span className="block text-2xl font-extrabold text-blue-600 dark:text-blue-400" dir="ltr">
                      {matchRatio}%
                    </span>
                    <span className="text-[10px] font-sans text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                      درصد انطباق مهارت‌ها (Skill Match)
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-sans">خلاصه تحلیل هوش مصنوعی (AI Analysis Summary):</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {analysis.summary}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-xs justify-start">
                  <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-1 text-slate-600 dark:text-slate-300 font-sans border dark:border-white/5">
                    سابقه کار: {analysis.experienceYears} سال
                  </span>
                  
                  {/* Matching skills Pill box */}
                  <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-500/20 px-3 py-1 text-emerald-700 dark:text-emerald-300 font-sans">
                    مهارت‌های منطبق (Matching Skills): {analysis.matchingSkills.length} مورد
                  </span>
                </div>
              </div>

              {/* Skill Gap Analysis Dashboard */}
              <div className="space-y-4 font-sans text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 flex-row-reverse">
                    <Compass className="h-5 w-5 text-blue-500" /> داشبورد تحلیل Skill Gap و ممیزی مهارت‌ها
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500">مقایسه توانمندی‌های فعلی با نیازمندی‌های شغلی</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Matching List Card */}
                  <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 space-y-3 backdrop-blur-xl">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 flex-row-reverse font-sans">
                      <CheckCircle2 className="h-4 w-4" /> مهارت‌های منطبق (Matching Skills)
                    </h4>
                    <div className="flex flex-wrap gap-1.5 justify-start">
                      {analysis.matchingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs transition duration-150 font-sans"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quantitative Learning Timeline Chart */}
                  <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 flex flex-col justify-between backdrop-blur-xl">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider pb-2 text-right">
                      زمان تخمینی یادگیری (ساعت)
                    </h4>
                    <div className="h-32 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getCategoryChartData()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="category" tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                          <YAxis tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} width={24} orientation="right" />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.12)", textAlign: "right" }} />
                          <Bar dataKey="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Gaps / Missing list detail */}
                <div className="space-y-3 pt-2 text-right">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">جزئیات خلاءهای مهارتی (Skill Gaps)</h4>
                  
                  {hasMissingSkills ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.missingSkills.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 space-y-3 shadow-xs hover:border-slate-350 dark:hover:border-blue-500/50 transition backdrop-blur-md"
                        >
                          <div className="flex items-start justify-between gap-2 flex-row-reverse text-right">
                            <div className="text-right">
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.skill}</h5>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{item.category}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${
                              item.relevance === "High" || item.relevance === "بالا"
                                ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                                : item.relevance === "Medium" || item.relevance === "متوسط"
                                ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                : "bg-slate-150 border-slate-200 text-slate-650 dark:bg-white/5 dark:border-white/10 dark:text-slate-300"
                            }`}>
                              اولویت {item.relevance}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-605 dark:text-slate-300 leading-relaxed text-right">
                            {item.description}
                          </p>

                          <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/10 pt-2 pb-1 flex-row-reverse justify-end font-sans">
                            <span className="flex items-center gap-1 font-semibold text-slate-705 dark:text-slate-300">
                              <Clock className="h-3 w-3 text-blue-500" /> {item.estimatedHoursToLearn} ساعت مطالعه
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3 text-slate-400" /> منابع پیشنهادی: {item.recommendedCourses.length}
                            </span>
                          </div>

                          <div className="space-y-1 bg-slate-50 dark:bg-black/40 p-2 rounded-lg border dark:border-white/5 text-right font-sans">
                            <span className="block text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">سرفصل‌ها و منابع یادگیری پیشنهادی:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-600 dark:text-slate-300 mr-2">
                              {item.recommendedCourses.map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2 flex-row-reverse text-right">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> انطباق بی‌نقص! شکاف مهارتی فاحشی برای مقصد مورد نظر شما شناسایی نشد.
                    </div>
                  )}
                </div>
              </div>

              {/* Personalized Career Learning Roadmap Timeline */}
              <div className="space-y-4 font-sans text-right">
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 flex-row-reverse">
                  <GraduationCap className="h-5 w-5 text-blue-500" /> Roadmap مهارت‌آموزی شخصی‌سازی‌شده و پروژه‌محور
                </h3>

                {/* Optimised Persian RTL Timeline structure mapping: border-r-2, mr-4, pr-6 */}
                <div className="relative border-r-2 border-slate-200 dark:border-slate-800 mr-4 space-y-8 pr-6 pl-0 ml-0 border-l-0 text-right">
                  {analysis.roadmap.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot Marker aligned to the right: -right-[35px] */}
                      <span className="absolute -right-[35px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-4 ring-white dark:ring-slate-900 shadow pb-[1px]" dir="ltr">
                        {idx + 1}
                      </span>

                      <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 space-y-3.5 shadow-xs transition hover:border-blue-500/50 dark:hover:border-white/15 backdrop-blur-md font-sans">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-row-reverse text-right">
                          <div className="text-right">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.phase}</h4>
                            <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{step.duration}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-sans text-[10px] bg-blue-500/10 dark:bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/25 text-blue-600 dark:text-blue-400">
                              هدف نهایی فاز: {step.objective}
                            </span>
                          </div>
                        </div>

                        {/* List Topics */}
                        <div className="space-y-1 text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block">موضوعات و مفاهیم کلیدی (Key Topics)</span>
                          <div className="flex flex-wrap gap-1.5 justify-start font-sans">
                            {step.topics.map((t, tIdx) => (
                              <span key={tIdx} className="bg-slate-50 dark:bg-white/5 text-slate-655 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-white/5">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Items */}
                        <div className="space-y-1 px-3 py-2 bg-blue-500/5 dark:bg-blue-500/10 rounded-lg border dark:border-white/5 text-right font-sans">
                          <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 tracking-wider block">پروژه‌های کاربردی و عملی (Hands-on Projects)</span>
                          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside mr-2">
                            {step.actionItems.map((act, actIdx) => (
                              <li key={actIdx} className="leading-relaxed">
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resource link */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-1.5 flex-row-reverse justify-end font-sans">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                          <span>منابع پیشنهادی: <span className="text-slate-800 dark:text-slate-200 font-semibold">{step.learningResource}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Companies fitting candidate */}
              <div className="space-y-4 font-sans text-right">
                <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2 flex-row-reverse">
                  <Building2 className="h-5 w-5 text-blue-500" id="building-target-icon" /> فرصت‌های شغلی پیشنهادی و پتانسیل بازار
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.targetCompanies.map((com, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-4 space-y-3 hover:border-slate-300 dark:hover:border-blue-500/50 transition backdrop-blur-md font-sans"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2 flex-row-reverse">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block truncate text-right">
                          {com.companyName}
                        </span>
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20" dir="ltr">
                          {com.matchPercent}%
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <span className="block text-[10px] text-slate-400">عنوان شغلی پیشنهادی</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{com.role}</span>
                      </div>

                      <div className="space-y-1 text-right">
                        <span className="block text-[10px] text-slate-400">محدوده حقوق تخمینی (سالیانه)</span>
                        <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold" dir="ltr">{com.salary}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-50 dark:border-white/10 pt-2 text-right">
                        {com.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-96 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2 font-sans">
              <Compass className="h-12 w-12 text-slate-300 animate-pulse" />
              <p className="text-sm font-semibold text-slate-850 dark:text-slate-300">دیتا یا آنالیزی یافت نشد</p>
              <p className="text-xs max-w-sm">برای شروع تحلیل، رزومه خود را آپلود کنید یا دکمه‌های درج نمونه دمو در بالای صفحه را کلیک کنید.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
