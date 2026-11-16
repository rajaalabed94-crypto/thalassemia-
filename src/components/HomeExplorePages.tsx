import React from 'react';
import { Language } from '../types';
import {
  BookOpen,
  Dna,
  Briefcase,
  ShieldCheck,
  HelpCircle,
  Gamepad2,
  TrendingUp,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Compass
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface HomeExplorePagesProps {
  language: Language;
  onNavigate: (pageId: string) => void;
}

interface ExploreCardItem {
  id: string;
  pageId: string;
  badge: { ar: string; en: string };
  title: { ar: string; en: string };
  summary: { ar: string; en: string };
  cta: { ar: string; en: string };
  icon: React.ElementType;
  accent: 'mauve' | 'red' | 'emerald' | 'navy';
}

export const HomeExplorePages: React.FC<HomeExplorePagesProps> = ({
  language,
  onNavigate
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { activeId } = useAudioSpeech();

  const exploreCards: ExploreCardItem[] = [
    {
      id: 'explore-education',
      pageId: 'education',
      badge: { ar: 'دليل طبي', en: 'Medical Guide' },
      title: { ar: 'اعرف الثلاسيميا والملف الطبي', en: 'Know Thalassemia & Medical Dossier' },
      summary: {
        ar: 'شرح مبسط لتصنيف المرض، أعراضه الثمانية، بروتوكولات العلاج، والوقاية بالفحص قبل الزواج مع مستشار الحقوق.',
        en: 'Clear overview of thalassemia types, 8 clinical signs, treatment protocols, premarital screening, and rights advisor.'
      },
      cta: { ar: 'اكتشف المزيد', en: 'Explore Page' },
      icon: BookOpen,
      accent: 'red'
    },
    {
      id: 'explore-genetics',
      pageId: 'genetics',
      badge: { ar: 'مربع بانت التفاعلي', en: 'Interactive Genetics' },
      title: { ar: 'كيف تنتقل الثلاسيميا وراثياً؟', en: 'How Thalassemia Is Inherited' },
      summary: {
        ar: 'مخطط علمي تفاعلي يوضح احتمالات كل حمل (٢٥٪ سليم، ٥٠٪ حامل، ٢٥٪ مصاب) والقاعدة الوراثية الذهبية.',
        en: 'Interactive Punnett Square illustrating per-pregnancy probabilities (25% healthy, 50% carrier, 25% major).'
      },
      cta: { ar: 'افتح المخطط', en: 'Open Diagram' },
      icon: Dna,
      accent: 'mauve'
    },
    {
      id: 'explore-services',
      pageId: 'services',
      badge: { ar: '٦ حزم معتمدة', en: '6 Service Packages' },
      title: { ar: 'خدماتنا وبرامج الحماية الاجتماعية', en: 'Services & Social Protection' },
      summary: {
        ar: 'استعرض حزم الدعم النقدي، التأمين الصحي، الإرشاد الأسري، التمكين الاقتصادي، وشروط الاستحقاق عبر دراسة الحالة.',
        en: 'Browse cash safety nets, medical exemptions, family counseling, micro-grants, and case assessment criteria.'
      },
      cta: { ar: 'عرض الخدمات', en: 'View Services' },
      icon: Briefcase,
      accent: 'red'
    },
    {
      id: 'explore-stigma',
      pageId: 'stigma',
      badge: { ar: 'ميثاق الكرامة', en: 'Dignity Charter' },
      title: { ar: 'الثلاسيميا ليست وصمة', en: 'Thalassemia Is Not a Stigma' },
      summary: {
        ar: 'رسالة توعوية وإنسانية تبرز قدرات المرضى وإنجازاتهم، وترسخ الحق في التعليم والعمل والمشاركة دون تمييز.',
        en: 'Human dignity charter highlighting patient talents and upholding equal rights to education, careers, and inclusion.'
      },
      cta: { ar: 'اقرأ الميثاق', en: 'Read Charter' },
      icon: ShieldCheck,
      accent: 'mauve'
    },
    {
      id: 'explore-myth',
      pageId: 'myth-vs-fact',
      badge: { ar: 'اختبار تفاعلي', en: 'Interactive Quiz' },
      title: { ar: 'تحدي صح أم خطأ؟', en: 'Myth vs. Fact Challenge' },
      summary: {
        ar: 'اختبر معلوماتك وصحّح المفاهيم المغلوطة حول العدوى، حبوب الحديد، الفحص قبل الزواج، وحياة المريض.',
        en: 'Test your knowledge and debunk misconceptions on contagion, iron pills, premarital testing, and daily living.'
      },
      cta: { ar: 'ابدأ التحدي', en: 'Start Quiz' },
      icon: HelpCircle,
      accent: 'emerald'
    },
    {
      id: 'explore-game',
      pageId: 'game',
      badge: { ar: 'لعبة تعليمية', en: 'Educational Game' },
      title: { ar: 'لعبة بطل الهيموجلوبين', en: 'Hemoglobin Hero Game' },
      summary: {
        ar: 'محاكاة تفاعلية مسلية تشرح للأطفال والشباب آلية نقل الأكسجين في الدم وأهمية أدوية طرد الحديد.',
        en: 'Interactive simulation teaching children and youth how red blood cells deliver oxygen and clear excess iron.'
      },
      cta: { ar: 'العب الآن', en: 'Play Now' },
      icon: Gamepad2,
      accent: 'red'
    },
    {
      id: 'explore-impact',
      pageId: 'impact',
      badge: { ar: 'إحصاءات ٢٠٢٦', en: '2026 Statistics' },
      title: { ar: 'لوحة القياس والأثر والمحافظات', en: 'Impact & Regional Registry' },
      summary: {
        ar: 'مؤشرات الأداء الميداني، أرقام السجل الوطني في الضفة والقطاع، والخريطة التفاعلية للشراكة.',
        en: 'Verified field KPIs, 2026 national registry numbers across governorates, and joint partner dashboards.'
      },
      cta: { ar: 'استعرض الأثر', en: 'View Impact' },
      icon: TrendingUp,
      accent: 'mauve'
    },
    {
      id: 'explore-directorates',
      pageId: 'directorates',
      badge: { ar: 'خريطة تفاعلية', en: 'Interactive Map' },
      title: { ar: 'خريطة مديريات التنمية الاجتماعية', en: 'MoSD Directorates Map' },
      summary: {
        ar: 'عناوين وأرقام هواتف المديريات في جميع محافظات فلسطين مع التحديد المباشر على خرائط Google.',
        en: 'Direct addresses, phone numbers, and exact Google Maps locations across every Palestinian governorate.'
      },
      cta: { ar: 'ابحث عن مديريتك', en: 'Find Office' },
      icon: MapPin,
      accent: 'navy'
    }
  ];

  const headerSpeechText = isAr
    ? 'استكشف أقسام المنصة والصفحات التخصصية. اختر أي مسار للانتقال إلى صفحته المستقلة الكاملة، سواءً للتعريف بالمرض أو الوراثة أو الخدمات أو اللعبة التعليمية أو خريطة المديريات.'
    : 'Explore Specialized Platform Pages. Open any dedicated page for medical guides, Mendelian genetics, protection services, interactive quizzes, the educational game, impact data, or directorate locations.';

  const accentBadgeMap = {
    mauve: 'bg-[#634B8F]/10 text-[#634B8F] border-[#634B8F]/20',
    red: 'bg-[#9E1B28]/10 text-[#9E1B28] border-[#9E1B28]/20',
    emerald: 'bg-[#2E6F56]/10 text-[#2E6F56] border-[#2E6F56]/20',
    navy: 'bg-[#1B1B3A]/10 text-[#1B1B3A] border-[#1B1B3A]/20'
  };

  const accentIconMap = {
    mauve: 'bg-[#634B8F] text-white',
    red: 'bg-[#9E1B28] text-white',
    emerald: 'bg-[#2E6F56] text-white',
    navy: 'bg-[#1B1B3A] text-white'
  };

  return (
    <section id="explore" className="scroll-mt-24 py-14 sm:py-16 bg-white border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-3xl transition-colors ${
            activeId === 'explore-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
          }`}
        >
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#634B8F]/10 text-[#634B8F] text-xs font-black">
                <Compass className="w-3.5 h-3.5" />
                <span>{isAr ? 'دليل الصفحات المستقلة' : 'Dedicated Pages Directory'}</span>
              </div>
              <ListenToPageButton
                items={[
                  {
                    id: 'explore-header',
                    title: isAr ? 'أقسام المنصة' : 'Explore Pages',
                    text: headerSpeechText
                  },
                  ...exploreCards.map((c) => ({
                    id: c.id,
                    title: c.title[language],
                    text: `${c.title[language]}. ${c.summary[language]}`
                  }))
                ]}
                title={isAr ? 'أقسام المنصة' : 'Platform Sections'}
              />
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B3A] tracking-tight">
                {isAr ? 'استكشف أقسام الحملة وصفحاتها المتخصصة' : 'Explore Specialized Campaign Pages'}
              </h2>
              <SpeakButton
                id="explore-header"
                text={headerSpeechText}
                title={isAr ? 'استكشف أقسام الحملة' : 'Explore Campaign Pages'}
                size="md"
              />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              {isAr
                ? 'تم تنظيم كل مسار في صفحته المستقلة لتسهيل التصفح والوصول السريع للمعلومات والخدمات.'
                : 'Each pathway is organized on its own dedicated page for clear navigation and direct access.'}
            </p>
          </div>
        </div>

        {/* Concise Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {exploreCards.map((card) => {
            const Icon = card.icon;
            const isSpeaking = activeId === card.id;

            return (
              <article
                key={card.id}
                className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  isSpeaking
                    ? 'bg-[#FAF7FD] border-[#694E91] ring-2 ring-[#694E91]/30 shadow-md'
                    : 'bg-[#FAF7F2] border-[#EADFD5]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                        accentIconMap[card.accent]
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                          accentBadgeMap[card.accent]
                        }`}
                      >
                        {card.badge[language]}
                      </span>
                      <SpeakButton
                        id={card.id}
                        text={`${card.title[language]}. ${card.summary[language]}`}
                        title={card.title[language]}
                        size="sm"
                      />
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#1B1B3A] leading-snug">
                    {card.title[language]}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {card.summary[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EADFD5]">
                  <button
                    type="button"
                    onClick={() => onNavigate(card.pageId)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#634B8F] text-[#634B8F] hover:text-white border border-[#634B8F]/25 hover:border-[#634B8F] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                  >
                    <span>{card.cta[language]}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
