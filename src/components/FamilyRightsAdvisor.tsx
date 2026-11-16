import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  HelpCircle, 
  MapPin, 
  UserCheck, 
  ExternalLink,
  Copy,
  Check,
  PhoneCall
} from 'lucide-react';
import { generateInstitutionalGuidance } from '../../shared/campaignEngine';

interface FamilyRightsAdvisorProps {
  language: Language;
}

interface QuickPrompt {
  id: string;
  category: string;
  label: { en: string; ar: string };
  query: { en: string; ar: string };
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 'new-diagnosis',
    category: 'medical_exemption',
    label: {
      en: 'Newly Diagnosed Child',
      ar: 'طفل حديث التشخيص'
    },
    query: {
      en: 'Our child was recently diagnosed with Beta Thalassemia Major. What are our official rights for comprehensive medical exemptions and social protection in Palestine?',
      ar: 'طفلنا تم تشخيصه حديثاً بثلاسيميا بيتا الكبرى. ما هي خطواتنا الرسمية للاستفادة من الإعفاءات الطبية الشاملة وشبكة الأمان الاجتماعي في فلسطين؟'
    }
  },
  {
    id: 'economic-empowerment',
    category: 'economic_empowerment',
    label: {
      en: 'Economic Empowerment Grant',
      ar: 'منح التمكين الاقتصادي'
    },
    query: {
      en: 'I am a young adult living with Thalassemia seeking an economic empowerment grant for a micro-project through MoSD. What are the eligibility conditions and procedures?',
      ar: 'أنا شاب مصاب بالثلاسيميا أبحث عن فرصة تمكين اقتصادي لتمويل مشروع صغير عبر وزارة التنمية الاجتماعية. ما هي الشروط والخطوات؟'
    }
  },
  {
    id: 'education-school',
    category: 'education_rights',
    label: {
      en: 'School & University Leave',
      ar: 'تسهيلات الدراسة والجامعة'
    },
    query: {
      en: 'What are the legal protections and academic accommodations for students with thalassemia during hospital transfusion days in Palestinian schools and universities?',
      ar: 'ما هي التسهيلات الأكاديمية وحقوق الغياب المعتمدة للطلبة المصابين بالثلاسيميا في المدارس والجامعات الفلسطينية خلال أيام نقل الدم؟'
    }
  },
  {
    id: 'social-cash-aid',
    category: 'social_aid',
    label: {
      en: 'MoSD Social Safety Net',
      ar: 'مساعدات التنمية وشيكات الشؤون'
    },
    query: {
      en: 'How does the Ministry of Social Development evaluate our family under the National Social Registry for cash and emergency assistance considering chronic disease costs?',
      ar: 'كيف تقيم وزارة التنمية الاجتماعية استحقاق أسرتنا في السجل الوطني للمساعدات النقدية والطارئة نظراً لأعباء مرض الثلاسيميا؟'
    }
  },
  {
    id: 'carrier-employment',
    category: 'carrier_rights',
    label: {
      en: 'Carrier Work Rights',
      ar: 'حقوق حامل الصفة في التوظيف'
    },
    query: {
      en: 'Does being a Thalassemia carrier legally affect employment or military / civil service hiring in Palestine?',
      ar: 'هل يؤثر كون الشخص حاملاً لصفة الثلاسيميا الوراثية على حقه في التوظيف بالقطاعين المدني أو الأمني في فلسطين؟'
    }
  }
];

export const FamilyRightsAdvisor: React.FC<FamilyRightsAdvisorProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [query, setQuery] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  const handleSubmitCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setPhoneSubmitted(true);
  };

  const governorates = [
    { en: 'Ramallah & Al-Bireh', ar: 'رام الله والبيرة' },
    { en: 'Nablus', ar: 'نابلس' },
    { en: 'Hebron', ar: 'الخليل' },
    { en: 'Jenin', ar: 'جنين' },
    { en: 'Tulkarm', ar: 'طولكرم' },
    { en: 'Qalqilya', ar: 'قلقيلية' },
    { en: 'Bethlehem', ar: 'بيت لحم' },
    { en: 'Tubas', ar: 'طوباس' },
    { en: 'Salfit', ar: 'سلفيت' },
    { en: 'Jericho & Jordan Valley', ar: 'أريحا والأغوار' },
    { en: 'Jerusalem', ar: 'القدس' },
    { en: 'Gaza Governorates', ar: 'محافظات غزة' }
  ];

  const roles = [
    { id: 'parent', en: 'Parent / Primary Caregiver', ar: 'أب / أم لمريض ثلاسيميا' },
    { id: 'patient', en: 'Person Living with Thalassemia', ar: 'مريض ثلاسيميا' },
    { id: 'carrier', en: 'Genetic Carrier', ar: 'حامل للصفة الوراثية' },
    { id: 'relative', en: 'Family Member / Advocate', ar: 'أحد أفراد الأسرة' }
  ];

  const handleSelectPrompt = (prompt: QuickPrompt) => {
    setQuery(prompt.query[language]);
    setResponse(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResponse(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          language,
          governorate: governorate || undefined,
          userRole: userRole || undefined,
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        setResponse(generateInstitutionalGuidance(query.trim(), language, userRole || undefined, governorate || undefined));
        return;
      }

      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setResponse(data.response);
      }
    } catch (err: any) {
      console.warn('Advisor offline fallback:', err);
      setResponse(generateInstitutionalGuidance(query.trim(), language, userRole || undefined, governorate || undefined));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setQuery('');
    setResponse(null);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DDD6FE] shadow-sm overflow-hidden">
      {/* Unified Header Banner */}
      <div className="p-6 sm:p-7 bg-[#634B8F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[#E4D7FC] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مستشار حقوق الأسرة والمساندة الذكي' : 'Smart Family Rights Advisor'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isAr ? 'اسأل عن حقوقك وإجراءات المساندة الرسمية' : 'Ask About Your Rights & MoSD Services'}
          </h3>
          <p className="text-[#E4D7FC] text-xs font-medium">
            {isAr 
              ? 'إرشاد موثوق حول الإعفاءات الطبية، المساعدات الاجتماعية، إدارة الحالة، والتمكين الاقتصادي.'
              : 'Direct guidance on medical exemptions, social safety nets, case management, and economic empowerment.'}
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6 bg-white">
        
        {/* Quick Situation Chips - Unified Color */}
        <div className="space-y-2.5">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#634B8F]" />
            <span>{isAr ? 'اختر استفساراً سريعاً:' : 'Quick prompt options:'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSelectPrompt(prompt)}
                className="text-xs px-3.5 py-2 rounded-xl border border-[#DDD6FE] bg-[#F5EFFC] hover:bg-[#634B8F] hover:text-white hover:border-[#634B8F] transition-all text-[#4A326E] font-bold active:scale-95 text-start cursor-pointer shadow-xs"
              >
                {prompt.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-[#634B8F]" />
                <span>{isAr ? 'صفتك بالنسبة للحالة (اختياري)' : 'Your Relationship (Optional)'}</span>
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#634B8F]/30 focus:border-[#634B8F]"
              >
                <option value="">{isAr ? '— اختر صفتك —' : '— Select your role —'}</option>
                {roles.map(r => (
                  <option key={r.id} value={r[language]}>{r[language]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#634B8F]" />
                <span>{isAr ? 'المحافظة (لتحديد المديرية المختصة)' : 'Governorate (Optional)'}</span>
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#634B8F]/30 focus:border-[#634B8F]"
              >
                <option value="">{isAr ? '— اختر المحافظة —' : '— Select governorate —'}</option>
                {governorates.map(g => (
                  <option key={g.en} value={g[language]}>{g[language]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'اكتب استفسارك أو وضع أسرتك بالتفصيل:' : 'Type your question or family situation:'}
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr 
                  ? 'مثال: ابني مريض ثلاسيميا وأواجه صعوبة في تكاليف المواصلات ومواعيد المستشفى، كيف أتقدم للحصول على تقييم في مديرية التنمية؟'
                  : 'E.g., My child has thalassemia and we struggle with transit costs to hospital; how do we apply for case evaluation at MoSD?'}
                className="w-full text-sm font-medium px-4 py-3 rounded-xl border border-[#DDD6FE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#634B8F]/30 focus:border-[#634B8F] placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#634B8F] text-white font-black text-xs hover:bg-[#523D77] transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{isAr ? 'جاري استخراج التوجيه القانوني…' : 'Analyzing Legal Guidance…'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{isAr ? 'استشر المستشار الآن' : 'Consult Advisor Now'}</span>
                  </>
                )}
              </button>

              {(query || response) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  {isAr ? 'مسح' : 'Clear'}
                </button>
              )}
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              {isAr ? 'خدمة استشارية مجانية وسرية تماماً' : '100% Free & Confidential Advice'}
            </span>
          </div>
        </form>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
            <p className="font-bold">{isAr ? 'تنبيه:' : 'Notice:'}</p>
            <p>{errorMessage}</p>
          </div>
        )}

        {/* AI Response Output */}
        {response && (
          <div className="mt-6 p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#7A1822]/20 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD5]">
              <div className="flex items-center gap-2 text-[#7A1822]">
                <ShieldCheck className="w-5 h-5 text-[#2E6F56]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {isAr ? 'التوجيه والإرشاد الرسمي للحالة' : 'Official Case Guidance'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#2E6F56]" />
                    <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>{isAr ? 'نسخ التوجيه' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Markdown rendered cleanly with linebreaks */}
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line space-y-3">
              {response}
            </div>

            {/* Quick Callback Phone Submission Box */}
            <div className="pt-3 border-t border-[#EADFD5] bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-700" />
                  <span>{isAr ? 'طلب تواصل هاتفي مباشر مع المرشد المختص:' : 'Request a direct callback from an advisor:'}</span>
                </span>
                <a 
                  href="tel:189" 
                  className="text-[11px] font-bold text-[#7A1822] hover:underline flex items-center gap-1"
                >
                  <span>{isAr ? 'أو اتصل مجاناً على 189' : 'Or call toll-free 189'}</span>
                </a>
              </div>
              {phoneSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-[#E4D7FC]" />
                  <span>{isAr ? 'تم استلام رقمك بنجاح! سيقوم الأخصائي الاجتماعي بالتواصل معك هاتفياً في أقرب فرصة ممكنة.' : 'Phone received! An advisor will call you shortly.'}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitCallback} className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    placeholder={isAr ? 'أدخل رقم جوالك (مثال: 059XXXXXXX)' : 'Enter phone number (e.g., 059XXXXXXX)'}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!callbackPhone.trim()}
                    className="px-4 py-2.5 bg-[#7A1822] hover:bg-[#911D29] text-white rounded-xl text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isAr ? 'إرسال الرقم' : 'Submit'}
                  </button>
                </form>
              )}
            </div>

            {/* Direct Action Link to Request Support */}
            <div className="pt-4 border-t border-[#EADFD5] flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl">
              <div>
                <p className="text-xs font-black text-slate-900">
                  {isAr ? 'هل تود فتح مسار دعم رسمي ومتابعة الحالة مع الأخصائي؟' : 'Ready to start a formal support pathway with a case worker?'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isAr ? 'يمكنك تقديم طلبك الرقمي مباشرة وسيتواصل معك منسق الحالة بالمديرية.' : 'Submit a request to connect directly with your regional directorate.'}
                </p>
              </div>
              <a
                href="#request"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E6F56] text-white text-xs font-black hover:bg-[#235844] transition-colors"
              >
                <span>{isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Family Pathway'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
