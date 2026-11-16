import React, { useState } from 'react';
import { Language } from '../types';
import { HelpCircle, ChevronDown, Search, ShieldCheck, HeartHandshake, PhoneCall, ExternalLink } from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';
import { analytics } from '../utils/analytics';

interface FaqSectionProps {
  language: Language;
  onNavigateToRequest?: () => void;
  onNavigateToDirectorates?: () => void;
}

interface CampaignFaq {
  number: string;
  category: 'services' | 'process' | 'confidentiality' | 'roles';
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
  keyPoints?: { en: string[]; ar: string[] };
}

export const CAMPAIGN_OFFICIAL_FAQS: CampaignFaq[] = [
  {
    number: '1',
    category: 'services',
    question: {
      en: 'Who can benefit from the campaign services?',
      ar: 'من يمكنه الاستفادة من خدمات الحملة؟'
    },
    answer: {
      en: 'The campaign primarily targets poor and vulnerable families that include individuals living with thalassemia, as well as families requiring social, psychosocial, or economic support, evaluated according to approved vulnerability and eligibility criteria.',
      ar: 'تستهدف الحملة بشكل أساسي الأسر الفقيرة والهشة التي تضم مرضى ثلاسيميا، إضافة إلى الأسر التي تحتاج إلى دعم اجتماعي أو نفسي أو اقتصادي، وذلك وفق التقييم ومعايير الاستحقاق المعتمدة.'
    }
  },
  {
    number: '2',
    category: 'services',
    question: {
      en: 'What types of services can a family receive?',
      ar: 'ما نوع الخدمات التي يمكن أن تحصل عليها الأسرة؟'
    },
    answer: {
      en: 'Services may include, depending on assessed need and verified eligibility: Social protection and relief assistance, Case management and continuous follow-up, Psychosocial support and family counseling, Referral to specialized institutional services, and Economic empowerment and livelihood opportunities.',
      ar: 'قد تشمل الخدمات، بحسب الحاجة والاستحقاق: الحماية والمساعدات الاجتماعية، إدارة الحالة والمتابعة المستمرة، الدعم النفسي والاجتماعي، الإحالة إلى الخدمات المناسبة، وفرص التمكين الاقتصادي وسبل العيش للمؤهلين.'
    },
    keyPoints: {
      en: [
        'Social protection and relief assistance.',
        'Case management and continuous follow-up.',
        'Psychosocial support and family counseling.',
        'Referral to specialized institutional services.',
        'Economic empowerment and livelihood opportunities for eligible beneficiaries.'
      ],
      ar: [
        'الحماية والمساعدات الاجتماعية.',
        'إدارة الحالة والمتابعة.',
        'الدعم النفسي والاجتماعي.',
        'الإحالة إلى الخدمات المناسبة.',
        'فرص التمكين الاقتصادي وسبل العيش للمؤهلين.'
      ]
    }
  },
  {
    number: '3',
    category: 'services',
    question: {
      en: 'Does every family automatically receive financial cash assistance?',
      ar: 'هل كل أسرة تحصل تلقائيًا على مساعدة مالية؟'
    },
    answer: {
      en: 'No. The type of support is determined after evaluating the family’s comprehensive needs and socioeconomic status, then directing them to the most appropriate program according to eligibility criteria and available ministry programs.',
      ar: 'لا. يتم تحديد نوع الدعم بعد تقييم احتياجات الأسرة ووضعها الاجتماعي والاقتصادي، ثم توجيهها إلى الخدمة الأنسب وفق معايير الاستحقاق والبرامج المتاحة.'
    }
  },
  {
    number: '4',
    category: 'process',
    question: {
      en: 'How do I start requesting support?',
      ar: 'كيف أبدأ طلب الدعم لأسرتي؟'
    },
    answer: {
      en: 'You can submit the basic support request form on this platform, contact the Ministry of Social Development or the Thalassemia Patients’ Friends Society directly, or visit your nearest MoSD directorate.',
      ar: 'يمكنك تعبئة نموذج طلب الدعم عبر الصفحة، أو التواصل مع وزارة التنمية الاجتماعية أو جمعية أصدقاء مرضى الثلاسيميا، أو التوجه إلى أقرب مديرية للوزارة.'
    }
  },
  {
    number: '5',
    category: 'process',
    question: {
      en: 'What happens after submitting a request?',
      ar: 'ماذا يحدث بعد إرسال الطلب؟'
    },
    answer: {
      en: 'The request undergoes a structured, dignified pathway: Receiving Request → Needs Assessment → Determining Proper Service → Formal Referral → Service Delivery → Continuous Follow-up.',
      ar: 'يمر الطلب بمسار واضح ومنظم: استلام الطلب، تقييم الاحتياج، تحديد الخدمة المناسبة، الإحالة، تقديم الخدمة، ثم المتابعة الدورية المستمرة.'
    }
  },
  {
    number: '6',
    category: 'confidentiality',
    question: {
      en: 'Are my data and my family’s data strictly confidential?',
      ar: 'هل بياناتي وبيانات أسرتي سرية ومحمية؟'
    },
    answer: {
      en: 'Yes, absolutely. All information is handled with full confidentiality and dignity. Only the minimum necessary data is used to assess needs and deliver services. No information, images, or stories are ever shared or published without explicit, informed consent.',
      ar: 'نعم، بكل تأكيد. يتم التعامل مع كافة البيانات بسرية تامة وصون كامل للكرامة، واستخدام الحد الأدنى اللازم منها لتقييم الحاجة، مع حظر نشر أي معلومات أو صور دون موافقة خطية صريحة ومسبقة.'
    }
  },
  {
    number: '7',
    category: 'services',
    question: {
      en: 'Is support designated for the patient only or for the entire family?',
      ar: 'هل الدعم موجه للمريض فقط أم للأسرة كاملة؟'
    },
    answer: {
      en: 'Support is not limited to the individual alone; because social, economic, and emotional challenges affect the household as a whole, the overall needs of the family are evaluated whenever necessary.',
      ar: 'الدعم لا يقتصر على الفرد فقط؛ لأن التحديات الاجتماعية والاقتصادية والنفسية تؤثر على الأسرة كاملة، لذلك يتم تقييم ومساندة احتياجات الأسرة بمجملها عند الحاجة.'
    }
  },
  {
    number: '8',
    category: 'services',
    question: {
      en: 'Are there economic empowerment opportunities?',
      ar: 'هل توجد فرص تمكين اقتصادي ومشاريع إنتاجية؟'
    },
    answer: {
      en: 'Yes. Eligible patients or family members can be linked to economic empowerment programs, vocational training, or income-generating small enterprise projects according to verified qualifications and available funding opportunities.',
      ar: 'نعم. يمكن توجيه المرضى أو أفراد الأسرة المؤهلين إلى برامج التمكين الاقتصادي وصناديق المشاريع الصغيرة المدرة للدخل لتعزيز الاعتماد على الذات والكرامة المعيشية.'
    }
  },
  {
    number: '9',
    category: 'roles',
    question: {
      en: 'What is the role of MoSD vs. the Thalassemia Patients’ Friends Society?',
      ar: 'ما دور وزارة التنمية الاجتماعية وما دور جمعية أصدقاء مرضى الثلاسيميا؟'
    },
    answer: {
      en: 'The Ministry and the Society work within an integrated, complementary partnership framework: MoSD provides social safety nets, formal case management, and economic empowerment; TPFS delivers community advocacy, peer groups, and psychosocial support.',
      ar: 'تعمل الوزارة والجمعية في إطار تكاملي رسمي: تقود وزارة التنمية الاجتماعية برامج الحماية، المساعدات، إدارة الحالة، والتمكين الاقتصادي؛ بينما تقود الجمعية التوعية، الدعم النفسي والمجتمعي، المتابعة الميدانية، والتشبيك.'
    }
  },
  {
    number: '10',
    category: 'roles',
    question: {
      en: 'Does the Ministry of Social Development provide direct medical services?',
      ar: 'هل تقدم وزارة التنمية الاجتماعية خدمات علاجية أو نقل دم؟'
    },
    answer: {
      en: 'No. The Ministry does not provide clinical treatments, transfusions, or medicine. Its mandate centers entirely on social, psychosocial, and economic safety nets, case management, and healthcare transit referrals.',
      ar: 'لا. وزارة التنمية الاجتماعية لا تقدم خدمات علاجية أو وحدات نقل دم أو أدوية، بل تركز حصراً على الحماية الاجتماعية، الإرشاد النفسي، المساعدات المعيشية، إدارة الحالة، وتيسير الإحالات وبدل المواصلات.'
    }
  }
];

export const FaqSection: React.FC<FaqSectionProps> = ({
  language,
  onNavigateToRequest,
  onNavigateToDirectorates
}) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();

  const [activeCategory, setActiveCategory] = useState<'all' | 'services' | 'process' | 'confidentiality' | 'roles'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({ '1': true });

  const categories = [
    { id: 'all', label: { ar: 'جميع الأسئلة', en: 'All Questions' } },
    { id: 'services', label: { ar: 'الخدمات والاستحقاق', en: 'Services & Eligibility' } },
    { id: 'process', label: { ar: 'مسار التقديم', en: 'Request Process' } },
    { id: 'confidentiality', label: { ar: 'السرية والخصوصية', en: 'Confidentiality' } },
    { id: 'roles', label: { ar: 'أدوار الشراكة', en: 'Partnership Roles' } },
  ];

  const filteredFaqs = CAMPAIGN_OFFICIAL_FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (number: string) => {
    setOpenItems(prev => ({
      ...prev,
      [number]: !prev[number]
    }));
  };

  const headerSpeechText = isAr
    ? 'الأسئلة الشائعة حول خدمات الحملة ومسار الدعم والحماية الاجتماعية لمرضى الثلاسيميا وأسرهم.'
    : 'Frequently Asked Questions regarding campaign services, support pathways, and social protection for thalassemia families.';

  const faqAudioItems = [
    { id: 'faq-section-header', text: headerSpeechText, title: isAr ? 'مقدمة الأسئلة الشائعة' : 'FAQ Overview' },
    ...filteredFaqs.map(faq => ({
      id: `faq-inpage-${faq.number}`,
      text: `${faq.question[language]}. ${faq.answer[language]}${
        faq.keyPoints ? ' ' + faq.keyPoints[language].join('، ') : ''
      }`,
      title: faq.question[language]
    }))
  ];

  return (
    <section id="faq" className="scroll-mt-24 py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-3 p-4 rounded-3xl transition-all ${
          activeId === 'faq-section-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-black text-[#694E91] uppercase tracking-wider">
              {isAr ? 'إجابات رسمية ومباشرة' : 'Official Verified Answers'}
            </span>
            <span className="text-slate-300">·</span>
            <ListenToPageButton items={faqAudioItems} label={isAr ? 'استمع لجميع الأسئلة' : 'Listen to FAQs'} />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1B1B3A] tracking-tight">
              {isAr ? 'الأسئلة الشائعة والمعلومات المعتمدة' : 'Frequently Asked Questions & Official Facts'}
            </h2>
            <SpeakButton 
              id="faq-section-header" 
              text={headerSpeechText} 
              title={isAr ? 'استمع لمقدمة الأسئلة' : 'Listen to FAQ intro'} 
            />
          </div>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr
              ? 'كل ما يهمك معرفته حول برامج الحماية، معايير الاستحقاق، مسار إدارة الحالة، وسرية البيانات.'
              : 'Everything you need to know about social protection, eligibility, case triage, and data confidentiality.'}
          </p>
        </div>

        {/* Search Bar & Category Filter Chips */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأسئلة والأجوبة...' : 'Search questions and answers...'}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-white border border-[#EADFD5] text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#694E91] focus:ring-2 focus:ring-[#694E91]/20 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#694E91] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-[#EADFD5] hover:bg-[#FAF7F2]'
                }`}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openItems[faq.number];
            const isSpeaking = activeId === `faq-inpage-${faq.number}`;
            const speechText = `${faq.question[language]}. ${faq.answer[language]}${
              faq.keyPoints ? ' ' + faq.keyPoints[language].join('، ') : ''
            }`;

            return (
              <div
                key={faq.number}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isSpeaking
                    ? 'border-[#694E91] ring-2 ring-[#694E91]/40 bg-[#FAF7FD]'
                    : isOpen
                    ? 'bg-white border-[#EADFD5] shadow-xs'
                    : 'bg-white/80 border-[#EADFD5] hover:border-[#694E91]/30'
                }`}
              >
                {/* Header Question Bar */}
                <div className="flex items-center justify-between p-4 sm:p-5 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.number)}
                    className="flex-1 flex items-center gap-3 text-start cursor-pointer focus:outline-hidden group"
                  >
                    <span className="w-7 h-7 rounded-xl bg-[#694E91]/10 text-[#694E91] font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-[#694E91] group-hover:text-white transition-colors">
                      {faq.number}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-[#1B1B3A] group-hover:text-[#694E91] transition-colors leading-snug">
                      {faq.question[language]}
                    </h3>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <SpeakButton
                      id={`faq-inpage-${faq.number}`}
                      text={speechText}
                      title={isAr ? `استمع للسؤال ${faq.number}` : `Listen to FAQ ${faq.number}`}
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.number)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                      aria-label={isOpen ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#694E91]' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Answer Content Dropdown */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 border-t border-slate-100 font-medium">
                    <p>{faq.answer[language]}</p>

                    {faq.keyPoints && (
                      <ul className="space-y-1.5 ps-4 list-disc text-slate-600 pt-1">
                        {faq.keyPoints[language].map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Strip at Bottom of FAQ */}
        <div className="p-4 rounded-2xl bg-white border border-[#EADFD5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-[#B72E43]" />
            <span>
              {isAr ? 'هل لديك استفسار إضافي؟ اتصل بالخط المجاني الموحد 189 أو تواصل مع أقرب مديرية.' : 'Have another inquiry? Call the unified helpline 189.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToRequest && (
              <button
                onClick={onNavigateToRequest}
                className="px-3.5 py-1.5 rounded-xl bg-[#694E91] text-white hover:bg-[#523D77] transition-all cursor-pointer font-black text-xs"
              >
                {isAr ? 'ابدأ مسار الدعم' : 'Start Pathway'}
              </button>
            )}
            {onNavigateToDirectorates && (
              <button
                onClick={onNavigateToDirectorates}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] text-slate-700 hover:text-slate-900 border border-[#EADFD5] transition-all cursor-pointer font-black text-xs"
              >
                {isAr ? 'خريطة المديريات' : 'Directorates'}
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
