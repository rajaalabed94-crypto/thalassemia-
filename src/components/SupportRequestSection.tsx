import React, { useState, useRef } from 'react';
import { Language, ServiceCategory, SupportRequest } from '../types';
import { createNewRequest } from '../utils/caseManagement';
import { PALESTINE_GOVERNORATES_DATA } from '../utils/statistics';
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Send,
  AlertCircle,
  Clock
} from 'lucide-react';
import { SpeakButton, ListenToPageButton, useAudioSpeech } from '../context/AudioSpeechContext';

interface SupportRequestSectionProps {
  language: Language;
  prefilledNeed?: ServiceCategory | null;
  prefilledGovernorate?: string | null;
  onSubmitSuccess: (newRequest: SupportRequest) => void;
  onNavigateToDirectorates: () => void;
}

export const SupportRequestSection: React.FC<SupportRequestSectionProps> = ({
  language,
  prefilledNeed,
  prefilledGovernorate,
  onSubmitSuccess,
  onNavigateToDirectorates
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { activeId } = useAudioSpeech();

  // Basic essential form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(prefilledGovernorate || 'رام الله والبيرة');
  const [locality, setLocality] = useState('');
  const [patientAge, setPatientAge] = useState<string>('12');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<SupportRequest | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Synchronous duplicate-click lock & per-submission idempotency key
  const isSubmittingRef = useRef<boolean>(false);
  const idempotencyKeyRef = useRef<string>(
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  React.useEffect(() => {
    if (prefilledGovernorate) setGovernorate(prefilledGovernorate);
  }, [prefilledGovernorate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission from rapid repeated clicks
    if (isSubmittingRef.current || isSubmitting) {
      return;
    }

    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة الاسم أو اللقب' : 'Please provide a name or alias');
      return;
    }

    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم هاتف صحيح للتواصل السري' : 'Please provide a valid contact phone number');
      return;
    }

    if (!locality.trim()) {
      setErrorMsg(isAr ? 'يرجى تحديد المدينة أو القرية أو المخيم' : 'Please specify your town, city, or camp');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Privacy-First: Transmit ONLY non-sensitive administrative fields to backend store.
      const response = await fetch('/api/support-requests', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          primaryNeed: prefilledNeed || 'social_protection',
          idempotencyKey: idempotencyKeyRef.current
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          isAr
            ? 'خدمة حفظ الطلبات غير مفعّلة في هذه النسخة الثابتة. يرجى التواصل عبر الرقم المجاني 189 أو مراجعة أقرب مديرية تنمية اجتماعية.'
            : 'Request submission backend is not active on this static deployment. Please call toll-free 189 or visit your nearest MoSD Directorate.'
        );
      }

      const data = await response.json();
      if (!response.ok || !data?.success || !data?.persistedOnServer) {
        throw new Error(
          data?.error ||
            (isAr
              ? 'تعذر تأكيد حفظ الطلب في الخدمة الخلفية. يرجى المحاولة مرة أخرى أو الاتصال على 189.'
              : 'Failed to confirm request storage on server. Please try again or call 189.')
        );
      }

      const newReq = createNewRequest({
        fullName: fullName.trim(),
        phone: phone.trim(),
        governorate,
        locality: locality.trim(),
        applicantRole: 'parent_guardian',
        patientAge: parseInt(patientAge, 10) || 10,
        primaryNeed: prefilledNeed || 'social_protection',
        urgencyLevel: 'normal',
        preferredContact: 'phone',
        notes: notes.trim()
      });

      // Use authoritative tracking code confirmed by backend
      const confirmedReq: SupportRequest = {
        ...newReq,
        trackingCode: data.trackingCode || newReq.trackingCode
      };

      setCreatedRequest(confirmedReq);
      onSubmitSuccess(confirmedReq);
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          (isAr
            ? 'تعذر إرسال الطلب حاليًا. يرجى المحاولة بعد قليل.'
            : 'Unable to submit request right now. Please try again.')
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (createdRequest?.trackingCode) {
      navigator.clipboard.writeText(createdRequest.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleResetForm = () => {
    setFullName('');
    setPhone('');
    setLocality('');
    setNotes('');
    setCreatedRequest(null);
    setErrorMsg(null);
    idempotencyKeyRef.current =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  return (
    <section id="request" className="scroll-mt-24 py-16 sm:py-20 bg-[#FAF8F5] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E1B24]/10 text-[#8E1B24] text-xs font-black">
              <Heart className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسار الدعم والتمكين الأسري' : 'Dignified Support Pathway'}</span>
            </div>
            <ListenToPageButton
              items={[
                {
                  id: 'request-header',
                  title: isAr ? 'مسار الدعم لأسرتك' : 'Support Pathway',
                  text: isAr
                    ? 'ابدأ مسار الدعم لأسرتك. أدخل البيانات الأساسية فقط، وسيتولى الأخصائي الاجتماعي المعتمد دراسة الحالة والتواصل معك بسرية تامة.'
                    : 'Start Your Family Support Pathway. Provide basic details only; a certified case officer will contact you confidentially.'
                },
                {
                  id: 'request-steps',
                  title: isAr ? 'مراحل مسار الدعم' : 'Support Steps',
                  text: isAr
                    ? 'مراحل مسار الدعم الخمس المعتمدة: أولاً التواصل وتسجيل البيانات، ثانياً دراسة الحالة والبحث الميداني، ثالثاً تقييم الاحتياج وفق معايير الاستحقاق، رابعاً تحديد الخدمة المناسبة، وخامساً التوجيه والإحالة والمتابعة الدورية.'
                    : 'Official 5-Step Support Journey: 1. Intake, 2. Field case study, 3. Needs assessment, 4. Appropriate service fit, 5. Referral and ongoing follow-up.'
                }
              ]}
              title={isAr ? 'مسار الدعم' : 'Support Pathway'}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#162035] tracking-tight">
              {isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Your Family Support Pathway'}
            </h2>
            <SpeakButton
              id="request-header"
              text={isAr
                ? 'ابدأ مسار الدعم لأسرتك. أدخل البيانات الأساسية فقط، وسيتولى الأخصائي الاجتماعي المعتمد دراسة الحالة والتواصل معك بسرية تامة.'
                : 'Start Your Family Support Pathway. Provide basic details only; a certified case officer will contact you confidentially.'}
              title={isAr ? 'ابدأ مسار الدعم' : 'Start Support Pathway'}
              size="md"
            />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            {isAr 
              ? 'أدخل البيانات الأساسية فقط، وسيتولى الأخصائي الاجتماعي المعتمد دراسة الحالة والتواصل معك بسرية تامة.' 
              : 'Provide basic details only; a certified case officer will contact you confidentially.'}
          </p>
        </div>

        {/* 5-Step Visual Pathway */}
        <div className={`bg-white rounded-3xl p-5 sm:p-7 border shadow-xs space-y-4 transition-colors ${
          activeId === 'request-steps' ? 'border-[#694E91] ring-2 ring-[#694E91]/30' : 'border-[#EADFD5]'
        }`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-black text-[#162035] block">
              {isAr ? 'مراحل مسار الدعم المعتمدة:' : 'Official 5-Step Support Journey:'}
            </span>
            <SpeakButton
              id="request-steps"
              text={isAr
                ? 'مراحل مسار الدعم المعتمدة: أولاً التواصل وتسجيل البيانات، ثانياً دراسة الحالة، ثالثاً تقييم الاحتياج، رابعاً تحديد الخدمة، وخامساً التوجيه والإحالة.'
                : 'Official 5-Step Support Journey: Contact, Case Study, Assessment, Service Fit, and Referral.'}
              title={isAr ? 'مراحل مسار الدعم' : 'Support Steps'}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8E1B24] text-white font-mono font-black text-xs inline-flex items-center justify-center">١</span>
              <strong className="block text-[#162035] font-black">{isAr ? 'التواصل' : 'Contact'}</strong>
              <span className="text-[10px] text-slate-500 block">{isAr ? 'تسجيل البيانات' : 'Intake'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8E1B24] text-white font-mono font-black text-xs inline-flex items-center justify-center">٢</span>
              <strong className="block text-[#162035] font-black">{isAr ? 'دراسة الحالة' : 'Case Study'}</strong>
              <span className="text-[10px] text-slate-500 block">{isAr ? 'بحث اجتماعي ميداني' : 'Field Review'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8E1B24] text-white font-mono font-black text-xs inline-flex items-center justify-center">٣</span>
              <strong className="block text-[#162035] font-black">{isAr ? 'تقييم الاحتياج' : 'Assessment'}</strong>
              <span className="text-[10px] text-slate-500 block">{isAr ? 'معايير الاستحقاق' : 'Eligibility'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-1">
              <span className="w-6 h-6 rounded-full bg-[#8E1B24] text-white font-mono font-black text-xs inline-flex items-center justify-center">٤</span>
              <strong className="block text-[#162035] font-black">{isAr ? 'تحديد الخدمة' : 'Service Fit'}</strong>
              <span className="text-[10px] text-slate-500 block">{isAr ? 'دعم نقدي / تمكين' : 'Safety Net'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] space-y-1 col-span-2 sm:col-span-1">
              <span className="w-6 h-6 rounded-full bg-[#8E1B24] text-white font-mono font-black text-xs inline-flex items-center justify-center">٥</span>
              <strong className="block text-[#162035] font-black">{isAr ? 'التوجيه والإحالة' : 'Referral'}</strong>
              <span className="text-[10px] text-slate-500 block">{isAr ? 'متابعة دورية مستمرة' : 'Follow-up'}</span>
            </div>
          </div>

          {/* Key Principle Box */}
          <div className="p-3.5 rounded-2xl bg-[#8E1B24]/5 border border-[#8E1B24]/15 flex items-start gap-2.5 text-xs text-slate-800">
            <AlertCircle className="w-4 h-4 text-[#8E1B24] shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">
              {isAr ? (
                <>
                  <strong className="text-[#8E1B24]">مبدأ تقديم الخدمة:</strong> يتم تحديد نوع الدعم المناسب بعد دراسة الحالة وتقييم الاحتياج الفعلي للأسر الأكثر هشاشة وفق معايير الاستحقاق المعتمدة من وزارة التنمية الاجتماعية.
                </>
              ) : (
                <>
                  <strong className="text-[#8E1B24]">Delivery Mandate:</strong> The appropriate support type is granted following comprehensive field case study and assessment of actual family vulnerability.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Form Card or Success Confirmation */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD5] shadow-xs">
          
          {createdRequest ? (
            /* Success View */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-[#2E6F56]/10 text-[#2E6F56] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isAr ? 'تم استلام طلبك بنجاح' : 'Your Request Has Been Received'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {isAr 
                    ? 'تم تسجيل طلبك إداريًا وبسرية للمراجعة. تخضع جميع الطلبات لدراسة الحالة وتقييم الاحتياج الفعلي وفق المعايير المعتمدة دون أي التزام مسبق بالقبول التلقائي.' 
                    : 'Your request has been logged confidentially for administrative review. All requests undergo case assessment and eligibility evaluation without automatic approval.'}
                </p>
              </div>

              {/* Reference Number Box */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EADFD5] max-w-sm mx-auto space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 block">
                  {isAr ? 'الرقم المرجعي لطلبك:' : 'Request Reference Code:'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono font-black text-xl text-[#8E1B24] tracking-wider">
                    {createdRequest.trackingCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                    title={isAr ? 'نسخ الرقم' : 'Copy code'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <span className="text-[11px] font-bold text-[#2E6F56] block">
                    {isAr ? 'تم نسخ الرقم بنجاح!' : 'Copied!'}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-500 block pt-1">
                  {isAr
                    ? '✓ تم تسجيل وحفظ طلبك إداريًا وبسرية تامة للمتابعة'
                    : '✓ Stored confidentially for administrative follow-up'}
                </span>
              </div>

              {/* What Happens Next Steps */}
              <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto text-xs text-slate-600 space-y-2 text-left rtl:text-right">
                <span className="font-black text-slate-900 block">
                  {isAr ? 'ماذا يحدث الآن؟' : 'What Happens Next?'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="block text-slate-900 mb-0.5">{isAr ? '١. مراجعة الطلب' : '1. Review'}</strong>
                    <span>{isAr ? 'مراجعة السجل الإداري والتحقق من التوجيه.' : 'Review administrative record and routing.'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="block text-slate-900 mb-0.5">{isAr ? '٢. دراسة الحالة' : '2. Case Study'}</strong>
                    <span>{isAr ? 'تقييم الاحتياج الفعلي للأسرة وفق الأصول.' : 'Evaluate actual household needs.'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <strong className="block text-slate-900 mb-0.5">{isAr ? '٣. تحديد الاستحقاق' : '3. Eligibility'}</strong>
                    <span>{isAr ? 'تحديد المسار الأنسب حسب معايير الاستحقاق.' : 'Determine fit based on eligibility criteria.'}</span>
                  </div>
                </div>
              </div>

              {/* Reset action */}
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-xl bg-[#8E1B24] text-white text-xs font-black hover:bg-[#911D29] cursor-pointer"
                >
                  {isAr ? 'تقديم طلب لأسرة أخرى' : 'Submit Another Request'}
                </button>
                <button
                  onClick={onNavigateToDirectorates}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  {isAr ? 'عرض بيانات المديريات' : 'View Directorates'}
                </button>
              </div>
            </div>
          ) : (
            /* Essential Basic Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Privacy Banner */}
              <div className="p-4 rounded-2xl bg-[#2E6F56]/10 border border-[#2E6F56]/20 flex items-center gap-3 text-xs text-[#1E4B3A]">
                <ShieldCheck className="w-5 h-5 text-[#2E6F56] shrink-0" />
                <p className="font-semibold leading-relaxed">
                  {isAr 
                    ? 'بياناتك في أمان تام؛ لن تُستخدم إلا لتقييم الاحتياج وتوجيه الخدمة وحفظ الكرامة.' 
                    : 'Your information is confidential and used strictly for needs evaluation and support delivery.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Basic Fields Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'الاسم الكامل أو اللقب العائلي *' : 'Full Name or Family Alias *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={isAr ? 'مثال: أحمد محمود أو (أم يوسف)' : 'e.g., Ahmad Mahmoud'}
                      className="w-full pl-4 pr-9 rtl:pr-9 rtl:pl-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24]"
                    />
                  </div>
                </div>

                {/* 2. Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'رقم الهاتف للتواصل السري *' : 'Contact Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isAr ? '059XXXXXXX أو 056XXXXXXX' : '059XXXXXXX'}
                      className="w-full pl-4 pr-9 rtl:pr-9 rtl:pl-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24] dir-ltr text-right rtl:text-right"
                    />
                  </div>
                </div>

                {/* 3. Governorate */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'المحافظة السكنية *' : 'Governorate *'}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24]"
                  >
                    {PALESTINE_GOVERNORATES_DATA.map((gov) => (
                      <option key={gov.id} value={gov.name.ar}>
                        {gov.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Locality / City / Camp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'المدينة / القرية / المخيم *' : 'Locality / City / Camp *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder={isAr ? 'مثال: بيتونيا، بلاطة، حلحول، مخيم جنين...' : 'e.g., Beitunia, Balata Camp'}
                      className="w-full pl-4 pr-9 rtl:pr-9 rtl:pl-4 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24]"
                    />
                  </div>
                </div>

                {/* 5. Patient Age in family */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'عمر مريض الثلاسيميا في الأسرة (بالسنوات):' : 'Age of Family Member with Thalassemia:'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="80"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full sm:w-48 p-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24]"
                  />
                </div>

                {/* 6. Brief note / support needed */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-black text-slate-900 block">
                    {isAr ? 'شرح موجز لاحتياجات الأسرة أو طبيعة الدعم المطلوب:' : 'Brief Note on Family Support Needs:'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'اكتب باختصار ما تحتاجه أسرتك (مثال: بحاجة لمساندة في تكاليف التنقل، دعم نفسي للطفل، استفسار عن برامج التمكين الاقتصادي...)' : 'Briefly describe your needs...'}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#8E1B24]"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isAr ? '* سيتم التعامل مع طلبك كملف إدارة حالة رسمي وسري.' : '* All submissions handled strictly under case management protocols.'}
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7A1822] hover:bg-[#911D29] text-white font-black text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" />
                  <span>{isSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال طلب الدعم لأسرتك' : 'Submit Support Request')}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
