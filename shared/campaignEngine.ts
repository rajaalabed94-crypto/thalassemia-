// Pure TypeScript shared engine (Web-standard & Node compatible, zero fs/Node-only imports)
// Used by Node/Express server, Cloudflare Pages Functions, and static resilience fallbacks.

export interface AdminSupportRecord {
  trackingCode: string;
  submittedAt: string;
  supportTypeCode: string;
  supportTypeLabel: string;
  status: string;
  lastUpdated: string;
  followUpNote: string;
  idempotencyKey: string;
}

export interface ChatCallbackRecord {
  referenceCode: string;
  submittedAt: string;
  fullName: string;
  phone: string;
  question: string;
  status: string;
  idempotencyKey: string;
}

export const DEFAULT_STATUS_AR = 'جديد - بانتظار المتابعة';
export const DEFAULT_CALLBACK_STATUS_AR = 'بانتظار التواصل';

export const SITE_KNOWLEDGE_BASE = `
=== محتوى الموقع الرسمي: حملة دعم وتمكين مرضى الثلاسيميا وأسرهم في فلسطين ===
الشراكة الرسمية: وزارة التنمية الاجتماعية الفلسطينية (MoSD) × جمعية أصدقاء مرضى الثلاسيميا - فلسطين (TPFS).
الرقم المجاني الموحد للاستفسارات والشكاوى في وزارة التنمية الاجتماعية: 189.
المواقع الرسمية: www.mosd.gov.ps و tpfs.ps.

--- 1. اعرف الثلاسيميا (الملف الطبي التوعوي في الموقع) ---
- التعريف: الثلاسيميا اضطراب وراثي في خلايا الدم يؤدي إلى انخفاض مستوى الهيموجلوبين وعدد كريات الدم الحمراء عن المعدل الطبيعي، مما يسبب أعراض فقر الدم مثل الإجهاد والتعب بسبب نقص الأكسجين.
- المسببات الجينية: تحدث بسبب طفرات جينية في الحمض النووي للخلايا المكوّنة للهيموجلوبين وتنتقل وراثيًا من الآباء إلى الأبناء. الثلاسيميا غير معدية نهائيًا ولا تنتقل باللمس أو المخالطة أو الطعام.
- الأعراض والعلامات الثمانية:
  1. التعب والضعف العام.
  2. ضيق التنفس.
  3. شحوب البشرة.
  4. اصفرار الجلد (اليرقان).
  5. تغيرات أو تشوهات في عظام الوجه.
  6. بطء النمو.
  7. انتفاخ البطن (تضخم الطحال).
  8. تغير لون البول إلى الداكن.
- العلاج المتبع في المستشفيات الحكومية: نقل الدم المتكرر، وأدوية طرد وسحب الحديد الزائد لحماية القلب والكبد (مثل Desferal و Exjade)، وخيار زراعة الخلايا الجذعية أو نخاع العظام من متبرع مطابق وراثيًا حسب تقييم الفريق الطبي. يحصل مريض الثلاسيميا على الإعفاء الطبي الشامل للرعاية الصحية ونقل الدم وأدوية سحب الحديد (مع التنبيه أن الوزارة لا تصف أدوية أو جرعات علاجية مباشرة).
- المضاعفات عند إهمال الرعاية: تأخر نمو الطفل، تضخم الطحال وانتفاخ البطن، ترقق وتشوه العظام، وتفاقم فقر الدم والإجهاد.
- الوقاية والفحص قبل الزواج: الالتزام بإجراء الفحص الطبي الشامل قبل الزواج يحد من انتقال المرض للأبناء، لأن حاملي الصفة الوراثية يكونون سليمين تمامًا ولا تظهر عليهم أعراض.

--- 2. الوراثة وكيف تنتقل الثلاسيميا ---
- إذا كان كلا الوالدين حاملين للصفة الوراثية (Thalassemia Trait)، ففي كل حمل تكون الاحتمالات:
  - 25% طفل سليم تمامًا لا يحمل الصفة ولا المرض.
  - 50% طفل حامل للصفة الوراثية (سليم 100% ولا يحتاج علاجًا).
  - 25% طفل مصاب بالثلاسيميا الكبرى.
- حامل الصفة الوراثية شخص سليم تمامًا ولا تظهر عليه أعراض مرضية، فقط ينبغي فحص الشريك قبل الزواج.

--- 3. ليست وصمة والحقوق القانونية والتعليم والعمل ---
- الحقوق القانونية والعمل: بموجب قانون رعاية وتأهيل المعوقين الفلسطيني رقم (4) لسنة 1999 وقانون العمل، يُحظر أي تمييز ضد مريض الثلاسيميا القادر على العمل، وتُخصَّص نسبة 5% للتوظيف للمؤهلين. كما أن حامل الصفة الوراثية سليم 100% ولا يجوز استبعاده من أي وظيفة مدنية أو أمنية.
- التعليم والمدرسة والجامعة: الطالب المصاب يحظى بتسهيلات معتمدة، وتُعد أيام جلسات نقل الدم غيابًا مبررًا بعذر طبي رسمي دون خصم علامات، مع تنسيق الامتحانات الإكمالية عبر الإرشاد التربوي وعمادة شؤون الطلبة وجمعية أصدقاء مرضى الثلاسيميا.

--- 4. خدمات الحملة الست (خدماتنا) ---
تُحدَّد الخدمة بعد دراسة الحالة وتقييم الاحتياج الفعلي:
1. الحماية الاجتماعية: إدماج الأسر الفقيرة والهشة التي لديها مريض ثلاسيميا ضمن السجل الوطني الاجتماعي وشبكات الأمان الوطنية. الوثائق: وثائق إثبات الأسرة ومسح اجتماعي أولي لدى المديرية.
2. المساعدات وفق الاستحقاق: مساعدات نقدية طارئة وعينية وطرود غذائية ومساعدات شتوية للأسر الأكثر احتياجًا وفق معادلة الاستحقاق المعتمدة ودون وساطة.
3. الدعم النفسي والاجتماعي: جلسات إرشاد فردي وأسري ومجموعات دعم الأمهات والآباء مجانًا وبسرية تامة في مراكز الجمعية (رام الله، طولكرم، نابلس، غزة) أو عن بُعد، ولا تتطلب أوراقًا معقدة.
4. إدارة الحالة والمتابعة: تعيين أخصائي اجتماعي يزور الأسرة بكرامة ويضع خطة متابعة شاملة ويساعد في التنسيق المدرسي والاجتماعي.
5. الإحالة للخدمات والجهات المختصة: تفعيل نظام التحويل الوطني لربط الأسرة بخدمات التنقل للمستشفيات والمساندة التعليمية والشركاء.
6. التمكين الاقتصادي وسُبل العيش: تأهيل المرضى البالغين (18 عامًا فأكثر) أو معيلي الأسر بدورات مهنية وتمويل مشاريع صغيرة مدرة للدخل ومنح معدات للانتقال من المساعدة إلى الاستقلالية.

--- 5. الأسئلة الشائعة الرسمية ودور الشركاء ---
- من يستفيد من الحملة؟ الأسر الفقيرة والهشة التي تضم مرضى ثلاسيميا أو تحتاج لدعم اجتماعي أو نفسي أو اقتصادي وفق معايير الاستحقاق.
- هل كل أسرة تحصل تلقائيًا على مساعدة مالية؟ لا، يُحدد نوع الدعم بعد تقييم احتياجات الأسرة ووضعها الاجتماعي والاقتصادي.
- هل الدعم للمريض فقط أم للأسرة؟ يشمل الأسرة ككل عند الحاجة لأن التحديات تؤثر على جميع أفراد الأسرة.
- هل تقدم وزارة التنمية خدمات طبية؟ لا، الوزارة لا تقدم علاجًا طبيًا أو نقل دم أو أدوية (التي تتبع المستشفيات الحكومية)، بل تركز على الحماية الاجتماعية والمساعدات وإدارة الحالة والتمكين الاقتصادي والإحالة.
- دور وزارة التنمية الاجتماعية: الحماية الاجتماعية، المساعدات وفق الاستحقاق، إدارة الحالة، والتمكين الاقتصادي.
- دور جمعية أصدقاء مرضى الثلاسيميا (تأسست 1996): التوعية، محاربة الوصمة، الدعم النفسي والمجتمعي، المتابعة، المناصرة القانونية، والتشبيك.
- سرية البيانات: كافة البيانات سرية تمامًا، ولا تُنشر أي معلومات أو صور أو قصص إلا بموافقة مسبقة.
- خطوات طلب الدعم: تعبئة نموذج "ابدأ مسار الدعم" في الموقع، أو الاتصال على الرقم المجاني 189، أو زيارة أقرب مديرية تنمية اجتماعية. مسار الطلب: استلام الطلب ← تقييم الاحتياج ← تحديد الخدمة المناسبة ← الإحالة ← تقديم الخدمة ← المتابعة.
- للاستشارات النفسية أو الاجتماعية العاجلة: التواصل مباشرة مع جمعية أصدقاء مرضى الثلاسيميا أو تعبئة نموذج الدعم أو مراجعة الأخصائي الاجتماعي في أقرب مديرية.
- خريطة المديريات: تتوفر في صفحة المديريات بالموقع عناوين وأرقام هواتف مديريات التنمية الاجتماعية في محافظات الضفة الغربية وغزة (الخليل، يطا، بيت لحم، القدس، رام الله والبيرة، أريحا، سلفيت، نابلس، قلقيلية، طولكرم، طوباس، جنين، ومحافظات غزة).
`;

const SERVICE_CATEGORY_LABELS_AR: Record<string, string> = {
  social_protection: 'الحماية الاجتماعية',
  eligibility_assistance: 'المساعدات وفق الاستحقاق',
  psychosocial: 'الدعم النفسي والاجتماعي',
  case_management: 'إدارة الحالة والمتابعة',
  referrals: 'الإحالة للخدمات والجهات المختصة',
  economic_empowerment: 'التمكين الاقتصادي وسبل العيش'
};

export function getSupportTypeLabelAr(category?: string): string {
  if (!category || !SERVICE_CATEGORY_LABELS_AR[category]) {
    return 'الحماية الاجتماعية';
  }
  return SERVICE_CATEGORY_LABELS_AR[category];
}

export function formatPalestineTimestamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value || '00';
  const hour = get('hour') === '24' ? '00' : get('hour');
  return `${get('year')}-${get('month')}-${get('day')} ${hour}:${get('minute')}:${get('second')}`;
}

export function generateServerTrackingCode(isTest = false): string {
  const year = 2026;
  const num = Math.floor(10000 + Math.random() * 90000);
  return isTest ? `THAL-TEST-${year}-${num}` : `THAL-${year}-${num}`;
}

export function getCallbackPrompt(language: 'ar' | 'en'): string {
  return language === 'en'
    ? 'Sorry, I could not find an answer to this question in the website content. Please provide your full name and phone number, and our team will contact you soon.'
    : 'عذرًا، لم أتمكن من العثور على إجابة لهذا السؤال ضمن معلومات الموقع الحالية. من فضلك أعطني اسمك الكامل ورقم هاتفك، وسيتواصل معك فريقنا المختص في أقرب وقت.';
}

export function tryDeterministicSiteAnswer(
  qRaw: string,
  language: 'ar' | 'en' = 'ar'
): { answeredFromSite: boolean; reply: string } {
  const q = qRaw.toLowerCase();
  const callbackPrompt = getCallbackPrompt(language);

  const siteMatchers: Array<{ keywords: string[]; replyAr: string; replyEn: string }> = [
    {
      keywords: [
        'ما هي الثلاسيميا',
        'تعريف',
        'ما هو مرض',
        'معني الثلاسيميا',
        'أعراض',
        'اعراض',
        'علامات',
        'معدي',
        'معدية',
        'what is thalassemia',
        'symptoms'
      ],
      replyAr:
        'الثلاسيميا اضطراب وراثي في خلايا الدم يؤدي إلى انخفاض مستوى الهيموجلوبين وعدد كريات الدم الحمراء عن المعدل الطبيعي، وهو غير معدي نهائيًا. من أبرز أعراضه المذكورة في الموقع: التعب والضعف العام، ضيق التنفس، شحوب البشرة، اصفرار الجلد (اليرقان)، تغيرات عظام الوجه، بطء النمو، انتفاخ البطن، وتغير لون البول إلى الداكن.',
      replyEn:
        'Thalassemia is an inherited, non-contagious blood disorder characterized by low hemoglobin and red blood cells. Symptoms listed on the site include fatigue, shortness of breath, pale skin, jaundice, facial bone changes, delayed growth, abdominal swelling, and dark urine.'
    },
    {
      keywords: ['وراث', 'تنتقل', 'فحص', 'زواج', 'حامل', 'الصفة', 'نسب', 'genetic', 'inherit', 'premarital', 'carrier'],
      replyAr:
        'تنتقل الثلاسيميا وراثيًا من الوالدين عبر الجينات. إذا كان كلا الوالدين حاملين للصفة الوراثية، فإن احتمالات كل حمل هي: 25% طفل سليم تمامًا، 50% طفل حامل للصفة (سليم 100% ولا يحتاج علاجًا)، و25% طفل مصاب. الفحص الطبي الشامل قبل الزواج يحد من انتقال المرض للأبناء.',
      replyEn:
        'When both parents carry the thalassemia trait, each pregnancy has a 25% chance of an unaffected child, 50% carrier (100% healthy), and 25% affected child. Premarital screening prevents transmission.'
    },
    {
      keywords: ['إعفاء', 'اعفاء', 'علاج', 'نقل دم', 'حديد', 'مستشفى', 'أدوية', 'ادوية', 'medical', 'exemption', 'treatment'],
      replyAr:
        'بحسب معلومات الموقع، يحصل مريض الثلاسيميا على الإعفاء الطبي الشامل للرعاية الصحية ونقل الدم المنتظم وأدوية طرد الحديد الزائد في المستشفيات الحكومية. وتجدر الإشارة إلى أن وزارة التنمية الاجتماعية لا تقدم خدمات طبية أو نقل دم أو أدوية مباشرة، بل تركز على الحماية الاجتماعية والمساعدات وإدارة الحالة والتمكين.',
      replyEn:
        'Patients receive comprehensive medical exemption for blood transfusions and iron chelation at government hospitals. Note that MoSD provides social protection, aid, and case management rather than direct clinical treatment.'
    },
    {
      keywords: [
        'خدم',
        'مساعد',
        'حماية',
        'نقد',
        'استحقاق',
        'سجل وطني',
        'تمكين',
        'مشروع',
        'منح',
        'دعم نفسي',
        'إدارة الحالة',
        'services',
        'empowerment',
        'cash',
        'protection'
      ],
      replyAr:
        'تشمل خدمات الحملة الست الموضحة في الموقع: (1) الحماية الاجتماعية والتسجيل في السجل الوطني الاجتماعي، (2) المساعدات وفق الاستحقاق (نقدية طارئة وطرود)، (3) الدعم النفسي والاجتماعي مجانًا وبسرية في مراكز الجمعية أو عن بُعد، (4) إدارة الحالة والمتابعة عبر أخصائي اجتماعي، (5) الإحالة للخدمات المختصة، (6) التمكين الاقتصادي ومنح المشاريع الصغيرة للمؤهلين (18 عامًا فأكثر أو معيلي الأسر).',
      replyEn:
        'The campaign offers 6 services: Social Protection (National Social Registry), Eligibility-based Assistance, Free Confidential Psychosocial Support, Case Management, Referrals, and Economic Empowerment micro-grants.'
    },
    {
      keywords: ['مدرسة', 'جامعة', 'غياب', 'امتحان', 'توظيف', 'وظيفة', 'عمل', 'قانون', 'وصمة', 'school', 'university', 'job', 'employment', 'stigma'],
      replyAr:
        'وفق محتوى الموقع، أيام جلسات نقل الدم للطلاب تُعد غيابًا مبررًا بعذر طبي رسمي مع تنسيق الامتحانات الإكمالية. وفي العمل، يحظر قانون رعاية وتأهيل المعوقين رقم (4) لسنة 1999 التمييز ضد المريض القادر على العمل (بنسبة 5% للمؤهلين)، كما أن حامل الصفة سليم 100% ولا يجوز استبعاده من أي وظيفة مدنية أو أمنية.',
      replyEn:
        'Transfusion days are officially excused absences for students with exam accommodations. Under Palestinian Disability Law No. 4 (1999), workplace discrimination is prohibited and genetic carriers face zero employment restrictions.'
    },
    {
      keywords: [
        'أبدأ',
        'ابدا',
        'طلب دعم',
        'مسار الدعم',
        'مديرية',
        'مديريات',
        'رقم',
        '189',
        'هاتف',
        'سرية',
        'سري',
        'بيانات',
        'من أنتم',
        'الجمعية',
        'الوزارة',
        'directorate',
        'request',
        'confidential'
      ],
      replyAr:
        'لتقديم طلب دعم يمكنك تعبئة نموذج «ابدأ مسار الدعم» في الموقع، أو الاتصال على الرقم المجاني 189، أو زيارة أقرب مديرية تنمية اجتماعية (الموضحة عناوينها وأرقامها في صفحة خريطة المديريات بالموقع). كافة البيانات تُعامل بسرية تامة ولا تُنشر دون موافقة مسبقة.',
      replyEn:
        'You can submit the Start Support Pathway form on this site, call toll-free 189, or visit your nearest MoSD Directorate listed on the Directorates Map page. All data is strictly confidential.'
    }
  ];

  const matched = siteMatchers.find((m) => m.keywords.some((kw) => q.includes(kw)));
  if (!matched) {
    return { answeredFromSite: false, reply: callbackPrompt };
  }
  return {
    answeredFromSite: true,
    reply: language === 'en' ? matched.replyEn : matched.replyAr
  };
}

export function generateInstitutionalGuidance(
  query: string,
  language: string = 'ar',
  _userRole?: string,
  governorate?: string
): string {
  const isAr = language !== 'en';
  const q = query.toLowerCase();
  const govNotice = governorate
    ? isAr
      ? `في محافظة ${governorate}`
      : `in ${governorate} Governorate`
    : isAr
    ? 'في محافظتك'
    : 'in your governorate';

  const campaignKeywords = [
    'ثلاسيميا',
    'دم',
    'إعفاء',
    'طبي',
    'صحي',
    'مجاني',
    'مرض',
    'طفل',
    'أسرة',
    'علاج',
    'حماية',
    'مساعدة',
    'تنمية',
    'جمعية',
    'تمكين',
    'مشروع',
    'تعليم',
    'مدرسة',
    'جامعة',
    'وظيفة',
    'عمل',
    'زواج',
    'فحص',
    'وراث',
    'أعراض',
    'مستشفى',
    'مديرية',
    'شؤون',
    'طرد',
    'حديد',
    'أدوية',
    'كفالة',
    'استحقاق',
    'thalassemia',
    'blood',
    'medical',
    'aid',
    'health',
    'support',
    'exemption'
  ];
  const isRelevant = campaignKeywords.some((k) => q.includes(k));

  if (!isRelevant && q.trim().length > 3) {
    return isAr
      ? 'أهلاً بك الكريم.\n\nنعتذر منك، لم نتمكن من العثور على إجابة كافية لهذا السؤال ضمن الخدمات والمعلومات المتاحة في قاعدة بيانات الحملة الرسمية.\n\nيرجى تزويدنا برقم هاتفك عبر نموذج الدعم أو الاتصال مباشرة عبر الرقم المجاني 189 أو مراجعة أقرب مديرية تنمية اجتماعية.'
      : 'Welcome.\n\nWe apologize, but we could not find a verified answer to this question within our official campaign records. Please call toll-free 189 or contact your nearest MoSD Directorate.';
  }

  if (q.includes('إعفاء') || q.includes('صحي') || q.includes('مجاني') || q.includes('علاج') || q.includes('دم') || q.includes('hospital') || q.includes('medical')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `وفقاً لقانون الصحة العامة الفلسطيني والبروتوكولات الحكومية النافذة، يحظى مريض الثلاسيميا بـ **الإعفاء الطبي الشامل** وتغطية كاملة لوحدات الدم المفلترة، أدوية سحب الحديد (Desferal, Exjade)، والفحوصات الدورية المخبرية التخصصية دون أي أعباء مالية.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• مراجعة مديرية الصحة ${govNotice} ومستشفى الرعاية الحكومي مصطحباً التقرير الطبي.\n` +
        `• التنسيق مع فرع جمعية أصدقاء مرضى الثلاسيميا لتسجيل الحالة وتوفير بطاقة المتابعة الميدانية.\n` +
        `• فتح ملف إدارة حالة في مديرية التنمية الاجتماعية للاستفادة من برامج الحماية وبدل المواصلات.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• تقرير طبي رسمي معتمد صادر عن المستشفى الحكومي يثبت تشخيص ثلاسيميا بيتا الكبرى.\n` +
        `• بطاقة هوية ولي الأمر أو المريض + شهادة الميلاد.\n` +
        `• صورتان شخصيتان للمريض.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `مديرية الصحة والمستشفى الحكومي ${govNotice}، والتنسيق المباشر مع فرع جمعية أصدقاء مرضى الثلاسيميا ومديرية التنمية الاجتماعية.`
      : `### 1. Legal & Social Grounding:\n` +
        `Under Palestinian public regulations, patients living with Thalassemia receive 100% comprehensive medical exemption covering blood transfusions, iron chelation therapies, and periodic tests without financial charge.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Visit the Directorate of Health and government hospital ${govNotice}.\n` +
        `• Coordinate with the Thalassemia Patients’ Friends Society (TPFS) branch.\n` +
        `• Open a family case file at MoSD Directorate for social support.\n\n` +
        `### 3. Required Documents:\n` +
        `• Official government hospital diagnostic report.\n` +
        `• Guardian/patient ID and birth certificate.\n` +
        `• Two personal photos.\n\n` +
        `### 4. Where to Go:\n` +
        `Directorate of Health and hospital ${govNotice}, TPFS branch, and MoSD Directorate.`;
  }

  if (q.includes('تمكين') || q.includes('مشروع') || q.includes('منح') || q.includes('قرض') || q.includes('دخل') || q.includes('economic') || q.includes('grant') || q.includes('project')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `تضع وزارة التنمية الاجتماعية أسر مرضى الثلاسيميا والمرضى البالغين المؤهلين على رأس أولويات **الإدارة العامة للتمكين الاقتصادي**، لتحويل الأسر من الاعتمادية على المساعدات إلى أسر منتجة ذات دخل مستقر وكريم.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• مراجعة مرشد التمكين الاقتصادي في مديرية التنمية الاجتماعية ${govNotice}.\n` +
        `• تعبئة استمارة فكرة المشروع الإنتاجي (زراعي، تجاري، مهني، أو خدمي).\n` +
        `• إعداد دراسة الجدوى وتحديد الاحتياجات من المعدات والمواد الخام بالتعاون مع شركاء التمكين.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• بطاقة الهوية لرب الأسرة أو المريض المتقدم.\n` +
        `• إثبات السكن والوضع الاجتماعي.\n` +
        `• شهادة خبرة أو مهارة مهنية في مجال المشروع المقترح إن وجدت.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `قسم التمكين الاقتصادي في مديرية التنمية الاجتماعية ${govNotice}.`
      : `### 1. Legal & Social Grounding:\n` +
        `The Ministry of Social Development prioritizes Thalassemia households and adult patients for economic empowerment micro-grants to transition from dependency into productive, sustainable independence.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Consult the Economic Empowerment Officer at your local MoSD directorate ${govNotice}.\n` +
        `• Submit your micro-project proposal (vocational, retail, agricultural, or service).\n` +
        `• Formulate feasibility assessment and tooling procurement plan.\n\n` +
        `### 3. Required Documents:\n` +
        `• National Palestinian ID.\n` +
        `• Family registry record and residency proof.\n` +
        `• Vocational certificates or past work proof if applicable.\n\n` +
        `### 4. Where to Go:\n` +
        `Economic Empowerment Unit at MoSD Directorate ${govNotice}.`;
  }

  if (q.includes('مدرسة') || q.includes('جامعة') || q.includes('تعليم') || q.includes('غياب') || q.includes('امتحان') || q.includes('school') || q.includes('university') || q.includes('student')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `تكفل التفاهمات المبرمة بين وزارتي التربية والتعليم والتعليم العالي وجمعية الثلاسيميا حق الطالب في اعتبار أيام جلسات نقل الدم غياباً رسمياً مبرراً بعذر مرضي، وتلزم إدارات المدارس والجامعات بعدم الخصم من درجات الطالب وتوفير امتحانات إكمالية مرنة.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• تزويد الإرشاد التربوي أو عمادة شؤون الطلبة بجدول مواعيد نقل الدم الشهرية المقررة.\n` +
        `• الحصول على كتاب دعم وتوصيف لحالة الطالب من جمعية أصدقاء مرضى الثلاسيميا لتسليمه للمؤسسة التعليمية.\n` +
        `• التنسيق مع الأساتذة والمرشد لتسليم الواجبات وتقديم الامتحانات البديلة دون ضغط نفسي.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• تقرير طبي حديث يثبت دورية نقل الدم.\n` +
        `• كتاب الجمعية الموجه لمدير المدرسة أو عميد الكلية.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `إدارة المدرسة أو عمادة شؤون الطلبة بالجامعة، والتواصل مع منسق التعليم بجمعية الثلاسيميا.`
      : `### 1. Legal & Social Grounding:\n` +
        `Under ministerial understandings with TPFS, student absences on transfusion days are officially excused and legally prohibited from harming academic standing or exam qualifications.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Submit monthly transfusion schedule to school counselor or Dean of Students.\n` +
        `• Provide TPFS institutional liaison letter requesting academic accommodation.\n` +
        `• Coordinate flexible make-up exam dates.\n\n` +
        `### 3. Required Documents:\n` +
        `• Hospital transfusion attendance note.\n` +
        `• Official TPFS educational recommendation letter.\n\n` +
        `### 4. Where to Go:\n` +
        `School administration, Dean of Student Affairs, and TPFS Education coordinator.`;
  }

  if (q.includes('وظيفة') || q.includes('عمل') || q.includes('توظيف') || q.includes('حامل') || q.includes('صفة') || q.includes('work') || q.includes('job') || q.includes('carrier')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `بموجب قانون رعاية وتأهيل المعوقين الفلسطيني رقم (4) لسنة 1999 وقانون العمل، يحظر أي تمييز ضد مريض الثلاسيميا القادر على العمل، كما تلتزم المؤسسات بنسبة الـ 5% للمؤهلين. أما حامل الصفة الوراثية فهو سليم 100% ويُحظر قانوناً استبعاده من أي مسابقة توظيف مدنية أو أمنية.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• التقدم للوظائف وفق الكفاءة والشهادات العلمية والمهنية.\n` +
        `• في حال طلب فحص طبي لوظيفة مدنية أو عسكرية، تمنح جمعية الثلاسيميا شهادة رسمية تؤكد أن حامل الصفة لائق طبياً بشكل كامل.\n` +
        `• في حال وجود أي عائق، يتم رفع شكوى لديوان الموظفين العام أو نقابة العمال بالتعاون مع الشؤون القانونية للجمعية.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• شهادة فحص ما قبل الزواج أو فحص الهيموجلوبين الكهربائي (Hb Electrophoresis).\n` +
        `• كتاب من الجمعية يؤكد سلامة حامل الصفة الوراثية.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `الدائرة القانونية بجمعية أصدقاء مرضى الثلاسيميا ومديرية العمل ${govNotice}.`
      : `### 1. Legal & Social Grounding:\n` +
        `Palestinian Disability Law No. 4 of 1999 guarantees non-discrimination in employment. Genetic carriers are 100% medically healthy individuals with zero legal or functional restriction for any civil or security post.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Apply normally based on qualifications.\n` +
        `• Obtain official medical fitness endorsement from TPFS for civil service or military committees.\n` +
        `• Report any unjust rejection to TPFS legal desk for immediate institutional intervention.\n\n` +
        `### 3. Required Documents:\n` +
        `• Hemoglobin Electrophoresis lab report.\n` +
        `• TPFS carrier fitness endorsement.\n\n` +
        `### 4. Where to Go:\n` +
        `TPFS Legal Affairs Unit and Ministry of Labor Directorate ${govNotice}.`;
  }

  return isAr
    ? `### 1. التطمين والوضع القانوني والاجتماعي:\n` +
      `ترحب وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا بأسرتكم الكريمة. أنتم لستم وحدكم في مواجهة أعباء المرض؛ يحق لأسرتكم فتح ملف دراسة حالة رسمي عبر **السجل الوطني الاجتماعي** للاستفادة من برامج الحماية، المساعدات النقدية والطارئة، والدعم النفسي وفق معايير الاستحقاق.\n\n` +
      `### 2. الخطوات العملية المحددة:\n` +
      `• زيارة مديرية التنمية الاجتماعية ${govNotice} ومقابلة الأخصائي الاجتماعي المكلف بإدارة الحالة.\n` +
      `• تسجيل الأسرة في السجل الوطني الاجتماعي لتقييم الاحتياجات الشاملة وفق معادلة الفقر متعدد الأبعاد.\n` +
      `• التنسيق مع جمعية أصدقاء مرضى الثلاسيميا للانضمام لبرامج الإرشاد الأسري ودعم الأقران.\n\n` +
      `### 3. الوثائق المطلوبة:\n` +
      `• بطاقة الهوية لولي الأمر وشهادات ميلاد أفراد الأسرة.\n` +
      `• التقرير الطبي الحكومي الخاص بمريض الثلاسيميا.\n` +
      `• فواتير أو مستندات تثبت نفقات العلاج والتنقل أو انقطاع الدخل.\n\n` +
      `### 4. أين تتوجه للتنفيذ:\n` +
      `مديرية التنمية الاجتماعية ${govNotice}، ومقر جمعية أصدقاء مرضى الثلاسيميا.`
    : `### 1. Legal & Social Grounding:\n` +
      `Under the joint partnership of the Ministry of Social Development and TPFS, families affected by Thalassemia have full rights to social protection assessment via the National Social Registry, case management, and emergency relief based on multidimensional vulnerability.\n\n` +
      `### 2. Actionable Steps:\n` +
      `• Visit your regional MoSD Directorate ${govNotice} to open a case management file.\n` +
      `• Complete social intake assessment for cash, food, or emergency safety nets.\n` +
      `• Register with TPFS for family counseling and peer empowerment activities.\n\n` +
      `### 3. Required Documents:\n` +
      `• Guardian national ID and family registry.\n` +
      `• Government hospital diagnostic report.\n` +
      `• Transit cost records or proof of economic hardship.\n\n` +
      `### 4. Where to Go:\n` +
      `MoSD Directorate ${govNotice} and regional TPFS branch.`;
}

export function pcm16ToWavUint8Array(pcmBytes: Uint8Array, sampleRate = 24000): Uint8Array {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBytes.byteLength;
  const wavBytes = new Uint8Array(44 + dataSize);
  const view = new DataView(wavBytes.buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  wavBytes.set(pcmBytes, 44);
  return wavBytes;
}
