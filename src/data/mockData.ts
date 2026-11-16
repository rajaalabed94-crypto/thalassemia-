import { 
  ServiceItem, 
  SupportRequest, 
  DirectorateLocation, 
  HumanStory 
} from '../types';

export const OFFICIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-01-social-protection',
    stepNumber: '01',
    category: 'social_protection',
    title: {
      en: 'Social Protection',
      ar: 'الحماية الاجتماعية'
    },
    subtitle: {
      en: 'National social safety net & family resilience',
      ar: 'شبكة الأمان الاجتماعي الوطنية وحماية استقرار الأسرة'
    },
    description: {
      en: 'Incorporating vulnerable families into national social protection programs, shielding them from financial shocks associated with chronic care.',
      ar: 'إدماج الأسر الهشة والفقيرة المتأثرة بالثلاسيميا ضمن شبكات الحماية والأمان الاجتماعي الوطنية لحمايتها من الصدمات المعيشية الناتجة عن رعاية مريض مزمن.'
    },
    provider: 'MoSD',
    whoCanBenefit: {
      en: 'Families living below or near the poverty line with a member living with thalassemia.',
      ar: 'الأسر التي تعيش تحت خط الفقر الوطني أو التي تعاني من انعدام الدخل الثابت ولديها مريض ثلاسيميا.'
    },
    coverageDetails: {
      en: 'Enrollment in the National Social Registry (السجل الوطني الاجتماعي) and priority safety net benefits.',
      ar: 'التسجيل في السجل الوطني الاجتماعي والاستفادة من حزم التدخل والمساندة الحكومية المعتمدة.'
    },
    requirements: {
      en: 'Family identity documents, basic socioeconomic survey by the directorate social worker.',
      ar: 'وثائق إثبات الأسرة وتقرير مسح اجتماعي أولي يُجريه أخصائي المديرية بكل كرامة.'
    },
    iconName: 'ShieldCheck'
  },
  {
    id: 'srv-02-eligibility-assistance',
    stepNumber: '02',
    category: 'eligibility_assistance',
    title: {
      en: 'Assistance According to Eligibility',
      ar: 'المساعدات وفق الاستحقاق'
    },
    subtitle: {
      en: 'Targeted cash & urgent material relief',
      ar: 'مساعدات نقدية وعينية طارئة مبنية على معايير استحقاق شفافة'
    },
    description: {
      en: 'Direct emergency financial and material assistance disbursed to eligible households according to verified social assessment scores.',
      ar: 'صرف مساعدات نقدية طارئة أو عينية مخصصة للأسر الأكثر احتياجاً وفق نتائج معادلة الاستحقاق الاجتماعي الشفافة ودون أي وساطة.'
    },
    provider: 'MoSD',
    whoCanBenefit: {
      en: 'Families facing acute crises, breadwinner unemployment, or sudden treatment-related economic stress.',
      ar: 'الأسر التي تعاني من أزمات مفاجئة، توقف المعيل عن العمل، أو ضغوطات مصاريف رعاية متراكمة.'
    },
    coverageDetails: {
      en: 'Discretionary emergency stipends, winterization aid, and food parcel allocations.',
      ar: 'دفعات نقدية طارئة، طرود غذائية مساندة، ومساعدات شتوية وموسمية وفق النظام المعتمد.'
    },
    requirements: {
      en: 'Social registry intake approval and case officer assessment report.',
      ar: 'اعتماد ملف الأسرة في سجل التنمية الاجتماعية واستيفاء معايير دراسة الحالة.'
    },
    iconName: 'Coins'
  },
  {
    id: 'srv-03-psychosocial',
    stepNumber: '03',
    category: 'psychosocial',
    title: {
      en: 'Psychosocial Support & Family Counseling',
      ar: 'الدعم النفسي والاجتماعي'
    },
    subtitle: {
      en: 'Individual therapy, peer circles & caregiver burnout relief',
      ar: 'جلسات إرشاد فردي وأسري، ومجموعات تفريغ نفسي للأمهات والمعيلين'
    },
    description: {
      en: 'Professional clinical counseling for patients and their caregivers to overcome emotional fatigue, social stigma, and chronic anxiety.',
      ar: 'جلسات إرشاد وتفريغ نفسي متخصصة للمرضى وأمهاتهم وآبائهم لتخفيف الاحتراق النفسي، التعامل مع نوبات التوتر، ومواجهة الضغوط المجتمعية.'
    },
    provider: 'TPFS',
    whoCanBenefit: {
      en: 'Any patient, mother, father, or caregiver seeking emotional resilience and connection.',
      ar: 'جميع المرضى والأمهات والآباء ومقدمي الرعاية الذين يواجهون ضغوطاً نفسية أو عزلة مجتمعية.'
    },
    coverageDetails: {
      en: 'Free in-person sessions at TPFS centers or secure remote tele-counseling with certified specialists.',
      ar: 'جلسات مجانية وسرية بالكامل حضورياً في مراكز الجمعية (رام الله، طولكرم، نابلس، غزة) أو هاتفياً.'
    },
    requirements: {
      en: 'No formal paperwork required; immediate confidential intake.',
      ar: 'لا تتطلب أي أوراق معقدة؛ التسجيل فوري ومفتوح لجميع الأسر.'
    },
    iconName: 'HeartHandshake'
  },
  {
    id: 'srv-04-case-management',
    stepNumber: '04',
    category: 'case_management',
    title: {
      en: 'Comprehensive Case Management',
      ar: 'إدارة الحالة والمتابعة'
    },
    subtitle: {
      en: 'Dedicated social worker & unified family plan',
      ar: 'أخصائي اجتماعي مخصص يرافق الأسرة خطوة بخطوة'
    },
    description: {
      en: 'A structured methodology assigning a dedicated social worker to conduct dignified home visits, coordinate needs, and follow up continuously.',
      ar: 'منهجية مهنية تعين أخصائياً اجتماعياً مخصصاً لكل أسرة، يزور المنزل بكرامة، يحدد الاحتياجات، وينسق التدخلات ضمن خطة موحدة.'
    },
    provider: 'Joint',
    whoCanBenefit: {
      en: 'Families with multi-dimensional vulnerabilities, multiple affected children, or complex social needs.',
      ar: 'الأسر التي تواجه ظروفاً مركبة (أكثر من مصاب، أمهات معيلات، أو صعوبات تعليمية وسكنية).'
    },
    coverageDetails: {
      en: 'Regular follow-up visits, school liaison to prevent dropout, and direct guidance across services.',
      ar: 'زيارات تفقدية دورية، تنسيق مع إدارات المدارس لحماية حق المريض بالتعليم، ومرافقة مستمرة.'
    },
    requirements: {
      en: 'Family consent for case intake file opening through the local directorate.',
      ar: 'موافقة الأسرة على فتح ملف إدارة حالة لمتابعة وتنسيق الخدمات.'
    },
    iconName: 'UserCheck'
  },
  {
    id: 'srv-05-referrals',
    stepNumber: '05',
    category: 'referrals',
    title: {
      en: 'Referrals to Specialized Agencies',
      ar: 'الإحالة للخدمات والجهات المختصة'
    },
    subtitle: {
      en: 'Seamless connection to partners without bureaucratic friction',
      ar: 'مسار إحالة وطني موحد يضمن عدم ضياع الأسرة بين المؤسسات'
    },
    description: {
      en: 'Operating the National Social Referral System to link patients to healthcare transit allowances, educational support, and specialized aid.',
      ar: 'تفعيل نظام التحويل الوطني الاجتماعي لربط المريض والأسرة بالجهات الشريكة (مساعدات التنقل، الرعاية الطبية، الجمعيات الخيرية) بمسار سلس.'
    },
    provider: 'Joint',
    whoCanBenefit: {
      en: 'Patients needing cross-sectoral interventions beyond the direct remit of social development.',
      ar: 'المرضى والأسر الذين تتطلب حالتهم خدمات مشتركة بين الصحة والتنمية والمؤسسات الأهلية.'
    },
    coverageDetails: {
      en: 'Official referral slip, fast-tracked processing with designated partner points of contact.',
      ar: 'بطاقة إحالة معتمدة ومتابعة إدارية مباشرة مع منسق الجهة المحال إليها.'
    },
    requirements: {
      en: 'Initial needs assessment conducted by the case worker.',
      ar: 'إجراء تقييم الاحتياج الأولي من قبل أخصائي الحالة.'
    },
    iconName: 'ArrowUpRight'
  },
  {
    id: 'srv-06-economic-empowerment',
    stepNumber: '06',
    category: 'economic_empowerment',
    title: {
      en: 'Economic Empowerment & Livelihoods',
      ar: 'التمكين الاقتصادي وسُبل العيش'
    },
    subtitle: {
      en: 'From assistance to sustainable productivity & micro-grants',
      ar: 'الانتقال من دائرة المساعدة المؤقتة إلى الاستقلالية والإنتاج'
    },
    description: {
      en: 'Equipping adult thalassemia patients and family breadwinners with vocational training, toolkits, and non-refundable micro-enterprise grants.',
      ar: 'تأهيل مرضى الثلاسيميا البالغين (١٨ عاماً فأكثر) ومعيلي الأسر بدورات مهنية ملائمة وتمويل مشاريع صغيرة مدرة للدخل تناسب طبيعة المرض.'
    },
    provider: 'MoSD',
    whoCanBenefit: {
      en: 'Adult patients (18+) or unemployed breadwinners seeking self-reliant income generation.',
      ar: 'المرضى البالغون القادرون على العمل وأرباب الأسر الراغبون في تأسيس مشروع مستدام.'
    },
    coverageDetails: {
      en: 'Vocational training sponsorship, business feasibility mentoring, and equipment grants up to $5,000.',
      ar: 'تغطية رسوم التدريب، إعداد دراسة الجدوى، وتقديم منح معدات وأدوات إنتاجية غير مستردة.'
    },
    requirements: {
      en: 'Age 18+, willingness to commit to training, business concept interview with empowerment counselor.',
      ar: 'العمر ١٨ سنة فأكثر، الجدية والالتزام، ومقابلة مع منسق التمكين في المديرية.'
    },
    iconName: 'Briefcase'
  }
];

export const INITIAL_SAMPLE_CASES: SupportRequest[] = [
  {
    id: 'case-00482',
    trackingCode: 'THAL-2026-00482',
    createdAt: '2026-10-24T10:00:00Z',
    fullName: 'عائلة أم يوسف (أم لطفل مريض)',
    phone: '0599-234-881',
    isConfidentialOnly: true,
    governorate: 'الخليل',
    locality: 'يطا',
    applicantRole: 'parent_guardian',
    patientAge: 9,
    primaryNeed: 'social_protection',
    urgencyLevel: 'urgent',
    preferredContact: 'phone',
    notes: 'الوالد عامل باليومية. الطفل يحتاج لوحدات دم منتظمة في مستشفى عالية الحكومي وتكاليف التنقل والإعاشة ترهق الأسرة.',
    consentGiven: true,
    status: 'service_active',
    assignedOfficer: 'أ. ريم القواسمي (أخصائية إدارة الحالة)',
    directorateOffice: 'مديرية التنمية الاجتماعية - الخليل',
    statusHistory: [
      {
        status: 'submitted',
        timestamp: '2026-10-24T10:00:00Z',
        note: {
          en: 'Initial confidential request submitted online.',
          ar: 'تم تقديم الطلب السري عبر المنصة الموحدة.'
        }
      },
      {
        status: 'under_review',
        timestamp: '2026-10-24T13:30:00Z',
        note: {
          en: 'Request verified and allocated to Hebron Directorate.',
          ar: 'تم تدقيق البيانات وتوجيه الملف لمديرية الخليل.'
        }
      },
      {
        status: 'under_assessment',
        timestamp: '2026-10-25T09:15:00Z',
        note: {
          en: 'Social worker conducted dignified home assessment in Yatta.',
          ar: 'أجرت الأخصائية الاجتماعية زيارة منزلية كريمة في يطا.'
        }
      },
      {
        status: 'referred_to_service',
        timestamp: '2026-10-25T14:00:00Z',
        note: {
          en: 'Referred to Emergency Safety Net & TPFS Transport Subsidies.',
          ar: 'تمت الإحالة للمساعدات النقدية الطارئة وبدل مواصلات المستشفى.'
        }
      },
      {
        status: 'service_active',
        timestamp: '2026-10-26T08:30:00Z',
        note: {
          en: 'First emergency transfer disbursed; transport subsidy active.',
          ar: 'تم تفعيل صرف الدفعة النقدية الطارئة وبدل المواصلات للمستشفى.'
        }
      }
    ],
    referralDetails: {
      partner: 'جمعية أصدقاء مرضى الثلاسيميا - فرع الخليل',
      serviceName: 'تغطية بدل تنقل جلسات نقل الدم الدورية',
      referralDate: '2026-10-25'
    }
  },
  {
    id: 'case-00129',
    trackingCode: 'THAL-2026-00129',
    createdAt: '2026-10-25T08:00:00Z',
    fullName: 'كريم ن. (شاب مريض ثلاسيميا)',
    phone: '0598-112-990',
    isConfidentialOnly: true,
    governorate: 'جنين',
    locality: 'مخيم جنين',
    applicantRole: 'patient',
    patientAge: 21,
    primaryNeed: 'economic_empowerment',
    urgencyLevel: 'normal',
    preferredContact: 'whatsapp',
    notes: 'خريج ثانوية عامة يعيش مع الثلاسيميا. يرغب في تدريب صيانة هواتف وأجهزة ذكية لتأمين دخل بمرونة تناسب أوقات نقله للدم.',
    consentGiven: true,
    status: 'under_assessment',
    assignedOfficer: 'أ. سامر زكارنة (منسق التمكين الميداني)',
    directorateOffice: 'مديرية التنمية الاجتماعية - جنين',
    statusHistory: [
      {
        status: 'submitted',
        timestamp: '2026-10-25T08:00:00Z',
        note: {
          en: 'Request submitted.',
          ar: 'تم استلام طلب التمكين الاقتصادي.'
        }
      },
      {
        status: 'under_review',
        timestamp: '2026-10-25T11:00:00Z',
        note: {
          en: 'Reviewed for vocational training eligibility.',
          ar: 'مراجعة أولية لملف التدريب المهني.'
        }
      },
      {
        status: 'under_assessment',
        timestamp: '2026-10-26T09:00:00Z',
        note: {
          en: 'Vocational counseling interview scheduled.',
          ar: 'تحديد موعد مقابلة تقييم المهارات ودراسة الجدوى.'
        }
      }
    ]
  }
];

export const HUMAN_STORIES_DATA: HumanStory[] = [
  {
    id: 'story-empowerment',
    theme: {
      en: 'Education & Economic Self-Reliance',
      ar: 'التعليم والاستقلالية الاقتصادية'
    },
    personAlias: {
      en: 'Tariq (24 yrs, Graphic Designer & Micro-Entrepreneur)',
      ar: 'طارق (٢٤ عاماً، مصمم جرافيك ومبادر)'
    },
    governorate: {
      en: 'Nablus Governorate',
      ar: 'محافظة نابلس'
    },
    quote: {
      en: '“Thalassemia is part of my daily routine, but it has never defined what I can achieve. The grant gave me the tools to build my own design studio.”',
      ar: '«الثلاسيميا جزء من روتيني الصحي، لكنها لم تحدد يوماً ما يمكنني تحقيقه. منحة التمكين وفرت لي الأجهزة لأطلق استوديو التصميم الخاص بي.»'
    },
    storyBody: {
      en: 'Because periodic hospital visits made strict 8-to-5 factory work difficult, Tariq connected with the Economic Empowerment unit. Following skill mentoring, he received high-end computing equipment and now supports his entire household with steady remote work.',
      ar: 'بسبب صعوبة الالتزام بوظيفة شاقة لساعات طويلة في المصانع، تقدم طارق لبرنامج التمكين الاقتصادي. حصل على أجهزة حاسوب متطورة للعمل عن بُعد، واليوم أصبح المعيل الأساسي لبيته بكرامة تامة.'
    },
    milestone: {
      en: 'From Aid to Productive Independence',
      ar: 'من طلب المساعدة إلى الاستقلالية والإنتاج'
    },
    servicesUsed: [
      { en: 'Micro-Grant Funding', ar: 'منحة مشروع صغير' },
      { en: 'Vocational Mentorship', ar: 'إرشاد مهني وتمكين' }
    ],
    visualSilhouette: 'workspace'
  },
  {
    id: 'story-caregiver',
    theme: {
      en: 'Caregiver Mental Health & Family Resilience',
      ar: 'صحة الأم النفسية وصمود الأسرة'
    },
    personAlias: {
      en: 'Mother of Lin (Child diagnosed at 2 years)',
      ar: 'أم الطفلة لين (تم التشخيص بعمر سنتين)'
    },
    governorate: {
      en: 'Hebron Governorate',
      ar: 'محافظة الخليل'
    },
    quote: {
      en: '“The psychological pressure when your daughter is first diagnosed feels overwhelming. Meeting other mothers at TPFS and having a social worker check on us lifted the isolation.”',
      ar: '«الصدمة الأولى عند تشخيص طفلتك تشعرك بالعزلة والخوف. حلقات دعم الأمهات في الجمعية وزيارات الأخصائية لبيتنا أعادت التوازن لأسرتنا.»'
    },
    storyBody: {
      en: 'Lin’s family faced intense emotional burnout and fears of community misunderstanding. Through regular psychosocial circles and school advocacy, teachers now support Lin with awareness, and her mother facilitates support groups for newly diagnosed families.',
      ar: 'عاشت الأسرة ضغطاً نفسياً حاداً وخوفاً من النظرة المجتمعية. عبر جلسات الإرشاد النفسي والتنسيق مع إدارة المدرسة، أصبحت الطفلة متفوقة في صفها، وأصبحت الأم سنداً لأمهات أخريات في المحافظة.'
    },
    milestone: {
      en: 'Overcoming Isolation & Building Resilience',
      ar: 'كسر العزلة وبناء صمود الأسرة'
    },
    servicesUsed: [
      { en: 'Mothers Support Circles', ar: 'حلقات دعم الأمهات' },
      { en: 'School Inclusion Liaison', ar: 'تنسيق مدرسي وتوعية' }
    ],
    visualSilhouette: 'family'
  },
  {
    id: 'story-safety-net',
    theme: {
      en: 'Social Safety Net & Dignified Relief',
      ar: 'شبكة الأمان الاجتماعي وصون الكرامة'
    },
    personAlias: {
      en: 'Abu Ahmad (Father of two affected children)',
      ar: 'أبو أحمد (أب لطفلين مصابين بالثلاسيميا)'
    },
    governorate: {
      en: 'Jenin Governorate',
      ar: 'محافظة جنين'
    },
    quote: {
      en: '“Travel expenses between our village and the blood bank were eating our food budget. The Ministry and Association treated our situation with immense respect.”',
      ar: '«تكاليف السفر بين قريتنا والمستشفى مرتين كل شهر كانت تلتهم قوت أولادنا. الوزارة والجمعية عاملونا بأعلى درجات الاحترام والسرية.»'
    },
    storyBody: {
      en: 'Living in an isolated rural area, coordinating transfusions for two young boys pushed the family into severe debt. Through the unified case management file, they were enrolled in monthly travel allowances and the social safety net without complex bureaucracy.',
      ar: 'وجود طفلين يحتاجان لنقل دم دوري في قرية نائية جعل تراكم الديون كابوساً يومياً. عبر ملف إدارة الحالة، تم تأمين بدل مواصلات شهري ومساعدات دورية مكنت الطفلين من الانتظام في مواعيد نقل الدم.'
    },
    milestone: {
      en: 'Health Logistics Stability & Debt Relief',
      ar: 'استقرار مواعيد العلاج ورفع عبء التنقل'
    },
    servicesUsed: [
      { en: 'Transfusion Travel Allowance', ar: 'بدل تنقلات نقل الدم' },
      { en: 'Social Registry Enrollment', ar: 'التسجيل في شبكة الأمان' }
    ],
    visualSilhouette: 'rural'
  }
];

export const DIRECTORATES_SEARCH_DATA: DirectorateLocation[] = [
  {
    id: 'dir-ramallah',
    governorate: { en: 'Ramallah & Al-Bireh', ar: 'رام الله والبيرة' },
    name: { en: 'MoSD Directorate - Ramallah & TPFS Headquarters', ar: 'مديرية التنمية الاجتماعية - رام الله والبيرة' },
    type: 'mosd_directorate',
    address: { en: 'Al-Masyoun, Ramallah', ar: 'الماصيون، رام الله' },
    phone: '022958343',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Hala Darwish (Lead Case Manager)', ar: 'أ. هالة درويش (مسؤولة إدارة الحالة)' },
    mapQueryUrl: 'https://maps.google.com/?q=Ramallah+Ministry+of+Social+Development'
  },
  {
    id: 'dir-jerusalem',
    governorate: { en: 'Jerusalem', ar: 'القدس الشريف' },
    name: { en: 'MoSD Directorate - Jerusalem & Suburbs Hub', ar: 'مديرية التنمية الاجتماعية - القدس الشريف وضواحيها' },
    type: 'mosd_directorate',
    address: { en: 'Al-Ram / Dahiet Al-Barid, Jerusalem', ar: 'الرام / ضاحية البريد، القدس' },
    phone: '022799969',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Fatima Al-Quds (Senior Case Specialist)', ar: 'أ. فاطمة الدجاني (أخصائية اجتماعية رئيسية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Jerusalem+Suburbs+Ministry+of+Social+Development'
  },
  {
    id: 'dir-hebron',
    governorate: { en: 'Hebron', ar: 'الخليل' },
    name: { en: 'MoSD Directorate - Hebron', ar: 'مديرية التنمية الاجتماعية - الخليل' },
    type: 'mosd_directorate',
    address: { en: 'Ein Sarah Street, Hebron', ar: 'شارع عين سارة، الخليل' },
    phone: '022227653',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Reem Al-Qawasmi (Senior Field Specialist)', ar: 'أ. ريم القواسمي (أخصائية اجتماعية رئيسية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Hebron+Directorate+of+Social+Development'
  },
  {
    id: 'dir-yatta',
    governorate: { en: 'Yatta (Hebron Governorate)', ar: 'يطا (الخليل)' },
    name: { en: 'MoSD Directorate - Yatta', ar: 'مديرية التنمية الاجتماعية - يطا' },
    type: 'mosd_directorate',
    address: { en: 'Yatta Center, Hebron Governorate', ar: 'وسط مدينة يطا، محافظة الخليل' },
    phone: '022279364',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Mahmoud Abu Sabha (Field Lead)', ar: 'أ. محمود أبو صبحة (مسؤول المتابعة الميدانية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Yatta+Directorate+of+Social+Development'
  },
  {
    id: 'dir-bethlehem',
    governorate: { en: 'Bethlehem', ar: 'بيت لحم' },
    name: { en: 'MoSD Directorate - Bethlehem', ar: 'مديرية التنمية الاجتماعية - بيت لحم' },
    type: 'mosd_directorate',
    address: { en: 'Bab Al-Zqaq, Bethlehem', ar: 'باب الزقاق، عمارة الأبرار، بيت لحم' },
    phone: '022741216',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Ibrahim Sabatin (Social Coordinator)', ar: 'أ. إبراهيم سباتين (منسق الحماية الاجتماعية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Bethlehem+Directorate+of+Social+Development'
  },
  {
    id: 'dir-nablus',
    governorate: { en: 'Nablus', ar: 'نابلس' },
    name: { en: 'MoSD Directorate - Nablus', ar: 'مديرية التنمية الاجتماعية - نابلس' },
    type: 'mosd_directorate',
    address: { en: 'Rafidia, Nablus', ar: 'رفيديا، بجانب المستشفى الوطني، نابلس' },
    phone: '092383574',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Khaled Hanbali (Social Network Lead)', ar: 'أ. خالد الحنبلي (منسق شبكة الحماية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Nablus+Directorate+of+Social+Development'
  },
  {
    id: 'dir-jenin',
    governorate: { en: 'Jenin', ar: 'جنين' },
    name: { en: 'MoSD Directorate - Jenin', ar: 'مديرية التنمية الاجتماعية - جنين' },
    type: 'mosd_directorate',
    address: { en: 'Government Complex, Jenin City', ar: 'مجمع الدوائر الحكومية، جنين' },
    phone: '042501017',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Samer Zakarneh (Field Officer)', ar: 'أ. سامر زكارنة (مسؤول التقييم الميداني)' },
    mapQueryUrl: 'https://maps.google.com/?q=Jenin+Directorate+of+Social+Development'
  },
  {
    id: 'dir-tulkarm',
    governorate: { en: 'Tulkarm', ar: 'طولكرم' },
    name: { en: 'MoSD Directorate - Tulkarm', ar: 'مديرية التنمية الاجتماعية - طولكرم' },
    type: 'mosd_directorate',
    address: { en: 'Al-Sikka Street, Tulkarm', ar: 'شارع السكة، طولكرم' },
    phone: '092671171',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Nour Jayousi (Case Coordinator)', ar: 'أ. نور الجيوسي (منسقة إدارة الحالة)' },
    mapQueryUrl: 'https://maps.google.com/?q=Tulkarm+Directorate+of+Social+Development'
  },
  {
    id: 'dir-qalqilya',
    governorate: { en: 'Qalqilya', ar: 'قلقيلية' },
    name: { en: 'MoSD Directorate - Qalqilya', ar: 'مديرية التنمية الاجتماعية - قلقيلية' },
    type: 'mosd_directorate',
    address: { en: 'Nablus Street, Qalqilya', ar: 'شارع نابلس، مجمع الدوائر الحكومية، قلقيلية' },
    phone: '092942588',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Mona Nazzal (Social Specialist)', ar: 'أ. منى نزال (أخصائية اجتماعية)' },
    mapQueryUrl: 'https://maps.google.com/?q=Qalqilya+Directorate+of+Social+Development'
  },
  {
    id: 'dir-salfit',
    governorate: { en: 'Salfit', ar: 'سلفيت' },
    name: { en: 'MoSD Directorate - Salfit', ar: 'مديرية التنمية الاجتماعية - سلفيت' },
    type: 'mosd_directorate',
    address: { en: 'Main Government Street, Salfit', ar: 'الشارع الرئيسي، مجمع الدوائر، سلفيت' },
    phone: '092515722',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Ahmad Marwan (Case Manager)', ar: 'أ. أحمد مروان (منسق إدارة الحالة)' },
    mapQueryUrl: 'https://maps.google.com/?q=Salfit+Directorate+of+Social+Development'
  },
  {
    id: 'dir-tubas',
    governorate: { en: 'Tubas & Northern Jordan Valley', ar: 'طوباس والأغوار الشمالية' },
    name: { en: 'MoSD Directorate - Tubas', ar: 'مديرية التنمية الاجتماعية - طوباس' },
    type: 'mosd_directorate',
    address: { en: 'Main Street, Government Complex, Tubas', ar: 'الشارع العام، مجمع الدوائر، طوباس' },
    phone: '092570005',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Suha Daraghmeh (Case Manager)', ar: 'أ. سهى دراغمة (أخصائية إدارة الحالة)' },
    mapQueryUrl: 'https://maps.google.com/?q=Tubas+Directorate+of+Social+Development'
  },
  {
    id: 'dir-jericho',
    governorate: { en: 'Jericho & Jordan Valley', ar: 'أريحا والأغوار' },
    name: { en: 'MoSD Directorate - Jericho & Jordan Valley', ar: 'مديرية التنمية الاجتماعية - أريحا والأغوار' },
    type: 'mosd_directorate',
    address: { en: 'Palestine Street, Near Municipality, Jericho', ar: 'شارع فلسطين، قرب بلدية أريحا' },
    phone: '022322504',
    hotline: '189',
    hours: { en: 'Sun–Thu: 8:00 AM – 3:00 PM', ar: 'الأحد - الخميس: ٨:٠٠ ص - ٣:٠٠ م' },
    socialWorkerLead: { en: 'Tariq Erekat (Field Supervisor)', ar: 'أ. طارق عريقات (مسؤول المسح الميداني)' },
    mapQueryUrl: 'https://maps.google.com/?q=Jericho+Directorate+of+Social+Development'
  },
  {
    id: 'dir-gaza',
    governorate: { en: 'Gaza Governorates', ar: 'محافظات قطاع غزة' },
    name: { en: 'Joint Emergency Thalassemia Relief & Coordination Desk', ar: 'مكتب الطوارئ والإغاثة المشترك لأسر الثلاسيميا' },
    type: 'tpfs_branch',
    address: { en: 'Central Humanitarian Service Hubs', ar: 'مراكز التنسيق الإنساني ومستشفيات القطاع' },
    phone: '082824455',
    hotline: '189',
    hours: { en: 'Daily Emergency Response (24/7 Hotline)', ar: 'استجابة طارئة يومية وخط ساخن ٢٤/٧' },
    socialWorkerLead: { en: 'Dr. Mahmoud & Humanitarian Field Team', ar: 'د. محمود وفريق الإغاثة الميداني' },
    mapQueryUrl: 'https://maps.google.com/?q=Gaza+Thalassemia+Relief'
  }
];
