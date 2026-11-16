import React, { useState } from 'react';
import { Language } from '../types';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';
import { 
  HelpCircle, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  PhoneCall,
  Sparkles
} from 'lucide-react';

interface FaqDedicatedModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRequest: () => void;
  onNavigateToDirectorates: () => void;
}

interface CampaignFaq {
  number: string;
  category: 'services' | 'process' | 'confidentiality' | 'roles' | 'urgent';
  question: { en: string; ar: string };
  answer: { en: string; ar: string };
  keyPoints?: { en: string[]; ar: string[] };
}

const CAMPAIGN_OFFICIAL_FAQS: CampaignFaq[] = [
  {
    number: '1',
    category: 'services',
    question: {
      en: '1. Who can benefit from the campaign services?',
      ar: '١. من يمكنه الاستفادة من خدمات الحملة؟'
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
      en: '2. What types of services can a family receive?',
      ar: '٢. ما نوع الخدمات التي يمكن أن تحصل عليها الأسرة؟'
    },
    answer: {
      en: 'Services may include, depending on assessed need and verified eligibility:',
      ar: 'قد تشمل الخدمات، بحسب الحاجة والاستحقاق:'
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
      en: '3. Does every family automatically receive financial cash assistance?',
      ar: '٣. هل كل أسرة تحصل تلقائيًا على مساعدة مالية؟'
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
      en: '4. How do I start requesting support?',
      ar: '٤. كيف أبدأ طلب الدعم؟'
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
      en: '5. What happens after submitting a request?',
      ar: '٥. ماذا يحدث بعد إرسال الطلب؟'
    },
    answer: {
      en: 'The request undergoes a structured, dignified pathway: Receiving Request → Needs Assessment → Determining Proper Service → Formal Referral → Service Delivery → Continuous Follow-up.',
      ar: 'يمر الطلب بمسار واضح:\nاستلام الطلب ← تقييم الاحتياج ← تحديد الخدمة المناسبة ← الإحالة ← تقديم الخدمة ← المتابعة.'
    }
  },
  {
    number: '6',
    category: 'confidentiality',
    question: {
      en: '6. Are my data and my family’s data strictly confidential?',
      ar: '٦. هل بياناتي وبيانات أسرتي سرية؟'
    },
    answer: {
      en: 'Yes, absolutely. All information is handled with full confidentiality and dignity. Only the minimum necessary data is used to assess needs and deliver services. No information, images, or stories are ever shared or published without explicit, informed consent.',
      ar: 'نعم. يتم التعامل مع البيانات بسرية تامة، واستخدام الحد الأدنى اللازم منها لتقييم الحاجة وتقديم الخدمة، مع عدم نشر المعلومات أو الصور أو القصص دون موافقة واضحة ومسبقة.'
    }
  },
  {
    number: '9',
    category: 'services',
    question: {
      en: '9. Is support designated for the patient only or for the entire family?',
      ar: '٩. هل الدعم موجه للمريض فقط أم للأسرة أيضًا؟'
    },
    answer: {
      en: 'Support is not limited to the individual alone; because social, economic, and emotional challenges affect the household as a whole, the overall needs of the family are evaluated whenever necessary.',
      ar: 'الدعم لا يقتصر على الفرد فقط؛ لأن التحديات الاجتماعية والاقتصادية والنفسية قد تؤثر على الأسرة كاملة، لذلك يتم تقييم احتياجات الأسرة ككل عند الحاجة.'
    }
  },
  {
    number: '10',
    category: 'services',
    question: {
      en: '10. Are there economic empowerment opportunities?',
      ar: '١٠. هل توجد فرص تمكين اقتصادي؟'
    },
    answer: {
      en: 'Yes. Eligible patients or family members can be linked to economic empowerment programs, vocational training, or income-generating small enterprise projects according to verified qualifications and available funding opportunities.',
      ar: 'نعم. يمكن توجيه المرضى أو أفراد الأسرة المؤهلين إلى برامج تمكين اقتصادي أو مشاريع مدرة للدخل وفق الشروط والفرص المتاحة.'
    }
  },
  {
    number: '11',
    category: 'roles',
    question: {
      en: '11. What is the role of the Ministry of Social Development vs. the Thalassemia Patients’ Friends Society?',
      ar: '١١. ما دور وزارة التنمية الاجتماعية وما دور جمعية أصدقاء مرضى الثلاسيميا؟'
    },
    answer: {
      en: 'The Ministry and the Society work within an integrated, complementary partnership framework:',
      ar: 'تعمل الوزارة والجمعية في إطار تكاملي:'
    },
    keyPoints: {
      en: [
        'Ministry of Social Development (MoSD): Social protection, material aid according to eligibility, formal case management, and economic empowerment programs.',
        'Thalassemia Patients’ Friends Society (TPFS): Awareness, emotional and community support, psychosocial follow-up, patient advocacy, and institutional networking.'
      ],
      ar: [
        'وزارة التنمية الاجتماعية: الحماية الاجتماعية، المساعدات، إدارة الحالة، والتمكين الاقتصادي.',
        'جمعية أصدقاء مرضى الثلاسيميا: التوعية، الدعم النفسي والمجتمعي، المتابعة، والتشبيك مع الجهات ذات العلاقة.'
      ]
    }
  },
  {
    number: '12',
    category: 'roles',
    question: {
      en: '12. Does the Ministry of Social Development provide direct medical services?',
      ar: '١٢. هل تقدم الوزارة خدمات طبية مباشرة؟'
    },
    answer: {
      en: 'No. The Ministry of Social Development does not provide medical treatment, blood transfusions, or pharmaceuticals. Rather, it focuses on social, psychosocial, and economic protection, case management, and referrals to appropriate health and care providers.',
      ar: 'لا. وزارة التنمية الاجتماعية لا تقدم خدمات طبية أو نقل دم أو أدوية، بل تركز على الجوانب الاجتماعية والنفسية والاقتصادية وإدارة الحالة والإحالة.'
    }
  },
  {
    number: '13',
    category: 'roles',
    question: {
      en: '13. How can the community and partners support these efforts?',
      ar: '١٣. كيف يمكن للمجتمع أو الشركاء دعم هذه الجهود؟'
    },
    answer: {
      en: 'Community members and organizations can contribute through:',
      ar: 'يمكن دعم الجهود من خلال:'
    },
    keyPoints: {
      en: [
        'Spreading awareness and actively dismantling social stigma.',
        'Funding and supporting family economic empowerment programs.',
        'Supporting community, recreational, and psychosocial resilience initiatives.',
        'Regular voluntary blood donations through accredited Palestinian health channels.'
      ],
      ar: [
        'نشر الوعي ومحاربة الوصمة.',
        'دعم برامج التمكين الاقتصادي للأسر.',
        'مساندة الأنشطة المجتمعية والنفسية.',
        'التبرع بالدم عبر القنوات والجهات الصحية المعتمدة في فلسطين.'
      ]
    }
  },
  {
    number: '14',
    category: 'urgent',
    question: {
      en: '14. Where can I find the nearest Ministry of Social Development directorate?',
      ar: '١٤. أين أجد أقرب مديرية لوزارة التنمية الاجتماعية؟'
    },
    answer: {
      en: 'You can use the interactive directorates map search tool on this page to view addresses, working hours, and direct telephone numbers of MoSD directorates across all Palestinian governorates, or visit www.mosd.gov.ps.',
      ar: 'يمكنك استخدام أداة البحث عن المديريات في هذه الصفحة للوصول إلى بيانات وعناوين وأرقام مديريات التنمية الاجتماعية في مختلف المحافظات، أو زيارة الموقع الرسمي www.mosd.gov.ps.'
    }
  },
  {
    number: '15',
    category: 'urgent',
    question: {
      en: '15. What should I do if I need urgent psychological or social counseling?',
      ar: '١٥. ماذا أفعل إذا كنت بحاجة إلى استشارة نفسية أو اجتماعية عاجلة؟'
    },
    answer: {
      en: 'You can immediately contact the Thalassemia Patients’ Friends Society, fill out the basic support form noting urgent intervention, or visit the social worker at your nearest MoSD directorate for prompt confidential assistance.',
      ar: 'يمكنك التواصل مباشرة مع جمعية أصدقاء مرضى الثلاسيميا، أو تعبئة نموذج الدعم السريع مع الإشارة إلى أن الحالة تتطلب متابعة عاجلة، أو مراجعة الأخصائي الاجتماعي في أقرب مديرية تنمية اجتماعية.'
    }
  }
];

export const FaqDedicatedModal: React.FC<FaqDedicatedModalProps> = ({
  language,
  isOpen,
  onClose,
  onNavigateToRequest,
  onNavigateToDirectorates
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const { activeId } = useAudioSpeech();

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: { en: 'All Questions', ar: 'كافة الأسئلة (١٣)' } },
    { id: 'services', label: { en: 'Services & Eligibility', ar: 'الخدمات والاستحقاق' } },
    { id: 'process', label: { en: 'Application Pathway', ar: 'مسار الطلب' } },
    { id: 'roles', label: { en: 'Roles & Partnerships', ar: 'أدوار الوزارة والجمعية' } },
    { id: 'urgent', label: { en: 'Urgent & Directorates', ar: 'الاستشارة والمديريات' } }
  ];

  const filteredFaqs = CAMPAIGN_OFFICIAL_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const qText = faq.question[language].toLowerCase();
    const aText = faq.answer[language].toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || qText.includes(query) || aText.includes(query);
    return matchesCategory && matchesSearch;
  });

  const allFaqAudioItems = filteredFaqs.map((faq) => ({
    id: `faq-${faq.number}`,
    title: faq.question[language],
    text: `${faq.question[language]}. ${faq.answer[language]} ${faq.keyPoints ? faq.keyPoints[language].join('. ') : ''}`
  }));

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-[#EADFD5] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="bg-[#634B8F] text-white p-5 sm:p-7 flex items-center justify-between relative shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#E4D7FC] text-xs font-black border border-[#E4D7FC]/30">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة الشائعة الرسمية للحملة' : 'Official Campaign FAQ'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isAr ? 'دليل إجابات الأسر والمستفيدين' : 'Family & Beneficiary Knowledge Base'}
            </h2>
            <p className="text-xs text-white/80 font-medium">
              {isAr ? 'كل ما تحتاج معرفته حول شروط الاستفادة، سرية البيانات، ومسار الدعم' : 'Everything you need to know about services, eligibility, and privacy'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ListenToPageButton
              items={allFaqAudioItems}
              title={isAr ? 'قراءة جميع الأسئلة' : 'Read All FAQs'}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-[11px]"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close FAQ modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-[#EADFD5] bg-[#FAF8F5] space-y-4 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأسئلة... (مثال: الاستحقاق، السرية، التمكين، المديرية)' : 'Search questions... (e.g., eligibility, privacy, empowerment)'}
              className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#7A1822]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#7A1822] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Accordion Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">
                {isAr ? 'لم نعثر على أسئلة مطابقة لبحثك' : 'No matching questions found'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-black text-[#7A1822] hover:underline"
              >
                {isAr ? 'عرض كافة الأسئلة' : 'Show all questions'}
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.number;
              const isSpeaking = activeId === `faq-${faq.number}`;
              const faqFullText = `${faq.question[language]}. ${faq.answer[language]} ${
                faq.keyPoints ? faq.keyPoints[language].join('. ') : ''
              }`;

              return (
                <div
                  key={faq.number}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isSpeaking
                      ? 'border-[#694E91] bg-[#694E91]/8 ring-2 ring-[#694E91]/30 shadow-md'
                      : isExpanded 
                        ? 'border-[#7A1822] bg-[#FFFDFC] shadow-sm' 
                        : 'border-[#EADFD5] bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Question Button */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : faq.number)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isSpeaking ? 'bg-[#694E91] text-white' : 'bg-[#7A1822]/10 text-[#7A1822]'
                      }`}>
                        {faq.number}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {faq.question[language]}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* One-Click TTS Audio Button */}
                      <SpeakButton
                        id={`faq-${faq.number}`}
                        text={faqFullText}
                        title={faq.question[language]}
                        size="sm"
                      />

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#7A1822]" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Answer Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed animate-in fade-in">
                      <p className="whitespace-pre-line font-medium">
                        {faq.answer[language]}
                      </p>

                      {faq.keyPoints && (
                        <ul className="space-y-1.5 pr-2 rtl:pr-4 ltr:pl-4 list-disc text-slate-800 font-semibold text-xs sm:text-xs">
                          {faq.keyPoints[language].map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 border-t border-[#EADFD5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#2E6F56]" />
            <span className="font-bold">
              {isAr ? 'إجابات رسمية صادرة بالتنسيق بين الوزارة والجمعية' : 'Official responses vetted by MoSD & TPFS'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateToDirectorates();
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              {isAr ? 'المديريات الميدانية' : 'Directorates'}
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateToRequest();
              }}
              className="px-4 py-2 rounded-xl bg-[#7A1822] hover:bg-[#911D29] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Support Request'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
