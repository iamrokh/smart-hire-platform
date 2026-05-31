export interface MissingSkill {
  skill: string;
  category: string;
  description: string;
  relevance: 'High' | 'Medium' | 'Low';
  estimatedHoursToLearn: number;
  recommendedCourses: string[];
}

export interface RoadmapStep {
  phase: string;
  duration: string;
  objective: string;
  topics: string[];
  actionItems: string[];
  learningResource: string;
}

export interface TargetCompany {
  companyName: string;
  role: string;
  salary: string;
  matchPercent: number;
  reason: string;
}

export interface ResumeAnalysis {
  candidateName: string;
  professionalTitle: string;
  summary: string;
  experienceYears: number;
  matchingSkills: string[];
  missingSkills: MissingSkill[];
  roadmap: RoadmapStep[];
  targetCompanies: TargetCompany[];
}

export interface ScreeningResult {
  candidateId: string;
  candidateName: string;
  professionalTitle: string;
  matchScore: number;
  riskScore: 'Low' | 'Medium' | 'High';
  riskReasoning: string;
  stabilityAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  interviewQuestions: string[];
  overallRecommendation: string;
}

export interface BulkCandidateSim {
  id: string;
  name: string;
  title: string;
  matchScore: number;
  riskScore: 'Low' | 'Medium' | 'High';
  skills: string[];
  experience: string;
  isFiltered: boolean; // whether still in matching pool during simulation step
}
