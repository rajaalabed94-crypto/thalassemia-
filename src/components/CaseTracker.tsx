import React, { useState, useEffect } from 'react';
import { Language, SupportRequest, CaseStatus } from '../types';
import { getStatusDetails, STATUS_SEQUENCE } from '../utils/caseManagement';
import { 
  Search, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface CaseTrackerProps {
  language: Language;
  cases: SupportRequest[];
  currentTrackedCode: string;
  onCodeChange: (code: string) => void;
  onRequestReassessment: (caseId: string, noteText: string) => void;
}

export const CaseTracker: React.FC<CaseTrackerProps> = ({
  language,
  cases,
  currentTrackedCode,
  onCodeChange,
  onRequestReassessment
}) => {
  const isAr = language === 'ar';
  const [searchInput, setSearchInput] = useState(currentTrackedCode || '');
  const [reassessmentNote, setReassessmentNote] = useState('');
  const [showReassessmentModal, setShowReassessmentModal] = useState(false);
  const [reassessmentSuccess, setReassessmentSuccess] = useState(false);

  useEffect(() => {
    if (currentTrackedCode) {
      setSearchInput(currentTrackedCode);
    }
  }, [currentTrackedCode]);

  const matchedCase = cases.find(
    c => c.trackingCode.toUpperCase().trim() === searchInput.toUpperCase().trim()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onCodeChange(searchInput.trim().toUpperCase());
    }
  };

  const handleSendReassessment = () => {
    if (matchedCase && reassessmentNote.trim()) {
      onRequestReassessment(matchedCase.id, reassessmentNote.trim());
      setReassessmentNote('');
      setShowReassessmentModal(false);
      setReassessmentSuccess(true);
      setTimeout(() => setReassessmentSuccess(false), 4000);
    }
  };

  const currentStatusInfo = matchedCase ? getStatusDetails(matchedCase.status, language) : null;
  const currentStatusIdx = matchedCase ? STATUS_SEQUENCE.indexOf(matchedCase.status) : -1;

  const timelineSteps = [
    { key: 'submitted', label: { en: 'Received', ar: 'تم الاستلام' } },
    { key: 'under_review', label: { en: 'Under Review', ar: 'قيد المراجعة' } },
    { key: 'under_assessment', label: { en: 'Assessment', ar: 'تقييم الحالة' } },
    { key: 'referred_to_service', label: { en: 'Referred', ar: 'تمت الإحالة' } },
    { key: 'service_active', label: { en: 'In Progress', ar: 'الخدمة قيد التنفيذ' } },
    { key: 'service_delivered', label: { en: 'Delivered', ar: 'تم تقديم الخدمة' } },
    { key: 'in_followup', label: { en: 'Follow-up', ar: 'متابعة دورية' } },
  ];

  return (
    <section id="track" className="scroll-mt-24 py-16 bg-[#F5EFE8] border-b border-[#E3D6C9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1822]/10 text-[#7A1822] text-xs font-black">
            <Search className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسار الخدمة والمتابعة المستمرة' : 'Case Service Experience & Live Tracker'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isAr ? 'تابع طلبك' : 'Track Your Support Case'}
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            {isAr 
              ? 'أدخل رقم الحالة الخاص بك للاطلاع على مراحل التقييم، وتحديثات الأخصائي، وموعد استلام الخدمة.' 
              : 'Enter your Case ID to inspect assessment progress, caseworker updates, and service delivery.'}
          </p>
        </div>

        {/* Input Bar */}
        <div className="bg-white rounded-2xl border border-[#E3D6C9] p-5 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder={isAr ? 'أدخل رقم الحالة (مثال: THAL-2026-00482)' : 'Enter Case ID (e.g., THAL-2026-00482)'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm tracking-wider uppercase focus:ring-2 focus:ring-[#7A1822] outline-hidden bg-[#FAF8F5]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#7A1822] hover:bg-[#B9232E] text-white font-black text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Search className="w-4 h-4" />
              <span>{isAr ? 'استعلام' : 'Track Case'}</span>
            </button>
          </form>

          {/* Quick active samples */}
          <div className="mt-3 pt-3 border-t border-[#F1ECE6] flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-bold">
              {isAr ? 'أرقام حالات تجريبية نشطة:' : 'Sample active demo IDs:'}
            </span>
            {cases.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchInput(c.trackingCode);
                  onCodeChange(c.trackingCode);
                }}
                className={`font-mono px-2 py-0.5 rounded-md border text-[11px] font-bold transition-all ${
                  searchInput === c.trackingCode
                    ? 'bg-[#7A1822] text-white border-[#7A1822]'
                    : 'bg-[#FAF8F5] border-[#E3D6C9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c.trackingCode}
              </button>
            ))}
          </div>
        </div>

        {reassessmentSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-black flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isAr ? 'تم تسجيل ملاحظتك بنجاح وإرسالها للأخصائي المسؤول!' : 'Your follow-up note was logged for the caseworker!'}</span>
          </div>
        )}

        {/* Case Results Display */}
        {matchedCase ? (
          <div className="bg-white rounded-3xl border border-[#E3D6C9] p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1ECE6]">
              <div className="flex items-start gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-[#FAF8F5] p-1.5 border border-[#E3D6C9] shadow-xs shrink-0 flex items-center justify-center">
                  <img 
                    src="/campaign-logo.jpg" 
                    alt="شعار الحملة" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#7A1822]">
                      {matchedCase.trackingCode}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${currentStatusInfo?.color}`}>
                      {currentStatusInfo?.title}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {matchedCase.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{matchedCase.governorate} — {matchedCase.locality}</span>
                    <span>•</span>
                    <span>{isAr ? `عمر المريض: ${matchedCase.patientAge} سنة` : `Patient: ${matchedCase.patientAge} yrs`}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E3D6C9] text-xs space-y-1 min-w-[200px]">
                <div className="flex items-center gap-1.5 font-black text-slate-900">
                  <User className="w-4 h-4 text-[#7A1822]" />
                  <span>{matchedCase.assignedOfficer || (isAr ? 'قيد التعيين' : 'Assigning')}</span>
                </div>
                <div className="text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1">{matchedCase.directorateOffice}</span>
                </div>
              </div>
            </div>

            {/* Current State Highlight */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E3D6C9] space-y-1">
              <span className="text-[11px] font-black text-[#7A1822] uppercase tracking-wider block">
                {isAr ? 'حالة ملفكم الحالية:' : 'Current Milestone:'}
              </span>
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {currentStatusInfo?.description}
              </p>
            </div>

            {/* 7-Step Animated Progress Stepper */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                {isAr ? 'مسار إدارة الحالة (الخط الزمني المعتمد):' : 'Case Management Timeline:'}
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {timelineSteps.map((st, idx) => {
                  const isPassed = currentStatusIdx >= idx;
                  const isCurrent = STATUS_SEQUENCE[currentStatusIdx] === st.key;
                  return (
                    <div
                      key={st.key}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-[#7A1822] text-white border-[#7A1822] shadow-sm'
                          : isPassed
                          ? 'bg-rose-50 text-[#7A1822] border-rose-200'
                          : 'bg-[#FAF8F5] text-slate-400 border-[#EADFD5]'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase mb-0.5 font-mono">
                        {isPassed && !isCurrent ? '✓' : `0${idx + 1}`}
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-black line-clamp-1">
                        {st.label[language]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action History Logs */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                {isAr ? 'سجل المتابعة والإجراءات:' : 'Case Action Logs:'}
              </h4>
              <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#E3D6C9] space-y-3 pl-4 rtl:pl-0 rtl:pr-4">
                {matchedCase.statusHistory.map((h, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {new Date(h.timestamp).toLocaleDateString()}
                    </span>
                    <p className="text-xs font-bold text-slate-800">{h.note[language]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reassessment Button */}
            <div className="pt-4 border-t border-[#F1ECE6] flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {isAr ? 'هل طرأ تغير في الوضع المعيشي أو الصحي للأسرة؟' : 'Has your family situation changed?'}
              </span>
              <button
                type="button"
                onClick={() => setShowReassessmentModal(true)}
                className="px-4 py-2 rounded-xl border border-[#7A1822] text-[#7A1822] hover:bg-[#7A1822]/5 text-xs font-black transition-colors"
              >
                {isAr ? 'طلب متابعة أو إعادة تقييم' : 'Request Follow-up Reassessment'}
              </button>
            </div>

          </div>
        ) : searchInput ? (
          <div className="bg-white rounded-2xl border border-[#E3D6C9] p-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#634B8F] mx-auto" />
            <h4 className="font-black text-slate-900 text-sm">
              {isAr ? 'لم يتم العثور على حالة بهذا الرقم' : 'No Case Found with This ID'}
            </h4>
            <p className="text-xs text-slate-500">
              {isAr ? 'يرجى التأكد من كتابة الرقم مثل: THAL-2026-00482' : 'Please check your Case ID syntax (e.g. THAL-2026-00482)'}
            </p>
          </div>
        ) : null}

        {/* Modal */}
        {showReassessmentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-base font-black text-slate-900">
                {isAr ? 'طلب متابعة وإعادة تقييم احتياجات' : 'Request Case Reassessment'}
              </h3>
              <textarea
                rows={4}
                value={reassessmentNote}
                onChange={(e) => setReassessmentNote(e.target.value)}
                placeholder={isAr ? 'اكتب ما طرأ على وضع الأسرة...' : 'Describe changes in family needs...'}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#7A1822] outline-hidden"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowReassessmentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleSendReassessment}
                  disabled={!reassessmentNote.trim()}
                  className="px-5 py-2 rounded-xl bg-[#7A1822] text-white text-xs font-black disabled:opacity-50"
                >
                  {isAr ? 'إرسال للملف' : 'Submit Note'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
