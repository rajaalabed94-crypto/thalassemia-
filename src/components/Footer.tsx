import React from 'react';
import { Language } from '../types';
import { 
  Heart, 
  ShieldCheck, 
  ExternalLink, 
  Globe, 
  Building2, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  onOpenFaq: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigate,
  onOpenFaq
}) => {
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#F5EFE8] text-slate-700 text-xs py-14 border-t border-[#EADFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Prominent Joint Institutional Platforms Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD5] shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#634B8F] bg-[#634B8F]/10 px-3 py-1 rounded-full inline-block border border-[#634B8F]/20">
              {isAr ? 'المنصات الرسمية المشتركة والمواقع المعتمدة' : 'Official Joint Platforms & Websites'}
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-[#1B1B3A]">
              {isAr ? 'شراكة وطنية متكاملة لصون كرامة مريض الثلاسيميا وأسرته' : 'Integrated National Partnership for Thalassemia Families'}
            </h3>
            <p className="text-slate-600 text-xs">
              {isAr 
                ? 'تكامل المسؤوليات بين الجانب الحكومي التنموي والجهد الأهلي التوعوي والمجتمعي' 
                : 'Synergy between national governmental social protection and grassroots patient advocacy.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 pt-2">
            
            {/* MoSD Official Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#9E1B28] transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#9E1B28] bg-[#9E1B28]/10 px-2.5 py-0.5 rounded-md border border-[#9E1B28]/20">
                    {isAr ? 'الجهة الحكومية' : 'Government Entity'}
                  </span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-black text-[#1B1B3A]">
                  {isAr ? 'وزارة التنمية الاجتماعية – دولة فلسطين' : 'Ministry of Social Development – State of Palestine'}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {isAr 
                    ? 'المسؤولة عن شبكة الأمان الاجتماعي، المساعدات النقدية وفق الاستحقاق، إدارة الحالة الشاملة، والتمكين الاقتصادي.' 
                    : 'Governing social protection, eligibility-based relief, comprehensive case management, and family economic empowerment.'}
                </p>
              </div>

              <a 
                href="https://www.mosd.gov.ps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#9E1B28] hover:bg-[#831621] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <span>www.mosd.gov.ps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* TPFS Official Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-[#EADFD5] hover:border-[#634B8F] transition-all flex flex-col justify-between space-y-4 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#634B8F] bg-[#634B8F]/15 px-2.5 py-0.5 rounded-md border border-[#634B8F]/30">
                    {isAr ? 'الجمعية الأهلية الرائدة' : 'National NGO Lead'}
                  </span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-black text-[#1B1B3A]">
                  {isAr ? 'جمعية أصدقاء مرضى الثلاسيميا – فلسطين (TPFS)' : 'Thalassemia Patients’ Friends Society – Palestine'}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {isAr 
                    ? 'الجهة التخصصية الرائدة في التوعية الوطنية، الدعم النفسي والاجتماعي، مناصرة حقوق المرضى، والتشبيك مع بنوك الدم.' 
                    : 'The leading specialized society for patient advocacy, psychological resilience circles, and blood donor networking.'}
                </p>
              </div>

              <a 
                href="https://tpfs.ps" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#634B8F] hover:bg-[#523D77] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <span>tpfs.ps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

        {/* Footer Navigation & Columns */}
        <div className="grid md:grid-cols-3 gap-8 pt-4">
          
          {/* Col 1: Platform Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#EADFD5] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <img 
                  src="/campaign-logo.jpg" 
                  alt="شعار الحملة" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-black text-[#1B1B3A] text-sm">
                {isAr ? 'الثلاسيميا… دعمٌ يمتدّ إلى الحياة' : 'Thalassemia Support Platform'}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {isAr 
                ? 'منصة خدمة وتوعية مصغّرة تربط بين المريض والأسرة، والمعلومة، والخدمة، وإدارة الحالة، والمتابعة، والأثر بالشراكة بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا.' 
                : 'A dedicated platform connecting Patient/Family → Information → Service → Case Management → Follow-up → Impact.'}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black text-[#1B1B3A] text-xs uppercase tracking-wider">
              {isAr ? 'أقسام المنصة' : 'Platform Navigation'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <button onClick={() => onNavigate('hero')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'الرئيسية' : 'Home'}
              </button>
              <button onClick={() => onNavigate('education')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'تعرّف عن الثلاسيميا' : 'Know Thalassemia'}
              </button>
              <button onClick={() => onNavigate('genetics')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'كيف تنتقل وراثياً' : 'Genetics'}
              </button>
              <button onClick={() => onNavigate('services')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'خدماتنا' : 'Services'}
              </button>
              <button onClick={() => onNavigate('stigma')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'ليست وصمة' : 'Not a Stigma'}
              </button>
              <button onClick={() => onNavigate('myth-vs-fact')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'صح أم خطأ؟' : 'Myth vs. Fact'}
              </button>
              <button onClick={() => onNavigate('stories')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'قصص وفيديوهات' : 'Stories'}
              </button>
              <button onClick={() => onNavigate('game')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'اللعبة التعليمية' : 'Educational Game'}
              </button>
              <button onClick={() => onNavigate('faq')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
              </button>
              <button onClick={() => onNavigate('directorates')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'خريطة المديريات' : 'Directorates'}
              </button>
              <button onClick={() => onNavigate('about-us')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'من نحن' : 'About Us'}
              </button>
              <button onClick={() => onNavigate('impact')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'لوحة القياس والأثر' : 'Impact'}
              </button>
              <button onClick={() => onNavigate('contribute')} className="hover:text-[#634B8F] text-slate-700 transition-colors cursor-pointer text-left rtl:text-right font-medium">
                {isAr ? 'ساهم معنا' : 'Contribute'}
              </button>
              <button onClick={() => onNavigate('request')} className="text-[#9E1B28] hover:text-[#B3202E] font-black transition-colors cursor-pointer text-left rtl:text-right col-span-2">
                {isAr ? 'ابدأ مسار الدعم لأسرتك ←' : 'Start Support Pathway →'}
              </button>
            </div>
          </div>

          {/* Col 3: Privacy & Case Management Pledge */}
          <div className="space-y-3">
            <h4 className="font-black text-[#1B1B3A] text-xs uppercase tracking-wider">
              {isAr ? 'ميثاق الخصوصية والكرامة' : 'Privacy & Dignity Charter'}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{isAr ? 'سرية تامة ومحمية قانونياً' : 'Protected Case Confidentiality'}</span>
              </div>
              <p>
                {isAr 
                  ? 'يتم التعامل مع طلبات الأسر وفق بروتوكولات إدارة الحالة المهنية بوزارة التنمية الاجتماعية، دون نشر أو مشاركة أي معلومات دون موافقة مسبقة.' 
                  : 'Family applications are handled strictly according to professional case management protocols with no unauthorized disclosures.'}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 border-t border-[#EADFD5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <div>
            © {new Date().getFullYear()} {isAr ? 'وزارة التنمية الاجتماعية الفلسطينية × جمعية أصدقاء مرضى الثلاسيميا' : 'Ministry of Social Development × TPFS Palestine'}
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <button onClick={() => { onOpenFaq(); onNavigate('faq'); }} className="hover:text-[#634B8F] transition-colors cursor-pointer">
              {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>
            <span>•</span>
            <a href="https://www.mosd.gov.ps" target="_blank" rel="noopener noreferrer" className="hover:text-[#634B8F] transition-colors">
              {isAr ? 'بوابة الوزارة' : 'MoSD Portal'}
            </a>
            <span>•</span>
            <a href="https://tpfs.ps" target="_blank" rel="noopener noreferrer" className="hover:text-[#634B8F] transition-colors">
              {isAr ? 'موقع الجمعية' : 'TPFS Website'}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
