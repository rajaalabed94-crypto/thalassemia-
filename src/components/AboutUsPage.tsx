import React from 'react';
import { Language } from '../types';
import { 
  Building2, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Award, 
  CheckCircle2, 
  Briefcase, 
  Scale, 
  Calendar,
  Layers
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface AboutUsPageProps {
  language: Language;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();

  const headerSpeechText = isAr
    ? 'من نحن: شراكة وطنية لتعزيز الحماية وصون الكرامة. تتكامل جهود وزارة التنمية الاجتماعية مع جمعية أصدقاء مرضى الثلاسيميا لضمان شبكة أمان اجتماعي وتمكين مستدام لمرضى الثلاسيميا وأسرهم في فلسطين.'
    : 'About Us: A National Partnership for Protection and Dignity. Uniting public governance with specialized civil society for sustainable social safety.';

  const mosdSpeechText = isAr
    ? 'وزارة التنمية الاجتماعية الفلسطينية: تقود الوزارة منظومة الحماية الاجتماعية الوطنية وفق رؤية ترتكز على العدالة وتكافؤ الفرص، وتعمل على دراسة أوضاع أسر مرضى الثلاسيميا لتقييم الاحتياج الفعلي وإدراجهم في شبكات الأمان الاجتماعي والمساعدات التمكينية.'
    : 'Palestinian Ministry of Social Development: Leading the national social protection system based on equity and opportunity, assessing thalassemia families and providing safety nets.';

  const tpfsSpeechText = isAr
    ? 'جمعية أصدقاء مرضى الثلاسيميا فلسطين: مؤسسة أهلية فلسطينية رائدة تأسست عام 1996، تمثل الصوت الحقوقي والتوعوي الأول للمرضى في الوطن، وتعمل بشراكة وثيقة مع المؤسسات الحكومية لتحسين جودة حياة المرضى ومساندة أسرهم نفسياً واجتماعياً.'
    : 'Thalassemia Patients Friends Society Palestine: Pioneering NGO founded in 1996, championing patient rights and continuous bedside and psychosocial support.';

  const aboutAudioItems = [
    { id: 'about-header', text: headerSpeechText, title: isAr ? 'مقدمة من نحن' : 'About Intro' },
    { id: 'about-mosd', text: mosdSpeechText, title: isAr ? 'وزارة التنمية الاجتماعية' : 'Ministry of Social Development' },
    { id: 'about-tpfs', text: tpfsSpeechText, title: isAr ? 'جمعية أصدقاء مرضى الثلاسيميا' : 'TPFS' }
  ];

  return (
    <section id="about-us" className="scroll-mt-24 py-16 bg-[#FAF7F2] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto space-y-3 p-4 rounded-3xl transition-all ${
          activeId === 'about-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#634B8F]/10 text-[#634B8F] text-xs font-black">
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'من نحن • تكامل الرؤية الوطنية' : 'About Us • Integrated National Mandate'}</span>
            </div>
            <ListenToPageButton items={aboutAudioItems} label={isAr ? 'استمع للتعريف' : 'Listen'} />
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-4xl font-black text-[#1B1B3A] tracking-tight">
              {isAr ? 'شراكة وطنية لتعزيز الحماية وصون الكرامة' : 'A National Partnership for Protection & Dignity'}
            </h2>
            <SpeakButton 
              id="about-header" 
              text={headerSpeechText} 
              title={isAr ? 'استمع لتعريف الشراكة' : 'Listen to partnership overview'} 
            />
          </div>

          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr 
              ? 'تتكامل جهود القطاع الحكومي مع المجتمع المدني التخصصي لضمان شبكة أمان اجتماعي وتمكين مستدام لمرضى الثلاسيميا وأسرهم في فلسطين.'
              : 'Uniting public governance with specialized civil society to ensure sustainable social safety and empowerment across Palestine.'}
          </p>
        </div>

        {/* Two Visually Equal Sections: MoSD & TPFS */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* 1. Ministry of Social Development (MoSD) */}
          <div className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${
            activeId === 'about-mosd' ? 'ring-2 ring-[#694E91] border-[#694E91] bg-[#FAF7FD]' : 'border-[#EADFD5]'
          }`}>
            <div className="space-y-5">
              
              {/* Partner Badge & Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1B1B3A] text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-6 h-6 text-[#E4D7FC]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#634B8F] block">
                      {isAr ? 'المظلة الحكومية الرسمية' : 'Official Government Mandate'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#1B1B3A]">
                      {isAr ? 'وزارة التنمية الاجتماعية الفلسطينية' : 'Palestinian Ministry of Social Development'}
                    </h3>
                  </div>
                </div>

                <SpeakButton
                  id="about-mosd"
                  text={mosdSpeechText}
                  title={isAr ? 'استمع لمهام وزارة التنمية الاجتماعية' : 'Listen to MoSD mandate'}
                  size="md"
                />
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {isAr ? (
                  <>
                    تقود الوزارة منظومة الحماية الاجتماعية الوطنية وفق رؤية ترتكز على العدالة وتكافؤ الفرص، وتعمل على دراسة أوضاع أسر مرضى الثلاسيميا لتقييم الاحتياج الفعلي وإدراجهم في شبكات الأمان الاجتماعي والمساعدات التمكينية.
                  </>
                ) : (
                  <>
                    Leading the national social protection system based on equity and opportunity, assessing thalassemia families to determine verified needs and enrolling eligible households in social safety nets.
                  </>
                )}
              </p>

              {/* Roles & Mandates */}
              <div className="space-y-2.5 pt-2">
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'الحماية الاجتماعية وشبكات الأمان:' : 'Social Protection & Safety Nets:'}
                    </strong>
                    <span>{isAr ? 'تقديم المساعدات النقدية والطارئة للأسر المستحقة وفق معادلة الفقر متعدد الأبعاد.' : 'Delivering targeted cash and emergency relief to vulnerable households.'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <Scale className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'إدارة الحالة والدعم الاجتماعي:' : 'Case Management & Family Support:'}
                    </strong>
                    <span>{isAr ? 'متابعة شاملة لاحتياجات الأسرة المعيشية، وتنسيق الإعفاءات الطبية والمساعدات الاجتماعية الرسمية.' : 'Comprehensive follow-up of living needs and coordination of medical fee exemptions and official social aid.'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <Briefcase className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'برامج التمكين الاقتصادي:' : 'Economic Empowerment Programs:'}
                    </strong>
                    <span>{isAr ? 'منح وتمويل مشاريع صغيرة مدرة للدخل لتحقيق الاعتماد على الذات والكرامة المعيشية.' : 'Livelihood micro-grants fostering financial independence and dignifying work.'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Official Website Link */}
            <div className="pt-4 border-t border-slate-100">
              <a
                href="https://www.mosd.gov.ps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#1B1B3A] hover:bg-[#2A2A54] text-white font-black text-xs text-center flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-[#E4D7FC]" />
                <span>{isAr ? 'زيارة البوابة الرسمية للوزارة (mosd.gov.ps)' : 'Visit MoSD Official Portal'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* 2. Thalassemia Patients' Friends Society (TPFS) */}
          <div className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 ${
            activeId === 'about-tpfs' ? 'ring-2 ring-[#694E91] border-[#694E91] bg-[#FAF7FD]' : 'border-[#EADFD5]'
          }`}>
            <div className="space-y-5">
              
              {/* Partner Badge & Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#634B8F] text-white flex items-center justify-center shadow-xs">
                    <Heart className="w-6 h-6 fill-[#E4D7FC] text-[#E4D7FC]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#9E1B28] block">
                      {isAr ? 'الشريك التخصصي الميداني' : 'Specialized Field Partner'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#1B1B3A]">
                      {isAr ? 'جمعية أصدقاء مرضى الثلاسيميا – فلسطين' : 'Thalassemia Patients’ Friends Society – Palestine'}
                    </h3>
                  </div>
                </div>

                <SpeakButton
                  id="about-tpfs"
                  text={tpfsSpeechText}
                  title={isAr ? 'استمع لمهام جمعية أصدقاء مرضى الثلاسيميا' : 'Listen to TPFS mandate'}
                  size="md"
                />
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {isAr ? (
                  <>
                    مؤسسة أهلية فلسطينية رائدة تأسست عام ١٩٩٦، تمثل الصوت الحقوقي والتوعوي الأول للمرضى في الوطن، وتعمل بشراكة وثيقة مع المؤسسات الحكومية لتحسين جودة حياة المرضى ومساندة أسرهم نفسيًا واجتماعيًا.
                  </>
                ) : (
                  <>
                    A pioneering Palestinian non-profit NGO founded in 1996, serving as the leading advocacy and patient-support organisation across the West Bank and Gaza, championing patients’ rights and wellbeing.
                  </>
                )}
              </p>

              {/* Roles & Mandates */}
              <div className="space-y-2.5 pt-2">
                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <Calendar className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'خبرة تخصصية ممتدة منذ ١٩٩٦:' : 'Three Decades of Advocacy:'}
                    </strong>
                    <span>{isAr ? 'ثلاثون عاماً من المرافقة الميدانية للمرضى في المستشفيات والمدارس والجامعات.' : 'Thirty years of continuous bedside and community support in clinics and schools.'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <Users className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'الإرشاد الأسري ودعم الأقران:' : 'Family Counseling & Peer Support:'}
                    </strong>
                    <span>{isAr ? 'جلسات تفريغ نفسي للأمهات والآباء، وورش تمكين شبابية لبناء الثقة والقيادة.' : 'Psychological debriefing for parents and leadership youth workshops.'}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADFD5] flex items-start gap-2.5 text-xs text-slate-800">
                  <Award className="w-4 h-4 text-[#634B8F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black text-[#1B1B3A] mb-0.5">
                      {isAr ? 'التوعية المجتمعية والوقاية:' : 'Awareness & Premarital Prevention:'}
                    </strong>
                    <span>{isAr ? 'مكافحة الوصمة المجتمعية، ونشر الوعي بأهمية الفحص الطبي الشامل قبل الزواج.' : 'Combating social stigma and championing compulsory premarital screening.'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Official Website Link */}
            <div className="pt-4 border-t border-slate-100">
              <a
                href="https://tpfs.ps/ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#634B8F] hover:bg-[#523D77] text-white font-black text-xs text-center flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-[#E4D7FC] text-[#E4D7FC]" />
                <span>{isAr ? 'زيارة الموقع الرسمي للجمعية (tpfs.ps)' : 'Visit TPFS Official Website'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
