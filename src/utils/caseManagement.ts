import { CaseStatus, SupportRequest, ServiceCategory, Language } from '../types';

export const STATUS_SEQUENCE: CaseStatus[] = [
  'submitted',
  'under_review',
  'under_assessment',
  'referred_to_service',
  'service_active',
  'service_delivered',
  'in_followup'
];

export function generateTrackingCode(): string {
  const year = 2026;
  const num = Math.floor(10000 + Math.random() * 90000);
  return `THAL-${year}-${num}`;
}

export function isValidTransition(current: CaseStatus, next: CaseStatus): boolean {
  if (current === next) return true;
  const currentIndex = STATUS_SEQUENCE.indexOf(current);
  const nextIndex = STATUS_SEQUENCE.indexOf(next);
  if (currentIndex === -1 || nextIndex === -1) return false;
  return nextIndex > currentIndex || nextIndex === currentIndex - 1;
}

export function getStatusStepIndex(status: CaseStatus): number {
  return Math.max(0, STATUS_SEQUENCE.indexOf(status));
}

export function getStatusDetails(status: CaseStatus, lang: Language): { title: string; description: string; color: string } {
  const details: Record<CaseStatus, { title: { en: string; ar: string }; description: { en: string; ar: string }; color: string }> = {
    submitted: {
      title: { en: 'Request Received', ar: 'تم الاستلام' },
      description: {
        en: 'Your confidential request has been recorded in the unified registry.',
        ar: 'تم تسجيل طلبكم بسرية تامة في السجل المشترك، وجارٍ توجيهه للمنسق المختص.'
      },
      color: 'bg-[#EDE9FE] text-[#4A326E] border-[#DDD6FE]'
    },
    under_review: {
      title: { en: 'Under Review', ar: 'قيد المراجعة' },
      description: {
        en: 'Intake coordinator is reviewing family details and regional directorate allocation.',
        ar: 'يقوم منسق الاستقبال بمراجعة البيانات الأولية وتحديد المديرية أو المركز المعني.'
      },
      color: 'bg-blue-100 text-blue-900 border-blue-300'
    },
    under_assessment: {
      title: { en: 'Needs Assessment', ar: 'تقييم الحالة' },
      description: {
        en: 'A certified MoSD/TPFS social worker is conducting the comprehensive social & economic assessment.',
        ar: 'يقوم الأخصائي الاجتماعي المعتمد بإجراء تقييم شامل لاحتياجات الأسرة وظروف الرعاية.'
      },
      color: 'bg-indigo-100 text-indigo-900 border-indigo-300'
    },
    referred_to_service: {
      title: { en: 'Referred to Services', ar: 'تمت الإحالة' },
      description: {
        en: 'Case officially referred to the designated assistance or empowerment program.',
        ar: 'تم تحويل الملف رسميًا إلى برنامج الدعم أو التمكين أو الإرشاد المعتمد.'
      },
      color: 'bg-purple-100 text-purple-900 border-purple-300'
    },
    service_active: {
      title: { en: 'Service in Progress', ar: 'الخدمة قيد التنفيذ' },
      description: {
        en: 'Assistance, transport allowances, or counseling sessions are actively underway.',
        ar: 'حزم المساعدة، بدلات التنقل، أو جلسات الإرشاد مفعلة وقيد الاستلام.'
      },
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
    },
    service_delivered: {
      title: { en: 'Service Delivered', ar: 'تم تقديم الخدمة' },
      description: {
        en: 'Core intervention delivered according to family eligibility and approved plan.',
        ar: 'تم استلام الخدمة المقررة وفق خطة التدخل والمساندة المعتمدة للأسرة.'
      },
      color: 'bg-teal-100 text-teal-900 border-teal-300'
    },
    in_followup: {
      title: { en: 'Ongoing Follow-up & Impact', ar: 'متابعة وقياس الأثر' },
      description: {
        en: 'Regular follow-up to ensure family stability and evaluate economic & social impact.',
        ar: 'متابعة دورية مستمرة لضمان استقرار الأسرة وقياس أثر التدخل ورضا المستفيدين.'
      },
      color: 'bg-rose-100 text-rose-950 border-rose-300'
    }
  };

  const item = details[status] || details.submitted;
  return {
    title: item.title[lang],
    description: item.description[lang],
    color: item.color
  };
}

export function createNewRequest(params: {
  fullName: string;
  phone: string;
  nationalId?: string;
  governorate: string;
  locality: string;
  applicantRole: SupportRequest['applicantRole'];
  patientAge: number;
  primaryNeed: ServiceCategory;
  urgencyLevel: SupportRequest['urgencyLevel'];
  preferredContact: SupportRequest['preferredContact'];
  notes?: string;
  isConfidentialOnly?: boolean;
}): SupportRequest {
  const code = generateTrackingCode();
  const now = new Date().toISOString();

  return {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    trackingCode: code,
    createdAt: now,
    fullName: params.fullName.trim(),
    phone: params.phone.trim(),
    nationalId: params.nationalId?.trim() || undefined,
    isConfidentialOnly: params.isConfidentialOnly ?? true,
    governorate: params.governorate,
    locality: params.locality.trim(),
    applicantRole: params.applicantRole,
    patientAge: params.patientAge,
    primaryNeed: params.primaryNeed,
    urgencyLevel: params.urgencyLevel,
    preferredContact: params.preferredContact,
    notes: params.notes?.trim() || '',
    consentGiven: true,
    status: 'submitted',
    assignedOfficer: 'قيد الفرز والتعيين (In Triage)',
    directorateOffice: `مديرية التنمية الاجتماعية - ${params.governorate}`,
    statusHistory: [
      {
        status: 'submitted',
        timestamp: now,
        note: {
          en: 'Request submitted confidentially via online platform.',
          ar: 'تم تقديم طلب الدعم والمساندة بسرية عبر المنصة الموحدة.'
        }
      }
    ]
  };
}
