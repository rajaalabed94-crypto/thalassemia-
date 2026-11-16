import React from 'react';
import { Language } from '../types';
import { Film, ArrowLeft, ArrowRight, Play, Award, Sparkles, Heart } from 'lucide-react';
import { SpeakButton } from '../context/AudioSpeechContext';

interface HomeCompactStoriesProps {
  language: Language;
  onNavigateToStories: () => void;
}

export const HomeCompactStories: React.FC<HomeCompactStoriesProps> = ({
  language,
  onNavigateToStories
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const headerText = isAr
    ? 'قصص وتجارب من واقع التحدي والأمل: نماذج ملهمة لمرضى ثلاسيميا وأسرهم حققوا التميز الأكاديمي، المهني، والإنتاجي بدعم منظومة الحماية الاجتماعية.'
    : 'Human Stories: Inspiring journeys of thalassemia individuals and families achieving academic, career, and personal excellence with social protection support.';

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1B28]/10 text-[#9E1B28] text-xs font-black">
              <Film className="w-3.5 h-3.5" />
              <span>{isAr ? 'قصص وتجارب ملهمة' : 'Inspiring Journeys & Videos'}</span>
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B3A] tracking-tight">
                {isAr ? 'قصص من واقع التحدي والأمل' : 'Stories of Hope & Resilience'}
              </h2>
              <SpeakButton id="home-compact-stories" text={headerText} title={isAr ? 'قصص من واقع الأمل' : 'Stories audio'} size="md" />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              {headerText}
            </p>
          </div>

          <button
            onClick={onNavigateToStories}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#694E91] text-[#694E91] hover:text-white border border-[#EADFD5] hover:border-[#694E91] text-xs font-black transition-all cursor-pointer shadow-2xs group self-start sm:self-auto shrink-0"
          >
            <span>{isAr ? 'شاهد جميع القصص والفيديوهات' : 'Watch All Stories & Videos'}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 3 Story Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Preview 1: Heba */}
          <div 
            onClick={onNavigateToStories}
            className="group rounded-2xl border border-[#EADFD5] overflow-hidden bg-[#FAF7F2] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src="/src/assets/images/palestine_youth_empowerment_1793088049892.jpg"
                alt="Heba Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-white" />
                <span>03:45</span>
              </div>
              <div className="absolute bottom-3 start-3 end-3 text-white">
                <span className="text-[10px] font-bold text-emerald-400 block">
                  {isAr ? 'التميز الأكاديمي والمهني' : 'Academic & Tech'}
                </span>
                <h4 className="text-xs sm:text-sm font-black line-clamp-1">
                  {isAr ? 'هبة: من كراسي نقل الدم إلى هندسة الأنظمة' : 'Heba: From Blood Units to Software Tech'}
                </h4>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-2">
                {isAr 
                  ? '«الثلاسيميا لم تكن عائقاً؛ بدعم أسرتي والجمعية والجامعة تخرجت بمرتبة الشرف وأعمل اليوم في التكنولوجيا.»'
                  : '“Thalassemia taught me resilience. With family and Association support, I graduated with honors.”'}
              </p>
              <div className="text-[11px] font-black text-[#694E91] flex items-center gap-1 group-hover:underline">
                <span>{isAr ? 'مشاهدة الفيديو وقراءة القصة' : 'Watch video & story'}</span>
                <ArrowIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Preview 2: Tariq */}
          <div 
            onClick={onNavigateToStories}
            className="group rounded-2xl border border-[#EADFD5] overflow-hidden bg-[#FAF7F2] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Tariq Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-white" />
                <span>04:12</span>
              </div>
              <div className="absolute bottom-3 start-3 end-3 text-white">
                <span className="text-[10px] font-bold text-amber-400 block">
                  {isAr ? 'التمكين الاقتصادي والمشاريع' : 'Economic Empowerment'}
                </span>
                <h4 className="text-xs sm:text-sm font-black line-clamp-1">
                  {isAr ? 'طارق: مشروعي المستقل من الحاجة إلى الإنتاج' : 'Tariq: My Independent Artisan Workshop'}
                </h4>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-2">
                {isAr 
                  ? '«لم أكن أبحث عن مساعدة عابرة، بل عن فرصة عمل تناسب طاقتي. جهزت ورشتي الخاصة وأصبحت معتمداً على نفسي.»'
                  : '“Through economic empowerment, I launched my own atelier and gained complete independence.”'}
              </p>
              <div className="text-[11px] font-black text-[#694E91] flex items-center gap-1 group-hover:underline">
                <span>{isAr ? 'مشاهدة الفيديو وقراءة القصة' : 'Watch video & story'}</span>
                <ArrowIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Preview 3: Um Ahmad */}
          <div 
            onClick={onNavigateToStories}
            className="group rounded-2xl border border-[#EADFD5] overflow-hidden bg-[#FAF7F2] hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src="/src/assets/images/palestine_family_support_1793088022772.jpg"
                alt="Family Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>{isAr ? 'تجربة أسرة' : 'Family Story'}</span>
              </div>
              <div className="absolute bottom-3 start-3 end-3 text-white">
                <span className="text-[10px] font-bold text-sky-400 block">
                  {isAr ? 'حماية كرامة الأسرة وشبكة الأمان' : 'Social Protection & Dignity'}
                </span>
                <h4 className="text-xs sm:text-sm font-black line-clamp-1">
                  {isAr ? 'أم أحمد: كيف تحولت الضغوط إلى استقرار وأمان' : 'Um Ahmad: Family Stability & Support'}
                </h4>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <p className="text-[11px] text-slate-600 leading-relaxed italic line-clamp-2">
                {isAr 
                  ? '«الأخصائية الاجتماعية دخلت بيتنا بمنتهى الاحترام وصون الكرامة. وجدنا سنداً حقيقياً نظم لنا المساعدات وبدل التنقل.»'
                  : '“The social worker treated us with highest dignity, enrolling us in mobility relief and care.”'}
              </p>
              <div className="text-[11px] font-black text-[#694E91] flex items-center gap-1 group-hover:underline">
                <span>{isAr ? 'قراءة تجربة الأسرة كاملة' : 'Read full experience'}</span>
                <ArrowIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
