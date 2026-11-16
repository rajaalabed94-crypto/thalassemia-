export type Language = 'ar' | 'en';

export type ServiceCategory = 
  | 'social_protection'
  | 'eligibility_assistance'
  | 'psychosocial'
  | 'case_management'
  | 'referrals'
  | 'economic_empowerment';

export interface ServiceItem {
  id: string;
  stepNumber: string;
  category: ServiceCategory;
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  description: { en: string; ar: string };
  provider: 'MoSD' | 'TPFS' | 'Joint';
  whoCanBenefit: { en: string; ar: string };
  coverageDetails: { en: string; ar: string };
  requirements: { en: string; ar: string };
  iconName: string;
}

export type CaseStatus = 
  | 'submitted'
  | 'under_review'
  | 'under_assessment'
  | 'referred_to_service'
  | 'service_active'
  | 'service_delivered'
  | 'in_followup';

export interface SupportRequest {
  id: string;
  trackingCode: string; // e.g. THAL-2026-00482
  createdAt: string;
  fullName: string;
  phone: string;
  nationalId?: string; // Optional for low friction
  isConfidentialOnly: boolean;
  governorate: string;
  locality: string;
  applicantRole: 'patient' | 'parent_guardian' | 'spouse' | 'sibling' | 'relative';
  patientAge: number;
  primaryNeed: ServiceCategory;
  urgencyLevel: 'normal' | 'urgent' | 'immediate_crisis';
  preferredContact: 'phone' | 'whatsapp' | 'directorate_visit' | 'home_visit';
  notes?: string;
  consentGiven: boolean;
  status: CaseStatus;
  assignedOfficer?: string;
  directorateOffice?: string;
  statusHistory: Array<{
    status: CaseStatus;
    timestamp: string;
    note: { en: string; ar: string };
  }>;
  referralDetails?: {
    partner: string;
    serviceName: string;
    referralDate: string;
  };
}

export interface DirectorateLocation {
  id: string;
  governorate: { en: string; ar: string };
  name: { en: string; ar: string };
  type: 'mosd_directorate' | 'tpfs_branch';
  address: { en: string; ar: string };
  phone: string;
  hotline: string;
  hours: { en: string; ar: string };
  socialWorkerLead: { en: string; ar: string };
  mapQueryUrl: string;
}

export interface HumanStory {
  id: string;
  theme: { en: string; ar: string };
  personAlias: { en: string; ar: string };
  governorate: { en: string; ar: string };
  quote: { en: string; ar: string };
  storyBody: { en: string; ar: string };
  milestone: { en: string; ar: string };
  servicesUsed: Array<{ en: string; ar: string }>;
  visualSilhouette: string;
}

export interface EligibilityAnswers {
  hasFamilyMemberWithThalassemia: boolean;
  patientAgeRange: 'child_under_12' | 'adolescent_12_18' | 'adult_18_plus';
  monthlyIncomeStatus: 'severely_vulnerable' | 'unstable_low' | 'moderate' | 'sufficient';
  facingEmotionalPressure: boolean;
  transportationDifficulty: boolean;
  needsVocationalHelp: boolean;
  governorate: string;
}

export interface EligibilityEvaluation {
  isEligible: boolean;
  priorityScore: number;
  priorityTier: 'high_priority' | 'medium_priority' | 'standard';
  matchedServices: ServiceCategory[];
  recommendedSteps: Array<{ en: string; ar: string }>;
  assessmentSummary: { en: string; ar: string };
}

