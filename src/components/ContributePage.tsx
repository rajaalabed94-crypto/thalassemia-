import React, { useState } from 'react';
import { Language } from '../types';
import {
  HeartHandshake,
  Send,
  CheckCircle2,
  PhoneCall,
  ShieldCheck
} from 'lucide-react';
import { SpeakButton, ListenToPageButton } from '../context/AudioSpeechContext';

interface ContributePageProps {
  language: Language;
}

export const ContributePage: React.FC<ContributePageProps> = ({ language }) => {
  const isAr = language === 'ar';

  const [partnerType, setPartnerType] = useState<'individual' | 'institution' | 'donor'>('individual');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('رام الله والبيرة');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setIsSubmitted(true);
  };

  return (
    <section id="contribute" className="scroll-mt-24 py-16 bg-[#FAF7F2] border-b border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8E1B24]/10 text-[#8E1B24] text-xs font-black">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{isAr ? 'ساهم معنا • مسؤولية مجتمعية وشراكة' : 'Contribute • Corporate & Civic Responsibility'}</span>
            </div>
            <ListenToPageButton
              items={[
                {
                  id: 'contribute-header',
                  title: isAr ? 'ساهم معنا' : 'Contribute',
                  text: isAr
                    ? 'ساهم في توسيع أثر الحماية والتمكين. باب المساهمة والشراكة مفتوح للأفراد والمؤسسات والشركاء المحليين والدوليين لمضاعفة شبكات الأمان لأسر مرضى الثلاسيميا.'
                    : 'Expand the Scope of Protection and Empowerment. Open for individuals, private institutions, and partners to scale social safety nets and livelihood opportunities for thalassemia households.'
                }
              ]}
              title={isAr ? 'فرص المساهمة والشراكة' : 'Contribution & Partnership'}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-4xl font-black text-[#162035] tracking-tight">
              {isAr ? 'ساهم في توسيع أثر الحماية والتمكين' : 'Expand the Scope of Protection & Empowerment'}
            </h2>
            <SpeakButton
              id="contribute-header"
              text={isAr
                ? 'ساهم في توسيع أثر الحماية والتمكين. باب المساهمة والشراكة مفتوح للأفراد والمؤسسات والشركاء المحليين والدوليين لمضاعفة شبكات الأمان لأسر مرضى الثلاسيميا.'
                : 'Expand the Scope of Protection and Empowerment. Open for individuals, private institutions, and partners.'}
              title={isAr ? 'عنوان المساهمة' : 'Contribute Heading'}
              size="md"
            />
          </div>
          <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
            {isAr 
              ? 'باب المساهمة والشراكة مفتوح للأفراد والمؤسسات والشركاء المحليين والدوليين لمضاعفة شبكات الأمان لأسر مرضى الثلاسيميا.'
              : 'Open for individuals, private institutions, and partners to scale social safety nets and livelihood opportunities for thalassemia households.'}
          </p>
        </div>

        {/* Engagement / Partnership Intent Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFD5] shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#162035]">
                {isAr ? 'نموذج إبداء الرغبة في الشراكة أو المساهمة' : 'Expression of Interest in Partnership'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isAr ? 'سيقوم فريق العلاقات المؤسسية بمتابعة طلبكم والتنسيق المباشر معكم.' : 'Our partnership team will coordinate directly with you upon submission.'}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#EADFD5] text-xs font-bold">
              {(['individual', 'institution', 'donor'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPartnerType(t)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    partnerType === t ? 'bg-[#162035] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'individual' ? (isAr ? 'فرد / فاعل خير' : 'Individual') :
                   t === 'institution' ? (isAr ? 'مؤسسة / شركة' : 'Company') :
                   (isAr ? 'جهة مانحة' : 'Donor')}
                </button>
              ))}
            </div>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base sm:text-lg font-black text-emerald-900">
                {isAr ? 'شكراً لمبادرتكم النبيلة وصنيعكم الكريم' : 'Thank You for Your Generous Solidarity'}
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto leading-relaxed">
                {isAr 
                  ? 'تم استلام بيانات رغبتكم في المساهمة بنجاح. سيقوم المنسق المشترك بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا بالتواصل معكم عبر الهاتف المسجل لمواءمة مسار الدعم وتزويدكم بالتقارير الميدانية الموثقة.'
                  : 'Your contribution intent has been registered. Our joint MoSD × TPFS coordinator will contact you shortly to coordinate your support track.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-black text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  {isAr ? 'إرسال مبادرة أخرى' : 'Submit Another Intent'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-[#162035]">
                    {isAr ? 'الاسم الكامل أو اسم الجهة / الشركة *' : 'Full Name or Organization *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'مثال: شركة القدس للاستثمار / د. محمد سالم' : 'e.g. Al-Quds Foundation / Sarah Ahmad'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#8E1B24]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-[#162035]">
                    {isAr ? 'رقم الهاتف المباشر للتواصل *' : 'Direct Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={isAr ? '059xxxxxxx أو 056xxxxxxx' : '059xxxxxxx'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#8E1B24] dir-ltr text-right rtl:text-right"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-[#162035]">
                    {isAr ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#8E1B24] dir-ltr text-right rtl:text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-black text-[#162035]">
                    {isAr ? 'المحافظة' : 'Governorate'}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#8E1B24]"
                  >
                    <option value="رام الله والبيرة">رام الله والبيرة</option>
                    <option value="نابلس">نابلس</option>
                    <option value="الخليل">الخليل</option>
                    <option value="جنين">جنين</option>
                    <option value="طولكرم">طولكرم</option>
                    <option value="بيت لحم">بيت لحم</option>
                    <option value="القدس الشريف">القدس الشريف</option>
                    <option value="قلقيلية">قلقيلية</option>
                    <option value="سلفيت">سلفيت</option>
                    <option value="أريحا والأغوار">أريحا والأغوار</option>
                    <option value="طوباس">طوباس</option>
                    <option value="محافظات غزة">محافظات غزة</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black text-[#162035]">
                  {isAr ? 'تفاصيل المبادرة أو ملاحظات إضافية' : 'Initiative Details or Notes'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'اذكر أي تفاصيل تفضلها (مثل: عدد الأسر المستهدفة، مجال التمكين، أو طبيعة التطوع)...' : 'Add any additional specifications...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-[#8E1B24]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'كافة المساهمات تخضع للحوكمة والتقارير الرقابية المعتمدة' : 'All contributions adhere to certified audit reporting.'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#8E1B24] hover:bg-[#A8242E] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال إبداء الرغبة في المساهمة' : 'Submit Partnership Intent'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Direct Contacts */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-bold">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#8E1B24]" />
              <span>{isAr ? 'للتواصل المباشر مع دائرة الشراكات:' : 'Direct Partnerships Desk:'}</span>
              <a href="tel:189" className="text-[#8E1B24] hover:underline font-mono font-black">189 (مجاني)</a>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://www.mosd.gov.ps" target="_blank" rel="noopener noreferrer" className="hover:text-[#8E1B24] underline">mosd.gov.ps</a>
              <a href="https://tpfs.ps/ar/" target="_blank" rel="noopener noreferrer" className="hover:text-[#8E1B24] underline">tpfs.ps</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
