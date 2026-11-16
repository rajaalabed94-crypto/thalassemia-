import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  Eye, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Accessibility, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAudioSpeech } from '../context/AudioSpeechContext';

interface AccessibilityWidgetProps {
  language: Language;
}

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({ language }) => {
  const isAr = language === 'ar';
  const { isPlaying, audioError, hasArabicVoice, cloudTtsConfigured, isSpeechSupported, stop: stopAudio, speak } = useAudioSpeech();
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(100); // 100%, 115%, 130%
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  // Apply High Contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  // Apply Font Zoom
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizeLevel}%`;
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [fontSizeLevel]);

  // Apply Dyslexia font class
  useEffect(() => {
    if (dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-friendly');
    } else {
      document.documentElement.classList.remove('dyslexia-friendly');
    }
  }, [dyslexiaFont]);

  // Text-to-speech for selected text or quick reader
  const handleToggleSpeech = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    const selectedText = window.getSelection()?.toString().trim();
    const textToRead = selectedText || (isAr 
      ? 'أهلاً بكم في المنصة الوطنية لدعم وتمكين مرضى الثلاسيميا وأسرهم في فلسطين، بالشراكة بين وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا. نوفر الحماية الاجتماعية، المساعدات وفق الاستحقاق، الدعم النفسي والاجتماعي، وإدارة الحالة، والتمكين الاقتصادي.'
      : 'Welcome to the National Platform for Thalassemia Support and Empowerment in Palestine, in partnership between the Ministry of Social Development and TPFS.');

    speak('accessibility-overview', textToRead, isAr ? 'نظرة عامة على الحملة' : 'Campaign Overview');
  };

  const handleReset = () => {
    setHighContrast(false);
    setFontSizeLevel(100);
    setDyslexiaFont(false);
    stopAudio();
  };

  return (
    <>
      {/* Floating Accessibility Trigger Button (Fully visible with safe screen margins) */}
      <div 
        className="fixed bottom-24 sm:bottom-8 right-4 sm:right-6 rtl:right-auto rtl:left-4 rtl:sm:left-6 z-50 flex items-center"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isAr ? 'أدوات إمكانية الوصول' : 'Accessibility Options'}
          className="bg-[#634B8F] hover:bg-[#523D77] text-white px-3.5 py-3 rounded-full shadow-2xl border-2 border-white ring-2 ring-[#634B8F]/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
          title={isAr ? 'إمكانية الوصول وذوو الاحتياجات الخاصة' : 'Accessibility & Special Needs Tools'}
        >
          <Accessibility className="w-5 h-5 text-white" />
          <span className="text-xs font-black tracking-wide">
            {isAr ? 'إمكانية الوصول' : 'Accessibility'}
          </span>
        </button>
      </div>

      {/* Accessibility Controls Panel Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border-2 border-[#7A1822]/20 shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 text-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#7A1822]/10 text-[#7A1822] flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-[#7A1822]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isAr ? 'أدوات سهولة الوصول' : 'Accessibility Tools'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isAr ? 'تخصيص العرض لذوي الاحتياجات وضعاف البصر' : 'Customize viewing & audio features'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-4">
              
              {/* 1. High Contrast */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-[#7A1822]" />
                  <div>
                    <span className="text-xs font-black block">
                      {isAr ? 'التباين العالي (High Contrast)' : 'High Contrast Mode'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isAr ? 'زيادة وضوح النصوص والخلفيات' : 'Sharp black & white visual contrast'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    highContrast ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {highContrast ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Off')}
                  </span>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      highContrast ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span 
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        highContrast ? 'ltr:translate-x-7 rtl:-translate-x-7' : 'ltr:translate-x-1 rtl:-translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 2. Font Size Zoom */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">
                    {isAr ? 'حجم الخط والتكبير' : 'Text Size & Scaling'}
                  </span>
                  <span className="text-xs font-bold text-[#7A1822] bg-[#7A1822]/10 px-2 py-0.5 rounded-md">
                    {fontSizeLevel}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => setFontSizeLevel(100)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      fontSizeLevel === 100 
                        ? 'bg-[#7A1822] text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{isAr ? 'افتراضي' : 'Default'}</span>
                  </button>

                  <button
                    onClick={() => setFontSizeLevel(115)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      fontSizeLevel === 115 
                        ? 'bg-[#7A1822] text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>+15%</span>
                  </button>

                  <button
                    onClick={() => setFontSizeLevel(130)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      fontSizeLevel === 130 
                        ? 'bg-[#7A1822] text-white shadow-xs' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>+30%</span>
                  </button>
                </div>
              </div>

              {/* 3. Text to Speech Reader */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-[#7A1822] animate-bounce' : 'text-slate-600'}`} />
                    <div>
                      <span className="text-xs font-black block">
                        {isAr ? 'القراءة الصوتية التلقائية' : 'Text-to-Speech Reader'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {isAr ? 'حدد أي نص أو انقر للاستماع' : 'Highlight text or click to listen'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleSpeech}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlaying 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : 'bg-[#7A1822] text-white hover:bg-[#911D29]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إيقاف' : 'Stop'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'قراءة' : 'Listen'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Helpful Tip & Live Voice Readiness */}
                {audioError || (hasArabicVoice === false && cloudTtsConfigured === false) || (!isSpeechSupported && cloudTtsConfigured === false) ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-900 leading-relaxed">
                    {audioError ||
                      (isAr
                        ? 'تنبيه: لا تتوفر حزمة صوت عربي محلية على هذا الجهاز، والخدمة السحابية للصوت غير مفعّلة بعد على الخادم.'
                        : 'Notice: No local Arabic TTS voice detected and server Cloud TTS is not configured yet.')}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EADFD5] text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                    <span className="text-base shrink-0">💡</span>
                    <p>
                      {isAr 
                        ? 'القراءة المباشرة بضغطة واحدة: انقر على أيقونة السماعة بجانب أي عنوان أو فقرة أو سؤال وجواب في الموقع للاستماع فوراً دون الحاجة لفتح هذه القائمة.' 
                        : 'One-click audio: Click the speaker icon beside any heading, paragraph, or FAQ on the site to listen immediately.'}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Dyslexia / Clean Font */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#7A1822]" />
                  <div>
                    <span className="text-xs font-black block">
                      {isAr ? 'خط واضح مريح للقراءة' : 'Readable Sans-Serif Font'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isAr ? 'تبسيط الخط وتوسيع المسافات' : 'Increased letter spacing & clarity'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    dyslexiaFont ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {dyslexiaFont ? (isAr ? 'مفعل' : 'Active') : (isAr ? 'معطل' : 'Off')}
                  </span>
                  <button
                    onClick={() => setDyslexiaFont(!dyslexiaFont)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      dyslexiaFont ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span 
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        dyslexiaFont ? 'ltr:translate-x-7 rtl:-translate-x-7' : 'ltr:translate-x-1 rtl:-translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Reset & Close */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ضبط الإعدادات' : 'Reset to Default'}</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#7A1822] text-white text-xs font-black hover:bg-[#911D29] cursor-pointer"
              >
                {isAr ? 'تم وحفظ' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
