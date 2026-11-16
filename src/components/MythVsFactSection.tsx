import React, { useState } from 'react';
import { Language } from '../types';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Heart } from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';
import { analytics } from '../utils/analytics';

interface MythVsFactSectionProps {
  language: Language;
}

interface QuizItem {
  id: string;
  statement: { ar: string; en: string };
  isTrue: boolean;
  explanation: { ar: string; en: string };
  medicalFact: { ar: string; en: string };
  category: { ar: string; en: string };
}

export const MythVsFactSection: React.FC<MythVsFactSectionProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();

  const QUIZ_ITEMS: QuizItem[] = [
    {
      id: 'myth-01-contagious',
      statement: {
        ar: 'الثلاسيميا مرض معدٍ ينتقل بالملامسة والمخالطة اليومية أو التنفس.',
        en: 'Thalassemia is a contagious disease transmitted through touch, sharing items, or breath.'
      },
      isTrue: false,
      explanation: {
        ar: 'خطأ تماماً: الثلاسيميا مرض وراثي جيني خالص. لا ينتقل نهائياً عبر العدوى، الرذاذ، المصافحة، أو مشاركة الطعام. لا مبرر لأي خوف أو عزل اجتماعي لمريض الثلاسيميا.',
        en: 'Completely False: Thalassemia is purely a genetic inherited condition. It is NEVER transmitted through physical contact, sharing meals, or coughing. Isolation is medically groundless.'
      },
      medicalFact: {
        ar: 'الحقيقة الطبية: ينتقل المرض فقط عند زواج شخصين كلاهما يحملان الجين المتنحي للثلاسيميا.',
        en: 'Medical Fact: It is only passed genetically when both biological parents are trait carriers.'
      },
      category: { ar: 'طبيعة المرض', en: 'Disease Nature' }
    },
    {
      id: 'myth-02-iron-pills',
      statement: {
        ar: 'أي شخص يعاني من فقر الدم وشحوب الوجه يجب عليه فوراً تناول حبوب مكملات الحديد.',
        en: 'Anyone suffering from anemia and pale complexion should immediately take iron supplement pills.'
      },
      isTrue: false,
      explanation: {
        ar: 'خطأ بالغ الخطورة: فقر دم الثلاسيميا ليس ناتجاً عن نقص الحديد، بل عن خلل في تصنيع الهيموجلوبين. تناول حبوب الحديد لمريض الثلاسيميا يؤدي إلى تسمم حديدي خطير وتراكمه القاتل في عضلة القلب والكبد والغدد الصماء!',
        en: 'Extremely Dangerous Myth: Thalassemia anemia is not caused by iron deficiency, but impaired globin synthesis. Giving iron supplements can cause fatal iron toxicity in the heart and liver!'
      },
      medicalFact: {
        ar: 'الحقيقة الطبية: مريض الثلاسيميا يتناول أدوية طاردة وخافضة للحديد (Chelators) للتخلص من الفائض.',
        en: 'Medical Fact: Thalassemia patients take iron-chelating medication to eliminate excess iron, not supplements.'
      },
      category: { ar: 'العلاج والحديد', en: 'Treatment & Iron' }
    },
    {
      id: 'myth-03-carrier-turns-patient',
      statement: {
        ar: 'الشخص الحامل للصفة الوراثية (Minor) سيتحول بالضرورة مع تقدم العمر إلى مريض ثلاسيميا كبرى.',
        en: 'A thalassemia trait carrier (Minor) will inevitably develop into Thalassemia Major as they age.'
      },
      isTrue: false,
      explanation: {
        ar: 'خطأ شائع: حامل الصفة سليم صحياً تماماً ولا يعاني من أي أعراض مرضية طوال حياته، ولا يمكن بأي حال أن يتحول إلى مريض ثلاسيميا كبرى. جيناته مستقرة ولا تتغير.',
        en: 'Common Misconception: A trait carrier is completely healthy, lives a normal life without symptoms, and will NEVER turn into a Thalassemia Major patient. Genes do not change over time.'
      },
      medicalFact: {
        ar: 'الحقيقة الطبية: حامل الصفة يحتاج فقط لإجراء الفحص الطبي قبل الزواج لضمان عدم الارتباط بحامل صفة آخر.',
        en: 'Medical Fact: The carrier only needs premarital testing to ensure their partner is not also a carrier.'
      },
      category: { ar: 'حامل الصفة', en: 'Trait Carrier' }
    },
    {
      id: 'myth-04-premarital-screening',
      statement: {
        ar: 'الفحص الطبي الدقيق قبل الزواج كفيل بحماية الأجيال القادمة ومنع ولادة أطفال مصابين بالثلاسيميا.',
        en: 'Accurate premarital medical screening can safeguard future generations and prevent new births with Thalassemia Major.'
      },
      isTrue: true,
      explanation: {
        ar: 'صحيح ومثبت علمياً: الفحص المخبري البسيط (CBC وفصل الهيموجلوبين الكهربائي) يكشف حمل الصفة بنسبة 100%. التزام المقبلين على الزواج بالاستشارة الوراثية نجح في تقليص ولادات الثلاسيميا في فلسطين إلى ما يقارب الصفر في سنوات عديدة.',
        en: 'Scientifically True: A simple premarital screening test (CBC & Hb Electrophoresis) detects carriers with 100% accuracy, enabling families to prevent high-risk pairings.'
      },
      medicalFact: {
        ar: 'الحقيقة الطبية: فلسطين من الدول الرائدة إقليمياً في قانون الفحص الطبي الإلزامي قبل الزواج.',
        en: 'Medical Fact: Mandatory premarital screening protocols have dramatically reduced new cases across Palestine.'
      },
      category: { ar: 'الوقاية الوطنية', en: 'Prevention' }
    },
    {
      id: 'myth-05-productive-life',
      statement: {
        ar: 'مريض الثلاسيميا قادر على إكمال دراسته الجامعية، العمل، الإبداع، وبناء مستقبل أسري واجتماعي مستقل.',
        en: 'A person with thalassemia can complete university, hold a career, be highly creative, and lead an independent fulfilling life.'
      },
      isTrue: true,
      explanation: {
        ar: 'صحيح تماماً: مع الرعاية الصحية الحديثة ومظلة الحماية الاجتماعية وشبكات الأمان التي تقدمها وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا، يبرز المرضى كمهندسين وأطباء ومعلمين وحرفيين متميزين.',
        en: 'Entirely True: With routine clinical care and social protection safety nets, thalassemia youth excel as engineers, academics, teachers, and independent professionals.'
      },
      medicalFact: {
        ar: 'الحقيقة الطبية: الإعاقة تكمن في نظرة المجتمع والوصمة، وليس في قدرات وطموح أبنائنا الأبطال.',
        en: 'Medical Fact: Disability stems from social prejudice, not the inherent human potential of our youth.'
      },
      category: { ar: 'التمكين والكرامة', en: 'Empowerment' }
    }
  ];

  const [userAnswers, setUserAnswers] = useState<{ [key: string]: boolean | null }>({});
  const [showSummary, setShowSummary] = useState(false);

  const handleSelectAnswer = (quizId: string, answer: boolean) => {
    const updated = { ...userAnswers, [quizId]: answer };
    setUserAnswers(updated);

    analytics.logEvent('myth_fact_answered', {
      quizId,
      answer: answer ? 'true' : 'false'
    });

    // If all answered
    if (Object.keys(updated).length === QUIZ_ITEMS.length) {
      setShowSummary(true);
      analytics.logEvent('myth_fact_completed', {
        correctCount: QUIZ_ITEMS.filter(it => updated[it.id] === it.isTrue).length
      });
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowSummary(false);
  };

  const correctAnswersCount = QUIZ_ITEMS.filter(
    item => userAnswers[item.id] !== undefined && userAnswers[item.id] === item.isTrue
  ).length;

  const headerSpeechText = isAr
    ? 'صح أم خطأ؟ قسم تفاعلي يصحح المفاهيم الشائعة والمغلوطة حول مرض الثلاسيميا وحاملي الصفة الوراثية.'
    : 'Myth vs Fact: Interactive quiz debunking common misconceptions about thalassemia and trait carriers.';

  const quizAudioItems = [
    { id: 'quiz-header', text: headerSpeechText, title: isAr ? 'مقدمة صح أم خطأ' : 'Quiz Header' },
    ...QUIZ_ITEMS.map((item, idx) => ({
      id: `quiz-audio-${item.id}`,
      text: `${isAr ? 'السؤال رقم' : 'Question'} ${idx + 1}: ${item.statement[language]}. ${
        item.isTrue ? (isAr ? 'الإجابة صحيحة.' : 'Answer: True.') : (isAr ? 'الإجابة خاطئة.' : 'Answer: False.')
      } ${item.explanation[language]} ${item.medicalFact[language]}`,
      title: `${isAr ? 'مفهوم' : 'Myth'} ${idx + 1}`
    }))
  ];

  return (
    <section id="myth-vs-fact" className="scroll-mt-24 py-16 sm:py-20 bg-white border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-3 p-4 rounded-3xl transition-all ${
          activeId === 'quiz-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-black text-[#B72E43] uppercase tracking-wider">
              {isAr ? 'تحدي المعرفة الطبية الصحيحة' : 'Medical Truth Challenge'}
            </span>
            <span className="text-slate-300">·</span>
            <ListenToPageButton items={quizAudioItems} label={isAr ? 'استمع للأسئلة والتوضيحات' : 'Listen'} />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1B1B3A] tracking-tight">
              {isAr ? 'صح أم خطأ؟ تصحيح المفاهيم الشائعة' : 'Myth vs. Fact: Debunking Common Misconceptions'}
            </h2>
            <SpeakButton 
              id="quiz-header" 
              text={headerSpeechText} 
              title={isAr ? 'استمع لمقدمة الاختبار' : 'Listen to Quiz Header'} 
            />
          </div>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr
              ? 'اختبر معلوماتك في 5 مفاهيم جوهرية واكتشف الحقائق العلمية الموثقة لدعم وحماية مرضى الثلاسيميا وأسرهم.'
              : 'Test your knowledge on 5 fundamental principles and discover certified facts to dispel stigma.'}
          </p>
        </div>

        {/* Score Ticker if User Started Answering */}
        {Object.keys(userAnswers).length > 0 && (
          <div className="bg-[#FAF7F2] border border-[#EADFD5] p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#694E91]" />
              <span>
                {isAr ? 'التقدم:' : 'Progress:'}{' '}
                <strong className="text-[#1B1B3A]">{Object.keys(userAnswers).length} / {QUIZ_ITEMS.length}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-black">
                {isAr ? 'الإجابات الصحيحة:' : 'Correct:'} {correctAnswersCount}
              </span>
            </div>

            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 cursor-pointer font-bold text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة الاختبار' : 'Reset'}</span>
            </button>
          </div>
        )}

        {/* Quiz Items Cards Stack */}
        <div className="space-y-6">
          {QUIZ_ITEMS.map((item, index) => {
            const hasAnswered = userAnswers[item.id] !== undefined;
            const chosen = userAnswers[item.id];
            const isUserCorrect = hasAnswered && chosen === item.isTrue;
            const isSpeaking = activeId === `quiz-audio-${item.id}`;

            const itemSpeechText = `${isAr ? 'المفهوم' : 'Statement'} ${index + 1}: ${item.statement[language]}. ${
              item.isTrue ? (isAr ? 'الإجابة صحيحة.' : 'Answer: True.') : (isAr ? 'الإجابة خاطئة.' : 'Answer: False.')
            } ${item.explanation[language]} ${item.medicalFact[language]}`;

            return (
              <div
                key={item.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 ${
                  isSpeaking
                    ? 'ring-2 ring-[#694E91] border-[#694E91] bg-[#FAF7FD]'
                    : hasAnswered
                    ? isUserCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-[#EADFD5] shadow-xs hover:border-[#694E91]/40'
                }`}
              >
                {/* Top Row: Category & Question Number */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-[#694E91] bg-[#694E91]/10 px-2.5 py-0.5 rounded-md">
                      {isAr ? `المفهوم رقم ${index + 1}` : `Statement #${index + 1}`}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {item.category[language]}
                    </span>
                  </div>

                  <SpeakButton
                    id={`quiz-audio-${item.id}`}
                    text={itemSpeechText}
                    title={isAr ? `استمع للمفهوم ${index + 1}` : `Listen to Statement ${index + 1}`}
                    size="sm"
                  />
                </div>

                {/* Statement Body */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-[#1B1B3A] leading-snug">
                    {item.statement[language]}
                  </h3>

                  {/* True / False Buttons */}
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectAnswer(item.id, true)}
                      className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        hasAnswered
                          ? item.isTrue
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : chosen === true
                            ? 'bg-rose-600 text-white line-through opacity-80'
                            : 'bg-slate-100 text-slate-400'
                          : 'bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isAr ? 'صح' : 'True'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectAnswer(item.id, false)}
                      className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        hasAnswered
                          ? !item.isTrue
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : chosen === false
                            ? 'bg-rose-600 text-white line-through opacity-80'
                            : 'bg-slate-100 text-slate-400'
                          : 'bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-200 hover:border-rose-300'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{isAr ? 'خطأ' : 'False'}</span>
                    </button>
                  </div>

                  {/* Immediate Scientific Explanation when answered */}
                  {hasAnswered && (
                    <div className="pt-3 space-y-2 animate-in fade-in duration-200">
                      <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed flex items-start gap-2.5 ${
                        isUserCorrect 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}>
                        {isUserCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <strong className="block font-black text-xs">
                            {isUserCorrect 
                              ? (isAr ? 'إجابتك صحيحة! أحسنت.' : 'Correct Answer!')
                              : (isAr ? 'إجابة خاطئة — انتبه للمعلومة الطبية الصحيحة:' : 'Incorrect — Note the Medical Fact:')}
                          </strong>
                          <p>{item.explanation[language]}</p>
                        </div>
                      </div>

                      <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EADFD5] text-[11px] sm:text-xs text-slate-700 font-bold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#694E91] shrink-0" />
                        <span>{item.medicalFact[language]}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Celebration Summary Card */}
        {showSummary && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#694E91] to-[#1B1B3A] text-white shadow-lg space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto flex items-center justify-center">
              <Heart className="w-7 h-7 text-[#E4D7FC]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {correctAnswersCount === QUIZ_ITEMS.length 
                ? (isAr ? 'رائع جداً! معرفتك الطبية كاملة ودقيقة ١٠٠٪' : 'Outstanding! 100% Medical Awareness')
                : (isAr ? 'أحسنت! المعرفة الدقيقة هي خط الدفاع الأول ضد الوصمة' : 'Well Done! Accurate Knowledge Conquers Stigma')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto font-medium leading-relaxed">
              {isAr 
                ? `لقد أجبت عن ${correctAnswersCount} من أصل ${QUIZ_ITEMS.length} مفاهيم بصورة صحيحة. نشر هذه الحقائق بين عائلتك وأصدقائك يسهم في حماية المجتمع وتكريم كرامة مرضانا.`
                : `You correctly answered ${correctAnswersCount} out of ${QUIZ_ITEMS.length} statements. Sharing certified facts safeguards our community.`}
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
