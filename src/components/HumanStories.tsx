import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Heart, 
  Play, 
  Pause, 
  X, 
  ShieldCheck, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Building, 
  ArrowRight, 
  ArrowLeft,
  Volume2,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface HumanStoriesProps {
  language: Language;
  onNavigateToRequest: () => void;
}

interface MediaStory {
  id: string;
  type: 'video' | 'photo_story';
  theme: { en: string; ar: string };
  title: { en: string; ar: string };
  personName: { en: string; ar: string };
  roleOrAchievement: { en: string; ar: string };
  governorate: { en: string; ar: string };
  duration?: string;
  thumbnailUrl: string;
  videoPreviewUrl?: string;
  quote: { en: string; ar: string };
  fullStory: { en: string; ar: string };
  impactPillars: { en: string[]; ar: string[] };
}

export const HumanStories: React.FC<HumanStoriesProps> = ({
  language,
  onNavigateToRequest
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeStoryModal, setActiveStoryModal] = useState<MediaStory | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);

  const STORIES: MediaStory[] = [
    {
      id: 'story-01-university-graduate',
      type: 'video',
      theme: { en: 'Academic Excellence & Determination', ar: 'التميز الأكاديمي وصناعة المستقبل' },
      title: { en: 'From Blood Units to University Honor Roll', ar: 'من كراسي نقل الدم إلى منصة شرف التخرج الجامعي' },
      personName: { en: 'Heba (Computer Systems Engineering)', ar: 'هبة (مهندسة أنظمة حاسوب - بيرزيت)' },
      roleOrAchievement: { en: 'Graduated with Honors & Working in Software Tech', ar: 'خريجة بمرتبة الشرف ومطورة برمجيات' },
      governorate: { en: 'Ramallah & Birzeit', ar: 'رام الله وبيرزيت' },
      duration: '03:45',
      thumbnailUrl: '/src/assets/images/palestine_youth_empowerment_1793088049892.jpg',
      quote: {
        en: '“Thalassemia taught me that time is precious. With the support of my family, the Association, and an inclusive study plan, I earned my degree with highest honors.”',
        ar: '«الثلاسيميا لم تكن عائقاً؛ بل جعلتني أكثر تنظيماً لوقتي وإصراراً على حلمي. بدعم أسرتي والجمعية والجامعة، تخرجت بتفوق واليوم أعمل في مجال التكنولوجيا.»'
      },
      fullStory: {
        en: 'Heba grew up receiving bi-weekly transfusions. Instead of viewing treatment days as a setback, she utilized the hospital hours to study algorithms. When financial stress touched her family, the joint economic and case management pathway ensured travel subsidies and an education grant, protecting her future without interruption.',
        ar: 'نشأت هبة على تلقي وحدات الدم كل أسبوعين في المستشفى. وبدل أن تشعر بالإحباط، حولت ساعات نقل الدم إلى وقت لمراجعة دروس البرمجة. ومع التحديات المادية، ساهم مسار إدارة الحالة وتغطية نفقات السفر ومنح التعليم في تأمين استمراريتها الجامعية حتى نالت شهادة الهندسة بتفوق.'
      },
      impactPillars: {
        en: ['Higher Education Exemption', 'Psychosocial Counseling', 'Youth Leadership Circle'],
        ar: ['تنسيق الإعفاء والمنح الجامعية', 'الإرشاد النفسي التمكيني', 'ملتقى القيادات الشابة']
      }
    },
    {
      id: 'story-02-family-resilience',
      type: 'photo_story',
      theme: { en: 'Family Dignity & Social Protection', ar: 'حماية كرامة الأسرة وشبكة الأمان' },
      title: { en: 'A Mother’s Heart: Rebuilding Family Security', ar: 'قلب أم: كيف تحولت الضغوط إلى استقرار وأمان' },
      personName: { en: 'Um Ahmad & Her Family', ar: 'أم أحمد وأسرتها (أبناء مصابون بالثلاسيميا)' },
      roleOrAchievement: { en: 'Household Economic Resilience', ar: 'استقرار معيشي وتمكين أسري' },
      governorate: { en: 'Nablus & Rural Villages', ar: 'نابلس والقرى المجاورة' },
      thumbnailUrl: '/src/assets/images/palestine_family_support_1793088022772.jpg',
      quote: {
        en: '“The social worker walked into our home with utmost respect and empathy. We received guidance, emergency relief, and peace of mind.”',
        ar: '«الأخصائية الاجتماعية دخلت بيتنا بمنتهى الأدب والاحترام وصون الكرامة. وجدنا سنداً حقيقياً نظم لنا المساعدات وأزال عنا ثقل الديون.»'
      },
      fullStory: {
        en: 'When two children in the family were diagnosed with thalassemia, transportation costs to regional blood banks caused extreme financial hardship. Through the Ministry of Social Development’s unified case management intake and TPFS coordination, the family was enrolled into the national safety net with monthly mobility aid, stabilizing their household budget.',
        ar: 'كانت تكاليف السفر المتكررة من القرية إلى المستشفى تشكل عبئاً خانقاً على ميزانية العائلة التي تضم طفلين مصابين. بعد ربط الأسرة بمديرية التنمية وإدارة الحالة بالتعاون مع الجمعية، تم إدراجها ضمن برامج الحماية وبدل التنقل، واستعادت الأسرة استقرارها النفسي والمعيشي.'
      },
      impactPillars: {
        en: ['Social Safety Net Stipend', 'Mobility Subsidy', 'Caregiver Relief Group'],
        ar: ['مخصصات الحماية الاجتماعية', 'تغطية بدل مواصلات المستشفى', 'جلسات الدعم النفسي للأمهات']
      }
    },
    {
      id: 'story-03-entrepreneurship',
      type: 'video',
      theme: { en: 'Economic Empowerment & Livelihoods', ar: 'التمكين الاقتصادي والمشاريع المنتجة' },
      title: { en: 'My Craft, My Independence', ar: 'مشروعي المستقل: من الحاجة إلى الإنتاج' },
      personName: { en: 'Tariq (Artisan & Small Business Owner)', ar: 'طارق (صاحب مشروع حرفي وإنتاجي مستقل)' },
      roleOrAchievement: { en: 'Micro-enterprise Grant Recipient', ar: 'مستفيد من منحة تمكين اقتصادي' },
      governorate: { en: 'Hebron (Al-Khalil)', ar: 'الخليل' },
      duration: '04:12',
      thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      quote: {
        en: '“I did not want sympathy; I wanted an opportunity. Through MoSD economic empowerment, I launched my workshop.”',
        ar: '«لم أكن أبحث عن مساعدة عابرة، بل عن فرصة عمل تناسب طاقتي. بفضل برنامج التمكين الاقتصادي، جهزت ورشتي الخاصة وأصبحت معتمداً على نفسي.»'
      },
      fullStory: {
        en: 'Tariq wanted steady financial autonomy tailored to his routine medical care. The Ministry’s Economic Empowerment Department, in synergy with TPFS livelihood assessments, provided seed equipment and marketing coaching for his artisanal leather and woodworking atelier.',
        ar: 'رغب طارق في تأسيس دخل مستدام يراعي مواعيد علاجه الدورية. من خلال دائرة التمكين الاقتصادي في وزارة التنمية الاجتماعية والجمعية، حصل على منحة أدوات أولية وتدريب تسويقي مكنه من إدارة ورشته بنجاح، محققاً استقلالاً اقتصادياً كاملاً.'
      },
      impactPillars: {
        en: ['Micro-enterprise Seed Funding', 'Business Mentoring', 'Independent Living'],
        ar: ['تمويل مشروع مدر للدخل', 'إرشاد مهني وتجاري', 'استقلالية اقتصادية كاملة']
      }
    }
  ];

  const { activeId } = useAudioSpeech();

  const headerSpeechText = isAr 
    ? 'حياة مع الثلاسيميا: قصص ملهمة وإنجازات. شاهد واقرأ تجارب واقعية لأبطال وأسر كسروا حاجز الوصمة، وحققوا نجاحات دراسية ومهنية بمساندة برامج الحماية والتمكين.' 
    : 'Living with Thalassemia: Inspiring Real Journeys of youth and families overcoming stigma through social empowerment.';

  const storiesAudioItems = [
    { id: 'stories-header', text: headerSpeechText, title: isAr ? 'مقدمة القصص' : 'Stories Header' },
    ...STORIES.map(story => ({
      id: `story-audio-${story.id}`,
      text: `${story.title[language]}. ${story.personName[language]}، ${story.roleOrAchievement[language]}. مقولة ملهمة: ${story.quote[language]}`,
      title: story.personName[language]
    }))
  ];

  return (
    <section id="stories" className="scroll-mt-24 py-16 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-3xl transition-all ${
          activeId === 'stories-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
                <Heart className="w-3.5 h-3.5" />
                <span>{isAr ? 'قصص حقيقية بالصوت والصورة' : 'Real Multimedia Stories'}</span>
              </div>
              <ListenToPageButton items={storiesAudioItems} label={isAr ? 'استمع للقصص' : 'Listen to stories'} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isAr ? 'حياة مع الثلاسيميا: قصص ملهمة وإنجازات' : 'Living with Thalassemia: Inspiring Real Journeys'}
              </h2>
              <SpeakButton 
                id="stories-header" 
                text={headerSpeechText} 
                title={isAr ? 'استمع لمقدمة القصص' : 'Listen to stories header'} 
              />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              {isAr 
                ? 'شاهد واقرأ تجارب واقعية لأبطال وأسر كسروا حاجز الوصمة، وحققوا نجاحات دراسية ومهنية بمساندة برامج الحماية والتمكين.' 
                : 'Watch and read authentic journeys of Palestinian youth and families moving from isolation to achievement.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white border border-[#EADFD5] px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#2E6F56]" />
            <span>{isAr ? 'موثقة برضا وموافقة المستفيدين التامة' : 'Verified with Full Informed Consent'}</span>
          </div>
        </div>

        {/* Stories Cards Grid (Photos & Videos) */}
        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map((story) => {
            const isSpeaking = activeId === `story-audio-${story.id}`;
            const storySpeech = `${story.title[language]}. ${story.personName[language]}، ${story.roleOrAchievement[language]}. مقولة ملهمة: ${story.quote[language]}`;

            return (
              <div
                key={story.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group ${
                  isSpeaking
                    ? 'border-[#694E91] ring-2 ring-[#694E91]/30 bg-[#FAF7FD]'
                    : 'border-[#EADFD5]'
                }`}
              >
                {/* Media Header (Thumbnail with Play Badge) */}
                <div 
                  className="relative h-56 sm:h-60 overflow-hidden bg-slate-900 cursor-pointer"
                  onClick={() => setActiveStoryModal(story)}
                >
                  <img
                    src={story.thumbnailUrl}
                    alt={story.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge Category */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="text-[10px] font-black bg-black/60 backdrop-blur-md text-[#E4D7FC] px-3 py-1 rounded-full border border-white/20">
                      {story.theme[language]}
                    </span>
                  </div>

                  {/* Video Play Button Overlay */}
                  {story.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#7A1822]/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#911D29] transition-all border-2 border-white/60">
                        <Play className="w-6 h-6 fill-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                      <span className="text-[10px] font-black bg-[#2E6F56] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        <span>{isAr ? 'قصة مصورة' : 'Photo Story'}</span>
                      </span>
                    </div>
                  )}

                  {/* Duration & Location tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                    <span>{story.governorate[language]}</span>
                    {story.duration && (
                      <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        <span>{story.duration}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Story Content Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-base sm:text-lg text-slate-900 group-hover:text-[#7A1822] transition-colors leading-snug">
                        {story.title[language]}
                      </h3>
                      <SpeakButton
                        id={`story-audio-${story.id}`}
                        text={storySpeech}
                        title={isAr ? `استمع لقصة ${story.personName[language]}` : `Listen to ${story.personName[language]}`}
                        size="sm"
                      />
                    </div>

                    <div className="text-xs font-bold text-[#7A1822]">
                      {story.personName[language]} • {story.roleOrAchievement[language]}
                    </div>

                    <blockquote className={`text-xs font-bold text-slate-700 italic p-3 rounded-xl border leading-relaxed transition-all ${
                      isSpeaking ? 'bg-[#694E91]/10 border-[#694E91]/30' : 'bg-[#FAF8F5] border-[#F1ECE6]'
                    }`}>
                      {story.quote[language]}
                    </blockquote>

                  {/* Impact Pillars */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">
                      {isAr ? 'مجالات التدخل والمساندة:' : 'Intervention Areas:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {story.impactPillars[language].map((pillar, i) => (
                        <span key={i} className="text-[10px] font-bold bg-[#FAF8F5] text-slate-700 px-2.5 py-0.5 rounded-md border border-[#EADFD5]">
                          {pillar}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveStoryModal(story)}
                    className="text-xs font-black text-[#7A1822] hover:text-[#911D29] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{story.type === 'video' ? (isAr ? 'شاهد الفيديو والتفاصيل' : 'Watch Video & Details') : (isAr ? 'اقرأ القصة كاملة' : 'Read Full Story')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onNavigateToRequest}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                  >
                    {isAr ? 'طلب دعم مماثل' : 'Request Support'}
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Video / Photo Story Modal Dialog */}
        {activeStoryModal && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
            onClick={() => setActiveStoryModal(null)}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-[#EADFD5] shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto animate-in zoom-in-95 text-slate-900"
            >
              {/* Modal Media Screen */}
              <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                <img
                  src={activeStoryModal.thumbnailUrl}
                  alt={activeStoryModal.title[language]}
                  className="w-full h-full object-cover opacity-85"
                />
                
                {/* Simulated Documentary Video Player Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 sm:p-6 text-white">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black bg-[#7A1822] px-3 py-1 rounded-full">
                      {activeStoryModal.theme[language]}
                    </span>
                    <button
                      onClick={() => setActiveStoryModal(null)}
                      className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Center Play/Pause Indicator */}
                  <div className="self-center">
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/40"
                    >
                      {isPlayingVideo ? (
                        <Pause className="w-7 h-7 text-white" />
                      ) : (
                        <Play className="w-7 h-7 text-white fill-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Video Progress */}
                  <div className="space-y-2">
                    <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#E4D7FC] h-full w-2/3 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/90">
                      <span>{activeStoryModal.personName[language]} - {activeStoryModal.governorate[language]}</span>
                      <span>{activeStoryModal.duration || '03:15'}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Narrative Details */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {activeStoryModal.title[language]}
                    </h3>
                    <p className="text-xs font-bold text-[#7A1822]">
                      {activeStoryModal.personName[language]} • {activeStoryModal.roleOrAchievement[language]}
                    </p>
                  </div>
                  <SpeakButton
                    id={`story-modal-${activeStoryModal.id}`}
                    text={`${activeStoryModal.title[language]}. ${activeStoryModal.personName[language]}. ${activeStoryModal.quote[language]} ${activeStoryModal.fullStory[language]}`}
                    title={activeStoryModal.title[language]}
                    size="md"
                    showText={true}
                  />
                </div>

                <div className={`p-5 rounded-2xl border space-y-2 transition-colors ${
                  activeId === `story-modal-${activeStoryModal.id}`
                    ? 'bg-[#694E91]/10 border-[#694E91]/30 ring-2 ring-[#694E91]/20'
                    : 'bg-[#FAF8F5] border-[#EADFD5]'
                }`}>
                  <span className="text-[11px] font-black uppercase text-slate-400 block">
                    {isAr ? 'رسالة الأمل والكرامة:' : 'Core Message:'}
                  </span>
                  <p className="text-sm font-bold text-slate-800 italic leading-relaxed">
                    {activeStoryModal.quote[language]}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {isAr ? 'تفاصيل القصة ومسار المساندة:' : 'Full Narrative & Intervention:'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeStoryModal.fullStory[language]}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveStoryModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>

                  <button
                    onClick={() => {
                      setActiveStoryModal(null);
                      onNavigateToRequest();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#7A1822] hover:bg-[#911D29] text-white text-xs font-black shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Support Request'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
