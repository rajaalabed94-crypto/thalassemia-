import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { 
  Globe, 
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Heart,
  HelpCircle,
  Gamepad2,
  BookOpen,
  Dna,
  Briefcase,
  MapPin,
  ShieldCheck,
  Film,
  Users,
  HandHeart,
  Activity,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenFaq: () => void;
  onOpenGame?: () => void;
}

type DropdownId = 'about' | 'services' | 'awareness' | 'whoWeAre' | null;

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenFaq,
  onOpenGame
}) => {
  const isAr = language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownId>(null);
  const [mobileAccordions, setMobileAccordions] = useState<{ [key: string]: boolean }>({
    about: false,
    services: false,
    awareness: false,
    whoWeAre: false
  });

  const headerRef = useRef<HTMLElement | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = (id: DropdownId) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleDropdownClick = (id: DropdownId) => {
    setActiveDropdown(prev => (prev === id ? null : id));
  };

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleItemClick = (sectionId: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const handleGameClick = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (onOpenGame) {
      onOpenGame();
    } else {
      onNavigate('game');
    }
  };

  const handleFaqClick = () => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    onNavigate('faq');
  };

  // Determine active states for parent items
  const isAboutActive = activeSection === 'education' || activeSection === 'genetics';
  const isServicesActive = activeSection === 'services' || activeSection === 'directorates';
  const isAwarenessActive =
    activeSection === 'stigma' ||
    activeSection === 'stories' ||
    activeSection === 'faq' ||
    activeSection === 'myth-vs-fact' ||
    activeSection === 'game';
  const isWhoWeAreActive = activeSection === 'about-us' || activeSection === 'contribute';

  return (
    <header 
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F4E8DF] shadow-xs w-full transition-all"
    >
      {/* Skip to Content for Accessibility */}
      <a 
        href="#hero" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#694E91] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-hidden"
      >
        {isAr ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Main Single-Row Navigation Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* ========================================================= */}
          {/* 1. RIGHT AREA (RTL Start): Logo & Identity               */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button 
              onClick={() => handleItemClick('hero')}
              className="flex items-center gap-2.5 text-start focus:outline-hidden group cursor-pointer"
              title={isAr ? 'الرئيسية' : 'Home'}
              aria-label={isAr ? 'الصفحة الرئيسية لحملة الثلاسيميا' : 'Thalassemia Support Home'}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white p-1 border border-[#F4E8DF] shadow-xs flex items-center justify-center shrink-0 group-hover:border-[#694E91] transition-all overflow-hidden">
                <img 
                  src="/campaign-logo.jpg" 
                  alt={isAr ? 'شعار الحملة الوطنية لدعم مرضى الثلاسيميا' : 'Thalassemia Campaign Logo'} 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div className="text-start select-none">
                <span className="font-black text-xs sm:text-sm lg:text-base text-[#1B1B3A] tracking-tight block leading-tight">
                  {isAr ? 'الثلاسيميا' : 'Thalassemia'}
                </span>
                <span className="hidden min-[480px]:block text-[10px] sm:text-[11px] font-bold text-[#694E91] leading-none mt-0.5">
                  {isAr ? 'دعمٌ يمتدّ إلى الحياة' : 'Support Extending to Life'}
                </span>
              </div>
            </button>
          </div>

          {/* ========================================================= */}
          {/* 2. CENTER AREA: Primary Navigation with Dropdown Menus    */}
          {/* (Visible on Desktop: lg and above, 1024px+)               */}
          {/* ========================================================= */}
          <nav 
            className="hidden lg:flex items-center gap-1 xl:gap-2 justify-center flex-1 min-w-0"
            aria-label={isAr ? 'التنقل الرئيسي' : 'Primary Navigation'}
          >
            {/* ITEM 1: الرئيسية (Direct Link) */}
            <button
              onClick={() => handleItemClick('hero')}
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                activeSection === 'hero'
                  ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                  : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>

            {/* ITEM 2: عن الثلاسيميا (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('about')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdownClick('about')}
                aria-expanded={activeDropdown === 'about'}
                aria-haspopup="true"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isAboutActive || activeDropdown === 'about'
                    ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                    : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
                }`}
              >
                <span>{isAr ? 'عن الثلاسيميا' : 'About Thalassemia'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  activeDropdown === 'about' ? 'rotate-180 text-[#694E91]' : ''
                }`} />
              </button>

              {activeDropdown === 'about' && (
                <div 
                  className="absolute top-full mt-1.5 start-0 w-60 rounded-2xl bg-white border border-[#F4E8DF] shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('education')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'education'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#694E91] shrink-0" />
                    <span>{isAr ? 'التعريف بالثلاسيميا' : 'What is Thalassemia?'}</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('genetics')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'genetics'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <Dna className="w-4 h-4 text-[#B72E43] shrink-0" />
                    <span>{isAr ? 'كيف تنتقل وراثيًا' : 'Genetic Inheritance'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* ITEM 3: خدماتنا (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('services')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdownClick('services')}
                aria-expanded={activeDropdown === 'services'}
                aria-haspopup="true"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isServicesActive || activeDropdown === 'services'
                    ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                    : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
                }`}
              >
                <span>{isAr ? 'خدماتنا' : 'Our Services'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  activeDropdown === 'services' ? 'rotate-180 text-[#694E91]' : ''
                }`} />
              </button>

              {activeDropdown === 'services' && (
                <div 
                  className="absolute top-full mt-1.5 start-0 w-60 rounded-2xl bg-white border border-[#F4E8DF] shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('services')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'services'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-[#694E91] shrink-0" />
                    <span>{isAr ? 'الخدمات المتاحة' : 'Available Services'}</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('directorates')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'directorates'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-[#B72E43] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isAr ? 'خريطة المديريات' : 'Directorates Map'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#694E91]/10 text-[#694E91] font-bold">
                        {isAr ? 'صفحة' : 'Page'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ITEM 4: التوعية (Dropdown) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('awareness')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdownClick('awareness')}
                aria-expanded={activeDropdown === 'awareness'}
                aria-haspopup="true"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isAwarenessActive || activeDropdown === 'awareness'
                    ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                    : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
                }`}
              >
                <span>{isAr ? 'التوعية' : 'Awareness'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  activeDropdown === 'awareness' ? 'rotate-180 text-[#694E91]' : ''
                }`} />
              </button>

              {activeDropdown === 'awareness' && (
                <div 
                  className="absolute top-full mt-1.5 start-0 w-64 rounded-2xl bg-white border border-[#F4E8DF] shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('stigma')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'stigma'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2E6F56] shrink-0" />
                    <span>{isAr ? 'ليست وصمة' : 'Not a Stigma'}</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('stories')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'stories'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <Film className="w-4 h-4 text-[#B72E43] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isAr ? 'قصص وفيديوهات' : 'Stories & Videos'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#694E91]/10 text-[#694E91] font-bold">
                        {isAr ? 'صفحة' : 'Page'}
                      </span>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('myth-vs-fact')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'myth-vs-fact'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-[#B72E43] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isAr ? 'صح أم خطأ؟ (المفاهيم الشائعة)' : 'Myth vs. Fact'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                        {isAr ? 'تفاعلي' : 'Quiz'}
                      </span>
                    </div>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('faq')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'faq'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-[#694E91] shrink-0" />
                    <span>{isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={handleGameClick}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'game'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4 text-[#694E91] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isAr ? 'اللعبة التعليمية' : 'Educational Game'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#B72E43]/10 text-[#B72E43] font-bold">
                        {isAr ? 'العب' : 'Play'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* ITEM 5: أثرنا (Direct Link) */}
            <button
              onClick={() => handleItemClick('impact')}
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                activeSection === 'impact'
                  ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                  : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
              }`}
            >
              {isAr ? 'أثرنا' : 'Our Impact'}
            </button>

            {/* ITEM 6: من نحن وساهم (Dropdown to keep ساهم accessible without large competing button) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownEnter('whoWeAre')}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => toggleDropdownClick('whoWeAre')}
                aria-expanded={activeDropdown === 'whoWeAre'}
                aria-haspopup="true"
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isWhoWeAreActive || activeDropdown === 'whoWeAre'
                    ? 'text-[#694E91] bg-[#F4E8DF]/60 font-black'
                    : 'text-slate-700 hover:text-[#694E91] hover:bg-[#F4E8DF]/30'
                }`}
              >
                <span>{isAr ? 'من نحن' : 'About Us'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                  activeDropdown === 'whoWeAre' ? 'rotate-180 text-[#694E91]' : ''
                }`} />
              </button>

              {activeDropdown === 'whoWeAre' && (
                <div 
                  className="absolute top-full mt-1.5 start-0 w-64 rounded-2xl bg-white border border-[#F4E8DF] shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('about-us')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'about-us'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <Users className="w-4 h-4 text-[#694E91] shrink-0" />
                    <span>{isAr ? 'من نحن (الرؤية والشراكة)' : 'Who We Are'}</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleItemClick('contribute')}
                    className={`w-full text-start px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      activeSection === 'contribute'
                        ? 'bg-[#F4E8DF]/70 text-[#694E91] font-black'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#694E91]'
                    }`}
                  >
                    <HandHeart className="w-4 h-4 text-[#B72E43] shrink-0" />
                    <div className="flex items-center justify-between flex-1">
                      <span>{isAr ? 'ساهم في توسيع الأثر' : 'Contribute / Support'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#B72E43]/10 text-[#B72E43] font-bold">
                        {isAr ? 'مشاركة' : 'Join'}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* ========================================================= */}
          {/* 3. LEFT AREA (RTL End): CTA, Contact 189 & Language       */}
          {/* ========================================================= */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Toll-Free 189 Contact Access (Visible on Tablets & Desktops >= 640px) */}
            <a
              href="tel:189"
              className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#F4E8DF]/60 hover:bg-[#F4E8DF] text-[#694E91] font-bold text-xs transition-colors border border-[#694E91]/20 cursor-pointer"
              title={isAr ? 'اتصال مجاني مباشر: 189' : 'Toll-Free Direct: 189'}
              aria-label={isAr ? 'رقم الاتصال المجاني المعتمد 189' : 'Toll-Free 189'}
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#694E91] shrink-0" />
              <span className="font-mono font-black text-xs">189</span>
            </a>

            {/* Language Switcher Button */}
            <button
              onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#694E91] hover:border-[#694E91]/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              aria-label={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#694E91] shrink-0" />
              <span className="font-bold text-[11px] sm:text-xs">{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Main Support CTA Button (ابدأ مسار الدعم) */}
            <button
              onClick={() => handleItemClick('request')}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-full bg-[#B72E43] hover:bg-[#9E2336] text-white font-black text-[11px] sm:text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              title={isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Support Pathway'}
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span className="whitespace-nowrap">{isAr ? 'ابدأ مسار الدعم' : 'Get Support'}</span>
            </button>

            {/* Hamburger Menu Toggle (Visible on screens below lg: < 1024px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8 sm:h-9 w-8 sm:w-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-[#F4E8DF]/60 focus:outline-hidden transition-colors cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? (isAr ? 'إغلاق القائمة' : 'Close navigation') : (isAr ? 'فتح القائمة' : 'Open navigation')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#694E91]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. RESPONSIVE MOBILE & TABLET NAVIGATION DRAWER           */}
      {/* Covers 320px, 375px, 430px, 768px, 820px smoothly        */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in" 
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel (RTL Start) */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-s border-[#F4E8DF]">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#F4E8DF] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-1 border border-[#F4E8DF] flex items-center justify-center shadow-xs overflow-hidden">
                  <img src="/campaign-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-black text-xs text-[#1B1B3A]">
                    {isAr ? 'حملة دعم مرضى الثلاسيميا' : 'Thalassemia Support'}
                  </div>
                  <div className="text-[10px] text-[#694E91] font-semibold">
                    {isAr ? 'دعمٌ يمتدّ إلى الحياة' : 'Support Extending to Life'}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                aria-label={isAr ? 'إغلاق القائمة' : 'Close menu'}
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            {/* Drawer Links Body (Scrollable with Accordions) */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              
              {/* ITEM 1: الرئيسية */}
              <button
                onClick={() => handleItemClick('hero')}
                className={`w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === 'hero'
                    ? 'bg-[#694E91] text-white font-black shadow-xs'
                    : 'text-slate-800 hover:bg-[#F4E8DF]/40'
                }`}
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              {/* ITEM 2: عن الثلاسيميا (Accordion) */}
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('about')}
                  className="w-full text-start px-3.5 py-2.5 text-xs font-bold flex items-center justify-between text-slate-800 cursor-pointer hover:bg-[#F4E8DF]/30"
                >
                  <span className={isAboutActive ? 'text-[#694E91] font-black' : ''}>
                    {isAr ? 'عن الثلاسيميا' : 'About Thalassemia'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordions.about ? 'rotate-180 text-[#694E91]' : ''
                  }`} />
                </button>

                {mobileAccordions.about && (
                  <div className="px-2 pb-2 space-y-1 bg-white border-t border-slate-100 pt-1">
                    <button
                      onClick={() => handleItemClick('education')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'education' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#694E91]" />
                      <span>{isAr ? 'التعريف بالثلاسيميا' : 'What is Thalassemia?'}</span>
                    </button>
                    <button
                      onClick={() => handleItemClick('genetics')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'genetics' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Dna className="w-3.5 h-3.5 text-[#B72E43]" />
                      <span>{isAr ? 'كيف تنتقل وراثيًا' : 'Genetics'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* ITEM 3: خدماتنا (Accordion) */}
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('services')}
                  className="w-full text-start px-3.5 py-2.5 text-xs font-bold flex items-center justify-between text-slate-800 cursor-pointer hover:bg-[#F4E8DF]/30"
                >
                  <span className={isServicesActive ? 'text-[#694E91] font-black' : ''}>
                    {isAr ? 'خدماتنا' : 'Our Services'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordions.services ? 'rotate-180 text-[#694E91]' : ''
                  }`} />
                </button>

                {mobileAccordions.services && (
                  <div className="px-2 pb-2 space-y-1 bg-white border-t border-slate-100 pt-1">
                    <button
                      onClick={() => handleItemClick('services')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'services' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#694E91]" />
                      <span>{isAr ? 'الخدمات المتاحة' : 'Available Services'}</span>
                    </button>
                    <button
                      onClick={() => handleItemClick('directorates')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === 'directorates' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B72E43]" />
                        <span>{isAr ? 'خريطة المديريات' : 'Directorates Map'}</span>
                      </div>
                      <span className="text-[10px] px-1 rounded bg-[#694E91]/10 text-[#694E91] font-bold">
                        {isAr ? 'صفحة' : 'Page'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* ITEM 4: التوعية (Accordion) */}
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('awareness')}
                  className="w-full text-start px-3.5 py-2.5 text-xs font-bold flex items-center justify-between text-slate-800 cursor-pointer hover:bg-[#F4E8DF]/30"
                >
                  <span className={isAwarenessActive ? 'text-[#694E91] font-black' : ''}>
                    {isAr ? 'التوعية' : 'Awareness'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordions.awareness ? 'rotate-180 text-[#694E91]' : ''
                  }`} />
                </button>

                {mobileAccordions.awareness && (
                  <div className="px-2 pb-2 space-y-1 bg-white border-t border-slate-100 pt-1">
                    <button
                      onClick={() => handleItemClick('stigma')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'stigma' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2E6F56]" />
                      <span>{isAr ? 'ليست وصمة' : 'Not a Stigma'}</span>
                    </button>

                    <button
                      onClick={() => handleItemClick('stories')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === 'stories' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Film className="w-3.5 h-3.5 text-[#B72E43]" />
                        <span>{isAr ? 'قصص وفيديوهات' : 'Stories'}</span>
                      </div>
                      <span className="text-[10px] px-1 rounded bg-[#694E91]/10 text-[#694E91] font-bold">
                        {isAr ? 'صفحة' : 'Page'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleItemClick('myth-vs-fact')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === 'myth-vs-fact' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-[#B72E43]" />
                        <span>{isAr ? 'صح أم خطأ؟' : 'Myth vs Fact'}</span>
                      </div>
                      <span className="text-[10px] px-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {isAr ? 'تحدي' : 'Quiz'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleItemClick('faq')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'faq' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#694E91]" />
                      <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
                    </button>

                    <button
                      onClick={handleGameClick}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === 'game' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-3.5 h-3.5 text-[#694E91]" />
                        <span>{isAr ? 'اللعبة التعليمية' : 'Game'}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#B72E43]/10 text-[#B72E43] font-bold">
                        {isAr ? 'العب' : 'Play'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* ITEM 5: أثرنا */}
              <button
                onClick={() => handleItemClick('impact')}
                className={`w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeSection === 'impact'
                    ? 'bg-[#694E91] text-white font-black shadow-xs'
                    : 'text-slate-800 hover:bg-[#F4E8DF]/40'
                }`}
              >
                <span>{isAr ? 'أثرنا' : 'Our Impact'}</span>
              </button>

              {/* ITEM 6: من نحن وساهم (Accordion) */}
              <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => toggleMobileAccordion('whoWeAre')}
                  className="w-full text-start px-3.5 py-2.5 text-xs font-bold flex items-center justify-between text-slate-800 cursor-pointer hover:bg-[#F4E8DF]/30"
                >
                  <span className={isWhoWeAreActive ? 'text-[#694E91] font-black' : ''}>
                    {isAr ? 'من نحن' : 'About Us'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${
                    mobileAccordions.whoWeAre ? 'rotate-180 text-[#694E91]' : ''
                  }`} />
                </button>

                {mobileAccordions.whoWeAre && (
                  <div className="px-2 pb-2 space-y-1 bg-white border-t border-slate-100 pt-1">
                    <button
                      onClick={() => handleItemClick('about-us')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer ${
                        activeSection === 'about-us' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#694E91]" />
                      <span>{isAr ? 'من نحن (الرؤية والشراكة)' : 'Who We Are'}</span>
                    </button>

                    <button
                      onClick={() => handleItemClick('contribute')}
                      className={`w-full text-start px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === 'contribute' ? 'bg-[#F4E8DF] text-[#694E91] font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <HandHeart className="w-3.5 h-3.5 text-[#B72E43]" />
                        <span>{isAr ? 'ساهم في توسيع الأثر' : 'Contribute'}</span>
                      </div>
                      <span className="text-[10px] px-1 rounded bg-[#B72E43]/10 text-[#B72E43] font-bold">
                        {isAr ? 'مشاركة' : 'Join'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* ITEM 7: الأسئلة الشائعة */}
              <button
                onClick={handleFaqClick}
                className="w-full text-start px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#694E91]" />
                <span>{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</span>
              </button>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#F4E8DF] bg-[#FAF7F2] space-y-3">
              
              {/* Toll-free 189 Banner */}
              <a
                href="tel:189"
                className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#694E91]/20 flex items-center justify-between text-slate-800 hover:border-[#694E91] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#694E91]" />
                  <span className="text-xs font-bold">{isAr ? 'الرقم المجاني المعتمد' : 'Toll-Free'}</span>
                </div>
                <span className="font-mono font-black text-sm text-[#694E91]">189</span>
              </a>

              {/* Main CTA in Drawer */}
              <button
                onClick={() => handleItemClick('request')}
                className="w-full py-3 px-4 rounded-xl bg-[#B72E43] hover:bg-[#9E2336] text-white font-black text-xs text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
              >
                <Heart className="w-4 h-4 fill-white text-white" />
                <span>{isAr ? 'ابدأ مسار الدعم لأسرتك' : 'Start Support Pathway'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
