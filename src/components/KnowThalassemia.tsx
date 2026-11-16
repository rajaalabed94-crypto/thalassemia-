import React, { useState } from 'react';
import { Language } from '../types';
import { 
  BookOpen, 
  Dna, 
  Heart, 
  HelpCircle, 
  CheckCircle, 
  Info,
  ShieldCheck, 
  AlertTriangle,
  Activity,
  Sparkles,
  Gamepad2,
  Play,
  ArrowRight,
  ArrowLeft,
  Syringe,
  Microscope,
  Stethoscope
} from 'lucide-react';
import { FamilyRightsAdvisor } from './FamilyRightsAdvisor';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface KnowThalassemiaProps {
  language: Language;
  onOpenGame?: () => void;
  onNavigateToGenetics?: () => void;
}

export const KnowThalassemia: React.FC<KnowThalassemiaProps> = ({
  language,
  onOpenGame,
  onNavigateToGenetics
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { activeId } = useAudioSpeech();

  const [activeTab, setActiveTab] = useState<'overview' | 'causes' | 'symptoms' | 'treatment' | 'prevention' | 'complications'>('overview');

  const causesText = isAr
    ? 'كيف تحدث الثلاسيميا؟ يحدث مرض الثلاسيميا بسبب تغيرات جينية في الحمض النووي للخلايا المكوّنة للهيموجلوبين، وتنتقل هذه الطفرة وراثيًّا من الآباء إلى الأبناء. يتسبب حدوث الطفرات الجينية في تعطيل إنتاج الهيموجلوبين الطبيعي، مما يؤدي إلى ظهور أعراض فقر الدم.'
    : 'How Does Thalassemia Occur? Thalassemia occurs due to genetic mutations in DNA coding for hemoglobin synthesis, passed down hereditarily from parents to offspring, hindering normal hemoglobin production and causing anemia.';

  const treatmentText = isAr
    ? 'علاج مرض الثلاسيميا يعتمد على نوع الثلاسيميا وشدته. أولاً: نقل الدم المتكرر وأدوية طرد وسحب الحديد الزائد لحماية القلب والكبد. ثانياً: زرع الخلايا الجذعية أو نخاع العظام من متبرع مطابق وراثياً كخيار علاجي جذري يقيّمه الفريق الطبي المتخصص.'
    : 'Treatment corresponds to severity: First, regular blood transfusions alongside iron chelation medicines to excrete excess iron. Second, stem cell or bone marrow transplantation from a matched donor evaluated by specialists.';

  const preventionText = isAr
    ? 'سبل الوقاية والفحص قبل الزواج: الالتزام بإجراء الفحص الطبي الشامل قبل الزواج يساعد على الحد من انتقال مرض الثلاسيميا إلى الأبناء، حيث تظهر التحاليل احتمال وجود جينات مصابة لدى الشخصين اللذين لا تظهر عليهما أعراض مرضية.'
    : 'Prevention and Premarital Screening: Comprehensive premarital screening identifies asymptomatic trait carriers and prevents inheritance in future generations.';

  const complicationsText = isAr
    ? 'مضاعفات الثلاسيميا الكبرى عند إهمال الرعاية: تأخر نمو الطفل، تضخم الطحال وانتفاخ البطن، تشوه وترقق العظام، وتفاقم فقر الدم والإجهاد المستمر.'
    : 'Complications in untreated cases include delayed child growth, splenomegaly and abdominal swelling, bone deformities, and worsening anemia with severe exhaustion.';

  const symptomsSummaryText = isAr
    ? 'علامات وأعراض مرض الثلاسيميا الثمانية: الإحساس بالتعب والضعف العام، ضيق في التنفس، شحوب في البشرة، اصفرار الجلد أو اليرقان، تغيرات في عظام الوجه، بطء النمو، انتفاخ البطن، وتغير لون البول إلى الداكن.'
    : 'Eight signs and symptoms of Thalassemia: Fatigue and general weakness, shortness of breath, pale skin, yellowing skin or jaundice, facial bone changes, delayed growth, abdominal swelling, and dark urine color.';

  const medicalAudioSequence = [
    {
      id: 'know-header',
      title: isAr ? 'دليل الثلاسيميا' : 'Guide Overview',
      text: isAr 
        ? 'اعرف الثلاسيميا: الملف الطبي الشامل. مرجع طبي موثوق يوضح تصنيف المرض، أسبابه الوراثية، أعراضه، بروتوكولات علاجه، وأهمية الفحص قبل الزواج.'
        : 'Know Thalassemia: Comprehensive Medical Dossier. Verified clinical insights on classification, genetic etiology, signs, treatment, and premarital screening.'
    },
    {
      id: 'know-desc',
      title: isAr ? 'الوصف الطبي' : 'Clinical Description',
      text: isAr 
        ? 'مرض الثلاسيميا هو اضطراب وراثي في خلايا الدم، ويوصف بانخفاض مستوى الهيموجلوبين وانخفاض عدد كريات الدم الحمراء عن المعدل الطبيعي، ويرجع السبب في ظهور أعراض الأنيميا كالإجهاد والتعب وغيرها إلى نقص الهيموجلوبين وهي المادة الموجودة في خلايا الدم الحمراء والمسؤولة عن حمل الأكسجين.'
        : 'Thalassemia is an inherited blood disorder characterized by below-normal levels of hemoglobin and fewer red blood cells. Symptoms of anemia like chronic fatigue and weakness stem from hemoglobin deficiency—the vital red blood cell protein responsible for oxygen transport.'
    },
    { id: 'know-causes', title: isAr ? 'المسببات الجينية' : 'Genetic Causes', text: causesText },
    { id: 'know-symptoms', title: isAr ? 'الأعراض والعلامات' : 'Symptoms', text: symptomsSummaryText },
    { id: 'know-treatment', title: isAr ? 'بروتوكولات العلاج' : 'Treatment', text: treatmentText },
    { id: 'know-prevention', title: isAr ? 'الوقاية والفحص' : 'Prevention', text: preventionText },
    { id: 'know-complications', title: isAr ? 'المضاعفات' : 'Complications', text: complicationsText }
  ];

  const medicalSections = [
    { id: 'overview', title: { en: 'Overview & Classification', ar: 'الوصف والتصنيف الطبي' }, icon: Microscope },
    { id: 'causes', title: { en: 'Causes & Genetics', ar: 'المسببات الجينية' }, icon: Dna },
    { id: 'symptoms', title: { en: 'Symptoms (8 Signs)', ar: 'الأعراض والعلامات' }, icon: Activity },
    { id: 'treatment', title: { en: 'Treatment Protocols', ar: 'بروتوكولات العلاج' }, icon: Syringe },
    { id: 'prevention', title: { en: 'Premarital Prevention', ar: 'الوقاية والفحص الطبي' }, icon: ShieldCheck },
    { id: 'complications', title: { en: 'Complications', ar: 'المضاعفات عند تأخر العلاج' }, icon: AlertTriangle },
  ];

  const symptomsList = [
    { en: 'Fatigue & General Weakness', ar: 'الإحساس بالتعب والضعف العام' },
    { en: 'Shortness of Breath', ar: 'ضيق في التنفس' },
    { en: 'Pale Skin', ar: 'شحوب في البشرة' },
    { en: 'Yellowing Skin (Jaundice)', ar: 'اصفرار الجلد (اليرقان)' },
    { en: 'Facial Bone Changes', ar: 'تشوهات في عظام الوجه' },
    { en: 'Delayed Growth', ar: 'بطء النمو' },
    { en: 'Abdominal Swelling', ar: 'انتفاخ البطن' },
    { en: 'Dark Urine Color', ar: 'تغير لون البول إلى الداكن' },
  ];

  return (
    <section id="education" className="scroll-mt-24 py-16 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'الدليل الطبي والتوعوي المعتمد' : 'Official Medical & Awareness Guide'}</span>
              </div>
              <ListenToPageButton 
                items={medicalAudioSequence}
                title={isAr ? 'الملف الطبي الشامل' : 'Medical Dossier'}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex-1">
                {isAr ? 'اعرف الثلاسيميا: الملف الطبي الشامل' : 'Know Thalassemia: Comprehensive Medical Dossier'}
              </h2>
              <SpeakButton 
                id="know-header"
                text={medicalAudioSequence[0].text}
                title={medicalAudioSequence[0].title}
                size="md"
              />
            </div>
            
            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              {isAr 
                ? 'مرجع طبي موثوق يوضح تصنيف المرض، أسبابه الوراثية، أعراضه، بروتوكولات علاجه، وأهمية الفحص قبل الزواج.' 
                : 'Verified clinical insights on classification, genetic etiology, signs, treatment, and premarital screening.'}
            </p>
          </div>

          {/* Interactive Game Launcher Callout Button */}
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#634B8F] hover:bg-[#523D77] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 border border-[#E4D7FC]/40 group"
            >
              <Gamepad2 className="w-5 h-5 text-[#E4D7FC] group-hover:rotate-12 transition-transform" />
              <div className="text-left rtl:text-right">
                <span className="block">{isAr ? 'العب الآن: بطل الهيموجلوبين' : 'Play: Hemoglobin Hero'}</span>
                <span className="text-[10px] text-[#E4D7FC] font-bold block">{isAr ? 'لعبة تفاعلية تحاكي نقل الأكسجين وطرد الحديد' : 'Interactive Bloodstream Game'}</span>
              </div>
            </button>
          )}
        </div>

        {/* Tab Navigation for Medical Dossier */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {medicalSections.map((sec) => {
            const Icon = sec.icon;
            const isSelected = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveTab(sec.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#634B8F] text-white shadow-sm ring-2 ring-[#634B8F]/30 font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E4D7FC]' : 'text-[#634B8F]'}`} />
                <span>{sec.title[language]}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Medical Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD5] shadow-xs">
          
          {/* 1. Overview & Classification */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black bg-[#7A1822]/10 text-[#7A1822] px-3.5 py-1 rounded-full">
                  {isAr ? 'تصنيف المرض: أمراض الدم' : 'Disease Classification: Hematological Disorders'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {isAr ? 'اضطراب وراثي في خلايا الدم الحمراء' : 'Genetic Red Blood Cell Disorder'}
                </span>
              </div>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'وصف مرض الثلاسيميا' : 'Description of Thalassemia'}
                  </h3>
                  <SpeakButton
                    id="know-desc"
                    text={medicalAudioSequence[1].text}
                    title={medicalAudioSequence[1].title}
                    size="sm"
                  />
                </div>
                
                <p className={`font-semibold text-slate-800 bg-[#FAF8F5] p-5 rounded-2xl border border-[#F1ECE6] transition-colors duration-300 ${
                  activeId === 'know-desc' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
                }`}>
                  {isAr 
                    ? 'مرض الثلاسيميا هو اضطراب وراثي في خلايا الدم، ويوصف بانخفاض مستوى الهيموجلوبين وانخفاض عدد كريات الدم الحمراء عن المعدل الطبيعي، ويرجع السبب في ظهور أعراض الأنيميا كالإجهاد والتعب وغيرها إلى نقص الهيموجلوبين وهي المادة الموجودة في خلايا الدم الحمراء والمسؤولة عن حمل الأكسجين.'
                    : 'Thalassemia is an inherited blood disorder characterized by below-normal levels of hemoglobin and fewer red blood cells. Symptoms of anemia like chronic fatigue and weakness stem from hemoglobin deficiency—the vital red blood cell protein responsible for oxygen transport.'}
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-1">
                    <span className="text-xs font-black text-cyan-900 block">
                      {isAr ? 'ما هو الهيموجلوبين؟' : 'What is Hemoglobin?'}
                    </span>
                    <p className="text-xs text-cyan-800">
                      {isAr ? 'بروتين غني بالحديد موجود داخل كريات الدم الحمراء، يرتبط بالأكسجين في الرئتين وينقله إلى سائر أعضاء وأنسجة الجسم.' : 'Iron-rich protein in RBCs carrying oxygen throughout the body.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5EFFC] border border-[#DDD6FE] space-y-1">
                    <span className="text-xs font-black text-[#4A326E] block">
                      {isAr ? 'أثر نقص كريات الدم الحمراء' : 'Impact of Low RBC Count'}
                    </span>
                    <p className="text-xs text-[#5A4080]">
                      {isAr ? 'تلف خلايا الدم الحمراء السريع يحرم الخلايا من الأكسجين الكافي، مما يولد أعراض الأنيميا والإنهاك المستمر.' : 'Rapid RBC destruction reduces tissue oxygenation, causing fatigue and shortness of breath.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Causes & Genetics */}
          {activeTab === 'causes' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#7A1822]/10 text-[#7A1822] px-3.5 py-1 rounded-full">
                    {isAr ? 'المسببات والطفرات الجينية' : 'Genetic Etiology'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'كيف تحدث الثلاسيميا؟' : 'How Does Thalassemia Occur?'}
                  </h3>
                </div>
                <SpeakButton
                  id="know-causes"
                  text={causesText}
                  title={isAr ? 'المسببات الجينية' : 'Genetic Causes'}
                  size="sm"
                />
              </div>

              <div className={`p-5 rounded-2xl border text-slate-800 text-sm leading-relaxed space-y-3 font-semibold transition-colors duration-300 ${
                activeId === 'know-causes'
                  ? 'bg-[#694E91]/10 border-[#694E91]/30 ring-2 ring-[#694E91]/30'
                  : 'bg-[#FAF8F5] border-[#F1ECE6]'
              }`}>
                <p>
                  {isAr 
                    ? 'يحدث مرض الثلاسيميا بسبب تغيرات جينية في الحمض النووي (DNA) للخلايا المكوّنة للهيموجلوبين، وتنتقل هذه الطفرة وراثيًّا من الآباء إلى الأبناء.' 
                    : 'Thalassemia occurs due to genetic mutations in DNA coding for hemoglobin synthesis, passed down hereditarily from parents to offspring.'}
                </p>
                <p>
                  {isAr 
                    ? 'يتسبب حدوث الطفرات الجينية في تعطيل إنتاج الهيموجلوبين الطبيعي، وبالتالي فإن انخفاض مستويات الهيموجلوبين، وارتفاع معدل تلف خلايا الدم الحمراء، (وهو ما يحدث لدى مرضى الثلاسيميا) يؤدي إلى ظهور أعراض فقر الدم.' 
                    : 'These mutations hinder normal hemoglobin production; low hemoglobin alongside accelerated RBC breakdown provokes severe anemia manifestations.'}
                </p>
              </div>

              <div className="pt-2">
                {onNavigateToGenetics ? (
                  <button
                    type="button"
                    onClick={onNavigateToGenetics}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#7A1822] hover:underline cursor-pointer"
                  >
                    <span>{isAr ? 'انتقل إلى صفحة مخطط الوراثة المندلية ومربع بانت' : 'Open full Mendelian Genetics Page'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <a
                    href="#genetics"
                    className="inline-flex items-center gap-2 text-xs font-black text-[#7A1822] hover:underline"
                  >
                    <span>{isAr ? 'شاهد مخطط الوراثة المندلية المفصل' : 'View full genetic diagram'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* 3. Symptoms (8 Signs) */}
          {activeTab === 'symptoms' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#7A1822]/10 text-[#7A1822] px-3.5 py-1 rounded-full">
                    {isAr ? 'الأعراض والعلامات السريرية' : 'Clinical Symptoms'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'علامات وأعراض مرض الثلاسيميا' : 'Signs & Manifestations of Thalassemia'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {isAr 
                      ? 'هناك عدة أنواع من الثلاسيميا، وتعتمد الأعراض حسب النوع والشدة، وهي تشمل ما يلي:' 
                      : 'Symptoms depend on thalassemia subtype and clinical severity, encompassing:'}
                  </p>
                </div>
                <SpeakButton
                  id="know-symptoms"
                  text={symptomsSummaryText}
                  title={isAr ? 'أعراض الثلاسيميا' : 'Thalassemia Symptoms'}
                  size="sm"
                />
              </div>

              {/* 8 Symptoms Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {symptomsList.map((sym, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F1ECE6] hover:border-[#7A1822]/30 transition-colors flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#7A1822] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-snug">
                        {sym[language]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Treatment */}
          {activeTab === 'treatment' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#7A1822]/10 text-[#7A1822] px-3.5 py-1 rounded-full">
                    {isAr ? 'مسار الرعاية الطبية' : 'Medical Management'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'علاج مرض الثلاسيميا' : 'Treatment Protocols'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {isAr 
                      ? 'علاج مرض الثلاسيميا يعتمد على نوع الثلاسيميا وشدته. وتشمل خيارات علاج الحالات المعتدلة إلى الحادة ما يلي:' 
                      : 'Treatment corresponds to severity and classification, including for moderate-to-severe forms:'}
                  </p>
                </div>
                <SpeakButton
                  id="know-treatment"
                  text={treatmentText}
                  title={isAr ? 'علاج الثلاسيميا' : 'Thalassemia Treatment'}
                  size="sm"
                />
              </div>

              <div className={`grid md:grid-cols-2 gap-6 pt-2 rounded-3xl transition-colors duration-300 ${
                activeId === 'know-treatment' ? 'bg-[#694E91]/8 p-3 ring-2 ring-[#694E91]/30' : ''
              }`}>
                
                {/* 1. Blood Transfusions & Chelation */}
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#EADFD5] space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <Syringe className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    {isAr ? '١. نقل الدم المتكرر وأدوية طرد الحديد' : '1. Regular Blood Transfusions & Iron Chelation'}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {isAr 
                      ? 'غالبًا ما تتطلب هذه الحالات عمليات نقل الدم المتكررة، وربما كل بضعة أسابيع. مع مرور الوقت يسبب نقل الدم تراكم الحديد في الدم؛ ما يمكن أن يلحق الضرر بالقلب والكبد وغيرهما من أعضاء الجسم. ولمساعدة الجسم للتخلص من تراكم الحديد الزائد بسبب نقل الدم يوصف للمريض بعض الأدوية (أدوية طرد وسحب الحديد).'
                      : 'Requires transfusions every few weeks. Over time, transfusions cause systemic iron accumulation harmful to the heart and liver. Iron chelation medicines are prescribed to excrete excess iron.'}
                  </p>
                </div>

                {/* 2. Stem Cell Transplantation */}
                <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#EADFD5] space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2E6F56] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    {isAr ? '٢. زرع الخلايا الجذعية (نخاع العظام)' : '2. Stem Cell (Bone Marrow) Transplantation'}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {isAr 
                      ? 'يُعد زرع نخاع العظام أو الخلايا الجذعية من متبرع مطابق وراثياً (غالباً من الأخوة الأشقاء) العلاج الجذري والوحيد المتاح لشفاء الثلاسيميا، ويتم تقييم مدى ملاءمته للحالة عبر فريق طبي واستشاري متخصص.'
                      : 'Allogeneic bone marrow or stem cell transplant from an HLA-matched donor provides the potential curative option, evaluated comprehensively by specialized hematologists.'}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* 5. Prevention */}
          {activeTab === 'prevention' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-[#2E6F56]/10 text-[#2E6F56] px-3.5 py-1 rounded-full">
                    {isAr ? 'الوقاية الوطنية والفحص المبكر' : 'Prevention & Screening'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'سبل الوقاية والفحص قبل الزواج' : 'Prevention & Premarital Medical Screening'}
                  </h3>
                </div>
                <SpeakButton
                  id="know-prevention"
                  text={preventionText}
                  title={isAr ? 'الوقاية والفحص قبل الزواج' : 'Prevention & Screening'}
                  size="sm"
                />
              </div>

              <div className={`p-6 rounded-3xl border space-y-3 font-semibold text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                activeId === 'know-prevention'
                  ? 'bg-[#694E91]/12 border-[#694E91] text-[#1B1B3A] ring-2 ring-[#694E91]/30'
                  : 'bg-[#2E6F56]/10 border-[#2E6F56]/20 text-[#1E4B3A]'
              }`}>
                <p>
                  {isAr 
                    ? 'في معظم الحالات لا يمكن منع حدوث مرض الثلاسيميا أو الوقاية منه لأنه وراثي؛ لكن إذا كنت مصابًا بمرض الثلاسيميا، أو إذا كنت تحمل جينات الثلاسيميا، فمن الأفضل التحدث إلى متخصص في الأمراض الوراثية.' 
                    : 'Thalassemia cannot be prevented organically as it is hereditary; however, consulting a genetic counselor is advised if you carry the trait or live with thalassemia.'}
                </p>
                <p className="pt-2 border-t border-[#2E6F56]/20 font-bold">
                  {isAr 
                    ? 'كذلك الالتزام بإجراء الفحص الطبي الشامل قبل الزواج يساعد على الحد من انتقال مرض الثلاسيميا إلى الأبناء - بإذن الله - حيث تظهر التحاليل الطبية احتمال وجود جينات مصابة بالمرض لدى المرأة أو الرجل، والذين لا تظهر عليهم الأعراض المرضية.' 
                    : 'Adherence to comprehensive premarital screening effectively prevents inheritance in future generations by identifying asymptomatic trait carriers.'}
                </p>
              </div>
            </div>
          )}

          {/* 6. Complications */}
          {activeTab === 'complications' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-black bg-red-600/10 text-red-700 px-3.5 py-1 rounded-full">
                    {isAr ? 'المضاعفات عند إهمال الرعاية' : 'Complications of Delayed Care'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {isAr ? 'مضاعفات الثلاسيميا الكبرى' : 'Complications in Untreated Cases'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {isAr 
                      ? 'يصاب المريض بالثلاسيميا الكبرى ومرض هيموجلوبين (هـ) بكثير من المضاعفات إن لم يتم علاجه بالشكل الصحيح، وفي الوقت المناسب، ومن هذه المضاعفات:' 
                      : 'Patients may develop severe clinical complications if untreated or inconsistently monitored, including:'}
                  </p>
                </div>
                <SpeakButton
                  id="know-complications"
                  text={complicationsText}
                  title={isAr ? 'مضاعفات الثلاسيميا الكبرى' : 'Complications'}
                  size="sm"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <div className="flex items-center gap-2 text-red-900 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{isAr ? 'تأخر نمو الطفل' : 'Delayed Child Growth'}</span>
                  </div>
                  <p className="text-xs text-red-800">
                    {isAr ? 'نقص الأكسجين المزمن يعيق النمو البدني الطبيعي للطفل.' : 'Chronic hypoxia hinders normal physical milestone growth.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <div className="flex items-center gap-2 text-red-900 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{isAr ? 'تضخم الطحال وانتفاخ البطن' : 'Splenomegaly & Abdominal Swelling'}</span>
                  </div>
                  <p className="text-xs text-red-800">
                    {isAr ? 'إجهاد الطحال في محاولة تكسير خلايا الدم التالفة يؤدي لتضخمه.' : 'Hyperactive spleen filtering damaged RBCs causes enlargement.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <div className="flex items-center gap-2 text-red-900 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{isAr ? 'تشوه العظام' : 'Bone Deformities'}</span>
                  </div>
                  <p className="text-xs text-red-800">
                    {isAr ? 'توسع نخاع العظم لتعويض فقر الدم يؤدي إلى ترقق العظام وتغير ملامح الوجه.' : 'Marrow expansion to compensate anemia thins cortexes.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <div className="flex items-center gap-2 text-red-900 font-black text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>{isAr ? 'تفاقم فقر الدم والإجهاد المستمر' : 'Worsening Anemia & Severe Exhaustion'}</span>
                  </div>
                  <p className="text-xs text-red-800">
                    {isAr ? 'شعور دائم بالإرهاق الحاد وصعوبة في ممارسة الأنشطة اليومية.' : 'Persistent extreme fatigue compromising routine school and daily life.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* AI Family Rights Advisor */}
        <div className="pt-2">
          <FamilyRightsAdvisor language={language} />
        </div>

      </div>
    </section>
  );
};
