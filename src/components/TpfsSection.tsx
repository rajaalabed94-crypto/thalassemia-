import React from 'react';
import { Language } from '../types';
import { ShieldCheck, Heart, ExternalLink, MapPin, Calendar, Award, Users } from 'lucide-react';
import { SpeakButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface TpfsSectionProps {
  language: Language;
}

export const TpfsSection: React.FC<TpfsSectionProps> = ({
  language
}) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();

  const tpfsSpeechText = isAr
    ? 'جمعية أصدقاء مرضى الثلاسيميا في فلسطين: مؤسسة أهلية فلسطينية غير ربحية رائدة تأسست عام 1996، لتمثل صوت المرضى وتدافع عن حقوقهم، وتعمل في كافة محافظات الضفة الغربية وقطاع غزة لبناء قدرات المرضى صحياً واقتصادياً ونفسياً واجتماعياً.'
    : 'Thalassemia Patients Friends Society Palestine: A pioneering Palestinian non-profit NGO established in 1996, representing patients, defending their human rights, and fostering health, psychosocial, and economic empowerment across the West Bank and Gaza Strip.';

  return (
    <section id="tpfs" className="scroll-mt-24 py-16 bg-[#F5EFE8] border-b border-[#E3D6C9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className={`bg-white rounded-3xl p-8 sm:p-12 border shadow-sm transition-colors ${
          activeId === 'tpfs-section-card' ? 'border-[#694E91] ring-2 ring-[#694E91]/30' : 'border-[#E3D6C9]'
        }`}>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5 text-left rtl:text-right">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
                  <Heart className="w-3.5 h-3.5 fill-[#7A1822]" />
                  <span>{isAr ? 'عن الشريك التخصصي الميداني' : 'Specialized Field Partner'}</span>
                </div>
                <SpeakButton
                  id="tpfs-section-card"
                  text={tpfsSpeechText}
                  title={isAr ? 'عن جمعية أصدقاء مرضى الثلاسيميا' : 'About TPFS'}
                  size="sm"
                />
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {isAr 
                  ? 'جمعية أصدقاء مرضى الثلاسيميا – فلسطين (TPFS)' 
                  : 'Thalassemia Patients’ Friends Society – Palestine'}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                {isAr ? (
                  <>
                    مؤسسة أهلية فلسطينية غير ربحية رائدة، <strong className="text-slate-900 font-bold">تأسست عام ١٩٩٦</strong>، لتمثل صوت المرضى وتدافع عن حقوقهم، وتعمل في كافة محافظات الضفة الغربية وقطاع غزة لبناء قدرات المرضى صحياً واقتصادياً ونفسياً واجتماعياً.
                  </>
                ) : (
                  <>
                    A pioneering Palestinian non-profit NGO, <strong className="text-slate-900 font-bold">established in 1996</strong>, representing the collective voice of patients, defending their human rights, and fostering health, psychosocial, and economic empowerment across the West Bank and Gaza Strip.
                  </>
                )}
              </p>

              {/* 4 Pillars Grid */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFD5] space-y-1">
                  <span className="font-black text-slate-900 block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7A1822]" />
                    {isAr ? 'عطاء متواصل منذ ١٩٩٦' : 'Established in 1996'}
                  </span>
                  <span className="text-slate-600 leading-relaxed block">
                    {isAr ? 'ثلاثة عقود من الخبرة التراكمية في رعاية المرضى والدفاع عن حقوقهم.' : 'Three decades of dedicated patient care and community advocacy.'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFD5] space-y-1">
                  <span className="font-black text-slate-900 block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7A1822]" />
                    {isAr ? 'مراكز في الضفة والقطاع' : 'Centers Across Palestine'}
                  </span>
                  <span className="text-slate-600 leading-relaxed block">
                    {isAr ? 'مراكز ومكاتب تنسيق في رام الله، طولكرم، نابلس، وغزة.' : 'Centers and field coordination hubs in Ramallah, Tulkarm, Nablus, and Gaza.'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://tpfs.ps/ar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#7A1822] hover:bg-[#B9232E] text-white font-black text-xs sm:text-sm shadow-xs transition-colors"
                >
                  <span>{isAr ? 'زيارة الموقع الرسمي للجمعية (tpfs.ps)' : 'Visit Official TPFS Website'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Side Infographic Box */}
            <div className="lg:col-span-4 bg-[#7A1822] text-white rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
                <img 
                  src="/campaign-logo.jpg" 
                  alt="شعار الحملة" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E4D7FC]">
                {isAr ? 'رسالة الجمعية والوزارة المشتركة' : 'Joint Strategic Mandate'}
              </span>
              <h3 className="text-lg font-black leading-snug">
                {isAr ? '«المرضى شركاء فاعلون في المجتمع، وليسوا متلقين سلبيين للرعاية»' : '“Patients are active partners in community life, not passive recipients of aid”'}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                {isAr 
                  ? 'بناء قدرات الشباب المصابين بالثلاسيميا وتمكينهم من التعلم والعمل والإنتاج بكرامة واستقلالية.' 
                  : 'Fostering the capacities of young thalassemia patients to pursue higher education, employment, and productive independence.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
