import React, { useEffect, useState, useRef } from 'react';
import { Language } from '../types';
import { TPFS_2026_OFFICIAL_STATS } from '../utils/statistics';
import { Users, BarChart3, MapPin, Calendar, Heart } from 'lucide-react';

interface DynamicNumbersSectionProps {
  language: Language;
}

export const DynamicNumbersSection: React.FC<DynamicNumbersSectionProps> = ({
  language
}) => {
  const isAr = language === 'ar';
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animated values
  const [totalCount, setTotalCount] = useState(0);
  const [wbCount, setWbCount] = useState(0);
  const [gazaCount, setGazaCount] = useState(0);
  const [under18Count, setUnder18Count] = useState(0);
  const [above19Count, setAbove19Count] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Animate numbers up to final targets
          const duration = 1600; // ms
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            setTotalCount(Math.floor(ease * TPFS_2026_OFFICIAL_STATS.totalRegistered));
            setWbCount(Math.floor(ease * TPFS_2026_OFFICIAL_STATS.westBankTotal));
            setGazaCount(Math.floor(ease * TPFS_2026_OFFICIAL_STATS.gazaTotal));
            setUnder18Count(Math.floor(ease * TPFS_2026_OFFICIAL_STATS.age18AndUnder));
            setAbove19Count(Math.floor(ease * TPFS_2026_OFFICIAL_STATS.age19AndAbove));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section id="numbers" ref={sectionRef} className="scroll-mt-24 py-16 bg-[#F5EFE8] border-b border-[#E3D6C9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'بيانات وإحصاءات السجل الوطني' : 'Official National Registry Data'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isAr ? 'واقع الثلاسيميا في فلسطين لعام ٢٠٢٦' : 'Thalassemia in Palestine – 2026 Registry Records'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            {isAr 
              ? 'أرقام حقيقية تعكس حجم المسؤولية المشتركة نحو الأسر، والتحول من رعاية الطفولة إلى تمكين البالغين.' 
              : 'Empirical data underscoring our collective mandate to support families through every life stage.'}
          </p>
        </div>

        {/* 5 Big Animated Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: Total Registered (Highlight) */}
          <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-[#7A1822] text-white shadow-sm flex flex-col justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#E4D7FC]">
              {isAr ? 'إجمالي الحالات' : 'Total Patients'}
            </span>
            <div className="my-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {totalCount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-bold text-white/90">
              {isAr ? 'مريض ثلاسيميا مسجل' : 'Registered Patients'}
            </div>
          </div>

          {/* Card 2: West Bank */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3D6C9] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-black text-slate-500">
              <span>{isAr ? 'الضفة الغربية' : 'West Bank'}</span>
              <span className="text-[#7A1822] font-black">{TPFS_2026_OFFICIAL_STATS.westBankPercentage}%</span>
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {wbCount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              {isAr ? 'في محافظات الضفة' : 'In West Bank'}
            </div>
          </div>

          {/* Card 3: Gaza Strip */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3D6C9] shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-black text-slate-500">
              <span>{isAr ? 'قطاع غزة' : 'Gaza Strip'}</span>
              <span className="text-[#B9232E] font-black">{TPFS_2026_OFFICIAL_STATS.gazaPercentage}%</span>
            </div>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {gazaCount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              {isAr ? 'في محافظات غزة' : 'In Gaza Strip'}
            </div>
          </div>

          {/* Card 4: Age 18 and Under */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3D6C9] shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-black text-slate-500 uppercase">
              {isAr ? 'الأطفال واليافعون' : 'Children & Youth'}
            </span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {under18Count.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              {isAr ? 'بعمر ١٨ سنة فأقل' : 'Aged 18 and Under'}
            </div>
          </div>

          {/* Card 5: Age 19 and Above */}
          <div className="p-5 rounded-2xl bg-white border border-[#E3D6C9] shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-black text-[#2E6F56] uppercase">
              {isAr ? 'فئة البالغين والتمكين' : 'Adults & Livelihoods'}
            </span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {above19Count.toLocaleString()}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              {isAr ? 'بعمر ١٩ سنة فأكثر' : 'Aged 19 and Above'}
            </div>
          </div>

        </div>

        {/* Visual Animated Distribution Bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#E3D6C9] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-black text-slate-900 uppercase">
              {isAr ? 'التوزيع الجغرافي للمرضى المسجلين:' : 'Geographical Distribution of Registered Patients:'}
            </span>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#7A1822]" />
                {isAr ? 'الضفة الغربية (٦٦.٤٪)' : 'West Bank (66.4%)'}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-[#B9232E]" />
                {isAr ? 'قطاع غزة (٣٣.٦٪)' : 'Gaza Strip (33.6%)'}
              </span>
            </div>
          </div>

          {/* Percentage Bar */}
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${TPFS_2026_OFFICIAL_STATS.westBankPercentage}%` }}
              className="h-full bg-[#7A1822] transition-all duration-1000 ease-out"
            />
            <div 
              style={{ width: `${TPFS_2026_OFFICIAL_STATS.gazaPercentage}%` }}
              className="h-full bg-[#B9232E] transition-all duration-1000 ease-out"
            />
          </div>

          {/* Demographics insight */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {isAr ? (
              <>
                <strong>ملاحظة استراتيجية:</strong> وجود <strong className="text-slate-900">٦١١ مريضاً بالغاً (أكثر من ٧١٪)</strong> يؤكد أهمية محور <strong>التمكين الاقتصادي وسُبل العيش</strong> لتمكين المرضى من الاستقلال المالي والاندماج في سوق العمل بكرامة.
              </>
            ) : (
              <>
                <strong>Strategic Insight:</strong> With <strong className="text-slate-900">611 adult patients (over 71%)</strong>, economic empowerment, vocational training, and flexible micro-grants are foundational to long-term dignity and self-sufficiency.
              </>
            )}
          </p>
        </div>

        {/* Required Official Attribution Note */}
        <div className="text-center">
          <p className="text-xs text-slate-500 italic font-medium">
            *{TPFS_2026_OFFICIAL_STATS.dataSourceNote[language]}
          </p>
        </div>

      </div>
    </section>
  );
};
