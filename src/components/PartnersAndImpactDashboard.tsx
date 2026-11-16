import React, { useState } from 'react';
import { Language } from '../types';
import { filterImpactMetrics, ImpactFilters } from '../utils/statistics';
import { 
  Building, 
  Handshake, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  Mail, 
  Sparkles,
  Briefcase
} from 'lucide-react';

interface PartnersAndImpactDashboardProps {
  language: Language;
}

export const PartnersAndImpactDashboard: React.FC<PartnersAndImpactDashboardProps> = ({
  language
}) => {
  const isAr = language === 'ar';

  const [filters, setFilters] = useState<ImpactFilters>({
    region: 'all',
    timeframe: 'all_time'
  });

  const [contactPartnerModal, setContactPartnerModal] = useState(false);
  const [partnerMessageSent, setPartnerMessageSent] = useState(false);

  const metrics = filterImpactMetrics(filters);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerMessageSent(true);
    setTimeout(() => {
      setPartnerMessageSent(false);
      setContactPartnerModal(false);
    }, 2500);
  };

  return (
    <section id="partners" className="scroll-mt-24 py-20 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Donor & Partner Callout Banner */}
        <div className="bg-[#7A1822] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-8 items-center relative">
            <div className="lg:col-span-8 space-y-4 text-left rtl:text-right">
              <span className="text-xs font-black uppercase tracking-widest text-[#E4D7FC] bg-white/10 px-3.5 py-1 rounded-full inline-block border border-[#E4D7FC]/30">
                {isAr ? 'للشركاء والممولين والمنظمات الدولية' : 'For International Donors & Institutional Partners'}
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {isAr ? 'ساهم في توسيع أثر الحماية والتمكين' : 'Partner with Us to Expand Family Impact'}
              </h2>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium max-w-2xl">
                {isAr 
                  ? 'ندعو المؤسسات والجهات المانحة والشركاء إلى دعم برامج الحماية والتمكين الموجهة لمرضى الثلاسيميا وأسرهم، لنحول الدعم الطارئ إلى استدامة واستقلال اقتصادي حقيقي.' 
                  : 'We invite multilateral donors, philanthropic foundations, and private partners to co-fund family safety nets, psychosocial centers, and micro-livelihood grants.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setContactPartnerModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#634B8F] hover:bg-[#523D77] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors border border-[#E4D7FC]/40"
                >
                  <Handshake className="w-4 h-4 text-[#E4D7FC]" />
                  <span>{isAr ? 'فرص الشراكة والتمويل' : 'Partnership Opportunities'}</span>
                </button>

                <button
                  onClick={() => setContactPartnerModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors"
                >
                  <span>{isAr ? 'تواصل معنا' : 'Contact Partnership Desk'}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 rounded-2xl p-6 border border-white/10 space-y-3 text-xs">
              <span className="font-black text-[#E4D7FC] block text-xs uppercase">
                {isAr ? 'مجالات الاستثمار المجتمعي ذات الأثر العالي:' : 'High-Impact Investment Windows:'}
              </span>
              <ul className="space-y-2 text-white/90 list-disc list-inside">
                <li>{isAr ? 'صندوق منح المشاريع الصغيرة للمرضى البالغين' : 'Micro-Enterprise Seed Grants for Adult Patients'}</li>
                <li>{isAr ? 'تغطية بدلات تنقل جلسات نقل الدم للأسر الريفية' : 'Transfusion Travel Subsidies for Remote Villages'}</li>
                <li>{isAr ? 'توسيع دوائر الدعم النفسي والإرشاد الأسري' : 'Expanding Psychosocial & Caregiver Circles'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Impact Dashboard (Dual-Face Feature) */}
        <div className="bg-white rounded-3xl border border-[#EADFD5] p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#F1ECE6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isAr ? 'لوحة قياس الأثر والتحويلات الاجتماعية' : 'Live Impact & Social Protection Dashboard'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {isAr 
                  ? 'مؤشرات أداء متقدمة تتيح للممول والباحث تتبع مسار الحالات والخدمات في المحافظات.' 
                  : 'Advanced metrics allowing partners to inspect verified case throughput across Palestine.'}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Region filter */}
              <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#EADFD5] text-xs font-bold">
                <button
                  onClick={() => setFilters({ ...filters, region: 'all' })}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filters.region === 'all' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'كل فلسطين' : 'All Palestine'}
                </button>
                <button
                  onClick={() => setFilters({ ...filters, region: 'west_bank' })}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filters.region === 'west_bank' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'الضفة' : 'West Bank'}
                </button>
                <button
                  onClick={() => setFilters({ ...filters, region: 'gaza' })}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filters.region === 'gaza' ? 'bg-[#7A1822] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isAr ? 'غزة' : 'Gaza'}
                </button>
              </div>

              {/* Timeframe filter */}
              <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#EADFD5] text-xs font-bold">
                <button
                  onClick={() => setFilters({ ...filters, timeframe: 'this_month' })}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filters.timeframe === 'this_month' ? 'bg-[#1E293B] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {isAr ? 'هذا الشهر' : 'This Month'}
                </button>
                <button
                  onClick={() => setFilters({ ...filters, timeframe: 'this_year' })}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filters.timeframe === 'this_year' ? 'bg-[#1E293B] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {isAr ? '٢٠٢٦' : '2026'}
                </button>
                <button
                  onClick={() => setFilters({ ...filters, timeframe: 'all_time' })}
                  className={`px-2.5 py-1.5 rounded-lg transition-all ${
                    filters.timeframe === 'all_time' ? 'bg-[#1E293B] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {isAr ? 'الإجمالي' : 'All Time'}
                </button>
              </div>
            </div>
          </div>

          {/* 5 Live Impact Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFD5] space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                {isAr ? 'طلبات الدعم المسجلة' : 'Support Requests'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {metrics.supportRequests}
              </div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {isAr ? 'أسر باشرت المسار' : 'Families Initiated'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFD5] space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                {isAr ? 'حالات تم تقييمها' : 'Cases Assessed'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {metrics.assessmentsCompleted}
              </div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {isAr ? 'مسح اجتماعي ميداني' : 'Field Assessments'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFD5] space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                {isAr ? 'حالات تمت إحالتها' : 'Referrals Delivered'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#7A1822]">
                {metrics.referralsDelivered}
              </div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {isAr ? 'مسار إحالة ناجح' : 'Active Referrals'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADFD5] space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                {isAr ? 'مستفيدون حصلوا على خدمة' : 'Active Services'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#2E6F56]">
                {metrics.activeServices}
              </div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {isAr ? 'مساعدات وبدلات وإرشاد' : 'Direct Services'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5EFFC] border border-[#DDD6FE] space-y-1">
              <span className="text-[10px] font-black uppercase text-[#4A326E] block">
                {isAr ? 'مشاريع تمكين اقتصادي' : 'Livelihood Projects'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#2A1747]">
                {metrics.economicEmpowermentProjects}
              </div>
              <span className="text-[11px] font-bold text-[#634B8F] block">
                {isAr ? 'من المساعدة إلى الإنتاج' : 'Self-Reliant Units'}
              </span>
            </div>

          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400 font-medium italic">
              {isAr 
                ? 'ملاحظة: البيانات مرتبطة بمنظومة السجل الاجتماعي المشترك لضمان الشفافية وموثوقية الأثر.' 
                : 'Note: Metrics reflect integrated social registry outcomes to ensure transparent donor reporting.'}
            </span>
          </div>

        </div>

        {/* Contact Partner Modal */}
        {contactPartnerModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">
                  {isAr ? 'تواصل مع مكتب الشراكات والمشاريع' : 'Institutional Partnership Inquiry'}
                </h3>
                <button
                  onClick={() => setContactPartnerModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              {partnerMessageSent ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-950 text-sm">
                    {isAr ? 'شكراً لاهتمامكم! تم استلام رسالتكم بنجاح' : 'Thank You! Message Successfully Received'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {isAr ? 'سيتواصل معكم منسق العلاقات الدولية والمشاريع بالوزارة والجمعية.' : 'Our international cooperation directorate will reach out promptly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {isAr ? 'اسم المؤسسة / الجهة المانحة:' : 'Organization / Donor Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: الوكالة الإيطالية / صندوق التنمية' : 'e.g. Development Agency / Philanthropy'}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#7A1822] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {isAr ? 'البريد الإلكتروني الرسمي:' : 'Official Email:'}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="partner@organization.org"
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#7A1822] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      {isAr ? 'مجال الاهتمام بالشراكة:' : 'Area of Partnership Interest:'}
                    </label>
                    <select className="w-full p-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#7A1822] outline-hidden">
                      <option>{isAr ? 'تمويل منح التمكين الاقتصادي والمشاريع الصغيرة' : 'Funding Micro-Enterprise Livelihood Grants'}</option>
                      <option>{isAr ? 'كفالة بدلات تنقل جلسات نقل الدم للمحافظات البعيدة' : 'Sponsoring Blood Transfusion Travel Allowances'}</option>
                      <option>{isAr ? 'تطوير مراكز الدعم النفسي والإرشاد الأسري' : 'Upgrading Psychosocial Family Centers'}</option>
                      <option>{isAr ? 'دعم برامج التدخل الطارئ في قطاع غزة' : 'Emergency Thalassemia Relief in Gaza'}</option>
                    </select>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setContactPartnerModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#7A1822] text-white font-black hover:bg-[#B9232E] transition-colors"
                    >
                      {isAr ? 'إرسال الاستفسار' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
