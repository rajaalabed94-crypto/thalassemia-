import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import {
  Volume2,
  Square,
  Pause,
  Play,
  Headphones,
  AlertTriangle,
  X,
  Loader2,
  Gauge
} from 'lucide-react';
import { Language } from '../types';

export interface QueueItem {
  id: string;
  title?: string;
  text: string;
}

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
export type AudioEngine = 'local' | 'cloud' | null;

interface AudioSpeechContextType {
  activeId: string | null;
  status: AudioStatus;
  audioEngine: AudioEngine;
  cloudTtsConfigured: boolean | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoadingAudio: boolean;
  currentText: string | null;
  currentTitle: string | null;
  rate: number;
  setRate: (rate: number) => void;
  audioError: string | null;
  clearError: () => void;
  hasArabicVoice: boolean | null;
  voicesCount: number;
  isSpeechSupported: boolean;
  speak: (id: string, text: string, title?: string) => void;
  stop: () => void;
  togglePause: () => void;
  speakSequence: (items: QueueItem[], sequenceTitle?: string) => void;
  language: Language;
}

const AudioSpeechContext = createContext<AudioSpeechContextType | null>(null);

// Minimal valid 44-byte silent WAV for synchronous mobile autoplay unlocking
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

declare global {
  interface Window {
    __activeSpeechUtterance?: SpeechSynthesisUtterance | null;
  }
}

export const AudioSpeechProvider: React.FC<{
  children: React.ReactNode;
  language: Language;
}> = ({ children, language }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<AudioStatus>('idle');
  const [audioEngine, setAudioEngine] = useState<AudioEngine>(null);
  const [cloudTtsConfigured, setCloudTtsConfigured] = useState<boolean | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [rate, setRateState] = useState<number>(0.95);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  // Refs to avoid stale closures, protect Chromium GC, and manage async fallback cleanly
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioPrimedRef = useRef<boolean>(false);
  const modeRef = useRef<AudioEngine>(null);

  const queueRef = useRef<QueueItem[]>([]);
  const queueIndexRef = useRef<number>(0);
  const chunksRef = useRef<string[]>([]);
  const chunkIndexRef = useRef<number>(0);
  const currentItemRef = useRef<QueueItem | null>(null);
  const rateRef = useRef<number>(0.95);
  const sessionRef = useRef<number>(0);

  const watchdogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepAliveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const prefetchAbortRef = useRef<AbortController | null>(null);

  // Client-side objectURL cache for Cloud TTS clips (max 40 entries)
  const cloudCacheRef = useRef<Map<string, string>>(new Map());
  const inFlightFetchesRef = useRef<Map<string, Promise<string>>>(new Map());

  const isAr = language === 'ar';

  const getAudioElement = useCallback((): HTMLAudioElement | null => {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return null;
    if (!audioElRef.current) {
      const el = new Audio();
      el.preload = 'auto';
      audioElRef.current = el;
    }
    return audioElRef.current;
  }, []);

  // Synchronously unlock audio playback inside a user click gesture (iOS/Android/Safari/Chrome)
  const primeAudioElement = useCallback(() => {
    const audio = getAudioElement();
    if (!audio || audioPrimedRef.current) return;
    try {
      audio.dataset.priming = '1';
      audio.muted = true;
      audio.src = SILENT_WAV_DATA_URI;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            audioPrimedRef.current = true;
            if (audio.dataset.priming === '1') {
              audio.pause();
              audio.currentTime = 0;
              audio.muted = false;
              audio.dataset.priming = '0';
            }
          })
          .catch(() => {
            audio.muted = false;
            audio.dataset.priming = '0';
          });
      } else {
        audioPrimedRef.current = true;
        audio.muted = false;
        audio.dataset.priming = '0';
      }
    } catch {
      // Ignore browser priming quirks
    }
  }, [getAudioElement]);

  const clearTimers = useCallback(() => {
    if (watchdogTimerRef.current) {
      clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const abortNetworkRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (prefetchAbortRef.current) {
      prefetchAbortRef.current.abort();
      prefetchAbortRef.current = null;
    }
  }, []);

  // Check backend cloud TTS readiness quietly on mount
  useEffect(() => {
    let active = true;
    fetch('/api/tts/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data && typeof data.cloudTtsConfigured === 'boolean') {
          setCloudTtsConfigured(data.cloudTtsConfigured);
        }
      })
      .catch(() => {
        // Leave null if offline / unreachable
      });
    return () => {
      active = false;
    };
  }, []);

  // Load local Web Speech voices cleanly (async voiceschanged + polling fallback)
  useEffect(() => {
    if (!isSpeechSupported) {
      setVoicesLoaded(true);
      return;
    }

    const refreshVoices = () => {
      try {
        const list = window.speechSynthesis.getVoices();
        if (list && list.length > 0) {
          voicesRef.current = list;
          setVoices(list);
          setVoicesLoaded(true);
        }
      } catch {
        // Ignore browser edge errors
      }
    };

    refreshVoices();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);

    const t1 = setTimeout(refreshVoices, 150);
    const t2 = setTimeout(refreshVoices, 500);
    const t3 = setTimeout(refreshVoices, 1200);
    const t4 = setTimeout(() => {
      refreshVoices();
      setVoicesLoaded(true);
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
    };
  }, [isSpeechSupported]);

  const normalizeLang = (lang: string) => lang.toLowerCase().replace(/_/g, '-').trim();

  const isArabicVoiceMatch = useCallback((v: SpeechSynthesisVoice) => {
    const norm = normalizeLang(v.lang || '');
    return norm === 'ar' || norm.startsWith('ar-');
  }, []);

  const hasArabicVoice: boolean | null = React.useMemo(() => {
    if (!isSpeechSupported) return false;
    if (voices.length === 0) return voicesLoaded ? false : null;
    return voices.some(isArabicVoiceMatch);
  }, [isSpeechSupported, voices, voicesLoaded, isArabicVoiceMatch]);

  const cleanSpokenText = (raw: string): string => {
    return raw
      .replace(/\[AIS_METADATA_SECTION_START\][\s\S]*?\[AIS_METADATA_SECTION_END\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[*#_`~>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Detect text language: Arabic characters always require Arabic voice (never English fallback)
  const detectTextLanguage = useCallback(
    (text: string): 'ar' | 'en' => {
      const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
      const latinChars = (text.match(/[A-Za-z]/g) || []).length;
      if (arabicChars === 0 && latinChars > 0) return 'en';
      if (arabicChars > 0) return 'ar';
      return isAr ? 'ar' : 'en';
    },
    [isAr]
  );

  // Split text into natural sentence chunks with configurable max chunk length
  const splitIntoChunks = useCallback((text: string, maxLen = 175): string[] => {
    const clean = cleanSpokenText(text);
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];

    const sentences = clean
      .split(/(?<=[.!؟?!؛،\n])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const chunks: string[] = [];
    let buffer = '';

    for (const sentence of sentences) {
      if (sentence.length > maxLen) {
        if (buffer) {
          chunks.push(buffer.trim());
          buffer = '';
        }
        const words = sentence.split(/\s+/);
        let sub = '';
        for (const word of words) {
          if ((sub + ' ' + word).trim().length > maxLen) {
            if (sub) chunks.push(sub.trim());
            sub = word;
          } else {
            sub = (sub + ' ' + word).trim();
          }
        }
        if (sub) chunks.push(sub.trim());
      } else if ((buffer + ' ' + sentence).trim().length > maxLen) {
        if (buffer) chunks.push(buffer.trim());
        buffer = sentence;
      } else {
        buffer = (buffer + ' ' + sentence).trim();
      }
    }

    if (buffer) chunks.push(buffer.trim());
    return chunks.length > 0 ? chunks : [clean];
  }, []);

  // Select best local browser voice without requiring any hard-coded voice name
  const getBestVoice = useCallback(
    (langPrefix: 'ar' | 'en'): SpeechSynthesisVoice | null => {
      if (!isSpeechSupported) return null;
      const liveVoices = window.speechSynthesis.getVoices();
      if (liveVoices.length > 0) {
        voicesRef.current = liveVoices;
      }
      const pool = liveVoices.length > 0 ? liveVoices : voicesRef.current;
      if (!pool || pool.length === 0) return null;

      const matching = pool.filter((v) => {
        const norm = normalizeLang(v.lang || '');
        return norm === langPrefix || norm.startsWith(`${langPrefix}-`);
      });
      if (matching.length === 0) return null;

      const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
      const candidates = isOffline
        ? matching.filter((v) => v.localService)
        : matching;
      const searchPool = candidates.length > 0 ? candidates : isOffline ? [] : matching;
      if (searchPool.length === 0) return null;

      if (langPrefix === 'ar') {
        const preferredRegions = ['ar-sa', 'ar-eg', 'ar-jo', 'ar-ae', 'ar-ps', 'ar-xa', 'ar'];
        const naturalOrGoogle = searchPool.find((v) =>
          ['natural', 'google', 'neural', 'online'].some((kw) =>
            v.name.toLowerCase().includes(kw)
          )
        );
        if (naturalOrGoogle && !isOffline) return naturalOrGoogle;

        for (const region of preferredRegions) {
          const regionVoice = searchPool.find((v) => normalizeLang(v.lang) === region);
          if (regionVoice) return regionVoice;
        }
        return searchPool[0];
      }

      const naturalEn = searchPool.find(
        (v) =>
          v.name.toLowerCase().includes('natural') ||
          v.name.toLowerCase().includes('google') ||
          normalizeLang(v.lang) === 'en-us'
      );
      return naturalEn || searchPool[0];
    },
    [isSpeechSupported]
  );

  // Stop all playback (both local Web Speech & Cloud HTMLAudio) cleanly
  const stop = useCallback(() => {
    sessionRef.current += 1;
    clearTimers();
    abortNetworkRequests();
    modeRef.current = null;

    if (isSpeechSupported) {
      try {
        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending ||
          window.speechSynthesis.paused
        ) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // Ignore browser cancel errors
      }
    }

    const audio = audioElRef.current;
    if (audio) {
      try {
        audio.onplay = null;
        audio.onpause = null;
        audio.onended = null;
        audio.onerror = null;
        audio.dataset.priming = '0';
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch {
        // Ignore audio reset errors
      }
    }

    utteranceRef.current = null;
    if (typeof window !== 'undefined') {
      window.__activeSpeechUtterance = null;
    }

    queueRef.current = [];
    queueIndexRef.current = 0;
    chunksRef.current = [];
    chunkIndexRef.current = 0;
    currentItemRef.current = null;

    setActiveId(null);
    setStatus('idle');
    setAudioEngine(null);
    setCurrentText(null);
    setCurrentTitle(null);
  }, [abortNetworkRequests, clearTimers, isSpeechSupported]);

  // Revoke cached object URLs on full provider unmount
  useEffect(() => {
    return () => {
      stop();
      cloudCacheRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      });
      cloudCacheRef.current.clear();
    };
  }, [stop]);

  const buildErrorMessage = useCallback(
    (
      reason:
        | 'offline'
        | 'cloud-unconfigured'
        | 'cloud-auth'
        | 'cloud-quota'
        | 'cloud-failed'
        | 'blocked',
      serverDetail?: string
    ) => {
      if (reason === 'offline') {
        return isAr
          ? 'انقطع الاتصال بالإنترنت ولا يتوفر صوت عربي محلي مثبّت على هذا الجهاز حاليًا. يرجى إعادة الاتصال بالإنترنت لاستخدام القراءة الصوتية السحابية.'
          : 'You are offline and no local Arabic TTS voice is installed on this device. Please reconnect to the internet for cloud voice reading.';
      }
      if (reason === 'cloud-unconfigured') {
        return isAr
          ? 'لا يتوفر صوت عربي محلي في المتصفح حاليًا، وخدمة الصوت السحابية على الخادم غير مفعّلة بعد (تحتاج لإضافة مفتاح GEMINI_API_KEY في إعدادات المشروع).'
          : 'No local Arabic voice is available in this browser, and cloud TTS on the server is not configured yet (requires GEMINI_API_KEY).';
      }
      if (reason === 'cloud-auth') {
        return isAr
          ? serverDetail ||
              'تعذر المصادقة مع خدمة الصوت السحابية على الخادم. يرجى التحقق من صلاحية مفتاح API في إعدادات المشروع.'
          : serverDetail || 'Cloud TTS authentication failed on the server. Please verify the API key.';
      }
      if (reason === 'cloud-quota') {
        return isAr
          ? serverDetail || 'تم الوصول إلى الحد الأقصى المؤقت لخدمة الصوت السحابية. يرجى المحاولة بعد قليل.'
          : serverDetail || 'Cloud TTS rate limit reached temporarily. Please try again shortly.';
      }
      if (reason === 'blocked') {
        return isAr
          ? 'منع المتصفح تشغيل الصوت تلقائيًا. تأكد من رفع مستوى الصوت والسماح بتشغيل الصوت للموقع ثم اضغط مرة أخرى.'
          : 'Browser autoplay policy blocked playback. Please allow audio for this site and click again.';
      }
      return isAr
        ? serverDetail || 'تعذر تشغيل القراءة الصوتية حاليًا. يرجى المحاولة مرة أخرى بعد قليل.'
        : serverDetail || 'Unable to play audio right now. Please try again shortly.';
    },
    [isAr]
  );

  const setCloudCacheEntry = useCallback((key: string, objectUrl: string) => {
    if (cloudCacheRef.current.size >= 40) {
      const oldestKey = cloudCacheRef.current.keys().next().value;
      if (oldestKey) {
        const oldUrl = cloudCacheRef.current.get(oldestKey);
        if (oldUrl) {
          try {
            URL.revokeObjectURL(oldUrl);
          } catch {
            // Ignore
          }
        }
        cloudCacheRef.current.delete(oldestKey);
      }
    }
    cloudCacheRef.current.set(key, objectUrl);
  }, []);

  // Fetch & cache synthesized Arabic/English audio blob URL from backend /api/tts
  const fetchCloudAudioUrl = useCallback(
    async (chunkText: string, lang: 'ar' | 'en', signal?: AbortSignal): Promise<string> => {
      const cacheKey = `${lang}:${chunkText}`;
      const cached = cloudCacheRef.current.get(cacheKey);
      if (cached) return cached;

      const existingPromise = inFlightFetchesRef.current.get(cacheKey);
      if (existingPromise) return existingPromise;

      const reqPromise = (async () => {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
          const err: any = new Error('OFFLINE');
          err.ttsCode = 'OFFLINE';
          throw err;
        }

        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunkText, lang }),
          signal
        });

        if (!res.ok) {
          let payload: any = null;
          try {
            payload = await res.json();
          } catch {
            // Ignore
          }
          const err: any = new Error(payload?.error || `HTTP ${res.status}`);
          err.ttsCode = payload?.code || (res.status === 503 ? 'CLOUD_TTS_UNCONFIGURED' : 'CLOUD_TTS_FAILED');
          throw err;
        }

        const audioBlob = await res.blob();
        if (!audioBlob || audioBlob.size < 64) {
          const err: any = new Error('Empty audio response');
          err.ttsCode = 'CLOUD_TTS_FAILED';
          throw err;
        }

        setCloudTtsConfigured(true);
        const objectUrl = URL.createObjectURL(audioBlob);
        setCloudCacheEntry(cacheKey, objectUrl);
        return objectUrl;
      })();

      inFlightFetchesRef.current.set(cacheKey, reqPromise);
      try {
        return await reqPromise;
      } finally {
        inFlightFetchesRef.current.delete(cacheKey);
      }
    },
    [setCloudCacheEntry]
  );

  // Pre-fetch next chunk while current cloud audio plays so multi-paragraph transitions are seamless
  const prefetchNextCloudChunk = useCallback(
    (sessionId: number, chunkIdx: number) => {
      if (sessionRef.current !== sessionId) return;
      let nextChunk: string | undefined = chunksRef.current[chunkIdx + 1];
      if (!nextChunk) {
        const nextQueueIdx = queueIndexRef.current + 1;
        if (nextQueueIdx < queueRef.current.length) {
          const nextItem = queueRef.current[nextQueueIdx];
          const nextItemChunks = splitIntoChunks(nextItem.text, 450);
          nextChunk = nextItemChunks[0];
        }
      }
      if (!nextChunk) return;

      const lang = detectTextLanguage(nextChunk);
      const cacheKey = `${lang}:${nextChunk}`;
      if (cloudCacheRef.current.has(cacheKey)) return;

      if (prefetchAbortRef.current) {
        prefetchAbortRef.current.abort();
      }
      const controller = new AbortController();
      prefetchAbortRef.current = controller;
      fetchCloudAudioUrl(nextChunk, lang, controller.signal).catch(() => {
        // Silent prefetch failure; foreground handler will handle real errors if reached
      });
    },
    [detectTextLanguage, fetchCloudAudioUrl, splitIntoChunks]
  );

  // Cloud TTS chunk player using HTML5 <audio>
  const playCloudChunk = useCallback(
    async (sessionId: number, item: QueueItem, chunkIdx: number) => {
      if (sessionRef.current !== sessionId) return;

      const chunks = chunksRef.current;
      if (chunkIdx >= chunks.length) {
        const nextQueueIdx = queueIndexRef.current + 1;
        if (nextQueueIdx < queueRef.current.length) {
          queueIndexRef.current = nextQueueIdx;
          const nextItem = queueRef.current[nextQueueIdx];
          currentItemRef.current = nextItem;
          chunksRef.current = splitIntoChunks(nextItem.text, 450);
          chunkIndexRef.current = 0;
          playCloudChunk(sessionId, nextItem, 0);
          return;
        }
        stop();
        return;
      }

      const chunkText = chunks[chunkIdx];
      const textLang = detectTextLanguage(chunkText);

      modeRef.current = 'cloud';
      setActiveId(item.id);
      setAudioEngine('cloud');
      setStatus('loading');
      setCurrentText(cleanSpokenText(item.text));
      setCurrentTitle(item.title || null);
      setAudioError(null);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const objectUrl = await fetchCloudAudioUrl(chunkText, textLang, controller.signal);
        if (sessionRef.current !== sessionId) return;

        const audio = getAudioElement();
        if (!audio) {
          throw Object.assign(new Error('Audio element unavailable'), { ttsCode: 'CLOUD_TTS_FAILED' });
        }

        audio.onplay = null;
        audio.onpause = null;
        audio.onended = null;
        audio.onerror = null;

        audio.dataset.priming = '0';
        audio.muted = false;
        audio.src = objectUrl;
        audio.playbackRate = rateRef.current;

        audio.onplay = () => {
          if (sessionRef.current !== sessionId) return;
          audio.playbackRate = rateRef.current;
          setActiveId(item.id);
          setAudioEngine('cloud');
          setStatus('playing');
          setCurrentText(cleanSpokenText(item.text));
          setCurrentTitle(item.title || null);
          prefetchNextCloudChunk(sessionId, chunkIdx);
        };

        audio.onended = () => {
          if (sessionRef.current !== sessionId) return;
          chunkIndexRef.current = chunkIdx + 1;
          playCloudChunk(sessionId, item, chunkIdx + 1);
        };

        audio.onerror = () => {
          if (sessionRef.current !== sessionId) return;
          stop();
          setStatus('error');
          setAudioError(buildErrorMessage('cloud-failed'));
        };

        try {
          await audio.play();
        } catch (playErr: any) {
          if (sessionRef.current !== sessionId) return;
          stop();
          setStatus('error');
          setAudioError(
            buildErrorMessage(playErr?.name === 'NotAllowedError' ? 'blocked' : 'cloud-failed')
          );
        }
      } catch (err: any) {
        if (sessionRef.current !== sessionId || err?.name === 'AbortError') return;

        const code = err?.ttsCode;
        const offline =
          code === 'OFFLINE' ||
          (typeof navigator !== 'undefined' && navigator.onLine === false) ||
          err instanceof TypeError;

        stop();
        setStatus('error');
        if (offline) {
          setAudioError(buildErrorMessage('offline'));
        } else if (code === 'CLOUD_TTS_UNCONFIGURED') {
          setCloudTtsConfigured(false);
          setAudioError(buildErrorMessage('cloud-unconfigured'));
        } else if (code === 'CLOUD_TTS_AUTH_ERROR') {
          setAudioError(buildErrorMessage('cloud-auth', err?.message));
        } else if (code === 'CLOUD_TTS_QUOTA') {
          setAudioError(buildErrorMessage('cloud-quota', err?.message));
        } else {
          setAudioError(buildErrorMessage('cloud-failed', err?.message));
        }
      }
    },
    [
      buildErrorMessage,
      detectTextLanguage,
      fetchCloudAudioUrl,
      getAudioElement,
      prefetchNextCloudChunk,
      splitIntoChunks,
      stop
    ]
  );

  // Switch seamlessly from local Web Speech to Cloud TTS mid-session when local fails/unavailable
  const fallbackSessionToCloud = useCallback(
    (sessionId: number, item: QueueItem, startFromChunkIdx: number) => {
      if (sessionRef.current !== sessionId) return;
      clearTimers();

      if (isSpeechSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // Ignore
        }
      }

      // Re-chunk remaining text of current item into 450-char cloud chunks so nothing is repeated or lost
      const remainingLocalText = chunksRef.current.slice(startFromChunkIdx).join(' ');
      const cloudChunks = splitIntoChunks(remainingLocalText || item.text, 450);
      chunksRef.current = cloudChunks;
      chunkIndexRef.current = 0;

      playCloudChunk(sessionId, item, 0);
    },
    [clearTimers, isSpeechSupported, playCloudChunk, splitIntoChunks]
  );

  // Keep Chrome/Android Web Speech API alive during longer local reads
  const startKeepAlive = useCallback(
    (sessionId: number) => {
      if (keepAliveIntervalRef.current) clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = setInterval(() => {
        if (sessionRef.current !== sessionId || modeRef.current !== 'local') return;
        if (
          isSpeechSupported &&
          window.speechSynthesis.speaking &&
          !window.speechSynthesis.paused
        ) {
          try {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } catch {
            // Ignore
          }
        }
      }, 11000);
    },
    [isSpeechSupported]
  );

  // Local Web Speech chunk player (called synchronously when local Arabic/English voice is ready)
  const playLocalChunk = useCallback(
    (sessionId: number, item: QueueItem, chunkIdx: number) => {
      if (sessionRef.current !== sessionId) return;

      const chunks = chunksRef.current;
      if (chunkIdx >= chunks.length) {
        const nextQueueIdx = queueIndexRef.current + 1;
        if (nextQueueIdx < queueRef.current.length) {
          queueIndexRef.current = nextQueueIdx;
          const nextItem = queueRef.current[nextQueueIdx];
          currentItemRef.current = nextItem;
          chunksRef.current = splitIntoChunks(nextItem.text, 175);
          chunkIndexRef.current = 0;
          playLocalChunk(sessionId, nextItem, 0);
          return;
        }
        stop();
        return;
      }

      if (!isSpeechSupported) {
        fallbackSessionToCloud(sessionId, item, chunkIdx);
        return;
      }

      const chunkText = chunks[chunkIdx];
      const textLang = detectTextLanguage(chunkText);
      const selectedVoice = getBestVoice(textLang);

      // Strictly forbid reading Arabic text with non-Arabic voice -> switch straight to Cloud TTS
      if (!selectedVoice) {
        fallbackSessionToCloud(sessionId, item, chunkIdx);
        return;
      }

      try {
        if (
          window.speechSynthesis.speaking ||
          window.speechSynthesis.pending ||
          window.speechSynthesis.paused
        ) {
          window.speechSynthesis.cancel();
        }
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch {
        // Ignore
      }

      const utter = new SpeechSynthesisUtterance(chunkText);
      utter.voice = selectedVoice;
      utter.lang = selectedVoice.lang || (textLang === 'ar' ? 'ar-SA' : 'en-US');
      utter.rate = rateRef.current;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      utteranceRef.current = utter;
      window.__activeSpeechUtterance = utter;

      let started = false;
      clearTimers();

      modeRef.current = 'local';
      setActiveId(item.id);
      setAudioEngine('local');
      setStatus('loading');
      setCurrentText(cleanSpokenText(item.text));
      setCurrentTitle(item.title || null);
      setAudioError(null);

      // Watchdog: if local browser swallows speech silently without firing onstart, fallback to Cloud TTS
      watchdogTimerRef.current = setTimeout(() => {
        if (sessionRef.current !== sessionId || started) return;
        if (window.speechSynthesis.speaking) {
          started = true;
          setStatus('playing');
          startKeepAlive(sessionId);
          return;
        }
        fallbackSessionToCloud(sessionId, item, chunkIdx);
      }, 1800);

      utter.onstart = () => {
        if (sessionRef.current !== sessionId) return;
        started = true;
        if (watchdogTimerRef.current) {
          clearTimeout(watchdogTimerRef.current);
          watchdogTimerRef.current = null;
        }
        setActiveId(item.id);
        setAudioEngine('local');
        setStatus('playing');
        setCurrentText(cleanSpokenText(item.text));
        setCurrentTitle(item.title || null);
        startKeepAlive(sessionId);
      };

      utter.onend = () => {
        if (sessionRef.current !== sessionId) return;
        if (watchdogTimerRef.current) {
          clearTimeout(watchdogTimerRef.current);
          watchdogTimerRef.current = null;
        }
        chunkIndexRef.current = chunkIdx + 1;
        playLocalChunk(sessionId, item, chunkIdx + 1);
      };

      utter.onerror = (event) => {
        if (sessionRef.current !== sessionId) return;
        if (event.error === 'interrupted' || event.error === 'canceled') {
          return;
        }
        // Any real local speech synthesis failure transitions automatically to Cloud TTS
        fallbackSessionToCloud(sessionId, item, chunkIdx);
      };

      try {
        window.speechSynthesis.speak(utter);
      } catch {
        fallbackSessionToCloud(sessionId, item, chunkIdx);
      }
    },
    [
      clearTimers,
      detectTextLanguage,
      fallbackSessionToCloud,
      getBestVoice,
      isSpeechSupported,
      splitIntoChunks,
      startKeepAlive,
      stop
    ]
  );

  // Helper: Wait briefly (max 350ms) only if browser supports speechSynthesis and voices haven't populated yet
  const ensureVoicesReadyBriefly = useCallback((): Promise<void> => {
    if (!isSpeechSupported) return Promise.resolve();
    const current = window.speechSynthesis.getVoices();
    if (current.length > 0) {
      voicesRef.current = current;
      setVoices(current);
      setVoicesLoaded(true);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let resolved = false;
      const done = () => {
        if (resolved) return;
        resolved = true;
        clearInterval(poll);
        clearTimeout(timeout);
        window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
        resolve();
      };
      const onVoices = () => {
        const list = window.speechSynthesis.getVoices();
        if (list.length > 0) {
          voicesRef.current = list;
          setVoices(list);
          setVoicesLoaded(true);
          done();
        }
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoices);
      const poll = setInterval(onVoices, 60);
      const timeout = setTimeout(() => {
        setVoicesLoaded(true);
        done();
      }, 350);
    });
  }, [isSpeechSupported]);

  // Unified session starter: tries local matching voice first, falls back to Cloud TTS seamlessly
  const startPlaybackQueue = useCallback(
    async (items: QueueItem[], sequenceTitle?: string) => {
      const firstItem = items[0];
      const newSession = sessionRef.current + 1;
      sessionRef.current = newSession;

      clearTimers();
      abortNetworkRequests();

      // Stop any previous audio or speech cleanly
      if (isSpeechSupported) {
        try {
          if (
            window.speechSynthesis.speaking ||
            window.speechSynthesis.pending ||
            window.speechSynthesis.paused
          ) {
            window.speechSynthesis.cancel();
          }
        } catch {
          // Ignore
        }
      }
      const existingAudio = audioElRef.current;
      if (existingAudio) {
        try {
          existingAudio.onplay = null;
          existingAudio.onended = null;
          existingAudio.onerror = null;
          existingAudio.pause();
        } catch {
          // Ignore
        }
      }

      // Synchronously unlock <audio> on click BEFORE any async await
      primeAudioElement();

      queueRef.current = items;
      queueIndexRef.current = 0;
      currentItemRef.current = firstItem;
      setActiveId(firstItem.id);
      setStatus('loading');
      setCurrentText(cleanSpokenText(firstItem.text));
      setCurrentTitle(sequenceTitle || firstItem.title || null);
      setAudioError(null);

      // If voices already loaded and local matching voice exists, start synchronously!
      const detectedLang = detectTextLanguage(firstItem.text);
      let localVoice = getBestVoice(detectedLang);

      if (!localVoice && isSpeechSupported && voicesRef.current.length === 0) {
        await ensureVoicesReadyBriefly();
        if (sessionRef.current !== newSession) return;
        localVoice = getBestVoice(detectedLang);
      }

      if (localVoice) {
        chunksRef.current = splitIntoChunks(firstItem.text, 175);
        chunkIndexRef.current = 0;
        playLocalChunk(newSession, firstItem, 0);
      } else {
        chunksRef.current = splitIntoChunks(firstItem.text, 450);
        chunkIndexRef.current = 0;
        playCloudChunk(newSession, firstItem, 0);
      }
    },
    [
      abortNetworkRequests,
      clearTimers,
      detectTextLanguage,
      ensureVoicesReadyBriefly,
      getBestVoice,
      isSpeechSupported,
      playCloudChunk,
      playLocalChunk,
      primeAudioElement,
      splitIntoChunks
    ]
  );

  // Public single-item toggle: 1st click plays, 2nd click stops, another item switches cleanly
  const speak = useCallback(
    (id: string, text: string, title?: string) => {
      setAudioError(null);

      if (activeId === id && (status === 'playing' || status === 'paused' || status === 'loading')) {
        stop();
        return;
      }

      if (!cleanSpokenText(text)) return;
      startPlaybackQueue([{ id, text, title }], title);
    },
    [activeId, startPlaybackQueue, status, stop]
  );

  // Public sequence reader for full pages / sections
  const speakSequence = useCallback(
    (items: QueueItem[], sequenceTitle?: string) => {
      setAudioError(null);

      const validItems = items.filter((it) => cleanSpokenText(it.text).length > 0);
      if (validItems.length === 0) return;

      const isSameSequencePlaying =
        (status === 'playing' || status === 'paused' || status === 'loading') &&
        validItems.some((it) => it.id === activeId);

      if (isSameSequencePlaying) {
        stop();
        return;
      }

      startPlaybackQueue(validItems, sequenceTitle);
    },
    [activeId, startPlaybackQueue, status, stop]
  );

  // Pause / Resume supporting BOTH Cloud HTMLAudio and Local Web Speech
  const togglePause = useCallback(() => {
    if (modeRef.current === 'cloud') {
      const audio = audioElRef.current;
      if (!audio) return;

      if (status === 'paused') {
        audio
          .play()
          .then(() => setStatus('playing'))
          .catch(() => {
            stop();
            setStatus('error');
            setAudioError(buildErrorMessage('blocked'));
          });
      } else if (status === 'playing') {
        audio.pause();
        setStatus('paused');
      }
      return;
    }

    if (!isSpeechSupported) return;

    if (status === 'paused') {
      setStatus('playing');
      try {
        window.speechSynthesis.resume();
      } catch {
        // Fallback below
      }
      setTimeout(() => {
        if (
          modeRef.current === 'local' &&
          currentItemRef.current &&
          !window.speechSynthesis.speaking &&
          !window.speechSynthesis.pending
        ) {
          const newSession = sessionRef.current + 1;
          sessionRef.current = newSession;
          playLocalChunk(newSession, currentItemRef.current, chunkIndexRef.current);
        }
      }, 280);
    } else if (status === 'playing') {
      try {
        window.speechSynthesis.pause();
        setStatus('paused');
      } catch {
        stop();
      }
    }
  }, [buildErrorMessage, isSpeechSupported, playLocalChunk, status, stop]);

  // Adjust reading speed (0.75x - 1.5x): instant in cloud mode, chunk-restart in local mode
  const setRate = useCallback(
    (newRate: number) => {
      const clamped = Math.max(0.7, Math.min(1.6, newRate));
      rateRef.current = clamped;
      setRateState(clamped);

      if (modeRef.current === 'cloud' && audioElRef.current) {
        audioElRef.current.playbackRate = clamped;
        return;
      }

      if (
        modeRef.current === 'local' &&
        (status === 'playing' || status === 'paused') &&
        currentItemRef.current &&
        isSpeechSupported
      ) {
        const item = currentItemRef.current;
        const idx = chunkIndexRef.current;
        const newSession = sessionRef.current + 1;
        sessionRef.current = newSession;
        playLocalChunk(newSession, item, idx);
      }
    },
    [isSpeechSupported, playLocalChunk, status]
  );

  const clearError = useCallback(() => {
    setAudioError(null);
    if (status === 'error') {
      setStatus('idle');
    }
  }, [status]);

  const isPlaying = status === 'playing';
  const isPaused = status === 'paused';
  const isLoadingAudio = status === 'loading';

  return (
    <AudioSpeechContext.Provider
      value={{
        activeId,
        status,
        audioEngine,
        cloudTtsConfigured,
        isPlaying,
        isPaused,
        isLoadingAudio,
        currentText,
        currentTitle,
        rate,
        setRate,
        audioError,
        clearError,
        hasArabicVoice,
        voicesCount: voices.length,
        isSpeechSupported,
        speak,
        stop,
        togglePause,
        speakSequence,
        language
      }}
    >
      {children}
    </AudioSpeechContext.Provider>
  );
};

export const useAudioSpeech = () => {
  const context = useContext(AudioSpeechContext);
  if (!context) {
    throw new Error('useAudioSpeech must be used within an AudioSpeechProvider');
  }
  return context;
};

// ============================================================================
// REUSABLE ACCESSIBLE SPEAK BUTTON (One-Click Reading, Keyboard & Screen Reader Ready)
// ============================================================================
interface SpeakButtonProps {
  id: string;
  text: string;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showText?: boolean;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  id,
  text,
  title,
  className = '',
  size = 'sm',
  label,
  showText = false
}) => {
  const { activeId, isPlaying, isPaused, isLoadingAudio, speak, language } = useAudioSpeech();
  const isThisPlaying = activeId === id && (isPlaying || isPaused);
  const isThisLoading = activeId === id && isLoadingAudio;
  const isAr = language === 'ar';

  const defaultLabel = isThisPlaying
    ? isAr
      ? `إيقاف قراءة: ${title || 'النص'}`
      : `Stop reading: ${title || 'text'}`
    : isThisLoading
    ? isAr
      ? `جاري تجهيز قراءة: ${title || 'النص'}`
      : `Loading audio: ${title || 'text'}`
    : label || (isAr ? `استمع إلى: ${title || 'هذا النص'}` : `Listen to: ${title || 'this text'}`);

  const sizeClasses = {
    sm: 'min-w-[38px] min-h-[38px] px-2 text-xs',
    md: 'min-w-[44px] min-h-[44px] px-2.5 text-xs',
    lg: 'min-h-[44px] px-4 text-xs'
  }[size];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(id, text, title);
      }}
      aria-pressed={isThisPlaying || isThisLoading}
      aria-label={defaultLabel}
      title={defaultLabel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#694E91]/50 shrink-0 select-none ${
        isThisPlaying
          ? 'bg-[#B72E43] text-white shadow-md ring-2 ring-[#B72E43]/40 scale-105'
          : isThisLoading
          ? 'bg-[#694E91] text-white shadow-sm'
          : 'bg-[#FAF7F2] hover:bg-[#F4E8DF] text-[#694E91] border-2 border-[#694E91]/25 hover:border-[#694E91] shadow-2xs hover:scale-105 active:scale-95'
      } ${sizeClasses} ${className}`}
    >
      {isThisLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : isThisPlaying ? (
        <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
      ) : (
        <Volume2 className="w-4 h-4" aria-hidden="true" />
      )}

      {showText && (
        <span className="font-bold text-xs whitespace-nowrap">
          {isThisLoading
            ? isAr
              ? 'تجهيز...'
              : 'Loading...'
            : isThisPlaying
            ? isAr
              ? 'إيقاف'
              : 'Stop'
            : isAr
            ? 'استمع'
            : 'Listen'}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// LISTEN TO FULL SECTION / PAGE BUTTON
// ============================================================================
interface ListenToPageButtonProps {
  items: QueueItem[];
  title?: string;
  label?: string;
  className?: string;
}

export const ListenToPageButton: React.FC<ListenToPageButtonProps> = ({
  items,
  title,
  label,
  className = ''
}) => {
  const { isPlaying, isPaused, isLoadingAudio, activeId, speakSequence, stop, language } =
    useAudioSpeech();
  const isAr = language === 'ar';
  const matchesSequence = items.some((it) => it.id === activeId);
  const isSequenceActive = matchesSequence && (isPlaying || isPaused);
  const isSequenceLoading = matchesSequence && isLoadingAudio;

  const defaultIdleText = isAr ? 'استمع للصفحة صوتياً' : 'Listen to Page';
  const buttonText = isSequenceActive
    ? isAr
      ? 'إيقاف القراءة الصوتية'
      : 'Stop Reading'
    : isSequenceLoading
    ? isAr
      ? 'جاري تجهيز الصوت...'
      : 'Starting Audio...'
    : label || defaultIdleText;

  return (
    <button
      type="button"
      onClick={() => {
        if (isSequenceActive || isSequenceLoading) {
          stop();
        } else {
          speakSequence(items, title);
        }
      }}
      aria-pressed={isSequenceActive || isSequenceLoading}
      className={`inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-full font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 border-2 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-[#694E91]/50 ${
        isSequenceActive
          ? 'bg-[#B72E43] text-white border-[#B72E43] ring-2 ring-[#B72E43]/30'
          : isSequenceLoading
          ? 'bg-[#694E91] text-white border-[#694E91]'
          : 'bg-white hover:bg-[#FAF7F2] text-[#694E91] border-[#694E91]/35 hover:border-[#694E91]'
      } ${className}`}
      title={buttonText}
      aria-label={buttonText}
    >
      {isSequenceLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : isSequenceActive ? (
        <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
      ) : (
        <Headphones className="w-4 h-4 text-current" aria-hidden="true" />
      )}
      <span className="font-black">{buttonText}</span>
      {isSequenceActive && !isPaused && (
        <span className="w-2 h-2 rounded-full bg-white animate-ping" aria-hidden="true" />
      )}
    </button>
  );
};

// ============================================================================
// FLOATING AUDIO PLAYER BAR WITH SPEED, PAUSE/RESUME & CLEAR STATUS
// ============================================================================
export const FloatingAudioBar: React.FC = () => {
  const {
    status,
    audioEngine,
    isPlaying,
    isPaused,
    isLoadingAudio,
    currentText,
    currentTitle,
    rate,
    setRate,
    audioError,
    clearError,
    togglePause,
    stop,
    language
  } = useAudioSpeech();
  const isAr = language === 'ar';

  const speeds = [
    { label: '0.8x', value: 0.8 },
    { label: '1x', value: 0.95 },
    { label: '1.25x', value: 1.25 },
    { label: '1.5x', value: 1.5 }
  ];

  // Keyboard Escape support to stop active reading or close error banner
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (audioError) {
        clearError();
      } else if (isPlaying || isPaused || isLoadingAudio) {
        stop();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [audioError, clearError, isLoadingAudio, isPaused, isPlaying, stop]);

  if (audioError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-20 sm:bottom-6 start-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-amber-50 border-2 border-amber-400 text-amber-950 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 space-y-1 text-xs">
            <strong className="font-black block text-sm">
              {isAr ? 'تنبيه القراءة الصوتية' : 'Text-to-Speech Notice'}
            </strong>
            <p className="leading-relaxed font-semibold text-amber-900">{audioError}</p>
          </div>
          <button
            type="button"
            onClick={clearError}
            aria-label={isAr ? 'إغلاق التنبيه' : 'Dismiss alert'}
            className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!isPlaying && !isPaused && !isLoadingAudio && status !== 'playing' && status !== 'paused') {
    return null;
  }

  const engineLabel =
    audioEngine === 'cloud'
      ? isAr
        ? 'صوت سحابي'
        : 'Cloud Voice'
      : audioEngine === 'local'
      ? isAr
        ? 'صوت الجهاز'
        : 'Device Voice'
      : null;

  return (
    <aside
      aria-label={isAr ? 'شريط التحكم بالقراءة الصوتية' : 'Audio Reading Controls'}
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 start-1/2 -translate-x-1/2 z-50 w-[94%] max-w-xl bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-white/20 p-3.5 sm:p-4 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Status & excerpt */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-[#694E91] text-white flex items-center justify-center shrink-0 shadow-xs">
              {isLoadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black text-[#E4D7FC] tracking-wide">
                  {isLoadingAudio
                    ? isAr
                      ? 'جاري تجهيز الصوت...'
                      : 'Preparing audio...'
                    : isPaused
                    ? isAr
                      ? 'القراءة متوقفة مؤقتاً'
                      : 'Paused'
                    : isAr
                    ? `جاري القراءة الصوتية${currentTitle ? ` · ${currentTitle}` : ''}`
                    : `Speaking${currentTitle ? ` · ${currentTitle}` : ''}`}
                </span>
                {engineLabel && !isLoadingAudio && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                    {engineLabel}
                  </span>
                )}
                {isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                {currentText || (isAr ? 'استماع للمحتوى' : 'Listening to content')}
              </p>
            </div>
          </div>

          {/* Play / Pause / Stop buttons (min 40px accessible touch target) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={togglePause}
              disabled={isLoadingAudio}
              className="min-w-[40px] min-h-[40px] px-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-white"
              title={isPaused ? (isAr ? 'استئناف القراءة' : 'Resume') : isAr ? 'إيقاف مؤقت' : 'Pause'}
              aria-label={isPaused ? (isAr ? 'استئناف القراءة' : 'Resume') : isAr ? 'إيقاف مؤقت' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
              <span className="hidden sm:inline text-[11px] font-bold">
                {isPaused ? (isAr ? 'استئناف' : 'Resume') : isAr ? 'مؤقت' : 'Pause'}
              </span>
            </button>

            <button
              type="button"
              onClick={stop}
              className="min-w-[40px] min-h-[40px] px-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center gap-1 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
              title={isAr ? 'إيقاف القراءة بالكامل' : 'Stop Reading'}
              aria-label={isAr ? 'إيقاف القراءة بالكامل' : 'Stop Reading'}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline text-[11px] font-bold">
                {isAr ? 'إيقاف' : 'Stop'}
              </span>
            </button>
          </div>
        </div>

        {/* Speed Selector Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Gauge className="w-3.5 h-3.5 text-[#E4D7FC]" aria-hidden="true" />
            <span>{isAr ? 'سرعة القراءة:' : 'Speed:'}</span>
          </div>

          <div className="flex items-center gap-1" role="group" aria-label={isAr ? 'سرعة القراءة الصوتية' : 'Speech Speed'}>
            {speeds.map((s) => {
              const isActive = Math.abs(rate - s.value) < 0.05;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setRate(s.value)}
                  aria-pressed={isActive}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-white ${
                    isActive
                      ? 'bg-[#694E91] text-white ring-1 ring-[#E4D7FC]'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
