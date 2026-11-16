import React from 'react';
import { Language } from '../types';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Users, 
  HelpCircle,
  HeartHandshake,
  AlertCircle,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';

import { HeroBloodstreamVisual } from './HeroBloodstreamVisual';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';
import { analytics } from '../utils/analytics';

interface HeroProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  onOpenFaq: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onNavigate,
  onOpenFaq
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { activeId } = useAudioSpeech();

  const heroAudioItems = [
    {
      id: 'hero-title',
      title: isAr ? 'عنوان الحملة' : 'Campaign Title',
      text: isAr ? 'الثلاسيميا… دعمٌ يمتدّ إلى الحياة' : 'Thalassemia, support extending to life'
    },
    {
      id: 'hero-subheadline',
      title: isAr ? 'منظومة الشراكة' : 'Partnership Framework',
      text: isAr 
        ? 'منظومة دعم وحماية وتمكين لمرضى الثلاسيميا وأسرهم، تقدمها وزارة التنمية الاجتماعية بالشراكة مع جمعية أصدقاء مرضى الثلاسيميا في فلسطين.'
        : 'A comprehensive protection, counseling, and empowerment framework for thalassemia families, delivered by the Ministry of Social Development in partnership with TPFS Palestine.'
    },
    {
      id: 'hero-definition',
      title: isAr ? 'ما هي الثلاسيميا' : 'What is Thalassemia',
      text: isAr
        ? 'ما هي الثلاسيميا؟ الثلاسيميا مرض وراثي يؤثر في إنتاج الهيموجلوبين في كريات الدم الحمراء، مما يتطلب رعاية صحية منتظمة، وتوفير مظلة أمان وحماية اجتماعية ونفسية متكاملة تصون كرامة المريض وأسرته بسرية تامة.'
        : 'What is Thalassemia? An inherited genetic condition affecting hemoglobin synthesis in red blood cells. Beyond clinical management, families receive holistic social safety, dignity, confidentiality, and livelihood empowerment.'
    },
    {
      id: 'hero-mandate',
      title: isAr ? 'تأكيد الدور المؤسسي' : 'Institutional Mandate',
      text: isAr
        ? 'تأكيد الدور المؤسسي: لا نقدم خدمة طبية أو نقل دم؛ بل نوفر الحماية الاجتماعية، المساعدات النقدية وفق الاستحقاق، الدعم النفسي، إدارة الحالة، الإحالات، والتمكين الاقتصادي.'
        : 'Institutional Mandate: We do not provide clinical treatment or blood transfusions; our focus is social safety nets, means-tested cash assistance, psychosocial therapy, case management, and economic livelihood grants.'
    }
  ];

  const recognitionItems = [
    { en: 'You have a family member living with thalassemia.', ar: 'لديك مريض ثلاسيميا في الأسرة.' },
    { en: 'The family faces economic hardship and living strains.', ar: 'تواجه الأسرة صعوبة اقتصادية وأعباء معيشية.' },
    { en: 'The family needs psychosocial counseling and support.', ar: 'تحتاج الأسرة إلى دعم نفسي واجتماعي.' },
  ];

  return (
    <section id="hero" className="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-[#F5EFE8]/90 via-[#FAF7F2] to-[#FAF7F2] pt-6 pb-16 lg:pt-8 lg:pb-20 border-b border-[#EADFD5]">
      
      {/* Subtle warm decorative glows matching poster */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#9E1B28]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#634B8F]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
        
        {/* Pure Animated SVG/CSS Erythrocyte & Hemoglobin Showcase */}
        <HeroBloodstreamVisual language={language} />

        {/* Main Grid: Copy (7 cols) + Recognition Card (5 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left rtl:text-right">

            {/* Listen to Section Bar */}
            <div className="flex items-center justify-between pb-1">
              <ListenToPageButton 
                items={heroAudioItems} 
                title={isAr ? 'مقدمة الحملة الوطنية' : 'Campaign Introduction'}
              />
            </div>

            {/* Main Title Row with SpeakButton */}
            <div className={`transition-colors duration-300 rounded-2xl p-1 ${
              activeId === 'hero-title' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30 p-2.5' : ''
            }`}>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1B1B3A] leading-[1.15] tracking-tight flex-1">
                  {isAr ? (
                    <>
                      الثلاسيميا…{' '}
                      <span className="text-[#9E1B28]">
                        دعمٌ يمتدّ إلى الحياة
                      </span>
                    </>
                  ) : (
                    <>
                      Thalassemia…{' '}
                      <span className="text-[#9E1B28]">
                        Support Extending to Life
                      </span>
                    </>
                  )}
                </h1>
                <SpeakButton
                  id="hero-title"
                  text={heroAudioItems[0].text}
                  title={heroAudioItems[0].title}
                  size="md"
                />
              </div>
            </div>

            {/* Subheadline & Simplified Thalassemia Definition */}
            <div className="space-y-3">
              <div className={`transition-colors duration-300 rounded-2xl ${
                activeId === 'hero-subheadline' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30 p-2.5' : ''
              }`}>
                <div className="flex items-start gap-2.5">
                  <p className="text-base sm:text-xl text-slate-800 leading-relaxed font-semibold flex-1">
                    {isAr ? (
                      <>
                        منظومة دعم وحماية وتمكين لمرضى الثلاسيميا وأسرهم، تقدمها{' '}
                        <strong className="text-[#1B1B3A] font-black">وزارة التنمية الاجتماعية</strong>{' '}
                        بالشراكة مع{' '}
                        <strong className="text-[#634B8F] font-black">جمعية أصدقاء مرضى الثلاسيميا – فلسطين</strong>.
                      </>
                    ) : (
                      <>
                        A comprehensive protection, counseling, and empowerment framework for thalassemia families, delivered by the{' '}
                        <strong className="text-[#1B1B3A] font-bold">Ministry of Social Development</strong>{' '}
                        in partnership with the{' '}
                        <strong className="text-[#634B8F] font-bold">Thalassemia Patients’ Friends Society – Palestine</strong>.
                      </>
                    )}
                  </p>
                  <SpeakButton
                    id="hero-subheadline"
                    text={heroAudioItems[1].text}
                    title={heroAudioItems[1].title}
                    size="sm"
                  />
                </div>
              </div>
              
              <div className={`transition-colors duration-300 rounded-2xl ${
                activeId === 'hero-definition' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
              }`}>
                <div className="bg-white/80 p-3.5 rounded-xl border border-[#EADFD5] flex items-start gap-2.5">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium flex-1">
                    {isAr ? (
                      <>
                        <strong className="text-[#634B8F] font-bold">ما هي الثلاسيميا؟ </strong>
                        الثلاسيميا مرض وراثي يؤثر في إنتاج الهيموجلوبين في كريات الدم الحمراء، مما يتطلب رعاية صحية منتظمة، وتوفير مظلة أمان وحماية اجتماعية ونفسية متكاملة تصون كرامة المريض وأسرته بسرية تامة.
                      </>
                    ) : (
                      <>
                        <strong className="text-[#634B8F] font-bold">What is Thalassemia? </strong>
                        An inherited genetic condition affecting hemoglobin synthesis in red blood cells. Beyond clinical management, families receive holistic social safety, dignity, confidentiality, and livelihood empowerment.
                      </>
                    )}
                  </p>
                  <SpeakButton
                    id="hero-definition"
                    text={heroAudioItems[2].text}
                    title={heroAudioItems[2].title}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Core Role Clarification Callout */}
            <div className={`transition-colors duration-300 rounded-2xl ${
              activeId === 'hero-mandate' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
            }`}>
              <div className="p-3.5 rounded-xl bg-[#634B8F]/8 border border-[#634B8F]/20 text-xs text-slate-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold flex-1">
                  {isAr ? (
                    <>
                      <strong className="text-[#634B8F]">تأكيد الدور المؤسسي:</strong> لا نقدم خدمة طبية أو نقل دم؛ بل نوفر الحماية الاجتماعية، المساعدات النقدية وفق الاستحقاق، الدعم النفسي، إدارة الحالة، الإحالات، والتمكين الاقتصادي.
                    </>
                  ) : (
                    <>
                      <strong className="text-[#634B8F]">Institutional Mandate:</strong> We do not provide clinical treatment or blood transfusions; our focus is social safety nets, means-tested cash assistance, psychosocial therapy, case management, and economic livelihood grants.
                    </>
                  )}
                </p>
                <SpeakButton
                  id="hero-mandate"
                  text={heroAudioItems[3].text}
                  title={heroAudioItems[3].title}
                  size="sm"
                />
              </div>
            </div>

            {/* Primary Action Button & Secondary Explore Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  onNavigate('request');
                  analytics.logEvent('hero_cta_click', { button: 'start_pathway' });
                }}
                className="px-8 py-3.5 rounded-xl bg-[#9E1B28] hover:bg-[#B3202E] text-white font-black text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 group active:scale-98 cursor-pointer"
              >
                <span>{isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Support Pathway'}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onNavigate('education');
                  analytics.logEvent('hero_cta_click', { button: 'learn_about_thalassemia' });
                }}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#694E91] border border-[#694E91]/30 hover:border-[#694E91] font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>{isAr ? 'تعرّف على الثلاسيميا' : 'Learn About Thalassemia'}</span>
              </button>
            </div>

            {/* Trust Line */}
            <div className="pt-3 border-t border-[#EADFD5] flex flex-wrap items-center gap-5 text-xs font-black text-slate-700">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#634B8F]" />
                <span>{isAr ? 'سرية تامة' : 'Strict Privacy'}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#634B8F]" />
                <span>{isAr ? 'صون الكرامة' : 'Human Dignity'}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#634B8F]" />
                <span>{isAr ? 'متابعة دورية مستمرة' : 'Continuous Follow-up'}</span>
              </div>
            </div>

          </div>

          {/* Side Column: "Is this page for you?" Recognition Box (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* "Is This Page for You?" Recognition Checklist with exactly 3 items + CTA */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EADFD5] shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#634B8F]/10 text-[#634B8F] flex items-center justify-center font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#1B1B3A] text-base">
                    {isAr ? 'هل هذه الصفحة موجهة لأسرتك؟' : 'Is This Page for Your Family?'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    {isAr ? 'إذا انطبقت على أسرتك هذه الحالات، فالدعم متاح لكم:' : 'If any apply to your family, support is available:'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                {recognitionItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-800 bg-[#FAF7F2] p-3 rounded-xl border border-[#EADFD5]/70">
                    <CheckCircle2 className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item[language]}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('services')}
                className="w-full py-3.5 rounded-xl bg-[#634B8F] hover:bg-[#523D77] text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
              >
                <span>{isAr ? 'اعرف الخدمات والمساعدات المتاحة لأسرتك' : 'Explore Available Support & Services'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Directorate Locator Action */}
            <div 
              onClick={() => onNavigate('directorates')}
              className="bg-[#634B8F]/5 hover:bg-[#634B8F]/10 border border-[#634B8F]/15 text-[#1B1B3A] rounded-2xl p-4 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#634B8F]" />
                <div>
                  <span className="text-xs font-black block text-[#1B1B3A]">
                    {isAr ? 'خريطة مديريات التنمية الاجتماعية' : 'Find Nearest MoSD Directorate'}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {isAr ? 'بيانات وعناوين المديريات في كافة المحافظات' : 'Field office phone & addresses across Palestine'}
                  </span>
                </div>
              </div>
              <ArrowIcon className="w-4 h-4 text-[#634B8F]" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
