import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Sparkles, Shield, Heart, Award, CheckCircle } from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface NotAStigmaProps {
  language: Language;
}

export const NotAStigma: React.FC<NotAStigmaProps> = ({
  language
}) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();

  const roleWords = [
    { en: 'Student', ar: 'طالب متفوق' },
    { en: 'Professional', ar: 'مهني وموظف' },
    { en: 'Parent', ar: 'رب أسرة' },
    { en: 'Creator', ar: 'مبدع ومنتج' },
    { en: 'Partner', ar: 'شريك في بناء الوطن' }
  ];

  const [activeWordIdx, setActiveWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIdx((prev) => (prev + 1) % roleWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [roleWords.length]);

  const antiStigmaPillars = [
    {
      title: { en: 'Not a Cause for Isolation or Discrimination', ar: 'ليست سببًا للعزل أو التمييز' },
      desc: {
        en: 'A genetic condition is a medical reality, not a justification for social marginalization, isolation, or unequal treatment.',
        ar: 'الثلاسيميا حالة وراثية وليست عيباً أو ذنباً؛ لا يجوز بأي حال أن تكون مبرراً للعزل الاجتماعي أو التمييز في التعليم أو العمل أو الحياة العامة.'
      }
    },
    {
      title: { en: 'Deserves Deep Understanding & Respect for Dignity', ar: 'تحتاج إلى فهم عميق واحترام للكرامة' },
      desc: {
        en: 'True solidarity starts with enlightened understanding and honoring each patient’s fundamental right to a dignified, uncompromised life.',
        ar: 'التضامن الحقيقي يبدأ بالوعي الصحي المستنير واحترام حق المريض الكامل في العيش بكرامة وأمان، بعيداً عن نظرات الشفقة أو الخوف غير المبرر.'
      }
    },
    {
      title: { en: 'Part of Life, Not the Whole Identity or Potential', ar: 'جزء من الحياة… وليست كل الهوية أو القدرات' },
      desc: {
        en: 'Thalassemia is part of a person’s routine journey, never a barrier to talents, leadership, career success, and civic contribution.',
        ar: 'المرض جزء من تجربة المريض اليومية، لكنه لا يحدد إمكاناته ولا طموحاته؛ مرضى الثلاسيميا يدرسون ويبتكرون ويعملون ويبنون أسرهم بنجاح.'
      }
    }
  ];

  const stigmaAudioItems = [
    {
      id: 'stigma-header',
      title: isAr ? 'ليست وصمة' : 'Not a Stigma',
      text: isAr 
        ? 'ميثاق كسر الوصمة وبناء الوعي الإنساني: الثلاسيميا ليست وصمة. الثلاسيميا جزء من تجربة المريض، وليست تعريفاً لكامل هويته وقدراته.'
        : 'Anti-Stigma & Human Dignity Charter: Thalassemia is Not a Stigma. Thalassemia is part of life’s journey, not the definition of identity or limits.'
    },
    ...antiStigmaPillars.map((p, idx) => ({
      id: `stigma-pillar-${idx}`,
      title: p.title[language],
      text: `${p.title[language]}. ${p.desc[language]}`
    }))
  ];

  return (
    <section id="stigma" className="scroll-mt-24 py-20 bg-gradient-to-b from-[#251A38] via-[#482D6E] to-[#1E142F] text-white relative overflow-hidden">
      {/* Background radial gradient with soft mauve and crimson glow */}
      <div className="absolute inset-0 bg-radial from-[#634B8F]/25 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#9E1B28]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#8E7CC3]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-12">
        
        {/* Kinetic Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#E4D7FC] bg-white/10 px-3.5 py-1.5 rounded-full inline-block border border-white/15">
              {isAr ? 'ميثاق كسر الوصمة وبناء الوعي الإنساني' : 'Anti-Stigma & Human Dignity Charter'}
            </span>
            <ListenToPageButton 
              items={stigmaAudioItems}
              title={isAr ? 'ميثاق كسر الوصمة' : 'Anti-Stigma Charter'}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>

          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {isAr ? 'الثلاسيميا ليست وصمة' : 'Thalassemia is Not a Stigma'}
            </h2>
            <SpeakButton
              id="stigma-header"
              text={stigmaAudioItems[0].text}
              title={stigmaAudioItems[0].title}
              size="md"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>

          {/* Kinetic Role Ticker */}
          <div className="h-14 flex items-center justify-center">
            <div className="text-2xl sm:text-4xl font-black text-[#DDD6FE] transition-all duration-300">
              {isAr ? `هو ${roleWords[activeWordIdx].ar}` : `A Proud ${roleWords[activeWordIdx].en}`}
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-white/95 max-w-2xl mx-auto italic pt-2">
            {isAr ? (
              <>«الثلاسيميا جزء من تجربة المريض… وليست تعريفاً لكامل هويته وقدراته.»</>
            ) : (
              <>“Thalassemia is part of life’s journey… not the definition of identity or limits.”</>
            )}
          </p>
        </div>

        {/* 3 Core Messages Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-4">
          {antiStigmaPillars.map((pillar, idx) => {
            const isSpeakingThis = activeId === `stigma-pillar-${idx}`;

            return (
              <div
                key={idx}
                className={`p-7 rounded-3xl border backdrop-blur-xs space-y-4 transition-all duration-300 flex flex-col justify-between ${
                  isSpeakingThis
                    ? 'bg-white/25 border-[#E4D7FC] ring-2 ring-[#E4D7FC] shadow-xl scale-102'
                    : 'bg-white/10 border-white/20 hover:bg-white/15'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-[#634B8F] text-[#E4D7FC] flex items-center justify-center font-black shadow-xs">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <SpeakButton
                      id={`stigma-pillar-${idx}`}
                      text={`${pillar.title[language]}. ${pillar.desc[language]}`}
                      title={pillar.title[language]}
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    />
                  </div>

                  <h3 className="font-black text-lg text-white">
                    {pillar.title[language]}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                    {pillar.desc[language]}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/15 text-[11px] font-bold text-[#E4D7FC]">
                  {isAr ? `الرسالة المحورية ٠${idx + 1}` : `Core Pillar 0${idx + 1}`}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
