import React, { useState } from 'react';
import { Language } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { SpeakButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface HomeCompactFaqProps {
  language: Language;
  onNavigateToFaq: () => void;
}

export const HomeCompactFaq: React.FC<HomeCompactFaqProps> = ({
  language,
  onNavigateToFaq
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { activeId } = useAudioSpeech();

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const previewFaqs = [
    {
      q: {
        ar: 'من يمكنه الاستفادة من حزم خدمات الحماية والرعاية الاجتماعية؟',
        en: 'Who is eligible to benefit from social protection and care packages?'
      },
      a: {
        ar: 'تستهدف الحملة الأسر الفلسطينية التي تضم مريض ثلاسيميا، ولا سيما الأسر ذات الوضع الاقتصادي الحرج أو التي تحتاج لمساندة نفسية وتمكين اقتصادي، وتُحدد الخدمات بعد دراسة حالة وبحث ميداني معتمد.',
        en: 'The campaign supports Palestinian families with thalassemia members, prioritizing vulnerable households through certified social case assessments.'
      }
    },
    {
      q: {
        ar: 'هل تُقدم الحملة خدمات نقل دم أو علاجات طبية في المستشفيات؟',
        en: 'Does the campaign provide blood transfusions or clinical hospital treatments?'
      },
      a: {
        ar: 'تأكيد هام: دور وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا يركز على الحماية الاجتماعية، المساعدات النقدية وفق الاستحقاق، الدعم النفسي، إدارة الحالة، والتمكين المعيشي، بينما الرعاية الطبية ونقل الدم تقدمها وزارة الصحة والمستشفيات المعتمدة.',
        en: 'Key Clarification: MoSD and TPFS provide social safety, financial relief, psychosocial therapy, and livelihood grants, while clinical care is managed by the Ministry of Health and hospitals.'
      }
    }
  ];

  const headerText = isAr
    ? 'الأسئلة الأكثر تداولاً: إجابات رسمية ومباشرة حول معايير الاستحقاق، إجراءات دراسة الحالة، ونطاق الدعم الاجتماعي.'
    : 'Frequently Asked Questions: Official, direct answers regarding eligibility criteria, case management, and support scope.';

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#694E91]/10 text-[#694E91] text-xs font-black">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ Preview'}</span>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B3A] tracking-tight">
                {isAr ? 'إجابات عن تساؤلات الأسر' : 'Common Questions & Official Answers'}
              </h2>
              <SpeakButton id="home-compact-faq" text={headerText} title={isAr ? 'الأسئلة الشائعة' : 'FAQ audio'} size="md" />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              {headerText}
            </p>
          </div>

          <button
            onClick={onNavigateToFaq}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#694E91] text-[#694E91] hover:text-white border border-[#694E91]/30 hover:border-[#694E91] text-xs font-black transition-all cursor-pointer shadow-2xs group self-start sm:self-auto shrink-0"
          >
            <span>{isAr ? 'عرض بنك الأسئلة الشائعة بالكامل (١٠ أسئلة)' : 'View All 10 Campaign FAQs'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2 Essential Accordion Cards */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {previewFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const faqAudioId = `home-compact-faq-${idx}`;
            const isSpeakingThis = activeId === faqAudioId;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border overflow-hidden shadow-2xs transition-all ${
                  isSpeakingThis
                    ? 'border-[#694E91] bg-[#FAF7FD] ring-2 ring-[#694E91]/30'
                    : 'border-[#EADFD5] bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 p-4 sm:p-5 hover:bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex-1 text-start flex items-center gap-3 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="w-7 h-7 rounded-xl bg-[#694E91]/10 text-[#694E91] font-mono font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-[#1B1B3A] leading-snug">
                      {faq.q[language]}
                    </h4>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <SpeakButton
                      id={faqAudioId}
                      text={`${faq.q[language]}. ${faq.a[language]}`}
                      title={faq.q[language]}
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#694E91] cursor-pointer"
                      aria-label={isOpen ? (isAr ? 'إغلاق الإجابة' : 'Collapse answer') : (isAr ? 'عرض الإجابة' : 'Expand answer')}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#694E91]" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className={`px-5 pb-5 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed ${
                    isSpeakingThis ? 'bg-[#694E91]/8' : 'bg-[#FAF7F2]/40'
                  }`}>
                    <p>{faq.a[language]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
