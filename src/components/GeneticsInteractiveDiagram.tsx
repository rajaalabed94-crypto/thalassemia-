import React, { useState } from 'react';
import { Language } from '../types';
import { Dna, ShieldCheck, Heart, AlertCircle, Info, CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface GeneticsInteractiveDiagramProps {
  language: Language;
}

export const GeneticsInteractiveDiagram: React.FC<GeneticsInteractiveDiagramProps> = ({
  language
}) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();
  
  // Selected outcome or cell in Punnett square
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<number | null>(null);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState<boolean>(false);

  const outcomes = [
    {
      id: 1,
      badge: '25%',
      genotype: 'BB',
      title: { en: 'Child 1: Completely Healthy', ar: 'طفل سليم تماماً (غير مصاب وغير حامل)' },
      percentage: '25%',
      ratio: { en: '1 in 4 chance', ar: 'احتمال ١ من كل ٤ (٢٥٪)' },
      colorClass: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50',
      badgeColor: 'bg-emerald-600 text-white',
      desc: {
        en: 'Inherits two normal beta-globin genes (B from father, B from mother). Completely free of the condition, does not carry the trait, and cannot pass it to future generations.',
        ar: 'يرث جينين سليمين (B من الأب، B من الأم). سليم تماماً من الناحية الصحية، لا يحمل الصفة الوراثية، ولا ينقلها إلى أبنائه مستقبلاً.'
      }
    },
    {
      id: 2,
      badge: '50%',
      genotype: 'Bb',
      title: { en: 'Children 2 & 3: Thalassemia Trait Carrier', ar: 'طفل حامل للصفة الوراثية (ثلاسيميا صغرى)' },
      percentage: '50%',
      ratio: { en: '2 in 4 chances (1 in 2)', ar: 'احتمال ٢ من كل ٤ (٥٠٪)' },
      colorClass: 'bg-[#F4EFFC]/80 border-[#D8C7F8] text-[#341F59]',
      activeRing: 'ring-2 ring-[#694E91] bg-[#F4EFFC]',
      badgeColor: 'bg-[#694E91] text-white',
      desc: {
        en: 'Inherits one normal gene and one altered gene (B and b). Healthy, lives a normal life with no symptoms, but carries the trait and can pass it on if partner is also a carrier.',
        ar: 'يرث جيناً سليماً B وجيناً متحوراً b. إنسان معافى تماماً ويمارس حياته بشكل طبيعي دون أعراض مرضية، لكنه يحمل الصفة ويمكن أن ينقلها إذا كان الطرف الآخر حاملاً أيضاً.'
      }
    },
    {
      id: 3,
      badge: '25%',
      genotype: 'bb',
      title: { en: 'Child 4: Living with Thalassemia Major', ar: 'طفل مصاب بالمرض (ثلاسيميا كبرى)' },
      percentage: '25%',
      ratio: { en: '1 in 4 chance', ar: 'احتمال ١ من كل ٤ (٢٥٪)' },
      colorClass: 'bg-[#FDF2F3]/80 border-[#F5C2C7] text-[#7A1520]',
      activeRing: 'ring-2 ring-[#9E1B28] bg-[#FDF2F3]',
      badgeColor: 'bg-[#9E1B28] text-white',
      desc: {
        en: 'Inherits two altered genes (b from father, b from mother). Requires routine healthcare, periodic transfusions, iron chelation, and the national social protection safety net.',
        ar: 'يرث الجينين المتحورين (b من الأب، b من الأم). يحتاج إلى رعاية صحية منتظمة، ونقل دم دوري، وعلاجات طرد الحديد، ومظلة الحماية والدعم الاجتماعي الشامل.'
      }
    }
  ];

  const headerText = isAr 
    ? 'كيف تنتقل الثلاسيميا وراثياً؟ تنتقل الثلاسيميا كصفة جسدية متنحية. عند زواج شخصين كلاهما حامل لصفة بيتا ثلاسيميا، تكون الاحتمالات الرياضية في كل حمل كما يوضحها مربع بانت الوراثي: ٢٥٪ طفل سليم تماماً، ٥٠٪ طفل حامل للصفة، و٢٥٪ طفل مصاب بالمرض.'
    : 'How is Thalassemia Inherited? Inherited as an autosomal recessive trait. When two carriers marry, the Mendelian Punnett square probabilities per pregnancy are: 25% healthy, 50% carrier, 25% major.';

  const goldenRuleText = isAr
    ? 'قاعدة علمية جوهرية: هذه النسب (٢٥٪ سليم، ٥٠٪ حامل، ٢٥٪ مصاب) تمثل احتمالية مستقلة تتجدد مع كل حمل بصورة منفصلة بنسبة ١٠٠٪، ولا تعني إطلاقاً أن إنجاب طفل مصاب يضمن سلامة الأطفال اللاحقين. الفحص الطبي قبل الزواج هو الوسيلة الحاسمة لحماية الأسرة والأجيال.'
    : 'Scientific Principle: These probabilities apply independently to each single pregnancy. Premarital medical screening remains the definitive shield.';

  const geneticsAudioItems = [
    { id: 'genetics-header', text: headerText, title: isAr ? 'مقدمة الوراثة ومربع بانت' : 'Genetics Overview' },
    ...outcomes.map(item => ({
      id: `genetics-outcome-${item.id}`,
      text: `${item.title[language]}. ${item.percentage}، ${item.ratio[language]}. ${item.desc[language]}`,
      title: item.title[language]
    })),
    { id: 'genetics-golden-rule', text: goldenRuleText, title: isAr ? 'القاعدة الذهبية' : 'Golden Rule' }
  ];

  return (
    <section id="genetics" className="scroll-mt-24 py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#EADFD5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-3 p-4 rounded-3xl transition-all ${
          activeId === 'genetics-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#694E91]/10 text-[#694E91] text-xs font-black">
              <Dna className="w-3.5 h-3.5" />
              <span>{isAr ? 'مخطط الوراثة ومربع بانت (Punnett Square)' : 'Mendelian Punnett Square'}</span>
            </div>
            <ListenToPageButton 
              items={geneticsAudioItems} 
              label={isAr ? 'استمع لشرح الوراثة' : 'Listen to genetics'} 
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B3A] tracking-tight">
              {isAr ? 'كيف تنتقل الثلاسيميا وراثياً؟' : 'How is Thalassemia Inherited?'}
            </h2>
            <SpeakButton 
              id="genetics-header" 
              text={headerText} 
              title={isAr ? 'استمع لمقدمة الوراثة' : 'Listen to genetics intro'} 
            />
          </div>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr 
              ? 'تنتقل الثلاسيميا وفق نمط الوراثة المتنحي. عند زواج شخصين حاملين للصفة (Carrier × Carrier)، تتوزع الاحتمالات الوراثية لكل حمل بمفرده وفق الآلية العلمية التالية:' 
              : 'Inherited as an autosomal recessive trait. When two carriers marry, the genetic possibilities per pregnancy follow this Mendelian distribution:'}
          </p>
        </div>

        {/* Scientific Punnett Square & Parents Showcase Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#EADFD5] shadow-xs space-y-8">
          
          {/* Parents Row (Vector Gene Markers - No Cartoon Faces) */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-6 border border-[#EADFD5]">
            <div className="text-center mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#694E91] bg-white px-3 py-1 rounded-full border border-[#EADFD5] inline-block shadow-2xs">
                {isAr ? 'الوالدان: كلاهما حامل لصفة بيتا ثلاسيميا الوراثية' : 'Parents: Both Are Beta Thalassemia Trait Carriers'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              
              {/* Father Marker */}
              <div className="bg-white p-4 rounded-xl border border-[#EADFD5] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#694E91]/10 text-[#694E91] flex items-center justify-center font-black">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#1B1B3A]">
                      {isAr ? 'الأب: حامل للصفة الوراثية' : 'Father: Trait Carrier'}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-bold block mt-0.5">
                      {isAr ? 'سليم ظاهرياً (جين سليم B + جين متحور b)' : 'Healthy carrier (B b)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-xs">
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200" title={isAr ? 'جين سليم' : 'Normal gene'}>B</span>
                  <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 border border-rose-200" title={isAr ? 'جين متحور' : 'Altered gene'}>b</span>
                </div>
              </div>

              {/* Mother Marker */}
              <div className="bg-white p-4 rounded-xl border border-[#EADFD5] flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#694E91]/10 text-[#694E91] flex items-center justify-center font-black">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#1B1B3A]">
                      {isAr ? 'الأم: حاملة للصفة الوراثية' : 'Mother: Trait Carrier'}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-bold block mt-0.5">
                      {isAr ? 'سليمة ظاهرياً (جين سليم B + جين متحور b)' : 'Healthy carrier (B b)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-mono font-black text-xs">
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200" title={isAr ? 'جين سليم' : 'Normal gene'}>B</span>
                  <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 border border-rose-200" title={isAr ? 'جين متحور' : 'Altered gene'}>b</span>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Punnett Square Grid (2x2 Matrix) */}
          <div className="max-w-xl mx-auto space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-sm sm:text-base font-black text-[#1B1B3A]">
                {isAr ? 'مربع بانت الوراثي لاحتمالات الأجنة:' : 'Mendelian Punnett Square for Gamete Combinations:'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'انقر على أي خلية في المربع لإبراز نتيجة الاحتمال المقابل:' : 'Click any cell to highlight the corresponding outcome:'}
              </p>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[320px] max-w-md mx-auto border-2 border-slate-300 rounded-2xl p-3 bg-white shadow-xs">
                
                {/* Header Row: Father Gametes */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-black pb-2 border-b border-slate-200 items-center">
                  <div className="text-[11px] text-slate-500 font-bold">
                    {isAr ? 'الأم ↓ / الأب ←' : 'Mother ↓ / Father →'}
                  </div>
                  <div className="bg-[#FAF7F2] py-1.5 rounded-lg border border-[#EADFD5]">
                    <span className="text-emerald-700 font-mono font-black text-sm">B</span>{' '}
                    <span className="text-[10px] text-slate-500 hidden sm:inline">({isAr ? 'سليم' : 'Normal'})</span>
                  </div>
                  <div className="bg-[#FAF7F2] py-1.5 rounded-lg border border-[#EADFD5]">
                    <span className="text-rose-700 font-mono font-black text-sm">b</span>{' '}
                    <span className="text-[10px] text-slate-500 hidden sm:inline">({isAr ? 'متحور' : 'Trait'})</span>
                  </div>
                </div>

                {/* Row 1: Mother Gamete B */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 items-center">
                  <div className="bg-[#FAF7F2] py-3 rounded-lg border border-[#EADFD5] text-xs font-black">
                    <span className="text-emerald-700 font-mono text-sm">B</span>
                    <span className="text-[10px] text-slate-500 block">{isAr ? 'جين سليم' : 'Normal'}</span>
                  </div>

                  {/* Cell 1: BB (Healthy 25%) */}
                  <button
                    onClick={() => setSelectedOutcomeId(selectedOutcomeId === 1 ? null : 1)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedOutcomeId === 1
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400 shadow-xs'
                        : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-mono font-black text-sm text-emerald-900">
                      <span>B</span>
                      <span>B</span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-800 mt-0.5">
                      {isAr ? 'سليم تماماً' : 'Healthy'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">٢٥٪</span>
                  </button>

                  {/* Cell 2: Bb (Carrier 25%) */}
                  <button
                    onClick={() => setSelectedOutcomeId(selectedOutcomeId === 2 ? null : 2)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedOutcomeId === 2
                        ? 'bg-[#EAE0FA] border-[#694E91] ring-2 ring-[#694E91]/40 shadow-xs'
                        : 'bg-[#F4EFFC]/70 border-[#D8C7F8] hover:bg-[#EAE0FA]/70'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-mono font-black text-sm text-[#341F59]">
                      <span className="text-emerald-700">B</span>
                      <span className="text-rose-700">b</span>
                    </div>
                    <span className="text-[11px] font-black text-[#694E91] mt-0.5">
                      {isAr ? 'حامل للصفة' : 'Carrier'}
                    </span>
                    <span className="text-[10px] font-bold text-[#694E91]">٢٥٪</span>
                  </button>
                </div>

                {/* Row 2: Mother Gamete b */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2 items-center">
                  <div className="bg-[#FAF7F2] py-3 rounded-lg border border-[#EADFD5] text-xs font-black">
                    <span className="text-rose-700 font-mono text-sm">b</span>
                    <span className="text-[10px] text-slate-500 block">{isAr ? 'جين متحور' : 'Trait'}</span>
                  </div>

                  {/* Cell 3: Bb (Carrier 25%) */}
                  <button
                    onClick={() => setSelectedOutcomeId(selectedOutcomeId === 2 ? null : 2)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedOutcomeId === 2
                        ? 'bg-[#EAE0FA] border-[#694E91] ring-2 ring-[#694E91]/40 shadow-xs'
                        : 'bg-[#F4EFFC]/70 border-[#D8C7F8] hover:bg-[#EAE0FA]/70'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-mono font-black text-sm text-[#341F59]">
                      <span className="text-emerald-700">B</span>
                      <span className="text-rose-700">b</span>
                    </div>
                    <span className="text-[11px] font-black text-[#694E91] mt-0.5">
                      {isAr ? 'حامل للصفة' : 'Carrier'}
                    </span>
                    <span className="text-[10px] font-bold text-[#694E91]">٢٥٪</span>
                  </button>

                  {/* Cell 4: bb (Major 25%) */}
                  <button
                    onClick={() => setSelectedOutcomeId(selectedOutcomeId === 3 ? null : 3)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedOutcomeId === 3
                        ? 'bg-rose-100 border-[#9E1B28] ring-2 ring-[#9E1B28]/40 shadow-xs'
                        : 'bg-[#FDF2F3]/70 border-[#F5C2C7] hover:bg-rose-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-mono font-black text-sm text-[#7A1520]">
                      <span className="text-rose-700">b</span>
                      <span className="text-rose-700">b</span>
                    </div>
                    <span className="text-[11px] font-black text-[#9E1B28] mt-0.5">
                      {isAr ? 'مصاب بالمرض' : 'Major'}
                    </span>
                    <span className="text-[10px] font-bold text-[#9E1B28]">٢٥٪</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Clean Outcome Results Cards (3 Harmonious Cards) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-[#1B1B3A]">
                {isAr ? 'الاحتمالات الرياضية المعتمدة لكل حمل بصورة مستقلة:' : 'Mathematical Probabilities Per Single Pregnancy:'}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {isAr ? 'انقر على أي بطاقة للتفاصيل والاستماع' : 'Tap for audio explanation'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {outcomes.map((item) => {
                const isSelected = selectedOutcomeId === item.id;
                const isSpeaking = activeId === `genetics-outcome-${item.id}`;
                const outcomeText = `${item.title[language]}. ${item.percentage}، ${item.ratio[language]}. ${item.desc[language]}`;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedOutcomeId(isSelected ? null : item.id)}
                    className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${item.colorClass} ${
                      isSpeaking
                        ? 'ring-2 ring-[#694E91] shadow-md scale-102 bg-white'
                        : isSelected
                        ? item.activeRing + ' shadow-md scale-102'
                        : 'hover:shadow-xs hover:-translate-y-0.5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${item.badgeColor} font-mono shadow-2xs`}>
                          {item.percentage}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold opacity-80 font-mono">
                            {item.ratio[language]}
                          </span>
                          <SpeakButton
                            id={`genetics-outcome-${item.id}`}
                            text={outcomeText}
                            title={isAr ? `استمع لـ ${item.title[language]}` : `Listen to ${item.title[language]}`}
                            size="sm"
                          />
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-black leading-snug">
                        {item.title[language]}
                      </h4>
                      <div className="font-mono text-[11px] font-bold opacity-75 mt-0.5">
                        {isAr ? `التركيب الجيني: ${item.genotype}` : `Genotype: ${item.genotype}`}
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed opacity-90 font-medium pt-2 border-t border-black/5">
                      {item.desc[language]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Rule Note */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-3.5 text-xs text-slate-800 ${
            activeId === 'genetics-golden-rule' 
              ? 'bg-[#694E91]/10 border-[#694E91] ring-2 ring-[#694E91]/30' 
              : 'bg-[#FAF8F5] border-[#EADFD5]'
          }`}>
            <Info className="w-5 h-5 text-[#9E1B28] shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="leading-relaxed font-semibold">
                <strong className="text-[#1B1B3A] font-black">
                  {isAr ? 'قاعدة علمية جوهرية:' : 'Crucial Scientific Principle:'}
                </strong>{' '}
                {isAr 
                  ? 'هذه النسب (٢٥٪ سليم، ٥٠٪ حامل، ٢٥٪ مصاب) تمثل احتمالية مستقلة تتجدد مع كل حمل بصورة منفصلة بنسبة ١٠٠٪، ولا تعني إطلاقاً أن إنجاب طفل مصاب يعني حتمية سلامة الأطفال اللاحقين. الفحص الطبي قبل الزواج هو الوسيلة الحاسمة لحماية الأسرة والأجيال.' 
                  : 'These probabilities apply independently to each single pregnancy. Premarital medical testing remains the definitive shield.'}
              </p>
            </div>
            <SpeakButton
              id="genetics-golden-rule"
              text={goldenRuleText}
              title={isAr ? 'استمع للقاعدة الذهبية' : 'Listen to golden rule'}
              size="sm"
            />
          </div>

          {/* Detailed Genetic Explanation Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
              className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-between border border-slate-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#694E91]" />
                <span>{isAr ? 'عرض التفسير الجيني والوراثي التفصيلي (جين بيتا جلوبين)' : 'View Detailed Genetic Explanation (Beta-Globin Gene)'}</span>
              </div>
              {showDetailedExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDetailedExplanation && (
              <div className={`mt-3 p-5 rounded-2xl border space-y-3 text-xs text-slate-700 animate-in fade-in duration-200 transition-colors ${
                activeId === 'genetics-detailed-basis'
                  ? 'bg-[#694E91]/10 border-[#694E91]/40 ring-2 ring-[#694E91]/30'
                  : 'bg-white border-[#EADFD5]'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-black text-[#1B1B3A] text-sm">
                    {isAr ? 'التأصيل العلمي لوراثة بيتا ثلاسيميا (Beta Thalassemia):' : 'Scientific Basis of Beta Thalassemia Inheritance:'}
                  </h5>
                  <SpeakButton
                    id="genetics-detailed-basis"
                    text={isAr
                      ? 'التأصيل العلمي لوراثة بيتا ثلاسيميا: يقع جين بيتا جلوبين على الكروموسوم رقم 11، وتنتقل الصفة بنمط السيادة المتنحية. حامل الصفة يمتلك جيناً واحداً متحوراً ويعيش حياة طبيعية تماماً دون حاجة لنقل دم، بينما المصاب يمتلك جينين متحورين ويحتاج إلى برنامج الرعاية الدوري.'
                      : 'Scientific Basis of Beta Thalassemia: The beta-globin gene lies on chromosome 11 and follows autosomal recessive inheritance. A carrier has one altered allele and leads a normal healthy life, whereas two altered alleles result in Thalassemia Major requiring regular care.'}
                    title={isAr ? 'التفسير الجيني التفصيلي' : 'Detailed Genetic Basis'}
                    size="sm"
                  />
                </div>
                <p className="leading-relaxed">
                  {isAr 
                    ? 'يقع جين بيتا جلوبين المسؤول عن تصنيع سلاسل الهيموجلوبين على الذراع القصير للكروموسوم رقم ١١. تنتقل صفة بيتا ثلاسيميا وفق نمط السيادة المتنحية (Autosomal Recessive). يحتاج تكوين كريات دم حمراء طبيعية إلى جينين سليمين (B B).' 
                    : 'The beta-globin gene is located on chromosome 11. Beta thalassemia is inherited in an autosomal recessive pattern requiring two altered alleles for major symptoms.'}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5]">
                    <strong className="text-[#694E91] block mb-1 font-black">
                      {isAr ? 'حامل الصفة (Thalassemia Minor):' : 'Carrier (Minor):'}
                    </strong>
                    <span className="leading-relaxed">
                      {isAr 
                        ? 'يمتلك جيناً واحداً متحوراً (B b)، ويصنّع كمية كافية من الهيموجلوبين ليعيش حياة طبيعية تماماً دون حاجة لنقل دم.' 
                        : 'Possesses one altered gene (B b); manufactures sufficient hemoglobin for a healthy normal life without transfusions.'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EADFD5]">
                    <strong className="text-[#9E1B28] block mb-1 font-black">
                      {isAr ? 'المصاب بالمرض (Thalassemia Major):' : 'Affected (Major):'}
                    </strong>
                    <span className="leading-relaxed">
                      {isAr 
                        ? 'يمتلك جينين متحورين (b b)، مما يؤدي إلى عجز نخاع العظم عن إنتاج هيموجلوبين كافٍ، وبالتالي يحتاج لبرنامج الرعاية الدوري.' 
                        : 'Possesses two altered genes (b b), leading to severe anemia requiring regular transfusions and chelation.'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
