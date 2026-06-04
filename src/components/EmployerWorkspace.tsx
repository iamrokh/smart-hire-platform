import React, { useState, useEffect } from "react";
import { 
  Briefcase, Activity, ShieldAlert, Sparkles, AlertCircle, FileText, 
  CheckCircle2, Sliders, UserCheck, HelpCircle, Zap, Trash2
} from "lucide-react";
import { ScreeningResult, BulkCandidateSim } from "../types";
import { generateBulkProfiles, SAMPLE_RESUMES } from "../mockData";

const MOCK_JOB_DESCRIPTION_FA = `موقعیت شغلی: Senior MLOps Pipeline Engineer
تسلط کامل بر معماری داده distributed، ابزارهای Kubeflow & MLflow، حداقل ۴ سال تجربه برنامه‌نویسی Python، فریم‌ورک PyTorch و بهینه‌سازی GPU/CUDA.
معیار ارزیابی Tenure: برخورداری از ثبات شغلی مناسب و سابقه همکاری مستمر در پروژه‌های قبلی (حداقل ۲ سال به طور متوسط در هر موقعیت جهت کاهش ریسک جابجایی مکرر).`;

const MOCK_BULK_STATS_FA = [
  { step: "مخزن ورودی", count: 500, label: "رزومه‌های دریافتی (Pool)", description: "رزومه‌های ارسال‌شده یا اسکن شده در بانک اطلاعاتی فعال" },
  { step: "اعتبارسنجی اولیه", count: 320, label: "بررسی فرمت و فایل‌ها", description: "حذف فایل‌های مخدوش، ناقص یا فرمت‌های ناسازگار با سیستم" },
  { step: "انطباق مهارت‌ها", count: 180, label: "اسکن مهارتهای Core/Tech", description: "فیلتر بر اساس تسلط بر زبان‌ها و ابزارهای کلیدی پشته فنی" },
  { step: "تحلیل Tenure & ماندگاری", count: 65, label: "ممیزی ثبات کاری و جابجایی", description: "ارزیابی الگوی جابجایی کارجو و حذف رزومه‌های پرخطر از نظر پایداری شغلی" },
  { step: "ممیزی عمیق هوش مصنوعی", count: 22, label: "آنالیز دستاوردها با Gemini AI", description: "ارزیابی عمیق کیفیت پروژه‌ها، نقش در معماری و دستاوردهای گذشته با هوش مصنوعی" },
  { step: "نامزدهای نهایی (Verified)", count: 10, label: "لیست طلایی کاندیداهای کم‌ریسک", description: "کاندیداهای تاییدشده با بالاترین انطباق مهارتی و پایدارترین رزومه‌ها" }
];

const MOCK_SCREENED_CANDIDATES_FA: ScreeningResult[] = [
  {
    candidateId: "cand-1",
    candidateName: "الکساندر چن",
    professionalTitle: "Senior Fullstack / Frontend Engineer (JavaScript)",
    matchScore: 92,
    riskScore: "Low",
    riskReasoning: "ارزیابی ریسک Tenure: پایین (Low Risk). دارای ثبات شغلی بسیار خوب و سوابق منسجم. همکاری مستمر به مدت ۲.۵ سال در InnovateTech و ۲ سال در DevFlow. فارغ‌التحصیل Computer Science با سابقه عالی ماندگاری در تیم‌ها جهت ارزیابی کارکرد معماری‌ها در بلندمدت.",
    stabilityAnalysis: "الکساندر پایداری بسیار بالایی در پروژه‌های گذشته نشان می‌دهد. دوره همکاری چندساله در محیط‌های مدرن فنی، نمادی از بلوغ حرفه‌ای، حس مالکیت یا Ownership مهندسی بالا و تعهد کاری به پایداری محصول است.",
    strengths: [
      "تسلط کامل بر پشته فنی مدرن TypeScript، React و Node.js هماهنگ با نیازهای Core سیستم.",
      "طراحی معماری distributed با راندمان بالا و بهینه‌سازی رخدادها با Kafka تا مرز ۴۰ درصد بهبود پرفورمنس.",
      "دارای سابقه Mentorship موفق و کمک به رشد فنی ۴ برنامه‌نویس Junior."
    ],
    weaknesses: [
      "تجربه کمتر در Google Cloud (عمدتاً بر روی AWS مسلط است) هرچند به راحتی قابل انطباق است.",
      "تمرکز بسیار زیاد بر روی منطق بک‌اند و پرفورمنس موتور رندرینگ تا طراحی متحرک رابط کاربری."
    ],
    interviewQuestions: [
      "روند عیب‌یابی و بهینه‌سازی کوئری‌های کند PostgreSQL را شرح دهید و بگویید با چه سنجه‌هایی آن را مانیتور کردید؟",
      "در مواجهه با چالش‌های فنی یا معماری مخالف در جلسات Code Review تیمی چطور همگرایی ایجاد می‌کنید؟",
      "علت اصلی تمایل شما برای مهاجرت کاری به زیرساخت‌ها و کلاسترهای یادگیری ماشین چیست؟"
    ],
    overallRecommendation: "تصمیم قوی برای پیشبرد فرآیند استخدام. الکساندر انطباق فنی ایده‌آل را به همراه پایداری عالی در رزومه ترکیب کرده و ارزش افزوده بالایی برای تیم خلق خواهد کرد."
  },
  {
    candidateId: "cand-2",
    candidateName: "سارا جنکینز",
    professionalTitle: "Senior Technical Product Manager",
    matchScore: 65,
    riskScore: "Medium",
    riskReasoning: "ارزیابی ریسک Tenure: متوسط (Medium Risk). مدیر محصول توانمند با تمرکز بالا بر روی بازاریابی و معیارهای رشد کسب‌وکار، اما سابقه فنی و توسعه دست‌به‌کد او با پشته فنی جاوااسکریپت همپوشانی مستقیمی ندارد.",
    stabilityAnalysis: "ثبات عالی در نقش‌های قبلی با بیش از ۳ سال همکاری مستمر در رهبری ابعاد محصول. این سوابق نشان‌دهنده پایداری و تعهد بالا به تیم و ارزش‌های محصول است.",
    strengths: [
      "توانایی قوی در هدایت تیم‌های چندمنظوره و پیشبرد فرآیندها با متدولوژی چابک (Agile).",
      "اندازه‌گیری و تحلیل KPIهای کلیدی، نرخ بازگشت سرمایه و کاهش Churn کاربر تا ۴.۵ درصد.",
      "فارغ‌التحصیل MBA با درک عمیق از تحلیل بازار و مدل‌های درآمدی در حوزه‌ نرم‌افزارهای سازمانی."
    ],
    weaknesses: [
      "عدم برخورداری از سابقه برنامه‌نویسی زنده با TypeScript یا کار جدی با NestJS.",
      "تجربه مستقیم کم در راه‌اندازی داکر و ارتباط با پایپلین‌های فرآیندهای CI/CD یا ابرهای ساختار یافته."
    ],
    interviewQuestions: [
      "نحوه تعامل فنی خود با مهندسان بک‌اند را توصیف کنید. آیا تجربه تحلیل ساختار کوئری‌ها را دارید؟",
      "چگونه معماری میکروسرویس‌ها یا تصمیمات طراحی سیستم را در تدوین نقشه راه (Roadmap) محصول لحاظ می‌کنید؟"
    ],
    overallRecommendation: "امکان بررسی برای موقعیت‌های مدیریت محصول (SaaS Product Management). مهارت‌های او برای توسعه نرم‌افزار کافی نیست، اما شایستگی فوق‌العاده‌ای در رهبری بیزینس و تیم‌های فنی دارد."
  },
  {
    candidateId: "cand-3",
    candidateName: "جان اسمیت",
    professionalTitle: "Frontend Developer (React)",
    matchScore: 48,
    riskScore: "High",
    riskReasoning: "ارزیابی ریسک Tenure: بالا (High Risk). ریسک جابجایی مکرر بسیار بالاست. متقاضی در ۲.۵ سال گذشته ۴ بار شرکت خود را تغییر داده و حداکثر ماندگاری او ۸ ماه بوده است. احتمال ترک کار زودهنگام در بازه کمتر از ۶ ماه شدیداً بالاست.",
    stabilityAnalysis: "سابقه ناپایدار و نوسان Tenure. جابجایی‌های مکرر در دوره‌های کوتاه (زیر ۱۰ ماه) ریسک بالایی برای پیوستگی تیم ایجاد کرده و هزینه‌های Onboarding کارفرما را اتلاف می‌کند.",
    strengths: [
      "کدخوان سریع و مسلط به طراحی‌های مدرن و زیبا با Tailwind CSS و کتابخانه‌های Component.",
      "آمادگی کامل و بدون وقفه برای شروع به کار با توجه به سابقه فعالیت فریلنس اخیر."
    ],
    weaknesses: [
      "احتمال ترک کار زودهنگام هنگام بروز چالش در ددلاین‌های سنگین پروژه‌ها.",
      "عدم دسترسی به دانش پایه‌ای عمیق پیرامون مباحث مدیریت حافظه دیتابیس، لود بالانسینگ و زیرساخت کلود.",
      "آموزش‌دیده در دوره‌‌های کوتاه برنامه‌نویسی (Bootcamp) با دانش تئوریک مهندسی متوسط."
    ],
    interviewQuestions: [
      "علت اصلی تغییرات مکرر شرکت‌ها در ۲ سال گذشته چه بوده؟ چطور Tenure و پایداری بلندمدت یک پلتفرم را برای شخص خود ارزیابی می‌کنید؟",
      "از تجربه خود در برطرف کردن باگ مدیریت استیت‌ها در پروژه‌های پیچیده فرانت‌اند صحبت کنید."
    ],
    overallRecommendation: "عدم تایید درخواست. با وجود مهارت‌های فنی مطلوب در بخش فرانت‌اند، نوسان بالای ماندگاری او پایداری فرآیندها و تداوم کار تیمی ما را با ریسک جدی مواجه می‌کند."
  }
];

export default function EmployerWorkspace() {
  const [jobDescription, setJobDescription] = useState(MOCK_JOB_DESCRIPTION_FA);
  const [activeStep, setActiveStep] = useState(5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [candidates, setCandidates] = useState<BulkCandidateSim[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningResult | null>(MOCK_SCREENED_CANDIDATES_FA[0]);
  
  // Custom screen interface states
  const [isScreening, setIsScreening] = useState(false);
  const [screenedList, setScreenedList] = useState<ScreeningResult[]>(MOCK_SCREENED_CANDIDATES_FA);
  const [pastedResume, setPastedResume] = useState("");
  const [screenerErrorMsg, setScreenerErrorMsg] = useState<string | null>(null);
  
  // Resume upload states
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [remainingTokens, setRemainingTokens] = useState(150000);

  const handleDeleteCandidate = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = screenedList.filter(cand => cand.candidateId !== candidateId);
    setScreenedList(updatedList);
    if (selectedCandidate?.candidateId === candidateId) {
      setSelectedCandidate(updatedList.length > 0 ? updatedList[0] : null);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setUploadedFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setUploadedFileSize(`${sizeInKb} KB`);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === "string") {
        setPastedResume(event.target.result);
      }
    };
    reader.readAsText(file);
  };

  const clearUploadedFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setPastedResume("");
  };

  // Initialize candidates list once and apply local Farsi names
  useEffect(() => {
    const rawList = generateBulkProfiles();
    // Transliterate names and titles to Persian for immersive UI coherence
    const faFullStackList = rawList.map(item => {
      let faName = item.name;
      let faTitle = item.title;
      let faExp = item.experience;

      if (item.name === "Alexander Chen") { faName = "الکساندر چن"; faTitle = "Senior Fullstack / MLOps Candidate"; faExp = "۶ سال (InnovateTech)"; }
      else if (item.name === "Sarah Jenkins") { faName = "سارا جنکینز"; faTitle = "Senior Technical Product Manager"; faExp = "۵ سال (CloudSaaS)"; }
      else if (item.name === "John Smith") { faName = "جان اسمیت"; faTitle = "Frontend Developer (React)"; faExp = "۱ سال (Startup Alpha)"; }
      else if (item.name === "Daniel Kim") { faName = "دانیال کیم"; faTitle = "Backend Engineer (Python)"; }
      else if (item.name === "Michael Chang") { faName = "مایکل چنگ"; faTitle = "Distributed Systems Engineer"; }
      else if (item.name === "Emily Davis") { faName = "امیلی دیویس"; faTitle = "Lead Data Engineer / Architect"; }
      else if (item.name === "Olivia Martinez") { faName = "اولیویا مارتینز"; faTitle = "Senior UI / Frontend Developer"; }
      else if (item.name === "Emma Watson") { faName = "امّا واتسون"; faTitle = "DevOps & Cloud Engineer"; }

      return {
        ...item,
        name: faName,
        title: faTitle,
        experience: faExp
      };
    });
    setCandidates(faFullStackList);
  }, []);

  // Simulate algorithmic profile reduction from 500 to 10
  const triggerBulkSimulation = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setActiveStep(0);
    
    // Reset candidates state with custom localized list
    const pool = generateBulkProfiles().map(item => {
      let faName = item.name;
      let faTitle = item.title;
      let faExp = item.experience;

      if (item.name === "Alexander Chen") { faName = "الکساندر چن"; faTitle = "Senior Fullstack / MLOps Candidate"; faExp = "۶ سال (InnovateTech)"; }
      else if (item.name === "Sarah Jenkins") { faName = "سارا جنکینز"; faTitle = "Senior Technical Product Manager"; faExp = "۵ سال (CloudSaaS)"; }
      else if (item.name === "John Smith") { faName = "جان اسمیت"; faTitle = "Frontend Developer (React)"; faExp = "۱ سال (Startup Alpha)"; }
      else if (item.name === "Daniel Kim") { faName = "دانیال کیم"; faTitle = "Backend Engineer (Python)"; }
      else if (item.name === "Michael Chang") { faName = "مایکل چنگ"; faTitle = "Distributed Systems Engineer"; }
      else if (item.name === "Emily Davis") { faName = "امیلی دیویس"; faTitle = "Lead Data Engineer / Architect"; }

      return {
        ...item,
        name: faName,
        title: faTitle,
        experience: faExp,
        isFiltered: false
      };
    });
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
      if (currentStepNum < MOCK_BULK_STATS_FA.length) {
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
    }, 1200);
  };

  // Run a real-time Gemini screen API on a custom resume pasted in by recruiters
  const executePastedScreen = async () => {
    if (!pastedResume.trim()) {
      setScreenerErrorMsg("لطفاً ابتدا رزومه کاندیدا را با درگ‌-اند-دراپ یا با کلیک روی بخش آپلود وارد کنید.");
      return;
    }

    setIsScreening(true);
    setScreenerErrorMsg(null);

    const nameToUse = "کارجوی ممیزی شده";
    const titleToUse = "متخصص فرآیند";

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
        throw new Error(errJson.error || "سرور درخواست غربالگری کاندیدا را رد نمود.");
      }

      const result: ScreeningResult = await response.json();
      setScreenedList(prev => [result, ...prev]);
      setSelectedCandidate(result);
      
      // Deduct a realistic tokens amount
      const promptTokensUsed = Math.floor(Math.random() * 800) + 1200;
      setRemainingTokens(prev => Math.max(0, prev - promptTokensUsed));
    } catch (err: any) {
      console.error(err);
      setScreenerErrorMsg(err.message || "برقراری ارتباط با مدل ارزیابی با شکست مواجه شد. از پیکربندی درست لایسنس Gemini اطمینان حاصل کنید.");
    } finally {
      setIsScreening(false);
    }
  };

  return (
    <div className="space-y-10" id="employer-portal-container" dir="rtl">
      
      {/* Immersive Introduction Banner */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900/40 to-slate-950/40 border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-0 h-48 w-48 bg-indigo-500/10 blur-[80px] rounded-full -ml-12 -mt-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-right">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              <Briefcase className="h-3.5 w-3.5" /> مخصوص کارفرمایان و پورتال جذب نیروی بااستعداد
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              غربالگر خودکار انبوه و ممیزی ثبات استخدامی
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              پیشران ارزیابی مهارت‌ها و ریسک لغزش کاندیداها بر بستر معیارهای عینا تعریف‌شده. با استفاده از فیلترینگ پیاپی هوشمند، مخزن ۵۰۰ عددی متقاضیان را پردازش کنید، یا رزومه تجربی کاندید خاصی را جهت عارضه‌یابی ثبات استخدامی دستی وارد نماید.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Columns (Sourcing Constraints & Job Description Inputs - 5 Columns) */}
        <div className="lg:col-span-12 lg:col-span-5 space-y-6">
          
          {/* Section 1: Target requirements */}
          <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm space-y-4 backdrop-blur-xl text-right">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 font-display justify-start">
              <Briefcase className="h-4 w-4 text-indigo-500" /> گزاره‌ها و فیلترهای موقعیت هدف
            </span>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="شرح انتظارات و شرایط سخت‌گیرانه برای ماندگاری کاندیداها را در این بخش پیست کنید..."
              rows={20}
              className="w-full text-right rounded-lg border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white font-sans ring-offset-background"
            />

            {/* Resume Upload Box */}
            <div className="space-y-2 text-right">
              <span className="text-xs font-bold text-slate-650 dark:text-slate-300 block">آپلود رزومه</span>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resume-file-input")?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                  isDragging 
                    ? "border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10" 
                    : uploadedFileName 
                    ? "border-emerald-500/55 bg-emerald-50/5 dark:bg-emerald-950/5" 
                    : "border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:dark:border-indigo-400"
                }`}
              >
                <input
                  type="file"
                  id="resume-file-input"
                  className="hidden"
                  accept=".txt,.md,.pdf,.docx,.json"
                  onChange={handleFileInputChange}
                />
                
                {uploadedFileName ? (
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-full truncate block" dir="ltr">
                      {uploadedFileName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {uploadedFileSize}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearUploadedFile();
                      }}
                      className="mt-2 text-[10px] text-rose-500 hover:text-rose-600 font-bold hover:underline bg-rose-500/10 hover:bg-rose-500/15 px-2.5 py-1 rounded"
                    >
                      حذف و بارگذاری مجدد
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 select-none text-right">
                    <FileText className="h-8 w-8 text-slate-400 dark:text-slate-650 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      رزومه کاندیدا را در این بخش رها کنید یا برای انتخاب فایل کلیک کنید
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      فرمت‌های متنی پشتیبانی‌شده: TXT, MD, PDF, DOCX
                    </span>
                  </div>
                )}
              </div>
            </div>

            {screenerErrorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs text-rose-700 dark:bg-rose-955/20 dark:border-rose-900/30 dark:text-rose-455 text-right flex items-center gap-2 flex-row-reverse">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{screenerErrorMsg}</span>
              </div>
            )}

            {/* Bottom layout: Submit & Token counter */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/5 flex-row-reverse">
              {/* Submit button */}
              <button
                onClick={executePastedScreen}
                disabled={isScreening || !pastedResume.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition duration-150 disabled:opacity-50 dark:glowing-primary-element font-display"
              >
                {isScreening ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent animate-infinite" />
                    تحلیل با هوش مصنوعی...
                  </>
                ) : (
                  <>
                    ثبت و تحلیل رزومه
                  </>
                )}
              </button>

              {/* Token counter panel styled elegantly */}
              <div className="flex items-center gap-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-900/40 text-left font-mono">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-none font-sans font-medium">توکن‌های باقیمانده</span>
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block mt-1" dir="ltr">
                    {remainingTokens.toLocaleString()} / 150,000
                  </span>
                </div>
                <Zap className="h-4 w-4 text-indigo-500 shrink-0" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns (Simulation Candidates & Detail Visualizers - 7 Columns) */}
        <div className="lg:col-span-12 lg:col-span-7 space-y-8">

          {/* TWO PANEL CANDIDATES WORKSPACE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-display">
            
            {/* Screened candidates list (Right component in Persian - 5 columns) */}
            <div className="md:col-span-12 md:col-span-12 lg:col-span-5 bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm space-y-4 backdrop-blur-xl text-right">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2 flex-row-reverse">
                <h4 className="text-xs font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  متقاضیان غربال شده ({screenedList.length})
                </h4>
                <span className="text-[10px] text-blue-650 font-bold dark:text-blue-400">کاندیداهای نهایی متمایز</span>
              </div>

              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pl-1">
                {screenedList.map((cand, idx) => {
                  const isSelected = selectedCandidate?.candidateId === cand.candidateId;
                  const scoreColor = cand.matchScore >= 80 ? "text-emerald-500" : cand.matchScore >= 60 ? "text-amber-500" : "text-rose-500";
                  
                  return (
                    <div
                      key={cand.candidateId || idx}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3 rounded-lg border text-right cursor-pointer transition flex justify-between gap-3 items-start flex-row-reverse ${
                        isSelected
                          ? "border-blue-500 bg-blue-50/20 dark:bg-blue-950/20"
                          : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0 text-right">
                        <div className="flex gap-2 items-center flex-row-reverse">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{cand.candidateName}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border shrink-0 ${
                            cand.riskScore === "Low"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300"
                              : cand.riskScore === "Medium"
                              ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300"
                              : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-300"
                          }`}>
                            ریسک {cand.riskScore === "Low" ? "پایین" : cand.riskScore === "Medium" ? "متوسط" : "بالا"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-450 block truncate font-sans">{cand.professionalTitle}</p>
                      </div>

                      <div className="text-left text-xs shrink-0 flex flex-col items-end gap-1 select-none">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleDeleteCandidate(cand.candidateId, e)}
                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 p-1 rounded transition cursor-pointer"
                            title="حذف ارزیابی"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <span className={`text-xs ${scoreColor}`} dir="ltr">
                            {cand.matchScore}%
                          </span>
                        </div>
                        <span className="text-[8px] text-slate-400 block font-sans">تطابق مهارتی</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Deep details Inspection Panel (Left component in Persian - 7 columns) */}
            <div className="md:col-span-12 md:col-span-12 lg:col-span-7 bg-white dark:bg-white/5 rounded-xl border border-slate-200/60 dark:border-white/10 p-5 shadow-sm backdrop-blur-xl text-right">
              {selectedCandidate ? (
                <div className="space-y-4 font-sans text-right" id="deep-inspection-card">
                  
                  {/* Title block */}
                  <div className="border-b border-slate-100 dark:border-white/10 pb-3 font-display">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedCandidate.candidateName}
                    </h4>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                      {selectedCandidate.professionalTitle}
                    </p>
                  </div>

                  {/* Matching rating & Alert bar */}
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="bg-blue-500/5 dark:bg-black/30 p-2.5 rounded-lg flex-1 border border-blue-500/15 text-center">
                      <span className="block text-xs text-slate-400 font-sans">امتیاز انطباق موقعیت</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-display" dir="ltr">{selectedCandidate.matchScore}%</span>
                    </div>

                    <div className="bg-amber-500/5 dark:bg-black/30 p-2.5 rounded-lg flex-1 border border-amber-500/15 text-center">
                      <span className="block text-xs text-slate-400 font-sans">برآورد ریسک استخدام</span>
                      <span className={`text-lg font-extrabold block truncate font-sans ${
                        selectedCandidate.riskScore === "Low" ? "text-emerald-500" : selectedCandidate.riskScore === "Medium" ? "text-amber-500" : "text-rose-500"
                      }`}>{selectedCandidate.riskScore === "Low" ? "بسیار پایین" : selectedCandidate.riskScore === "Medium" ? "متوسط" : "ریسک بالا"}</span>
                    </div>
                  </div>

                  {/* Tenure stability assessment */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-display">ممیزی ثبات کاری و ماندگاری در رزومه</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50/50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      {selectedCandidate.stabilityAnalysis}
                    </p>
                  </div>

                  {/* Technical gap and risk reasoning */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-650 dark:text-blue-400 uppercase tracking-widest block flex items-center gap-1.5 font-display flex-row-reverse">
                      <ShieldAlert className="h-4 w-4 shrink-0 text-blue-500" /> بررسی ریسک پایداری و فقدان‌های فنی متقاضی
                    </span>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-sans pl-2">
                      {selectedCandidate.riskReasoning}
                    </p>
                  </div>

                  {/* Strengths & Weaknesses (Side-by-side or neat single column layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-1">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-display">نقاط قوت محوری متقاضی</span>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-inside list-disc pr-1 font-sans">
                        {selectedCandidate.strengths.slice(0, 3).map((v, i) => (
                          <li key={i} className="leading-relaxed">{v}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-450 uppercase tracking-widest block font-display">شکاف‌های فنی / نکات منفی محتمل</span>
                      <ul className="space-y-1 text-xs text-rose-800 dark:text-rose-300 list-inside list-disc pr-1 font-sans">
                        {selectedCandidate.weaknesses.slice(0, 2).map((v, i) => (
                          <li key={i} className="leading-relaxed">{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Interview Questions block */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-white/10 text-right">
                    <span className="text-[10px] font-bold text-blue-650 dark:text-blue-450 uppercase tracking-widest block flex items-center gap-1.5 font-display flex-row-reverse">
                      <HelpCircle className="h-4 w-4" /> پرسش‌های تخصصی پیشنهادی جهت ارزیابی در مصاحبه حضوری
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-655 dark:text-slate-400 pr-1">
                      {selectedCandidate.interviewQuestions.map((q, qidx) => (
                        <div key={qidx} className="bg-slate-50/50 dark:bg-black/30 p-3 rounded-lg text-xs leading-relaxed select-all border border-slate-100 dark:border-white/5 text-right font-sans">
                          <span className="font-bold text-blue-500 ml-1.5">{qidx+1}.</span> {q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform decision summary banner */}
                  <div className="space-y-1.5 bg-blue-500/5 border-blue-500/15 border p-3 rounded-xl text-right mt-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block font-display">تصمیم‌نهایی پلتفرم درباره متقاضی استخدام</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {selectedCandidate.overallRecommendation}
                    </p>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 text-slate-400 text-center text-xs">
                  <UserCheck className="h-10 w-10 text-slate-200 mb-2" />
                  لطفاً کارجو را از جدول روبه‌رو انتخاب کُنید تا تحلیل‌های عمیق لایسنس نمایش داده شود.
                </div>
              )}
            </div>

          </div>

          {/* VISUAL CANDIDATES POOL MATRIX IN CHRONOLOGICAL ORDER */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm space-y-3 text-right">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              بانک نمادین رزومه‌های تحت پایش خودکار قیف شبیه‌سازی
            </h4>
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              مجموع عملکرد تائیدی کارجویان در فیلترینگ خودکار. مواردی که فاقد حداقل‌های تداوم شغلی بوده یا همپوشانی مهارتی کمی در شرح کار داشتند کدر شده و با پرواز کرسر بر کاندیداها می‌توانید ارزیابی را فورا آغاز کنید.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 font-display">
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
                        riskReasoning: cand.riskScore === "High" ? "ریسک ماندگاری مکرر. دوره‌های حضور در پروژه‌های قبلی بسیار کوتاه است." : cand.riskScore === "Medium" ? "تداوم شغلی قابل قبول با فاصله‌های جزیی بین موقعیت‌ها." : "ثبات کاری عالی و ماندگاری ایده‌آل در طول زمان استخدام تیمی.",
                        stabilityAnalysis: cand.isFiltered ? "در شبیه‌سازی مراحل قیفی فیلتر شد." : "نمایش ساختارمند سوابق کاری منسجم و رشد پیوسته تخصص.",
                        strengths: ["سوابق مهندسی منسجم.", "آشنایی با متدولوژی‌های عملکرد تیم توکار."],
                        weaknesses: ["آشنایی کمتر با ابزارهای ارزیابی بهینه."],
                        interviewQuestions: [`سهم مشارکت مستقیم خود را در فعالیت ${cand.experience} توضیح دهید.`],
                        overallRecommendation: "نامزد تائیدی کم‌ریسک. مطابقت کامل با حد آستانه‌های پذیرفته‌شده ارزیابی بانک استخدامی."
                      });
                    }
                  }}
                  className={`p-2 rounded border cursor-pointer text-right select-none transition-all duration-300 ${
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
                  
                  <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-slate-50 dark:border-slate-700 flex-row-reverse">
                    <span className={`text-[9px] font-extrabold ${cand.matchScore >= 75 ? "text-emerald-600" : "text-amber-600"}`} dir="ltr">
                      {cand.matchScore}%
                    </span>
                    <span className={`text-[7px] font-bold px-1 rounded uppercase ${
                      cand.riskScore === "Low" ? "bg-emerald-50 text-emerald-700" : cand.riskScore === "Medium" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {cand.riskScore === "Low" ? "کم ریسک" : cand.riskScore === "Medium" ? "ریسک متوسط" : "پر ریسک"}
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
