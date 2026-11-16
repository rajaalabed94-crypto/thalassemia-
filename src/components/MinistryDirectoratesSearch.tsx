import React, { useState } from 'react';
import { Language } from '../types';
import { DIRECTORATES_SEARCH_DATA } from '../data/mockData';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  ExternalLink, 
  Globe, 
  CheckCircle2,
  Navigation,
  Map as MapIcon
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface MinistryDirectoratesSearchProps {
  language: Language;
}

interface MapMarker {
  id: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  cityQuery: string;
  governorateKey: string;
}

// Precise coordinates for Palestinian cities & directorates so Google Maps navigates directly to the chosen city
const PALESTINE_MAP_PINS: MapMarker[] = [
  { id: 'hebron', nameAr: 'الخليل', nameEn: 'Hebron', lat: 31.5326, lng: 35.0998, cityQuery: 'الخليل, فلسطين', governorateKey: 'الخليل' },
  { id: 'yatta', nameAr: 'يطا', nameEn: 'Yatta', lat: 31.4497, lng: 35.0850, cityQuery: 'يطا, الخليل, فلسطين', governorateKey: 'يطا' },
  { id: 'bethlehem', nameAr: 'بيت لحم', nameEn: 'Bethlehem', lat: 31.7054, lng: 35.2024, cityQuery: 'بيت لحم, فلسطين', governorateKey: 'بيت لحم' },
  { id: 'jerusalem', nameAr: 'القدس الشريف', nameEn: 'Jerusalem', lat: 31.7767, lng: 35.2345, cityQuery: 'القدس الشريف, فلسطين', governorateKey: 'القدس' },
  { id: 'ramallah', nameAr: 'رام الله والبيرة', nameEn: 'Ramallah', lat: 31.9038, lng: 35.2034, cityQuery: 'رام الله, فلسطين', governorateKey: 'رام الله' },
  { id: 'jericho', nameAr: 'أريحا والأغوار', nameEn: 'Jericho', lat: 31.8611, lng: 35.4611, cityQuery: 'أريحا, فلسطين', governorateKey: 'أريحا' },
  { id: 'salfit', nameAr: 'سلفيت', nameEn: 'Salfit', lat: 32.0844, lng: 35.1764, cityQuery: 'سلفيت, فلسطين', governorateKey: 'سلفيت' },
  { id: 'nablus', nameAr: 'نابلس', nameEn: 'Nablus', lat: 32.2211, lng: 35.2544, cityQuery: 'نابلس, فلسطين', governorateKey: 'نابلس' },
  { id: 'qalqilya', nameAr: 'قلقيلية', nameEn: 'Qalqilya', lat: 32.1960, lng: 34.9815, cityQuery: 'قلقيلية, فلسطين', governorateKey: 'قلقيلية' },
  { id: 'tulkarm', nameAr: 'طولكرم', nameEn: 'Tulkarm', lat: 32.3117, lng: 35.0278, cityQuery: 'طولكرم, فلسطين', governorateKey: 'طولكرم' },
  { id: 'tubas', nameAr: 'طوباس والأغوار الشمالية', nameEn: 'Tubas', lat: 32.3211, lng: 35.3694, cityQuery: 'طوباس, فلسطين', governorateKey: 'طوباس' },
  { id: 'jenin', nameAr: 'جنين', nameEn: 'Jenin', lat: 32.4608, lng: 35.2974, cityQuery: 'جنين, فلسطين', governorateKey: 'جنين' },
  { id: 'gaza', nameAr: 'محافظات غزة', nameEn: 'Gaza', lat: 31.5017, lng: 34.4668, cityQuery: 'غزة, فلسطين', governorateKey: 'غزة' },
];

export const MinistryDirectoratesSearch: React.FC<MinistryDirectoratesSearchProps> = ({
  language
}) => {
  const isAr = language === 'ar';
  const { activeId } = useAudioSpeech();
  const [selectedPinId, setSelectedPinId] = useState<string>('hebron');

  const selectedPin = PALESTINE_MAP_PINS.find(p => p.id === selectedPinId) || PALESTINE_MAP_PINS[0];

  const activeDirectorate = DIRECTORATES_SEARCH_DATA.find(d => {
    return d.governorate.ar.includes(selectedPin.governorateKey) || d.name.ar.includes(selectedPin.governorateKey);
  }) || DIRECTORATES_SEARCH_DATA[0];

  // Exact Google Maps embed URL centered precisely on the selected city's coordinates
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${selectedPin.lat},${selectedPin.lng}&hl=${isAr ? 'ar' : 'en'}&z=14&t=m&ie=UTF8&iwloc=B&output=embed`;
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${selectedPin.lat},${selectedPin.lng}`;

  const headerSpeechText = isAr
    ? 'ابحث عن أقرب مديرية لوزارة التنمية الاجتماعية. انقر على اسم أي مدينة كالخليل، رام الله، أو نابلس لتنتقل الخريطة مباشرة وفوراً إلى موقعها الدقيق والاتصال بالمديرية.'
    : 'Find Your Nearest MoSD Directorate. Click any city to navigate Google Maps directly to its exact location and phone.';

  const activeOfficeSpeech = `${activeDirectorate.name[language]}. ${isAr ? 'رقم الهاتف الرسمي المعتمد للتواصل المباشر هو:' : 'Official phone number is:'} ${activeDirectorate.phone}. ${isAr ? 'الرقم المجاني الموحد للاستفسارات والشكاوى هو 189.' : 'Unified hotline is 189.'}`;

  const directoratesAudioItems = [
    { id: 'directorates-header', text: headerSpeechText, title: isAr ? 'مقدمة خريطة المديريات' : 'Directorates Header' },
    { id: 'directorates-active-card', text: activeOfficeSpeech, title: activeDirectorate.name[language] }
  ];

  return (
    <section id="directorates" className="scroll-mt-24 py-16 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 rounded-3xl transition-all ${
          activeId === 'directorates-header' ? 'bg-[#694E91]/10 ring-2 ring-[#694E91]/30' : ''
        }`}>
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E1B24]/10 text-[#8E1B24] text-xs font-black">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'الخريطة الميدانية المعتمدة عبر Google Maps' : 'Official MoSD Google Maps Directory'}</span>
              </div>
              <ListenToPageButton items={directoratesAudioItems} label={isAr ? 'استمع للمعلومات' : 'Listen'} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isAr ? 'ابحث عن أقرب مديرية لوزارة التنمية الاجتماعية' : 'Find Your Nearest MoSD Directorate'}
              </h2>
              <SpeakButton 
                id="directorates-header" 
                text={headerSpeechText} 
                title={isAr ? 'استمع لتعليمات المديريات' : 'Listen to instructions'} 
              />
            </div>

            <p className="text-slate-600 text-xs sm:text-sm font-medium">
              {isAr 
                ? 'انقر على اسم أي مدينة (كالخليل، رام الله، نابلس...) لتنتقل الخريطة مباشرة وفوراً إلى موقعها الدقيق.' 
                : 'Click any city (e.g. Hebron, Ramallah, Nablus) to instantly navigate Google Maps directly to its exact location.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Google Maps link */}
            <a
              href={googleMapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#EADFD5] text-slate-800 hover:border-[#8E1B24] transition-all font-bold text-xs shadow-2xs"
            >
              <MapIcon className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? `فتح ${selectedPin.nameAr} في Google Maps` : `Open ${selectedPin.nameEn} in Google Maps`}</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Official MoSD Portal Link */}
            <a
              href="https://www.mosd.gov.ps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E1B28] text-white hover:bg-[#B3202E] transition-all font-bold text-xs shadow-2xs border border-[#E4D7FC]/30"
            >
              <Globe className="w-4 h-4 text-[#E4D7FC]" />
              <span>www.mosd.gov.ps</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* Interactive Map & Details Split Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Google Map Interactive Frame */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-[#EADFD5] shadow-xs space-y-4 max-w-full overflow-hidden">
            
            {/* City Selection Bar at top of map */}
            <div className="space-y-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-[#9E1B28]" />
                  <span>{isAr ? 'اضغط على المدينة للانتقال إليها على الخريطة مباشرة:' : 'Click city to jump on Google Maps:'}</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {isAr ? `الخريطة تعرض: ${selectedPin.nameAr}` : `Viewing: ${selectedPin.nameEn}`}
                </span>
              </div>

              {/* City Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {PALESTINE_MAP_PINS.map((pin) => {
                  const isSelected = selectedPinId === pin.id;
                  return (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedPinId(pin.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isSelected
                          ? 'bg-[#8E1B24] text-white shadow-md ring-2 ring-[#8E1B24]/40 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 hover:border-[#8E1B24]/40'
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span>{isAr ? pin.nameAr : pin.nameEn}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LIVE GOOGLE MAPS EMBED - Remounts on selectedPinId change to jump directly to city */}
            <div className="relative w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-[#D8C9B8] shadow-inner bg-slate-100">
              <iframe
                key={selectedPin.id}
                title={isAr ? selectedPin.nameAr : selectedPin.nameEn}
                src={googleMapsEmbedUrl}
                className="w-full h-full border-0"
                loading="eager"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating city indicator over map */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 shadow-md flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isAr ? `موقع ${selectedPin.nameAr} في Google Maps` : `${selectedPin.nameEn} on Google Maps`}</span>
              </div>

              {/* Bottom Info Ribbon */}
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-900/90 text-white backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1.5 pointer-events-auto">
                  <span className="text-slate-400">{isAr ? 'الإحداثيات:' : 'Coords:'}</span>
                  <span className="font-mono text-emerald-400">{selectedPin.lat}, {selectedPin.lng}</span>
                </div>

                <a
                  href={googleMapsExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#8E1B24] text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-md hover:bg-[#A3202A] flex items-center gap-1.5 transition-all pointer-events-auto"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح في تطبيق الخرائط' : 'Open in Maps App'}</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Active Directorate Detailed Information Card */}
          <div className="lg:col-span-5 space-y-6 max-w-full">
            
            <div className="bg-white rounded-3xl border-2 border-[#8E1B24]/20 p-6 sm:p-7 shadow-md space-y-6">
              
              {/* Badge & Gov Title */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-[#8E1B24]/10 text-[#8E1B24] px-3 py-1 rounded-full">
                    {activeDirectorate.governorate[language]}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {activeDirectorate.type === 'mosd_directorate' ? (isAr ? 'مديرية حكومية رسمية' : 'Official MoSD Office') : (isAr ? 'مكتب تنسيق مشترك' : 'Joint Coordination Desk')}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[#8E1B24] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              {/* Office Name */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {activeDirectorate.name[language]}
                  </h3>
                  <SpeakButton
                    id="directorates-active-card"
                    text={activeOfficeSpeech}
                    title={isAr ? `استمع لمعلومات ${activeDirectorate.name[language]}` : `Listen to ${activeDirectorate.name[language]}`}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {isAr ? 'الجهة الرسمية المسؤولة عن برامج الحماية، إدارة الحالة، والمساعدات التمكينية' : 'Official entity for social safety net, case triage, and family empowerment'}
                </p>
              </div>

              {/* Details List (Address Block REMOVED as requested by user) */}
              <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">

                {/* Telephone from Official MoSD Poster */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border-2 border-[#8E1B24]/20 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-black text-slate-900 block mb-1 text-xs">
                      {isAr ? 'رقم الهاتف الرسمي للتواصل المباشر:' : 'Official Direct Telephone Number:'}
                    </span>
                    <a 
                      href={`tel:${activeDirectorate.phone.replace(/[^0-9]/g, '')}`} 
                      className="font-mono font-black text-base sm:text-lg text-[#8E1B24] hover:underline dir-ltr text-right rtl:text-right block tracking-wider"
                    >
                      {activeDirectorate.phone}
                    </a>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                      {isAr ? 'انقر للاتصال المباشر بالمديرية' : 'Tap to call field office directly'}
                    </span>
                  </div>
                </div>

                {/* Official Complaints & Inquiries Hotline: 189 (From MoSD Poster) */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 text-white shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block">
                        {isAr ? 'للاستفسارات والشكاوى (الرقم المجاني الموحد):' : 'Inquiries & Complaints Toll-Free:'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {isAr ? 'وزارة التنمية الاجتماعية' : 'Ministry of Social Development'}
                      </span>
                    </div>
                  </div>
                  <a
                    href="tel:189"
                    className="font-mono text-xl font-black text-emerald-400 tracking-widest px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all dir-ltr"
                  >
                    189
                  </a>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">{isAr ? 'ساعات الدوام:' : 'Hours:'} </span>
                    <span>{activeDirectorate.hours[language]}</span>
                  </div>
                </div>

              </div>

              {/* Links & CTA Bar */}
              <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
                <a
                  href={`tel:${activeDirectorate.phone.replace(/[^0-9]/g, '')}`}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#8E1B24] hover:bg-[#911D29] text-white font-black text-xs text-center shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>{isAr ? `اتصال بالمديرية (${activeDirectorate.phone})` : `Call (${activeDirectorate.phone})`}</span>
                </a>

                <a
                  href={googleMapsExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs text-center flex items-center justify-center gap-1.5"
                >
                  <MapIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'موقع Google Maps' : 'Google Maps'}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
