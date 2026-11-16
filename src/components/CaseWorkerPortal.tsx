import React from 'react';
import { Language, SupportRequest, CaseStatus } from '../types';
import { getStatusDetails, STATUS_SEQUENCE, isValidTransition } from '../utils/caseManagement';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Filter, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Calendar, 
  MessageSquare, 
  Building2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Phone,
  Clock
} from 'lucide-react';

interface CaseWorkerPortalProps {
  language: Language;
  cases: SupportRequest[];
  onUpdateCaseStatus: (caseId: string, newStatus: CaseStatus, note: string, officerName?: string) => void;
  onClosePortal: () => void;
}

export const CaseWorkerPortal: React.FC<CaseWorkerPortalProps> = ({
  language,
  cases,
  onUpdateCaseStatus,
  onClosePortal
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedCaseId, setSelectedCaseId] = React.useState<string>(cases[0]?.id || '');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  
  // Edit modal / action state
  const [newStatusInput, setNewStatusInput] = React.useState<CaseStatus>('under_assessment');
  const [statusNoteInput, setStatusNoteInput] = React.useState<string>('');
  const [officerNameInput, setOfficerNameInput] = React.useState<string>('');

  const selectedCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  React.useEffect(() => {
    if (selectedCase) {
      setNewStatusInput(selectedCase.status);
      setOfficerNameInput(selectedCase.assignedOfficer || '');
    }
  }, [selectedCase]);

  const filteredCases = cases.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchesStatus;

    return matchesStatus && (
      c.trackingCode.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.governorate.toLowerCase().includes(q) ||
      c.locality.toLowerCase().includes(q)
    );
  });

  const handleApplyStatusChange = () => {
    if (!selectedCase) return;
    const noteText = statusNoteInput.trim() || (isAr ? 'تحديث مرحلة الحالة في السجل المشترك.' : 'Case milestone updated in joint registry.');
    onUpdateCaseStatus(selectedCase.id, newStatusInput, noteText, officerNameInput.trim());
    setStatusNoteInput('');
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Worker Bar */}
        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#634B8F]/30 text-[#E4D7FC] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white">
                  {isAr ? 'بوابة إدارة الحالة والتقييم المشترك' : 'Joint Case Management & Intake Portal'}
                </h1>
                <span className="text-[10px] bg-[#634B8F] text-white font-black px-2.5 py-0.5 rounded-full uppercase border border-[#E4D7FC]/40">
                  {isAr ? 'لوحة الأخصائي' : 'Staff Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'وزارة التنمية الاجتماعية & جمعية أصدقاء مرضى الثلاسيميا | فرز الحالات، تقييم الاحتياجات، ومتابعة الإحالة' 
                  : 'MoSD & TPFS Joint Committee | Triage intakes, schedule assessments, and deliver referrals'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClosePortal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>{isAr ? 'العودة للبوابة العامة للأسرة' : 'Back to Family Portal'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'البحث برمز المتابعة، اسم الأسرة، أو المحافظة...' : 'Search by tracking code, family name, or governorate...'}
              className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden"
            >
              <option value="all">{isAr ? 'كافة مراحل الحالات' : 'All Case Statuses'}</option>
              <option value="submitted">{isAr ? 'طلبات جديدة (مستلمة)' : 'Submitted (New)'}</option>
              <option value="under_assessment">{isAr ? 'قيد التقييم الاجتماعي' : 'Under Assessment'}</option>
              <option value="plan_approved">{isAr ? 'خطط معتمدة' : 'Plan Approved'}</option>
              <option value="referred_to_service">{isAr ? 'محالة للخدمات' : 'Referred to Services'}</option>
              <option value="service_active">{isAr ? 'استلام خدمة نشط' : 'Active Service Delivery'}</option>
              <option value="in_followup">{isAr ? 'متابعة دورية' : 'In Follow-up'}</option>
            </select>
          </div>
        </div>

        {/* Main 2-Column Worker View */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Cases List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-800 rounded-2xl border border-slate-700 p-4 space-y-3 max-h-[750px] overflow-y-auto">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-700 text-xs font-bold text-slate-400">
              <span>{isAr ? 'قائمة الحالات المسجلة' : 'Registered Case Intakes'}</span>
              <span>{filteredCases.length} {isAr ? 'حالة' : 'Cases'}</span>
            </div>

            {filteredCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {isAr ? 'لا توجد حالات تطابق البحث المحدد.' : 'No cases match your filters.'}
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                const statusInfo = getStatusDetails(c.status, language);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full text-left rtl:text-right p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-700 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#E4D7FC] tracking-wider">
                        {c.trackingCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                        {statusInfo.title}
                      </span>
                    </div>

                    <div className="font-bold text-sm text-white line-clamp-1">
                      {c.fullName}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{c.governorate} — {c.locality}</span>
                      <span className="text-emerald-400 font-semibold">{c.primaryNeed.replace('_', ' ')}</span>
                    </div>

                    {c.urgencyLevel === 'immediate_crisis' || c.urgencyLevel === 'urgent' ? (
                      <div className="inline-flex items-center gap-1 text-[10px] text-rose-300 font-bold">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>{isAr ? 'أولوية عاجلة' : 'Urgent Priority'}</span>
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Case Details & Status Action Form (7 cols) */}
          {selectedCase ? (
            <div className="lg:col-span-7 bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-6">
              
              {/* Selected Case Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#E4D7FC] tracking-wider">
                      {selectedCase.trackingCode}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(selectedCase.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {selectedCase.fullName}
                  </h2>
                </div>

                <div className="text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
                  <span className="text-slate-500 block text-[10px]">{isAr ? 'وسيلة التواصل المفضلة:' : 'Contact Channel:'}</span>
                  <span className="font-bold text-emerald-400 capitalize">{selectedCase.preferredContact} ({selectedCase.phone})</span>
                </div>
              </div>

              {/* Case Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">{isAr ? 'المحافظة والمنطقة:' : 'Governorate & Locality:'}</span>
                  <span className="font-bold text-white">{selectedCase.governorate} — {selectedCase.locality}</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">{isAr ? 'عمر المريض وصفة المتقدم:' : 'Age & Relationship:'}</span>
                  <span className="font-bold text-white">{selectedCase.patientAge} {isAr ? 'سنة' : 'yrs'} ({selectedCase.applicantRole})</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-0.5">{isAr ? 'الاحتياج الأساسي:' : 'Primary Need:'}</span>
                  <span className="font-bold text-emerald-400">{selectedCase.primaryNeed}</span>
                </div>
              </div>

              {/* Family Notes */}
              {selectedCase.notes && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 text-xs sm:text-sm text-slate-300 space-y-1">
                  <span className="font-bold text-slate-400 block text-[11px] uppercase">
                    {isAr ? 'ملاحظات وظروف الأسرة المسجلة:' : 'Family Circumstances / Intake Notes:'}
                  </span>
                  <p className="leading-relaxed">{selectedCase.notes}</p>
                </div>
              )}

              {/* Status Update & Case Progression Controls */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                  <span>{isAr ? 'تحديث مرحلة التدخل وإدارة الحالة' : 'Advance Case Intervention Stage'}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'المرحلة التالية للملف:' : 'Transition to Stage:'}
                    </label>
                    <select
                      value={newStatusInput}
                      onChange={(e) => setNewStatusInput(e.target.value as CaseStatus)}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    >
                      <option value="submitted">{isAr ? 'استلام الطلب (طلب جديد)' : 'Request Received (New)'}</option>
                      <option value="under_assessment">{isAr ? 'التقييم الاجتماعي قيد التنفيذ' : 'Needs Assessment Underway'}</option>
                      <option value="plan_approved">{isAr ? 'اعتماد خطة الدعم الأسري' : 'Family Support Plan Approved'}</option>
                      <option value="referred_to_service">{isAr ? 'تمت الإحالة للجهة الشريكة' : 'Referred to Partner Services'}</option>
                      <option value="service_active">{isAr ? 'استلام الخدمة (نشط ومفعل)' : 'Active Service Delivery'}</option>
                      <option value="in_followup">{isAr ? 'متابعة دورية مستمرة' : 'Ongoing Follow-up'}</option>
                      <option value="completed">{isAr ? 'اكتمل التدخل بنجاح' : 'Empowered / Completed'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">
                      {isAr ? 'الأخصائي الاجتماعي المكلّف:' : 'Assigned Case Worker:'}
                    </label>
                    <input
                      type="text"
                      value={officerNameInput}
                      onChange={(e) => setOfficerNameInput(e.target.value)}
                      placeholder={isAr ? 'اسم الأخصائي / منسق الحالة' : 'Officer / Counselor Name'}
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {isAr ? 'إضافة تقرير تقييم / ملاحظة متابعة:' : 'Log Assessment Finding / Casework Note:'}
                  </label>
                  <input
                    type="text"
                    value={statusNoteInput}
                    onChange={(e) => setStatusNoteInput(e.target.value)}
                    placeholder={isAr ? 'مثال: تم إجراء الزيارة المنزلية والتأكد من استحقاق بدل المواصلات...' : 'e.g. Conducted home assessment visit, approved hospital travel allowance...'}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs text-white focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleApplyStatusChange}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'حفظ التحديث وتوثيق الإجراء' : 'Save Update & Log Action'}</span>
                  </button>
                </div>
              </div>

              {/* Timeline of History */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {isAr ? 'السجل التراكمي للملف:' : 'Cumulative Case History:'}
                </span>
                <div className="space-y-2 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-700 pl-4 rtl:pl-0 rtl:pr-4">
                  {selectedCase.statusHistory.map((h, i) => (
                    <div key={i} className="text-xs text-slate-300">
                      <span className="font-mono text-slate-500 block text-[10px]">
                        {new Date(h.timestamp).toLocaleString()}
                      </span>
                      <span className="font-medium text-slate-200">{h.note[language]}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : null}

        </div>

      </div>
    </div>
  );
};
