import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  TrendingUp, 
  Users, 
  HeartHandshake, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface ImpactDashboardPageProps {
  language: Language;
}

interface MetricItem {
  id: string;
  targetValue: number;
  suffix: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: React.ElementType;
  highlightColor: string;
}

export const ImpactDashboardPage: React.FC<ImpactDashboardPageProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    families: 0,
    counseling: 0,
    empowerment: 0,
    fieldOffices: 0,
    preventionTests: 0,
    communityEvents: 0
  });
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const metrics: MetricItem[] = [
    {
      id: 'families',
      targetValue: 1240,
      suffix: '+',
      title: { en: 'Families Supported', ar: 'أسرة مشمولة بالحماية والرعاية' },
      description: { en: 'Beneficiaries of social safety nets, emergency aid, and case management.', ar: 'استفادت من شبكات الأمان الاجتماعي والمساعدات النقدية وإدارة الحالة.' },
      icon: Users,
      highlightColor: '#9E1B28'
    },
    {
      id: 'counseling',
      targetValue: 860,
      suffix: '+',
      title: { en: 'Family Counseling Sessions', ar: 'جلسة إرشاد ودعم نفسي' },
      description: { en: 'Psychosocial support, peer groups, and emotional debriefing for parents.', ar: 'جلسات إرشاد أسري، تفريغ نفسي للأمهات والآباء، ودعم أقران للمرضى.' },
      icon: HeartHandshake,
      highlightColor: '#634B8F'
    },
    {
      id: 'empowerment',
      targetValue: 135,
      suffix: '',
      title: { en: 'Livelihood Micro-Grants', ar: 'مشروع تمكين اقتصادي' },
      description: { en: 'Income-generating micro-enterprises launched for patients and families.', ar: 'مشاريع صغيرة مدرة للدخل لتمكين المرضى وأسرهم من الإنتاج والاستقلال المالي.' },
      icon: Briefcase,
      highlightColor: '#8E7CC3'
    },
    {
      id: 'fieldOffices',
      targetValue: 16,
      suffix: '',
      title: { en: 'Field Directorates & Hubs', ar: 'مديرية وفرع ميداني فاعل' },
      description: { en: 'Serving patients across all governorates of the West Bank and Gaza Strip.', ar: 'تغطي كافة محافظات الضفة الغربية وقطاع غزة باستجابة ميدانية مباشرة.' },
      icon: Building2,
      highlightColor: '#1B1B3A'
    },
    {
      id: 'preventionTests',
      targetValue: 98,
      suffix: '%',
      title: { en: 'Premarital Screening Rate', ar: 'نسبة الالتزام بالفحص قبل الزواج' },
      description: { en: 'Achieved in registered Palestinian marriages preventing new cases.', ar: 'تحققت في عقود الزواج المسجلة لمنع ولادة حالات جديدة في فلسطين.' },
      icon: ShieldCheck,
      highlightColor: '#9E1B28'
    },
    {
      id: 'communityEvents',
      targetValue: 320,
      suffix: '+',
      title: { en: 'Awareness Seminars', ar: 'ندوة ولقاء توعوي مجتمعي' },
      description: { en: 'Held in schools, universities, and community centers to combat stigma.', ar: 'عقدت في المدارس والجامعات والمراكز المجتمعية لمناهضة الوصمة.' },
      icon: Award,
      highlightColor: '#634B8F'
    }
  ];

  // Scroll triggered count-up animation that repeats whenever entering viewport (scrolling up or down)
  useEffect(() => {
    let animationFrameId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
          }

          const duration = 1600; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for a refined, premium feel
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const nextCounts: { [key: string]: number } = {};
            metrics.forEach(m => {
              nextCounts[m.id] = Math.floor(easeProgress * m.targetValue);
            });

            setCounts(nextCounts);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              const finalCounts: { [key: string]: number } = {};
              metrics.forEach(m => {
                finalCounts[m.id] = m.targetValue;
              });
              setCounts(finalCounts);
              animationFrameId = null;
            }
          };

          animationFrameId = requestAnimationFrame(animate);
        } else {
          // When scrolled out of view, reset so next time it scrolls in, it counts up again
          if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          setCounts({
            families: 0,
            counseling: 0,
            empowerment: 0,
            fieldOffices: 0,
            preventionTests: 0,
            communityEvents: 0
          });
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="impact" 
      ref={sectionRef} 
      className="scroll-mt-24 py-16 bg-[#FAF7F2] border-b border-[#EADFD5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#634B8F]/10 text-[#634B8F] text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة القياس والأثر المستدام' : 'Live Impact & Measurable Outcomes'}</span>
            </div>
            <ListenToPageButton
              items={[
                {
                  id: 'impact-header',
                  title: isAr ? 'لوحة القياس والأثر' : 'Impact Dashboard',
                  text: isAr
                    ? 'أثر ملموس بالأرقام يمتد إلى حياة الأسر. مؤشرات الأداء الميداني للشراكة بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا في مجالات الحماية والتمكين والوقاية.'
                    : 'Measurable Impact Transforming Lives. Verified indicators reflecting joint social safety nets, economic livelihood interventions, and community awareness.'
                },
                ...metrics.map((m) => ({
                  id: `impact-metric-${m.id}`,
                  title: m.title[language],
                  text: `${m.targetValue}${m.suffix} ${m.title[language]}. ${m.description[language]}`
                }))
              ]}
              title={isAr ? 'لوحة القياس والأثر' : 'Impact Dashboard'}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1B1B3A] tracking-tight">
              {isAr ? 'أثرٌ ملموس بالأرقام يمتدّ إلى حياة الأسر' : 'Measurable Impact Transforming Lives'}
            </h2>
            <SpeakButton
              id="impact-header"
              text={isAr
                ? 'أثر ملموس بالأرقام يمتد إلى حياة الأسر. مؤشرات الأداء الميداني للشراكة بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا.'
                : 'Measurable Impact Transforming Lives. Verified indicators reflecting joint social safety nets and community awareness.'}
              title={isAr ? 'عنوان الأثر' : 'Impact Heading'}
              size="md"
            />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr 
              ? 'مؤشرات الأداء الميداني للشراكة بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا في مجالات الحماية والتمكين والوقاية.'
              : 'Verified indicators reflecting joint social safety nets, economic livelihood interventions, and community awareness.'}
          </p>
        </div>

        {/* Dynamic Metric Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            const currentVal = counts[m.id] ?? 0;
            return (
              <div
                key={m.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-xs hover:shadow-md hover:border-[#634B8F]/40 transition-all group flex flex-col justify-between space-y-4 ${
                  activeId === `impact-metric-${m.id}`
                    ? 'border-[#694E91] ring-2 ring-[#694E91]/30 bg-[#FAF7FD]'
                    : 'border-[#EADFD5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-105 shadow-xs"
                    style={{ backgroundColor: m.highlightColor }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SpeakButton
                      id={`impact-metric-${m.id}`}
                      text={`${m.targetValue}${m.suffix} ${m.title[language]}. ${m.description[language]}`}
                      title={m.title[language]}
                      size="sm"
                    />
                    <span className="text-xs font-black text-slate-400 group-hover:text-[#634B8F] transition-colors flex items-center gap-1">
                      <span>{isAr ? 'مؤشر أداء' : 'KPI'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-[#1B1B3A] font-mono tracking-tight">
                      {currentVal.toLocaleString()}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#9E1B28]">
                      {m.suffix}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#1B1B3A]">
                    {m.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {m.description[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'بيانات ميدانية موثقة' : 'Verified Field Record'}</span>
                  </span>
                  <span>{isAr ? 'تحديث دوري' : 'Periodic Sync'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Commitment Statement Card */}
        <div className="bg-[#1B1B3A] text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2 text-left rtl:text-right">
              <div className="inline-flex items-center gap-1.5 text-[#E4D7FC] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E4D7FC]" />
                <span>{isAr ? 'الهدف الوطني الاستراتيجي' : 'Strategic National Goal'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                {isAr 
                  ? 'فلسطين خالية من ولادات جديدة بالثلاسيميا، ومجتمعٌ ضامنٌ للكرامة الإنسانية'
                  : 'A Palestine free of new thalassemia births, with dignity guaranteed for all.'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'بفضل التزام المجتمع بالفحص الطبي قبل الزواج وتكامل شبكة الحماية الاجتماعية، تواصل فلسطين ريادتها الإقليمية في محاصرة المرض وتمكين المرضى كعناصر فاعلة في بناء المجتمع.'
                  : 'Through premarital screening and comprehensive social safety nets, Palestine maintains regional leadership in preventing new cases and empowering affected families.'}
              </p>
            </div>

            <div className="md:col-span-4 flex items-center justify-center md:justify-end">
              <a
                href="#request"
                className="px-6 py-3.5 rounded-xl bg-[#9E1B28] hover:bg-[#B3202E] text-white font-black text-xs transition-all shadow-sm active:scale-95 cursor-pointer text-center"
              >
                {isAr ? 'انضم إلى مسار الدعم والتمكين' : 'Join Support Pathway'}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
