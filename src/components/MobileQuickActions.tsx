import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import {
  Heart,
  Bot,
  X,
  Menu,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface MobileQuickActionsProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
  onOpenChatbot: () => void;
}

export const MobileQuickActions: React.FC<MobileQuickActionsProps> = ({
  language,
  onNavigate,
  onOpenChatbot
}) => {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <aside
      aria-label={isAr ? 'خيارات سريعة' : 'Quick Options'}
      className="fixed bottom-5 start-4 z-40 select-none"
    >
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 animate-in fade-in duration-200"
            aria-hidden="true"
          />

          {/* Options Card — Strictly 2 options: Start Support Pathway & Chatbot */}
          <div
            className="absolute bottom-16 start-0 z-50 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border-2 border-[#694E91]/20 p-4 space-y-3 animate-in slide-in-from-bottom-5 zoom-in-95 duration-200"
            role="menu"
            aria-label={isAr ? 'قائمة الخيارات السريعة' : 'Quick Options Menu'}
          >
            {/* Header of Popup */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#694E91]/10 text-[#694E91] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#694E91]" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    {isAr ? 'خيارات سريعة' : 'Quick Options'}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isAr ? 'اختر الخدمة المطلوبة مباشرة' : 'Choose an option directly'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label={isAr ? 'إغلاق الخيارات' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Strictly Two Options Only */}
            <div className="space-y-2 pt-1">
              {/* Option 1: ابدأ مسار الدعم */}
              <button
                onClick={() => handleAction(() => onNavigate('request'))}
                className="w-full text-start p-3 rounded-2xl bg-gradient-to-r from-[#9E1B28] to-[#B3202E] text-white flex items-center gap-3 shadow-xs hover:shadow transition-all cursor-pointer group active:scale-98"
                role="menuitem"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-white text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black block leading-tight">
                    {isAr ? 'ابدأ مسار الدعم' : 'Start Support Pathway'}
                  </span>
                  <span className="text-[10px] text-white/85 block mt-0.5">
                    {isAr ? 'تعبئة نموذج طلب الدعم الرسمي' : 'Submit official support request'}
                  </span>
                </div>
              </button>

              {/* Option 2: شات بوت */}
              <button
                onClick={() => handleAction(onOpenChatbot)}
                className="w-full text-start p-3 rounded-2xl bg-[#694E91] hover:bg-[#573E7B] text-white flex items-center gap-3 shadow-xs hover:shadow transition-all cursor-pointer group active:scale-98"
                role="menuitem"
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#E4D7FC]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black block leading-tight">
                    {isAr ? 'شات بوت' : 'Chatbot'}
                  </span>
                  <span className="text-[10px] text-white/85 block mt-0.5">
                    {isAr ? 'إجابات من محتوى الموقع أو طلب تواصل' : 'Site-only answers or request callback'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={isAr ? 'خيارات سريعة' : 'Quick Options'}
        className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full text-white font-black text-xs shadow-2xl transition-all cursor-pointer active:scale-95 border-2 ${
          isOpen
            ? 'bg-[#B72E43] border-white ring-4 ring-[#B72E43]/30 scale-105'
            : 'bg-[#694E91] hover:bg-[#573E7B] border-[#E4D7FC] ring-2 ring-[#694E91]/20'
        }`}
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4 text-white" />
            <span>{isAr ? 'إغلاق الخيارات' : 'Close'}</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Menu className="w-4 h-4 text-[#E4D7FC]" />
              <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <span>{isAr ? 'خيارات سريعة' : 'Quick Options'}</span>
            <ChevronUp className="w-3.5 h-3.5 text-[#E4D7FC]/80" />
          </>
        )}
      </button>
    </aside>
  );
};
