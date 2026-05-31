import { ResumeAnalysis, ScreeningResult, BulkCandidateSim } from "./types";

export const SAMPLE_RESUMES = {
  pivotToAI: `ALEXANDER CHEN
alexander.chen@email.com | (555) 019-2834 | San Francisco, CA
GitHub: github.com/alechen | LinkedIn: linkedin.com/in/alechen-dev

PROFESSIONAL SUMMARY
Highly motivated Senior Full-Stack Software Engineer with 6+ years of experience building secure, scalable web applications. Expert in TypeScript, React, Node.js, and relational databases. Strong track record of improving system performance and leading agile engineering squads. Actively seeking to leverage software expertise into AI Engineering and Machine Learning Infrastructure.

TECHNICAL SKILLS
- Languages: JavaScript/TypeScript, Python, SQL, HTML5/CSS3, Go
- Frameworks & Libs: React, Next.js, Node.js, Express, Fastify, Tailwind CSS
- Databases & Queues: PostgreSQL, Redis, MongoDB, PostgreSQL, Kafka
- DevOps & Cloud: AWS (S3, EC2, CloudFront), Docker, GitHub Actions, CI/CD, Terraform
- Methodologies: Agile/Scrum, System Design, Unit Testing (Jest, Vitest)

PROFESSIONAL EXPERIENCE
Senior Software Engineer | InnovateTech Systems | 2023 - Present
- Architected a real-time analytics dashboard backend using Node.js and Kafka, improving event processing throughput by 40% and reducing latency below 100ms.
- Built a reusable component library in React/Tailwind, standardizing UI patterns for three separate teams and speeding up frontend delivery cycles by 35%.
- Mentored 4 junior and mid-level engineers, leading architectural reviews and modernizing legacy server migrations.

Full-Stack Developer | DevFlow Solutions | 2021 - 2023
- Designed and launched a multi-tenant client portal in Next.js and PostgreSQL, supporting 25,000+ monthly active users and securing 99.9% uptime.
- Structured Python scripts to aggregate user behavior metric pipelines, storing findings in AWS S3 and utilizing Pandas for reports.
- Spearheaded PostgreSQL query optimization, reducing index sizes and accelerating slow dashboard aggregates by 50%.

Software Engineer | CloudScale Corp | 2020 - 2021
- Developed RESTful API endpoints in Express/Node.js, integrating Stripe paywalls and OAuth authentication schemes.
- Integrated comprehensive Jest test coverage across core microservices, lifting overall code coverage from 60% to 92%.

EDUCATION & CERTIFICATIONS
B.S. in Computer Science | San Jose State University | Graduated 2020
AWS Certified Solutions Architect – Associate | Valid through 2026`,

  managerPivot: `SARAH JENKINS, MBA
sarah.jenkins@email.com | (555) 382-9901 | New York, NY
Portfolio: sarahj-pmsf.com | LinkedIn: linkedin.com/in/sarahj-pm

PROFESSIONAL SUMMARY
Dynamic Product Manager with 5+ years of experience leading cross-functional teams to build SaaS platforms. Proven expert in user research, backlog prioritization, product roadmap design, and go-to-market strategies. Led 3 high-impact product launches resulting in a cumulative $14M ARR growth. Seeking to transition into an AI-driven or highly Technical Product Management role.

TECHNICAL SKILLS
- Product Management: Agile/Scrum, Product Roadmap, JIRA, Amplitude, Mixpanel, User Research, Figma
- Technology Concepts: Web APIS, Machine Learning Foundations, System Design Concepts, SQL, basic Python
- Business: Market Strategy, Pricing & packaging, MBA, OKRs, Stakeholder Management

PROFESSIONAL EXPERIENCE
Lead Product Manager | CloudSaaS Labs | 2023 - Present
- Spearheaded the conception and delivery of an automated email campaign workflow feature, driving a 22% increase in customer activation.
- Managed a 12-person cross-functional squad of engineers, UX researchers, and QA testers utilizing Kanban and Scrum.
- Defined and tracked key performance metrics (Amplitude), discovering friction points that lowered user churn by 4.5%.

Product Manager | Fintech Hub | 2021 - 2023
- Pivoted user onboarding flows using customized micro-interactions, leading to a 30% surge in trial-to-paid conversions.
- Conducted 50+ user interviews to detail requirements for a secure banking API portal, resulting in the successful integration of 12 enterprise accounts.

Associate Product Manager | RetailScale Inc | 2019 - 2021
- Conducted competitive market analyses and pricing studies that optimized high-density e-commerce SKUs, raising net margins by 12%.
- Generated comprehensive PRDs, mockups, and user stories while directly operating as Product Owner for visual layout updates.

EDUCATION & MBA
MBA in Technology Management | NYU Stern School of Business | Graduated 2019
B.S. in Business Administration | Boston University | Graduated 2017`,

  unstableResume: `JOHN SMITH
j.smith@email.com | (555) 555-5555 | Denver, CO

PROFESSIONAL SUMMARY
Agile React developer who loves moving fast. Experienced with React, Node.js and Tailwind CSS. Prefers rapid scaling tech environment with high output requirements.

PROFESSIONAL EXPERIENCE
Frontend Developer | TechStartup Alpha | Jan 2026 - Present (5 months)
- Developed responsive features using Tailwind. Left to seek better growth.

Software Engineer | DevCorp | Jun 2025 - Dec 2025 (7 months)
- Maintained a React Dashboard. Left during company restructure.

React Support Contractor | GigConsulting | Oct 2024 - May 2025 (8 months)
- Built landing pages for various small clients.

Junior Developer | SaaSLaunch | Mar 2024 - Sep 2024 (7 months)
- Handled styling and bug tickets for an e-commerce platform.

EDUCATION
Self-taught React, General Assembly Coding bootcamp certified.`
};

export const MOCK_CANDIDATE_ANALYSED: ResumeAnalysis = {
  candidateName: "Alexander Chen",
  professionalTitle: "AI & Machine Learning Infrastructure Systems pivot",
  summary: "Highly skilled Senior Developer with 6+ years of strong background in distributed systems, high-scale APIs, and Kafka. Extremely well-positioned to pivot into ML Platform/Infrastructure Engineering given solid Python, Docker, system design, and performance optimizations expertise.",
  experienceYears: 6,
  matchingSkills: ["Python", "Docker", "Kafka", "PostgreSQL", "Systems Architecture", "API Design", "Agile Management", "Data Pipelines (Pandas)"],
  missingSkills: [
    {
      skill: "PyTorch & TensorFlow Orchestration",
      category: "Machine Learning Frameworks",
      description: "Hands-on experience compiling deep learning models, configuring tensor computations, and managing deep neural net weights on hardware accelerators.",
      relevance: "High",
      estimatedHoursToLearn: 80,
      recommendedCourses: ["Deep Learning Specialization (Coursera/DeepLearning.AI)", "PyTorch for Deep Learning Bootcamp (Udemy)"]
    },
    {
      skill: "Kubeflow & MLflow (MLOps)",
      category: "MLOps & Orchestration",
      description: "Deploying and scaling machine learning pipelines, organizing experiment logs, running hyperparameter tuning, and containerizing models for scalable inferences.",
      relevance: "High",
      estimatedHoursToLearn: 60,
      recommendedCourses: ["MLOps Specialization (Coursera by Andrew Ng)", "MLflow Official Getting Started Documentation Guide"]
    },
    {
      skill: "NVIDIA CUDA & GPU Performance Optimizations",
      category: "Hardware Acceleration",
      description: "Understanding GPU memory hierarchies, streaming processors, tensor cores, and writing distributed model training setups across multi-node structures.",
      relevance: "Medium",
      estimatedHoursToLearn: 40,
      recommendedCourses: ["NVIDIA Deep Learning Institute (DLI) - Fundamentals of CUDA C/C++", "Parallel Programming with GPUs (Udacity)"]
    },
    {
      skill: "Vector Databases & Semantic Search",
      category: "Data Architectures",
      description: "Architecting indexing engines using Pinecone, Milvus, or pgvector for retrieval-augmented generation (RAG) pipelines and high-dimensional embeddings.",
      relevance: "High",
      estimatedHoursToLearn: 30,
      recommendedCourses: ["Vector Databases: From Embeddings to RAG (DeepLearning.AI)", "Pinecone Developer Docs & Tutorials"]
    }
  ],
  roadmap: [
    {
      phase: "Phase 1: Deep Learning Fundamentals",
      duration: "Weeks 1-4",
      objective: "Gain core mathematical and implementation knowledge of Neural Networks, backpropagation, and tensor mathematical operations.",
      topics: ["Matrix math & derivatives", "Multi-layer perceptrons in PyTorch", "CNNs and RNNs overview", "Optimization functions (Adam, SGD)"],
      actionItems: [
        "Recreate backpropagation from scratch in raw Numpy.",
        "Build a multi-class image classifier using PyTorch on an open-source dataset.",
        "Configure learning rate schedules and observe convergence behaviors."
      ],
      learningResource: "Deep Learning Specialization by Coursera or Fast.ai 'Practical Deep Learning for Coders'"
    },
    {
      phase: "Phase 2: MLOps and Machine Learning Pipelines",
      duration: "Weeks 5-8",
      objective: "Apply software engineering best practices to model deployment, logging, and continuous training infrastructures.",
      topics: ["MLflow experiment tracking", "Data versioning (DVC)", "Feature stores concepts", "Kubeflow pipeline setups"],
      actionItems: [
        "Integrate MLflow into a python script to log model metrics, hyperparameters, and artifacts.",
        "Dockerize PyTorch model inference into a FastAPIs server with standardized JSON request/response schema.",
        "Write full GitHub actions workflows to trigger model compilation warnings."
      ],
      learningResource: "Coursera: Machine Learning Engineering for Production (MLOps)"
    },
    {
      phase: "Phase 3: High-Scale ML Platform Orchestration",
      duration: "Weeks 9-12",
      objective: "Synthesize systems architecture skill with GPU optimizations, high throughput model serving, and distributed storage.",
      topics: ["Triton Inference Server", "Ray core & distributed training", "Pinecone/pgvector lookup indexing", "GPU profiling"],
      actionItems: [
        "Implement a fully functional Retrieval-Augmented Generation (RAG) system with a Pinecone vector DB and OpenAI/Gemini integration.",
        "Deploy a mock Ray cluster inside local Docker environment and perform dynamic task distributions across workers.",
        "Optimize models with standard quantization (FP16/INT8) and measure throughput changes."
      ],
      learningResource: "Triton Inference Server Developer Guide and Ray cluster configuration templates"
    }
  ],
  targetCompanies: [
    {
      companyName: "Anyscale",
      role: "Distributed ML Systems Engineer",
      salary: "$165,000 - $210,000",
      matchPercent: 82,
      reason: "Your high scale background in Kafka and systems optimization is a flawless match for ray cluster performance tuning, although you must supplement your ML pipeline orchestrations."
    },
    {
      companyName: "Scale AI",
      role: "Data Infrastructure Engineer",
      salary: "$150,000 - $190,000",
      matchPercent: 85,
      reason: "They need robust backend infrastructures capable of hosting petabytes of training datasets, managing task queues, and handling complex PostgreSQL analytics pipelines where you rank highly."
    },
    {
      companyName: "Pinecone",
      role: "Backend Database Developer",
      salary: "$160,000 - $205,000",
      matchPercent: 78,
      reason: "Perfect opportunity to utilize GOLANG, C++, or Rust backend optimization skills combined with vector index designs and high-speed in-memory database caching."
    }
  ]
};

export const MOCK_JOB_DESCRIPTION = `Senior Full-Stack Product Engineer
We are seeking a highly motivated Senior Full-Stack Engineer who can operate at the intersection of robust backend services and spectacular user interfaces.

Requirements:
- 5+ years of production experience in TypeScript, React, and Node.js.
- Strong knowledge of database architectures (PostgreSQL and in-memory caches like Redis).
- Experience setting up secure CI/CD pipelines, Docker containers, and Cloud infrastructure (AWS/GCP).
- Deep commitment to user experience, visual layouts, and fast feature deliveries.
- Risk Alert: We seek highly stable candidates with a history of long stays (2+ years per team) to help core platform growth.`;

export const MOCK_SCREENED_CANDIDATES: ScreeningResult[] = [
  {
    candidateId: "1",
    candidateName: "Alexander Chen",
    professionalTitle: "Senior Full-Stack Engineer",
    matchScore: 92,
    riskScore: "Low",
    riskReasoning: "Extremely stable employment history. He has spent 2.5 years at InnovateTech and 2 years at DevFlow. Graduated from SJSU with a CS degree. Solid record of staying with companies to observe long-term architectural success.",
    stabilityAnalysis: "Alexander showcases strong stability. He holds dual multi-year stints at tech sectors, demonstrating career growth, accountability, and the patience needed to develop deep contextual engineering assets.",
    strengths: [
      "Expert knowledge of React, Node.js, and TypeScript, matching 100% of our frontend-backend syntax requirements.",
      "Hands-on architectural designs with distributed systems, logging 40% speed optimizations using Kafka streams.",
      "Clear mentorship qualities, previously elevating four junior and mid level code-base partners."
    ],
    weaknesses: [
      "Limited native cloud administration in GCP (his main experience highlights AWS assets), though easily transferable.",
      "Lacks raw styling portfolio visuals, focusing primarily on logical dashboards rather than brand narrative animations."
    ],
    interviewQuestions: [
      "Can you walk us through how you optimized the PostgreSQL slow aggregates? What metrics did you use to track queries?",
      "How do you handle disagreement in code architectural reviews between dev team peers?",
      "Why are you looking to shift towards AI? How do you envision applying Kafka experience to ML clusters?"
    ],
    overallRecommendation: "Strong Move Forward. Alexander matches all technical markers with stellar stability credentials. He is highly likely to remain with the squad and deliver immense enterprise engineering value."
  },
  {
    candidateId: "2",
    candidateName: "Sarah Jenkins",
    professionalTitle: "Lead Product Manager",
    matchScore: 65,
    riskScore: "Medium",
    riskReasoning: "Excellent product leader, but background is heavily geared toward management, user metrics, and Amplitude dashboards rather than individual full-stack React and SQL coding requirements.",
    stabilityAnalysis: "Very stable tenure, holding a Lead PM role for over 3 years. This indicates excellent culture fit and long-term grit, but in a non-technical configuration.",
    strengths: [
      "Superb cross-functional leadership qualities, perfect for managing complex customer deliverables.",
      "Elite tracking of commercial KPIs, reducing user churn by 4.5% using strategic user interviews.",
      "MBA from Technology-forward Stern school, providing sophisticated business acumen."
    ],
    weaknesses: [
      "Lacks hands-on TypeScript, Nest/Node API or backend coding experience specified in the Job Description.",
      "No actual docker container configurations or AWS infrastructure pipelines found on the resume."
    ],
    interviewQuestions: [
      "Can you describe your involvement in technical implementation? Have you written code or handled databases in your products?",
      "To what extent have you designed or configured APIs? Talk about system design concepts you find beautiful."
    ],
    overallRecommendation: "Hold on active engineer pipeline. Her technical background is not aligned with our individual coding requirements. Consider screening her for a Technical Product Manager role instead."
  },
  {
    candidateId: "3",
    candidateName: "John Smith",
    professionalTitle: "Frontend Developer",
    matchScore: 48,
    riskScore: "High",
    riskReasoning: "Severe tenure risk. The candidate has changed jobs 4 times in the past 2.5 years, with the longest stint lasting only 8 months. High probability of departure within 6 months of hire.",
    stabilityAnalysis: "Extremely unstable job history. Over-representation of short-lived stays (5 mos, 7 mos, 8 mos, 7 mos) creates a major continuity liability. Candidate leaves before onboarding investments pay off.",
    strengths: [
      "Quick developer, proficient with CSS utility frameworks like Tailwind and React UI bindings.",
      "Immediately available to join, showing short notice bounds in current portfolio gig."
    ],
    weaknesses: [
      "High probability of churn under standard deadlines.",
      "No experienced knowledge of relational web structures (PostgreSQL, indexes) or complex cloud configurations.",
      "Self-taught coding bootcamper with shallow algorithmic system fundamentals."
    ],
    interviewQuestions: [
      "What led to your team changes over the past two years? How do you assess if a platform holds long-term alignment for you?",
      "Can you detail a complex React state conflict you debugged? How did you approach resolution?"
    ],
    overallRecommendation: "Reject. Despite solid basic React styling skills, his high tenure-hopping score poses a massive disruption risk to core project continuity."
  }
];

// Rich datasets to simulate automated screening reduction of 500 candidate resumes
export const MOCK_BULK_STATS = [
  { step: "Initial Pool", count: 500, label: "Unfiltered Resumes", description: "Resumes uploaded or parsed from databases" },
  { step: "Profile Parse", count: 320, label: "Valid Contact info & Formats", description: "Filter corrupt or incorrectly formatted files" },
  { step: "Keyword Screen", count: 180, label: "Core Skills Match (5+ years TS/React)", description: "Parsed skill profiles matching the target job description" },
  { step: "Stability Assessment", count: 65, label: "Stability & Tenure Filter", description: "Filter out extreme tenure risks (e.g., jobs changed < 8 months)" },
  { step: "Deep AI Audit", count: 22, label: "Gemini Quality Breakdown Score", description: "Comprehensive automated verification of achievements and summaries" },
  { step: "Top Picks", count: 10, label: "Low-Risk Champions Selected", description: "Final top matched low-risk candidates mapped for human recruiter review" }
];

// Generates 45 fake data profiles to show inside the recruiter simulator list
export const generateBulkProfiles = (): BulkCandidateSim[] => {
  const titles = ["Senior Fullstack Architect", "React Developer", "TypeScript API Lead", "System Engineer", "Node Developer", "Frontend Specialist"];
  const companies = ["TechCorp", "Initech", "SaaSLink", "WebFlow", "SoftGrid", "CloudDev"];
  const names = [
    "Daniel Kim", "Sarah Jenkins", "Alexander Chen", "John Smith", "Michael Chang", "Emily Davis",
    "Emma Watson", "David Miller", "Sophia Taylor", "James Anderson", "Olivia Martinez", "Ryan Garcia",
    "Jessica White", "Andrew Thomas", "Liam Harris", "Chloe Clark", "Nathan Rodriguez", "Zoe Lewis",
    "Matthew Walker", "Isabella Hall", "Tyler Allen", "Mia Young", "William Wright", "Abigail King"
  ];
  const skillsList = [
    ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
    ["React", "HTML/CSS", "JavaScript", "Tailwind"],
    ["Python", "Node.js", "Docker", "MongoDB", "Redux"],
    ["TypeScript", "Go", "Kubernetes", "Kafka", "PostgreSQL"],
    ["JavaScript", "React", "Express", "SQL"],
  ];

  return names.map((name, i) => {
    // Make first three consistent with our MOCK_SCREENED_CANDIDATES
    if (i === 1) {
      return {
        id: "cand-2",
        name: "Sarah Jenkins",
        title: "Lead Product Manager",
        matchScore: 65,
        riskScore: "Medium" as const,
        skills: ["Strategy", "Analytic Metrics", "Agile", "SQL"],
        experience: "5 Years (CloudSaaS Labs)",
        isFiltered: false
      };
    }
    if (i === 2) {
      return {
        id: "cand-1",
        name: "Alexander Chen",
        title: "Senior Full-Stack Engineer",
        matchScore: 92,
        riskScore: "Low" as const,
        skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Kafka"],
        experience: "6 Years (InnovateTech)",
        isFiltered: false
      };
    }
    if (i === 3) {
      return {
        id: "cand-3",
        name: "John Smith",
        title: "Frontend Developer",
        matchScore: 48,
        riskScore: "High" as const,
        skills: ["React", "CSS", "Tailwind"],
        experience: "1 Year (TechStartup Alpha)",
        isFiltered: false
      };
    }

    const t = titles[i % titles.length];
    const score = 40 + (i * 13) % 55;
    const skills = skillsList[i % skillsList.length];
    let risk: 'Low' | 'Medium' | 'High' = "Low";
    if (score < 55) risk = "High";
    else if (score < 75) risk = "Medium";

    return {
      id: `cand-bulk-${i}`,
      name,
      title: t,
      matchScore: score,
      riskScore: risk,
      skills,
      experience: `${2 + (i % 6)} Years (${companies[i % companies.length]})`,
      isFiltered: false
    };
  }).sort((a,b) => b.matchScore - a.matchScore);
};
