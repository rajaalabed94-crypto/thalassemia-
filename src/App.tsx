import React, { useState, useEffect, useCallback } from 'react';
import { Language, SupportRequest, ServiceCategory } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSlider } from './components/ServicesSlider';
import { KnowThalassemia } from './components/KnowThalassemia';
import { GeneticsInteractiveDiagram } from './components/GeneticsInteractiveDiagram';
import { NotAStigma } from './components/NotAStigma';
import { HumanStories } from './components/HumanStories';
import { SupportRequestSection } from './components/SupportRequestSection';
import { MinistryDirectoratesSearch } from './components/MinistryDirectoratesSearch';
import { AboutUsPage } from './components/AboutUsPage';
import { TpfsSection } from './components/TpfsSection';
import { ImpactDashboardPage } from './components/ImpactDashboardPage';
import { DynamicNumbersSection } from './components/DynamicNumbersSection';
import { PalestineInteractiveData } from './components/PalestineInteractiveData';
import { PartnersAndImpactDashboard } from './components/PartnersAndImpactDashboard';
import { ContributePage } from './components/ContributePage';
import { Footer } from './components/Footer';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { MythVsFactSection } from './components/MythVsFactSection';
import { FaqSection } from './components/FaqSection';
import { HemoglobinHeroGame } from './components/game/HemoglobinHeroGame';
import { MobileQuickActions } from './components/MobileQuickActions';
import { GeminiChatbot } from './components/GeminiChatbot';
import {
  AudioSpeechProvider,
  FloatingAudioBar,
  SpeakButton
} from './context/AudioSpeechContext';
import { ArrowRight, ArrowLeft, Gamepad2 } from 'lucide-react';

const LOCAL_STORAGE_LANG_KEY = 'thalassemia_platform_lang_2026';

export type PageView =
  | 'home'
  | 'education'
  | 'genetics'
  | 'services'
  | 'stigma'
  | 'myth-vs-fact'
  | 'stories'
  | 'faq'
  | 'game'
  | 'directorates'
  | 'impact'
  | 'about-us'
  | 'contribute';

const DEDICATED_PAGES: PageView[] = [
  'education',
  'genetics',
  'services',
  'stigma',
  'myth-vs-fact',
  'stories',
  'faq',
  'game',
  'directorates',
  'impact',
  'about-us',
  'contribute'
];

const PAGE_PATHS: Record<PageView, string> = {
  home: '/',
  education: '/education',
  genetics: '/genetics',
  services: '/services',
  stigma: '/stigma',
  'myth-vs-fact': '/myth-vs-fact',
  stories: '/stories',
  faq: '/faq',
  game: '/game',
  directorates: '/directorates',
  impact: '/impact',
  'about-us': '/about-us',
  contribute: '/contribute'
};

function parseRouteFromLocation(): { page: PageView; scrollTo?: string } {
  if (typeof window === 'undefined') return { page: 'home' };

  const cleanPath = window.location.pathname.replace(/\/+$/, '') || '/';
  if (cleanPath === '/request' || cleanPath === '/support') {
    return { page: 'home', scrollTo: 'request' };
  }

  for (const page of DEDICATED_PAGES) {
    if (PAGE_PATHS[page] === cleanPath) {
      return { page };
    }
  }

  const hashId = window.location.hash.replace(/^#/, '');
  if (DEDICATED_PAGES.includes(hashId as PageView)) {
    return { page: hashId as PageView };
  }
  if (hashId === 'request' || hashId === 'explore') {
    return { page: 'home', scrollTo: hashId };
  }

  return { page: 'home' };
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    return saved === 'en' || saved === 'ar' ? saved : 'ar';
  });

  const initialRoute = parseRouteFromLocation();
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [activeSection, setActiveSection] = useState<string>(
    initialRoute.scrollTo || (initialRoute.page === 'home' ? 'hero' : initialRoute.page)
  );
  const [prefilledNeed, setPrefilledNeed] = useState<ServiceCategory | null>(null);
  const [prefilledGovernorate, setPrefilledGovernorate] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sync document RTL / LTR based on language
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, language);
  }, [language]);

  const scrollToHomeElement = useCallback((targetId: string) => {
    const elem = document.getElementById(targetId);
    if (elem) {
      const headerOffset = 84;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      elem.classList.remove('section-target-highlight');
      void elem.offsetWidth;
      elem.classList.add('section-target-highlight');

      setTimeout(() => {
        elem.classList.remove('section-target-highlight');
      }, 2400);
    }
  }, []);

  // Scroll to target if opened directly via /request or #request
  useEffect(() => {
    if (initialRoute.scrollTo && initialRoute.page === 'home') {
      const timer = setTimeout(() => scrollToHomeElement(initialRoute.scrollTo!), 120);
      return () => clearTimeout(timer);
    }
  }, [initialRoute.page, initialRoute.scrollTo, scrollToHomeElement]);

  // Sync Browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromLocation();
      setCurrentPage(parsed.page);
      setActiveSection(parsed.scrollTo || (parsed.page === 'home' ? 'hero' : parsed.page));
      if (parsed.scrollTo && parsed.page === 'home') {
        setTimeout(() => scrollToHomeElement(parsed.scrollTo!), 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToHomeElement]);

  const handleNavigate = useCallback(
    (targetId: string) => {
      // Dedicated Independent Pages with Real Browser URLs
      if (DEDICATED_PAGES.includes(targetId as PageView)) {
        const nextPage = targetId as PageView;
        setCurrentPage(nextPage);
        setActiveSection(nextPage);
        const nextPath = PAGE_PATHS[nextPage];
        if (window.location.pathname !== nextPath) {
          window.history.pushState({ page: nextPage }, '', nextPath);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Home root
      if (targetId === 'home' || targetId === 'hero') {
        setCurrentPage('home');
        setActiveSection('hero');
        if (window.location.pathname !== '/' || window.location.hash) {
          window.history.pushState({ page: 'home' }, '', '/');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Section on Home Page (e.g. #request, #explore)
      setActiveSection(targetId);
      if (currentPage !== 'home') {
        setCurrentPage('home');
        window.history.pushState({ page: 'home' }, '', `/#${targetId}`);
        setTimeout(() => scrollToHomeElement(targetId), 90);
      } else {
        setTimeout(() => scrollToHomeElement(targetId), 10);
      }
    },
    [currentPage, scrollToHomeElement]
  );

  // ScrollSpy for Home Page sections
  useEffect(() => {
    if (currentPage !== 'home') return;

    const navSectionIds = ['hero', 'explore', 'request'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1
      }
    );

    navSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  // Global listener for in-page hash links
  useEffect(() => {
    const handleHashLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          if (targetId) {
            e.preventDefault();
            handleNavigate(targetId);
          }
        }
      }
    };

    document.addEventListener('click', handleHashLinkClick);
    return () => document.removeEventListener('click', handleHashLinkClick);
  }, [handleNavigate]);

  const handleCreateRequestSuccess = (_newRequest: SupportRequest) => {
    // Intentionally avoid persisting personal/medical fields in browser localStorage
  };

  const handleSelectServiceFromSlider = (category: ServiceCategory) => {
    setPrefilledNeed(category);
    handleNavigate('request');
  };

  const isAr = language === 'ar';
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const pageLabels: Record<Exclude<PageView, 'home'>, { ar: string; en: string }> = {
    education: { ar: 'التعريف بالثلاسيميا والملف الطبي', en: 'Know Thalassemia & Medical Dossier' },
    genetics: { ar: 'كيف تنتقل الثلاسيميا وراثياً', en: 'Genetics & Punnett Square' },
    services: { ar: 'خدماتنا وبرامج الحماية الاجتماعية', en: 'Our Services & Social Protection' },
    stigma: { ar: 'ميثاق: الثلاسيميا ليست وصمة', en: 'Thalassemia Is Not a Stigma' },
    'myth-vs-fact': { ar: 'تحدي صح أم خطأ؟ (المفاهيم الشائعة)', en: 'Myth vs. Fact Quiz' },
    stories: { ar: 'قصص وفيديوهات ملهمة', en: 'Stories & Videos' },
    faq: { ar: 'الأسئلة الشائعة والإجابات الرسمية', en: 'Frequently Asked Questions' },
    game: { ar: 'اللعبة التعليمية: بطل الهيموجلوبين', en: 'Educational Game: Hemoglobin Hero' },
    directorates: { ar: 'خريطة مديريات التنمية الاجتماعية', en: 'MoSD Directorates Map' },
    impact: { ar: 'لوحة القياس والأثر والمحافظات', en: 'Impact Dashboard & Regional Data' },
    'about-us': { ar: 'من نحن والشراكة الوطنية', en: 'About Us & Partnership' },
    contribute: { ar: 'ساهم في توسيع الأثر', en: 'Contribute & Partner' }
  };

  return (
    <AudioSpeechProvider language={language}>
      <div
        className={`min-h-screen flex flex-col font-sans bg-[#FAF7F2] selection:bg-[#634B8F] selection:text-white max-w-full overflow-x-clip ${
          isAr ? 'font-cairo' : ''
        }`}
      >
        {/* Floating Accessibility Widget */}
        <AccessibilityWidget language={language} />

        {/* Header */}
        <Header
          language={language}
          onLanguageChange={setLanguage}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenFaq={() => handleNavigate('faq')}
          onOpenGame={() => handleNavigate('game')}
        />

        {/* Breadcrumb Top Navigation for Every Independent Dedicated Page */}
        {currentPage !== 'home' && (
          <div className="bg-white border-b border-[#EADFD5] py-3.5 px-4 sm:px-6 shadow-xs sticky top-[64px] sm:top-[72px] z-30">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleNavigate('home')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-[#634B8F] hover:text-[#523D77] transition-all cursor-pointer group active:scale-95"
              >
                <BackIcon className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                <span>{isAr ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span className="hidden sm:inline">{isAr ? 'المنصة الوطنية' : 'Platform'}</span>
                <span className="hidden sm:inline">/</span>
                <span className="text-[#1B1B3A] font-black">
                  {pageLabels[currentPage]?.[language]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main Container */}
        <main className="flex-1 max-w-full overflow-x-clip">
          {/* ========================================================= */}
          {/* VIEW 1: HOME PAGE (الرئيسية المختصرة والمنظمة)            */}
          {/* ========================================================= */}
          {currentPage === 'home' && (
            <>
              <Hero
                language={language}
                onNavigate={handleNavigate}
                onOpenFaq={() => handleNavigate('faq')}
              />

              {/* Preserved Support Request Form */}
              <SupportRequestSection
                language={language}
                prefilledNeed={prefilledNeed}
                prefilledGovernorate={prefilledGovernorate}
                onSubmitSuccess={handleCreateRequestSuccess}
                onNavigateToDirectorates={() => handleNavigate('directorates')}
              />
            </>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /education (التعريف بالثلاسيميا)         */}
          {/* ========================================================= */}
          {currentPage === 'education' && (
            <div className="animate-in fade-in duration-200">
              <KnowThalassemia
                language={language}
                onOpenGame={() => handleNavigate('game')}
                onNavigateToGenetics={() => handleNavigate('genetics')}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /genetics (كيف تنتقل وراثياً)             */}
          {/* ========================================================= */}
          {currentPage === 'genetics' && (
            <div className="animate-in fade-in duration-200">
              <GeneticsInteractiveDiagram language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /services (خدماتنا وبرامج الحماية)        */}
          {/* ========================================================= */}
          {currentPage === 'services' && (
            <div className="animate-in fade-in duration-200">
              <ServicesSlider
                language={language}
                onSelectServiceForRequest={handleSelectServiceFromSlider}
                initialShowAll={true}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /stigma (الثلاسيميا ليست وصمة)           */}
          {/* ========================================================= */}
          {currentPage === 'stigma' && (
            <div className="animate-in fade-in duration-200">
              <NotAStigma language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /myth-vs-fact (صح أم خطأ)                */}
          {/* ========================================================= */}
          {currentPage === 'myth-vs-fact' && (
            <div className="animate-in fade-in duration-200">
              <MythVsFactSection language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /stories (قصص وفيديوهات)                  */}
          {/* ========================================================= */}
          {currentPage === 'stories' && (
            <div className="animate-in fade-in duration-200">
              <HumanStories
                language={language}
                onNavigateToRequest={() => handleNavigate('request')}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /faq (الأسئلة الشائعة)                   */}
          {/* ========================================================= */}
          {currentPage === 'faq' && (
            <div className="animate-in fade-in duration-200">
              <FaqSection
                language={language}
                onNavigateToRequest={() => handleNavigate('request')}
                onNavigateToDirectorates={() => handleNavigate('directorates')}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /game (اللعبة التعليمية: بطل الهيموجلوبين) */}
          {/* ========================================================= */}
          {currentPage === 'game' && (
            <section className="py-10 sm:py-14 bg-[#FAF7F2] border-b border-[#EADFD5] animate-in fade-in duration-200">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E1B28]/10 text-[#9E1B28] text-xs font-black">
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'صفحة اللعبة التعليمية التفاعلية' : 'Interactive Educational Game'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-4xl font-black text-[#1B1B3A] tracking-tight">
                        {isAr ? 'لعبة بطل الهيموجلوبين' : 'Hemoglobin Hero Quest'}
                      </h1>
                      <SpeakButton
                        id="game-page-intro"
                        text={
                          isAr
                            ? 'لعبة بطل الهيموجلوبين التعليمية. قُد كريات الدم الحمراء في مجرى الدم، واجمع جزيئات الأكسجين لتغذية الأعضاء الحيوية، واستخدم درع طرد الحديد الزائد لحماية القلب والكبد.'
                            : 'Hemoglobin Hero Educational Game. Guide red blood cells through the bloodstream, collect oxygen packets, and activate iron chelation shields.'
                        }
                        title={isAr ? 'شرح اللعبة التعليمية' : 'Game Instructions'}
                        size="md"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      {isAr
                        ? 'تجربة تفاعلية توضح أهمية نقل الأكسجين والالتزام بأدوية طرد الحديد لحماية القلب والكبد.'
                        : 'An interactive simulation demonstrating oxygen delivery and iron chelation protection.'}
                    </p>
                  </div>
                </div>

                <HemoglobinHeroGame
                  embedded={true}
                  language={language}
                  onClose={() => handleNavigate('home')}
                  onNavigateToSupport={() => handleNavigate('request')}
                />
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /directorates (خريطة المديريات)          */}
          {/* ========================================================= */}
          {currentPage === 'directorates' && (
            <div className="animate-in fade-in duration-200">
              <MinistryDirectoratesSearch language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /impact (لوحة القياس والأثر والمحافظات)   */}
          {/* ========================================================= */}
          {currentPage === 'impact' && (
            <div className="animate-in fade-in duration-200">
              <ImpactDashboardPage language={language} />
              <DynamicNumbersSection language={language} />
              <PalestineInteractiveData
                language={language}
                onSelectGovernorateForRequest={(govName) => {
                  setPrefilledGovernorate(govName);
                  handleNavigate('request');
                }}
              />
              <PartnersAndImpactDashboard language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /about-us (من نحن والجمعية الشريكة)      */}
          {/* ========================================================= */}
          {currentPage === 'about-us' && (
            <div className="animate-in fade-in duration-200">
              <AboutUsPage language={language} />
              <TpfsSection language={language} />
            </div>
          )}

          {/* ========================================================= */}
          {/* DEDICATED PAGE: /contribute (ساهم في توسيع الأثر)         */}
          {/* ========================================================= */}
          {currentPage === 'contribute' && (
            <div className="animate-in fade-in duration-200">
              <ContributePage language={language} />
            </div>
          )}
        </main>

        {/* Quick Actions (Support Pathway + Chatbot) */}
        <MobileQuickActions
          language={language}
          onNavigate={handleNavigate}
          onOpenChatbot={() => setIsChatOpen(true)}
        />

        {/* Site-Only Chatbot Modal Controlled from Quick Actions */}
        <GeminiChatbot
          language={language}
          isOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          hideFloatingButton={true}
        />

        {/* Footer */}
        <Footer
          language={language}
          onNavigate={handleNavigate}
          onOpenFaq={() => handleNavigate('faq')}
        />

        {/* Floating Audio Reading Bar with Live Controls & Voice Error Alert */}
        <FloatingAudioBar />
      </div>
    </AudioSpeechProvider>
  );
}
