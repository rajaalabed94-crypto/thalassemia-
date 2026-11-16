import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  User,
  PhoneCall,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { useAudioSpeech } from '../context/AudioSpeechContext';
import { tryDeterministicSiteAnswer } from '../../shared/campaignEngine';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  needsCallback?: boolean;
  unansweredQuestion?: string;
  callbackSubmitted?: boolean;
  callbackReferenceCode?: string;
}

interface GeminiChatbotProps {
  language: Language;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideFloatingButton?: boolean;
}

const PRESET_PROMPTS = [
  { ar: 'ما هي الثلاسيميا وما أبرز أعراضها؟', en: 'What is thalassemia and its symptoms?' },
  { ar: 'كيف تنتقل الثلاسيميا وراثياً؟', en: 'How is thalassemia inherited?' },
  { ar: 'ما هي الخدمات التي تقدمها الحملة ووزارة التنمية؟', en: 'What services does the campaign provide?' },
  { ar: 'ما حقوق مريض الثلاسيميا في المدرسة والعمل؟', en: 'What are patient rights at school and work?' }
];

function createGreetingMessage(language: Language): Message {
  const isAr = language === 'ar';
  return {
    id: 'msg-0',
    role: 'model',
    text: isAr
      ? 'أهلاً بك! أنا شات بوت حملة التوعية والدعم لمرضى الثلاسيميا. أستطيع الإجابة على أسئلتك من المعلومات المنشورة في الموقع فقط، وفي حال لم تتوفر الإجابة في الموقع سأطلب اسمك الكامل ورقم هاتفك ليتواصل معك فريقنا.'
      : 'Welcome! I am the Thalassemia Campaign Chatbot. I answer strictly from information published on this website, and if your question is not covered here, I will collect your full name and phone number so our team can reach out to you.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  language,
  isOpen: controlledIsOpen,
  onOpenChange,
  hideFloatingButton = false
}) => {
  const isAr = language === 'ar';
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean) => {
    if (onOpenChange) {
      onOpenChange(val);
    } else {
      setInternalIsOpen(val);
    }
  };

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [createGreetingMessage(language)]);
  const [callbackForms, setCallbackForms] = useState<Record<string, { fullName: string; phone: string }>>({});
  const [callbackSubmittingId, setCallbackSubmittingId] = useState<string | null>(null);
  const [callbackErrorByMsg, setCallbackErrorByMsg] = useState<Record<string, string>>({});

  const { activeId, isPlaying, isPaused, speak, stop } = useAudioSpeech();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'msg-0') {
        return [createGreetingMessage(language)];
      }
      return prev;
    });
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const submitCallbackLead = async (
    targetMsgId: string,
    rawFullName: string,
    rawPhone: string,
    questionText: string
  ) => {
    const cleanName = rawFullName.trim();
    const cleanPhone = rawPhone.trim();

    if (cleanName.length < 2) {
      setCallbackErrorByMsg((prev) => ({
        ...prev,
        [targetMsgId]: isAr ? 'يرجى كتابة الاسم الكامل.' : 'Please enter your full name.'
      }));
      return false;
    }

    if (cleanPhone.replace(/\D/g, '').length < 7) {
      setCallbackErrorByMsg((prev) => ({
        ...prev,
        [targetMsgId]: isAr ? 'يرجى كتابة رقم هاتف صحيح للتواصل.' : 'Please enter a valid phone number.'
      }));
      return false;
    }

    setCallbackErrorByMsg((prev) => {
      const next = { ...prev };
      delete next[targetMsgId];
      return next;
    });
    setCallbackSubmittingId(targetMsgId);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      const res = await fetch('/api/chat-callbacks', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          fullName: cleanName,
          phone: cleanPhone,
          question: questionText || (isAr ? 'استفسار عبر الشات بوت' : 'Chatbot inquiry'),
          idempotencyKey: targetMsgId
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          isAr
            ? 'خدمة حفظ طلبات التواصل غير مفعّلة بعد في الاستضافة الحالية. يرجى الاتصال مباشرة على الرقم المجاني 189.'
            : 'Callback storage service is not enabled on this deployment yet. Please call toll-free 189.'
        );
      }

      const data = await res.json();
      if (!res.ok || !data.success || !data.persistedOnServer) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const refCode = String(data.referenceCode || '');

      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === targetMsgId
            ? {
                ...m,
                callbackSubmitted: true,
                callbackReferenceCode: refCode
              }
            : m
        ),
        {
          id: `bot-confirm-${Date.now()}`,
          role: 'model',
          text: isAr
            ? `تم استلام بياناتك بنجاح (${cleanName} - ${cleanPhone}) برقم مرجع (${refCode}). سيتواصل معك فريقنا المختص في أقرب وقت.`
            : `Your contact details (${cleanName} - ${cleanPhone}) have been recorded under reference (${refCode}). Our team will reach out soon.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return true;
    } catch (err: any) {
      setCallbackErrorByMsg((prev) => ({
        ...prev,
        [targetMsgId]:
          err?.message ||
          (isAr ? 'تعذر حفظ بيانات التواصل. يرجى المحاولة مرة أخرى.' : 'Failed to save callback details.')
      }));
      return false;
    } finally {
      setCallbackSubmittingId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const lastPendingCallbackMsg = [...messages]
      .reverse()
      .find((m) => m.role === 'model' && m.needsCallback && !m.callbackSubmitted);

    setMessages((prev) => [...prev, userMsg]);
    if (textToSend === undefined) {
      setInputMessage('');
    }

    // If user typed their phone + full name directly into the chat right after an unanswered question
    if (lastPendingCallbackMsg && textToSend === undefined) {
      const phoneMatch = text.match(/(?:\+?\d[\d\s-]{6,}\d)/);
      if (phoneMatch) {
        const extractedPhone = phoneMatch[0].trim();
        const extractedName = text
          .replace(phoneMatch[0], ' ')
          .replace(/(?:اسمي|الاسم|رقمي|رقم الهاتف|هاتف|جوال|اسمي الكامل|name|phone|is|:|-)/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (extractedName.length >= 2) {
          await submitCallbackLead(
            lastPendingCallbackMsg.id,
            extractedName,
            extractedPhone,
            lastPendingCallbackMsg.unansweredQuestion || ''
          );
          return;
        } else {
          setCallbackForms((prev) => ({
            ...prev,
            [lastPendingCallbackMsg.id]: {
              fullName: prev[lastPendingCallbackMsg.id]?.fullName || '',
              phone: extractedPhone
            }
          }));
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-ask-name-${Date.now()}`,
              role: 'model',
              text: isAr
                ? 'تم رصد رقم الهاتف. يرجى كتابة اسمك الكامل مع رقم الهاتف في النموذج أعلاه ليتم إرسال طلب التواصل.'
                : 'Phone number detected. Please enter your full name above to submit your callback request.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'msg-0' && !m.id.startsWith('bot-confirm-'))
        .map((m) => ({
          role: m.role,
          text: m.text
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          language
        })
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const localResult = tryDeterministicSiteAnswer(text, language);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: localResult.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            needsCallback: !localResult.answeredFromSite,
            unansweredQuestion: localResult.answeredFromSite ? undefined : text
          }
        ]);
        return;
      }

      const data = await res.json();
      const replyText =
        data.reply ||
        (isAr
          ? 'عذرًا، لم أتمكن من العثور على إجابة لهذا السؤال ضمن معلومات الموقع الحالية. من فضلك أعطني اسمك الكامل ورقم هاتفك، وسيتواصل معك فريقنا المختص في أقرب وقت.'
          : 'Sorry, I could not find an answer in the website content. Please provide your full name and phone number so our team can contact you.');

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        needsCallback: Boolean(data.needsCallback),
        unansweredQuestion: data.unansweredQuestion || text
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const localResult = tryDeterministicSiteAnswer(text, language);
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: localResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        needsCallback: !localResult.answeredFromSite,
        unansweredQuestion: localResult.answeredFromSite ? undefined : text
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (msg: Message) => {
    const cleanText = msg.text.replace(/[*#_`]/g, '');
    speak(`chat-${msg.id}`, cleanText, isAr ? 'رد شات بوت الموقع' : 'Chatbot Reply');
  };

  const handleResetChat = () => {
    if (activeId?.startsWith('chat-')) {
      stop();
    }
    setMessages([createGreetingMessage(language)]);
    setCallbackForms({});
    setCallbackErrorByMsg({});
  };

  return (
    <>
      {/* Optional Floating Chat Trigger Button (hidden when opened from Quick Actions) */}
      {!isOpen && !hideFloatingButton && (
        <div className="fixed bottom-6 start-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#634B8F] to-[#523D77] text-white font-black text-xs sm:text-sm shadow-2xl hover:shadow-[#634B8F]/40 transition-all hover:scale-105 active:scale-95 border-2 border-[#E4D7FC] group cursor-pointer"
            title={isAr ? 'تحدث مع شات بوت الموقع' : 'Chat with Campaign Chatbot'}
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-[#E4D7FC]" />
              <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse" />
            </div>
            <span>{isAr ? 'شات بوت' : 'Chatbot'}</span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="fixed bottom-4 sm:bottom-6 start-4 sm:start-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-[#EADFD5] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 text-slate-900"
          role="dialog"
          aria-label={isAr ? 'شات بوت الحملة' : 'Campaign Chatbot'}
        >
          {/* Header */}
          <div className="bg-[#634B8F] text-white p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#E4D7FC] flex items-center justify-center border border-white/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm truncate">
                    {isAr ? 'شات بوت الحملة' : 'Campaign Chatbot'}
                  </h3>
                  <span className="text-[9px] bg-white/20 text-[#E4D7FC] px-1.5 py-0.5 rounded-md font-bold shrink-0">
                    {isAr ? 'محتوى الموقع' : 'Site Only'}
                  </span>
                </div>
                <p className="text-[11px] text-white/80 truncate">
                  {isAr ? 'إجابات من الموقع فقط أو تسجيل طلب تواصل' : 'Answers from site content or request callback'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isAr ? 'محادثة جديدة' : 'Reset chat'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF8F5]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSpeaking = activeId === `chat-${msg.id}` && (isPlaying || isPaused);
              const formState = callbackForms[msg.id] || { fullName: '', phone: '' };
              const formError = callbackErrorByMsg[msg.id];
              const isSubmittingThis = callbackSubmittingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser ? 'bg-slate-700 text-white' : 'bg-[#634B8F] text-[#E4D7FC]'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[84%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed space-y-2 ${
                      isUser
                        ? 'bg-[#634B8F] text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none font-medium'
                        : 'bg-white text-slate-800 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none border border-[#EADFD5] shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Inline Full Name + Phone Callback Form when question is outside website content */}
                    {!isUser && msg.needsCallback && !msg.callbackSubmitted && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          submitCallbackLead(
                            msg.id,
                            formState.fullName,
                            formState.phone,
                            msg.unansweredQuestion || ''
                          );
                        }}
                        className="pt-2.5 border-t border-slate-100 mt-2 space-y-2"
                      >
                        <p className="text-[11px] font-black text-[#634B8F] flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-[#9E1B28]" />
                          <span>
                            {isAr
                              ? 'أدخل اسمك الكامل ورقم هاتفك ليتواصل معك فريقنا:'
                              : 'Enter your full name and phone number for callback:'}
                          </span>
                        </p>

                        <input
                          type="text"
                          value={formState.fullName}
                          onChange={(e) =>
                            setCallbackForms((prev) => ({
                              ...prev,
                              [msg.id]: { ...formState, fullName: e.target.value }
                            }))
                          }
                          placeholder={isAr ? 'الاسم الكامل (مثال: محمد أحمد علي)' : 'Full Name'}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#634B8F] focus:bg-white font-semibold"
                          disabled={isSubmittingThis}
                          required
                        />

                        <input
                          type="tel"
                          dir="ltr"
                          value={formState.phone}
                          onChange={(e) =>
                            setCallbackForms((prev) => ({
                              ...prev,
                              [msg.id]: { ...formState, phone: e.target.value }
                            }))
                          }
                          placeholder={isAr ? 'رقم الهاتف (مثال: 0599123456)' : 'Phone Number (e.g. 0599123456)'}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono focus:outline-none focus:ring-2 focus:ring-[#634B8F] focus:bg-white text-start"
                          disabled={isSubmittingThis}
                          required
                        />

                        {formError && (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{formError}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmittingThis}
                          className="w-full py-2 px-3 bg-[#9E1B28] hover:bg-[#B3202E] text-white rounded-xl text-xs font-black transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingThis
                            ? isAr
                              ? 'جارٍ إرسال بيانات التواصل...'
                              : 'Sending details...'
                            : isAr
                            ? 'إرسال الاسم والرقم للتواصل'
                            : 'Send Name & Phone'}
                        </button>
                      </form>
                    )}

                    {/* Submitted Badge */}
                    {!isUser && msg.needsCallback && msg.callbackSubmitted && (
                      <div className="pt-2 border-t border-emerald-100 mt-1 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {isAr
                            ? `تم استلام بياناتك (${msg.callbackReferenceCode || ''})`
                            : `Received (${msg.callbackReferenceCode || ''})`}
                        </span>
                      </div>
                    )}

                    <div
                      className={`flex items-center justify-between pt-1 text-[10px] ${
                        isUser ? 'text-white/60' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => handleSpeech(msg)}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isSpeaking ? 'text-red-500 animate-pulse' : 'hover:text-[#7A1822]'
                          }`}
                          title={isAr ? 'استماع' : 'Listen'}
                        >
                          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 font-bold p-2.5 bg-white rounded-xl border border-slate-200 w-fit animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#7A1822] animate-spin" />
                <span>{isAr ? 'جاري البحث في محتوى الموقع...' : 'Searching website content...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p[language])}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#7A1822]/10 hover:text-[#7A1822] text-slate-700 text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer"
              >
                {p[language]}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#EADFD5] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isAr ? 'اكتب سؤالك من محتوى الموقع...' : 'Ask a question about the website...'}
                className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#634B8F] focus:bg-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#634B8F] hover:bg-[#523D77] text-white disabled:opacity-40 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 ltr:rotate-0 rtl:rotate-180" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
