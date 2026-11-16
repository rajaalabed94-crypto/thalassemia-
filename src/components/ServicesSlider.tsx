import React, { useState } from 'react';
import { Language, ServiceCategory, ServiceItem } from '../types';
import { OFFICIAL_SERVICES } from '../data/mockData';
import { 
  ShieldCheck, 
  Coins, 
  HeartHandshake, 
  UserCheck, 
  ArrowUpRight, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface ServicesSliderProps {
  language: Language;
  onSelectServiceForRequest: (category: ServiceCategory) => void;
  initialShowAll?: boolean;
}

export const ServicesSlider: React.FC<ServicesSliderProps> = ({
  language,
  onSelectServiceForRequest,
  initialShowAll = false
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [showAllServices, setShowAllServices] = useState<boolean>(initialShowAll);
  const { activeId } = useAudioSpeech();

  const servicesAudioSequence = [
    {
      id: 'services-heading',
      title: isAr ? 'خدماتنا' : 'Services Overview',
      text: isAr 
        ? 'خدماتنا: كيف يمكننا مساندة أسرتك؟ ست خدمات أساسية مصممة لتلبية احتياجات المريض والأسرة، ويتم تحديد نوع الدعم المناسب بعد دراسة الحالة وتقييم الاحتياج الفعلي.'
        : 'Our Services: Supporting Your Family. Six core interventions designed for patients and caregivers, determined through verified social case study.'
    },
    ...OFFICIAL_SERVICES.map(srv => ({
      id: `service-${srv.id}`,
      title: srv.title[language],
      text: `${srv.title[language]}. ${srv.subtitle[language]}. ${srv.description[language]}`
    }))
  ];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Coins': return Coins;
      case 'HeartHandshake': return HeartHandshake;
      case 'UserCheck': return UserCheck;
      case 'ArrowUpRight': return ArrowUpRight;
      case 'Briefcase': return Briefcase;
      default: return Sparkles;
    }
  };

  // Display initial 3 services on home page grid, expandable to all 6
  const displayedServices = showAllServices ? OFFICIAL_SERVICES : OFFICIAL_SERVICES.slice(0, 3);

  return (
    <section id="services" className="scroll-mt-24 py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E1B24]/10 text-[#8E1B24] text-xs font-black">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAr ? 'حزم الحماية والمساندة المعتمدة' : 'Available Protection & Empowerment'}</span>
              </div>
              <ListenToPageButton
                items={servicesAudioSequence}
                title={isAr ? 'قراءة حزم الخدمات' : 'Services Audio Guide'}
              />
            </div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1B1B3A] tracking-tight flex-1">
                {isAr ? 'خدماتنا: كيف يمكننا مساندة أسرتك؟' : 'Our Services: Supporting Your Family'}
              </h2>
              <SpeakButton
                id="services-heading"
                text={servicesAudioSequence[0].text}
                title={servicesAudioSequence[0].title}
                size="md"
              />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
              {isAr 
                ? 'ست خدمات أساسية مصممة لتلبية احتياجات المريض والأسرة، ويتم تحديد نوع الدعم المناسب بعد دراسة الحالة وتقييم الاحتياج الفعلي.' 
                : 'Six core interventions designed for patients and caregivers, determined through verified social case study.'}
            </p>
          </div>

          {/* Quick toggle indicator */}
          <div className="text-xs font-bold text-slate-500">
            {isAr 
              ? `عرض ${displayedServices.length} من إجمالي ${OFFICIAL_SERVICES.length} خدمات معتمدة`
              : `Showing ${displayedServices.length} of ${OFFICIAL_SERVICES.length} official services`}
          </div>
        </div>

        {/* Notice of Case Study & Assessment (Standardized Card) */}
        <div className={`p-4 rounded-2xl bg-white border border-[#EADFD5] shadow-xs flex items-center justify-between gap-3 text-xs text-slate-700 transition-colors duration-300 ${
          activeId === 'services-notice' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-xl bg-[#8E1B24]/10 text-[#8E1B24] flex items-center justify-center shrink-0 font-black">
              !
            </div>
            <p className="font-semibold leading-relaxed">
              {isAr ? (
                <>
                  <strong className="text-[#8E1B24]">تنويه معايير الاستحقاق:</strong> الاستفادة من الخدمات والمساعدات ليست أوتوماتيكية، بل تخضع لإجراءات <span className="underline decoration-[#8E1B24]">دراسة الحالة وتقييم الاحتياج الفعلي للأسرة</span> من قِبل الأخصائي الاجتماعي الميداني وفق معايير الاستحقاق الوطنية المعتمدة.
                </>
              ) : (
                <>
                  <strong className="text-[#8E1B24]">Eligibility Notice:</strong> Support delivery is not automatic; services are granted following an official field case assessment by social workers evaluating actual household vulnerability.
                </>
              )}
            </p>
          </div>
          <SpeakButton
            id="services-notice"
            text={isAr 
              ? 'تنويه معايير الاستحقاق: الاستفادة من الخدمات والمساعدات ليست أوتوماتيكية، بل تخضع لإجراءات دراسة الحالة وتقييم الاحتياج الفعلي للأسرة من قِبل الأخصائي الاجتماعي الميداني وفق معايير الاستحقاق الوطنية المعتمدة.'
              : 'Eligibility Notice: Support delivery is not automatic; services are granted following an official field case assessment by social workers evaluating actual household vulnerability.'}
            size="sm"
          />
        </div>

        {/* Responsive Organized Grid (Desktop: 3 cols, Tablet: 2 cols, Mobile: 1 col) - No Hidden Horizontal Scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((srv) => {
            const Icon = getServiceIcon(srv.iconName);
            const isSpeakingThis = activeId === `service-${srv.id}`;

            return (
              <div
                key={srv.id}
                className={`rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full bg-white group border ${
                  isSpeakingThis
                    ? 'border-2 border-[#694E91] bg-[#694E91]/8 ring-2 ring-[#694E91]/30 shadow-md'
                    : 'border-[#EADFD5]'
                }`}
              >
                <div className="space-y-3">
                  {/* Step Number, Audio Button & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-[#8E1B24]/40 group-hover:text-[#8E1B24] transition-colors font-mono">
                      {srv.stepNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <SpeakButton
                        id={`service-${srv.id}`}
                        text={`${srv.title[language]}. ${srv.subtitle[language]}. ${srv.description[language]}`}
                        title={srv.title[language]}
                        size="sm"
                      />
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EADFD5] text-[#8E1B24] flex items-center justify-center group-hover:bg-[#8E1B24] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-[#1B1B3A] group-hover:text-[#8E1B24] transition-colors leading-snug">
                      {srv.title[language]}
                    </h3>
                    <p className="text-xs font-bold text-[#2E6F56] mt-0.5">
                      {srv.subtitle[language]}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {srv.description[language]}
                  </p>

                  {/* Provider tag */}
                  <div className="pt-2 border-t border-[#F1ECE6] flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>{isAr ? 'الجهة المقدمة:' : 'Provider:'}</span>
                    <span className="text-slate-800 bg-[#FAF8F5] px-2 py-0.5 rounded-lg border border-[#EADFD5]">
                      {srv.provider === 'MoSD' 
                        ? (isAr ? 'وزارة التنمية الاجتماعية' : 'MoSD')
                        : srv.provider === 'TPFS'
                        ? (isAr ? 'جمعية أصدقاء مرضى الثلاسيميا' : 'TPFS')
                        : (isAr ? 'تنسيق مشترك (وزارة + جمعية)' : 'Joint Program')}
                    </span>
                  </div>
                </div>

                {/* Bottom Action: Details Modal Trigger & Direct Request Pathway */}
                <div className="pt-4 mt-4 border-t border-[#F1ECE6] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedServiceModal(srv)}
                    className="text-xs font-black text-[#8E1B24] group-hover:text-[#B9232E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'التفاصيل والشروط' : 'Details & Criteria'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectServiceForRequest(srv.category)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#8E1B24] text-slate-800 hover:text-white font-bold text-xs border border-[#EADFD5] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    {isAr ? 'طلب الخدمة' : 'Request'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Services / View Less Toggle Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#694E91] border border-[#694E91]/30 hover:border-[#694E91] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <span>
              {showAllServices 
                ? (isAr ? 'عرض خدمات أقل' : 'Show Less') 
                : (isAr ? 'عرض جميع الخدمات (٦ حزم معتمدة)' : 'View All Services (6 Packages)')}
            </span>
            {showAllServices ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Full Details Modal (Zero Information Lost) */}
        {selectedServiceModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-mono font-bold text-[#8E1B24]">
                    {isAr ? `الخدمة رقم ${selectedServiceModal.stepNumber}` : `Service #${selectedServiceModal.stepNumber}`}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {selectedServiceModal.title[language]}
                  </h3>
                  <p className="text-xs font-bold text-[#2E6F56] mt-0.5">
                    {selectedServiceModal.subtitle[language]}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <SpeakButton
                    id={`service-modal-${selectedServiceModal.id}`}
                    text={`${selectedServiceModal.title[language]}. ${selectedServiceModal.description[language]}. ${isAr ? 'من يستفيد:' : 'Who benefits:'} ${selectedServiceModal.whoCanBenefit[language]}. ${isAr ? 'التغطية:' : 'Coverage:'} ${selectedServiceModal.coverageDetails[language]}. ${isAr ? 'المتطلبات:' : 'Requirements:'} ${selectedServiceModal.requirements[language]}`}
                    title={selectedServiceModal.title[language]}
                    size="md"
                  />
                  <button
                    onClick={() => setSelectedServiceModal(null)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
                    aria-label={isAr ? 'إغلاق' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div>
                  <h4 className="font-black text-slate-900 mb-1">{isAr ? 'عن هذه الخدمة:' : 'About This Service:'}</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedServiceModal.description[language]}</p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EADFD5]">
                  <h4 className="font-black text-slate-900 mb-1">{isAr ? 'من يستفيد:' : 'Who Benefits:'}</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedServiceModal.whoCanBenefit[language]}</p>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-emerald-950">
                  <h4 className="font-black text-[#2E6F56] mb-1">{isAr ? 'تفاصيل التغطية الممنوحة:' : 'Coverage Specifics:'}</h4>
                  <p className="text-emerald-900 leading-relaxed">{selectedServiceModal.coverageDetails[language]}</p>
                </div>

                <div className="bg-[#F8F5FD] p-3.5 rounded-xl border border-[#DDD6FE] text-[#2C1D4D]">
                  <h4 className="font-black text-[#4A326E] mb-1">{isAr ? 'المتطلبات الميسرة (دون تعقيد):' : 'Requirements:'}</h4>
                  <p className="text-[#5A4080] leading-relaxed">{selectedServiceModal.requirements[language]}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    const cat = selectedServiceModal.category;
                    setSelectedServiceModal(null);
                    onSelectServiceForRequest(cat);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#8E1B24] hover:bg-[#B9232E] text-white font-black text-xs sm:text-sm text-center shadow-xs transition-colors cursor-pointer"
                >
                  {isAr ? 'المتابعة لطلب هذه الخدمة' : 'Proceed to Request This Service'}
                </button>
                <button
                  onClick={() => setSelectedServiceModal(null)}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
