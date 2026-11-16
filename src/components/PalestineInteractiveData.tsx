import React, { useState } from 'react';
import { Language } from '../types';
import { PALESTINE_GOVERNORATES_DATA, PalestineRegionalData } from '../utils/statistics';
import { MapPin, Building2, Hospital, Users, Search, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';

interface PalestineInteractiveDataProps {
  language: Language;
  onSelectGovernorateForRequest: (govName: string) => void;
}

export const PalestineInteractiveData: React.FC<PalestineInteractiveDataProps> = ({
  language,
  onSelectGovernorateForRequest
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedGovId, setSelectedGovId] = useState<string>('nablus');
  const [regionFilter, setRegionFilter] = useState<'all' | 'west_bank' | 'gaza'>('all');

  const selectedData = PALESTINE_GOVERNORATES_DATA.find(g => g.id === selectedGovId) || PALESTINE_GOVERNORATES_DATA[0];

  const filteredGovernorates = PALESTINE_GOVERNORATES_DATA.filter(g => {
    if (regionFilter === 'all') return true;
    return g.region === regionFilter;
  });

  return (
    <section id="palestine-data" className="scroll-mt-24 py-16 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
              <MapPin className="w-3.5 h-3.5" />
              <span>{isAr ? 'الخريطة التفاعلية للمحافظات' : 'Interactive Regional Data'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isAr ? 'الثلاسيميا بالأرقام في فلسطين' : 'Thalassemia by the Numbers in Palestine'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              {isAr 
                ? 'استكشف عدد المرضى المسجلين والمستشفيات المرجعية والمديريات المساندة في كل محافظة.' 
                : 'Explore registered patient concentrations, referral hospitals, and support directorates across governorates.'}
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex bg-[#EFE8E0] p-1 rounded-xl">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                regionFilter === 'all' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {isAr ? 'كافة المحافظات' : 'All Palestine'}
            </button>
            <button
              onClick={() => setRegionFilter('west_bank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                regionFilter === 'west_bank' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {isAr ? 'الضفة الغربية (٥٦٧)' : 'West Bank (567)'}
            </button>
            <button
              onClick={() => setRegionFilter('gaza')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                regionFilter === 'gaza' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {isAr ? 'قطاع غزة (٢٨٧)' : 'Gaza Strip (287)'}
            </button>
          </div>
        </div>

        {/* 2-Column Interactive Explorer */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: Governorates List with counts (7 cols) */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredGovernorates.map((gov) => {
              const isSelected = gov.id === selectedGovId;
              return (
                <button
                  key={gov.id}
                  onClick={() => setSelectedGovId(gov.id)}
                  onMouseEnter={() => setSelectedGovId(gov.id)}
                  className={`p-4 rounded-xl border text-left rtl:text-right transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#7A1822] text-white border-[#7A1822] shadow-md ring-2 ring-[#7A1822]/30'
                      : 'bg-white border-[#EADFD5] hover:border-[#7A1822]/50 text-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase block ${
                      isSelected ? 'text-[#E4D7FC]' : 'text-slate-400'
                    }`}>
                      {gov.region === 'west_bank' ? (isAr ? 'الضفة الغربية' : 'West Bank') : (isAr ? 'قطاع غزة' : 'Gaza')}
                    </span>
                    <span className={`font-black text-sm block ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#7A1822]'
                    }`}>
                      {gov.name[language]}
                    </span>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className={`text-xl font-black block tracking-tight ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}>
                      {gov.registeredCount}
                    </span>
                    <span className={`text-[10px] font-bold block ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {isAr ? 'مريض مسجل' : 'Patients'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Highlight Inspector Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EADFD5] p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
            
            {/* Top Badge */}
            <div className="flex items-center justify-between border-b border-[#F1ECE6] pb-4">
              <div>
                <span className="text-xs font-black text-[#7A1822] uppercase tracking-wider block">
                  {selectedData.region === 'west_bank' ? (isAr ? 'محافظات الضفة الغربية' : 'West Bank Region') : (isAr ? 'محافظات قطاع غزة' : 'Gaza Region')}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedData.name[language]}
                </h3>
              </div>

              <div className="text-right rtl:text-left bg-[#7A1822]/10 px-4 py-2 rounded-xl">
                <span className="text-2xl sm:text-3xl font-black text-[#7A1822] block leading-none">
                  {selectedData.registeredCount}
                </span>
                <span className="text-[10px] font-black text-slate-600 block mt-1">
                  {selectedData.percentageOfTotal}% {isAr ? 'من إجمالي فلسطين' : 'of Total'}
                </span>
              </div>
            </div>

            {/* Referral & Institutional Anchors */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <Hospital className="w-4 h-4 text-[#7A1822]" />
                  <span>{isAr ? 'المستشفى المرجعي وأقسام نقل الدم:' : 'Referral Hospital / Blood Units:'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFD5] font-bold text-slate-900">
                  {selectedData.hospitalRef[language]}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <Building2 className="w-4 h-4 text-[#2E6F56]" />
                  <span>{isAr ? 'مديرية التنمية الاجتماعية المختصة:' : 'Competent MoSD Directorate:'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFD5] font-bold text-slate-900">
                  {selectedData.mosdDirectorate[language]}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-500">
                  <Users className="w-4 h-4 text-[#7A1822]" />
                  <span>{isAr ? 'مركز وتنسيق جمعية الثلاسيميا:' : 'TPFS Center / Coordination Hub:'}</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EADFD5] font-bold text-slate-900">
                  {selectedData.tpfsCenter[language]}
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onSelectGovernorateForRequest(selectedData.name.ar)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#7A1822] hover:bg-[#B9232E] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>{isAr ? `ابدأ طلب دعم في ${selectedData.name.ar}` : `Request Support in ${selectedData.name.en}`}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
