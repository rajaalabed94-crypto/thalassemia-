import {
  type AdminSupportRecord,
  type ChatCallbackRecord,
  DEFAULT_CALLBACK_STATUS_AR,
  DEFAULT_STATUS_AR,
  SITE_KNOWLEDGE_BASE,
  formatPalestineTimestamp,
  generateInstitutionalGuidance,
  generateServerTrackingCode,
  getCallbackPrompt,
  getSupportTypeLabelAr,
  pcm16ToWavUint8Array,
  tryDeterministicSiteAnswer
} from '../../shared/campaignEngine.ts';

interface CfKVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface CfEnv {
  GEMINI_API_KEY?: string;
  GOOGLE_CLOUD_TTS_API_KEY?: string;
  THALASSEMIA_KV?: CfKVNamespace;
}

interface CfContext {
  request: Request;
  env: CfEnv;
  params: { path?: string[] | string };
}

interface KvStore {
  records: AdminSupportRecord[];
  chatCallbacks: ChatCallbackRecord[];
}

const KV_STORE_KEY = 'thalassemia_admin_store_v1';

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function getValidGeminiKey(env: CfEnv): string | null {
  const key = env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') return null;
  return key;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function readKvStore(env: CfEnv): Promise<KvStore> {
  if (!env.THALASSEMIA_KV) {
    return { records: [], chatCallbacks: [] };
  }
  try {
    const raw = await env.THALASSEMIA_KV.get(KV_STORE_KEY);
    if (!raw) return { records: [], chatCallbacks: [] };
    const parsed = JSON.parse(raw) as KvStore;
    return {
      records: Array.isArray(parsed.records) ? parsed.records : [],
      chatCallbacks: Array.isArray(parsed.chatCallbacks) ? parsed.chatCallbacks : []
    };
  } catch {
    return { records: [], chatCallbacks: [] };
  }
}

async function writeKvStore(env: CfEnv, store: KvStore): Promise<void> {
  if (!env.THALASSEMIA_KV) return;
  await env.THALASSEMIA_KV.put(KV_STORE_KEY, JSON.stringify(store));
}

async function safeJsonBody(request: Request): Promise<any> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export const onRequest = async (context: CfContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiPath = url.pathname.replace(/^\/api\/?/, '').replace(/\/+$/, '');
  const method = request.method.toUpperCase();

  // 1. Health Check
  if (apiPath === 'health' && method === 'GET') {
    return jsonResponse({
      status: 'ok',
      service: 'thalassemia-portal-api',
      runtime: 'cloudflare-pages'
    });
  }

  // 2. TTS Availability Check
  if (apiPath === 'tts/status' && method === 'GET') {
    const hasGemini = Boolean(getValidGeminiKey(env));
    const hasGoogleCloudTts = Boolean(env.GOOGLE_CLOUD_TTS_API_KEY?.trim());
    const provider = hasGemini ? 'gemini-tts' : hasGoogleCloudTts ? 'google-cloud-tts' : null;
    return jsonResponse({
      cloudTtsConfigured: Boolean(provider),
      provider
    });
  }

  // 3. Text-to-Speech Synthesis (Gemini TTS REST API or Google Cloud TTS REST API)
  if (apiPath === 'tts' && method === 'POST') {
    const body = await safeJsonBody(request);
    const rawText = body?.text;
    const requestedLang: 'ar' | 'en' = body?.lang === 'en' ? 'en' : 'ar';

    if (typeof rawText !== 'string' || !rawText.trim()) {
      return jsonResponse({ error: 'Text is required for speech synthesis.', code: 'INVALID_TEXT' }, 400);
    }

    const cleanText = rawText.replace(/[*#_`~]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1200);
    const geminiKey = getValidGeminiKey(env);
    const gcpTtsKey = env.GOOGLE_CLOUD_TTS_API_KEY?.trim();

    if (!geminiKey && !gcpTtsKey) {
      return jsonResponse(
        {
          error:
            requestedLang === 'ar'
              ? 'مفتاح القراءة الصوتية السحابية غير مُعدّ في متغيرات Cloudflare Pages؛ يتم الاعتماد على قارئ الجهاز المدمج.'
              : 'Cloud TTS API key is not configured in Cloudflare Pages environment variables.',
          code: 'CLOUD_TTS_UNCONFIGURED'
        },
        503
      );
    }

    if (geminiKey) {
      try {
        const ttsPrompt =
          requestedLang === 'ar'
            ? `اقرأ النص العربي التالي بصوت عربي فصيح وواضح وهادئ وبدون أي إضافات:\n${cleanText}`
            : `Read the following English text clearly and naturally without adding extra words:\n${cleanText}`;

        const geminiRes = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': geminiKey
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: ttsPrompt }] }],
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: requestedLang === 'ar' ? 'Kore' : 'Puck'
                    }
                  }
                }
              }
            })
          }
        );

        if (geminiRes.ok) {
          const gData = (await geminiRes.json()) as any;
          const parts = gData?.candidates?.[0]?.content?.parts || [];
          const audioPart = parts.find((p: any) => p?.inlineData?.data);
          if (audioPart?.inlineData?.data) {
            const rawBytes = base64ToUint8Array(audioPart.inlineData.data);
            const mimeType: string = audioPart.inlineData.mimeType || 'audio/L16;rate=24000';
            if (mimeType.toLowerCase().includes('pcm') || mimeType.toLowerCase().includes('l16')) {
              const rateMatch = /rate=(\d+)/i.exec(mimeType);
              const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
              const wav = pcm16ToWavUint8Array(rawBytes, sampleRate);
              return new Response(wav.buffer as ArrayBuffer, {
                status: 200,
                headers: {
                  'Content-Type': 'audio/wav',
                  'Cache-Control': 'public, max-age=3600'
                }
              });
            }
            return new Response(rawBytes.buffer as ArrayBuffer, {
              status: 200,
              headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=3600'
              }
            });
          }
        }
      } catch (err) {
        console.warn('Cloudflare Gemini TTS fallback error:', err);
      }
    }

    if (gcpTtsKey) {
      try {
        const gcpRes = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpTtsKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: cleanText },
            voice: {
              languageCode: requestedLang === 'ar' ? 'ar-XA' : 'en-US',
              ssmlGender: 'FEMALE'
            },
            audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 }
          })
        });

        if (gcpRes.ok) {
          const gcpData = (await gcpRes.json()) as any;
          if (gcpData.audioContent) {
            const mp3Bytes = base64ToUint8Array(gcpData.audioContent);
            return new Response(mp3Bytes.buffer as ArrayBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600'
              }
            });
          }
        }
      } catch (err) {
        console.warn('Cloudflare Google Cloud TTS fallback error:', err);
      }
    }

    return jsonResponse(
      {
        error:
          requestedLang === 'ar'
            ? 'تعذر توليد الصوت السحابي حاليًا؛ يمكنك استخدام القراءة المحلية إن وجد صوت في جهازك.'
            : 'Cloud TTS failed to generate audio.',
        code: 'CLOUD_TTS_FAILED'
      },
      502
    );
  }

  // 4. Smart Family Rights Advisor
  if (apiPath === 'advisor' && method === 'POST') {
    const body = await safeJsonBody(request);
    const { query, language = 'ar', governorate, userRole } = body;
    if (!query || typeof query !== 'string') {
      return jsonResponse({ error: 'Query is required' }, 400);
    }

    const geminiKey = getValidGeminiKey(env);
    if (!geminiKey) {
      const guidance = generateInstitutionalGuidance(query, language, userRole, governorate);
      return jsonResponse({ response: guidance });
    }

    try {
      const systemInstruction = `أنت المستشار الرسمي المعتمد لـ "حملة دعم وتمكين مرضى الثلاسيميا وأسرهم في فلسطين"، بالشراكة بين وزارة التنمية الاجتماعية (MoSD) وجمعية أصدقاء مرضى الثلاسيميا (TPFS).
مهمتك تقديم إجابات موثوقة ومبسطة ودقيقة للأسر استنادًا إلى الأنظمة الفلسطينية النافذة ومحتوى الحملة الرسمي فقط (الإعفاء الطبي الشامل، برامج الحماية الاجتماعية والسجل الوطني، إدارة الحالة، التمكين الاقتصادي، حقوق الطلبة والعمل بموجب قانون 4 لسنة 1999).
ممنوع تقديم استشارات أو جرعات طبية. وجّه الأسرة إلى الرقم المجاني 189 أو مديرية التنمية الاجتماعية في ${governorate || 'محافظتهم'}.
اللغة: ${language === 'en' ? 'English' : 'العربية'}.`;

      const aiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: query }] }]
          })
        }
      );

      if (aiRes.ok) {
        const aiData = (await aiRes.json()) as any;
        const text = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return jsonResponse({ response: text.trim() });
        }
      }
    } catch (err) {
      console.warn('Cloudflare Advisor Gemini error:', err);
    }

    const guidance = generateInstitutionalGuidance(query, language, userRole, governorate);
    return jsonResponse({ response: guidance });
  }

  // 5. Strict Site-Only Chatbot
  if (apiPath === 'chat' && method === 'POST') {
    const body = await safeJsonBody(request);
    const cleanMessage = typeof body?.message === 'string' ? body.message.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];
    const language: 'ar' | 'en' = body?.language === 'en' ? 'en' : 'ar';

    if (!cleanMessage) {
      return jsonResponse({ error: 'Message is required' }, 400);
    }

    const callbackPrompt = getCallbackPrompt(language);
    const geminiKey = getValidGeminiKey(env);

    if (!geminiKey) {
      const localResult = tryDeterministicSiteAnswer(cleanMessage, language);
      return jsonResponse({
        reply: localResult.reply,
        needsCallback: !localResult.answeredFromSite,
        unansweredQuestion: localResult.answeredFromSite ? undefined : cleanMessage
      });
    }

    try {
      const systemInstruction = `أنت شات بوت المساعدة الرسمي لحملة التوعية والدعم لمرضى الثلاسيميا وأسرهم في فلسطين.
قاعدة صارمة لا يجوز مخالفتها إطلاقًا:
1. أجب **فقط وحصرًا** باستخدام المعلومات الموجودة في «محتوى الموقع الرسمي» أدناه. يُمنع منعًا باتًا استخدام أي معلومات خارجية أو التخمين أو اختراع أرقام أو تفاصيل غير موجودة في النص أدناه.
2. إذا لم تجد إجابة واضحة ومباشرة للسؤال داخل «محتوى الموقع الرسمي» أدناه، اجعل answeredFromSite = false واترك reply فارغًا.
3. إذا كانت الإجابة موجودة بوضوح في «محتوى الموقع الرسمي»، اجعل answeredFromSite = true واكتب إجابة دقيقة ومباشرة.
4. لغة الرد المطلوبة: ${language === 'en' ? 'English' : 'العربية الفصحى الواضحة والمختصرة'}.

«محتوى الموقع الرسمي»:
${SITE_KNOWLEDGE_BASE}`;

      const contents = history.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(msg.text || '') }]
      }));
      contents.push({ role: 'user', parts: [{ text: cleanMessage }] });

      const aiRes = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  answeredFromSite: { type: 'BOOLEAN' },
                  reply: { type: 'STRING' }
                },
                required: ['answeredFromSite', 'reply']
              }
            }
          })
        }
      );

      if (aiRes.ok) {
        const aiData = (await aiRes.json()) as any;
        const rawJson = (aiData?.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson) as { answeredFromSite?: boolean; reply?: string };
          if (parsed.answeredFromSite && parsed.reply && parsed.reply.trim()) {
            return jsonResponse({
              reply: parsed.reply.trim(),
              needsCallback: false
            });
          }
          return jsonResponse({
            reply: callbackPrompt,
            needsCallback: true,
            unansweredQuestion: cleanMessage
          });
        }
      }
    } catch (err) {
      console.warn('Cloudflare Chatbot Gemini error:', err);
    }

    const fallback = tryDeterministicSiteAnswer(cleanMessage, language);
    return jsonResponse({
      reply: fallback.reply,
      needsCallback: !fallback.answeredFromSite,
      unansweredQuestion: fallback.answeredFromSite ? undefined : cleanMessage
    });
  }

  // 6. Support Request Submission (Privacy-First: non-sensitive admin fields only)
  if (apiPath === 'support-requests' && method === 'POST') {
    const body = await safeJsonBody(request);
    const { primaryNeed, idempotencyKey } = body;

    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return jsonResponse({ success: false, error: 'Missing idempotencyKey.' }, 400);
    }

    const hasKv = Boolean(env.THALASSEMIA_KV);
    if (!hasKv) {
      return jsonResponse(
        {
          success: false,
          persistedOnServer: false,
          code: 'STORAGE_UNCONFIGURED',
          error:
            'تعذر حفظ الطلب لعدم ربط مساحة التخزين (Cloudflare KV) في إعدادات الاستضافة بعد. يرجى الاتصال مباشرة على الرقم المجاني 189 أو مراجعة أقرب مديرية تنمية اجتماعية.'
        },
        503
      );
    }

    const store = await readKvStore(env);
    const existing = store.records.find((r) => r.idempotencyKey === idempotencyKey);
    if (existing) {
      return jsonResponse({
        success: true,
        duplicatePrevented: true,
        persistedOnServer: true,
        trackingCode: existing.trackingCode,
        submittedAt: existing.submittedAt,
        supportTypeLabel: existing.supportTypeLabel,
        status: existing.status
      });
    }

    const nowStr = formatPalestineTimestamp();
    const trackingCode = generateServerTrackingCode(false);
    const newRecord: AdminSupportRecord = {
      trackingCode,
      submittedAt: nowStr,
      supportTypeCode: typeof primaryNeed === 'string' ? primaryNeed : 'social_protection',
      supportTypeLabel: getSupportTypeLabelAr(primaryNeed),
      status: DEFAULT_STATUS_AR,
      lastUpdated: nowStr,
      followUpNote: 'مسجل عبر الموقع بانتظار المراجعة - بيانات شخصية محجوبة',
      idempotencyKey
    };

    store.records = [newRecord, ...store.records];
    await writeKvStore(env, store);

    return jsonResponse(
      {
        success: true,
        duplicatePrevented: false,
        persistedOnServer: true,
        trackingCode: newRecord.trackingCode,
        submittedAt: newRecord.submittedAt,
        supportTypeLabel: newRecord.supportTypeLabel,
        status: newRecord.status
      },
      201
    );
  }

  // 7. Chatbot Unanswered-Question Callback Leads
  if (apiPath === 'chat-callbacks' && method === 'POST') {
    const body = await safeJsonBody(request);
    const { fullName, phone, question, idempotencyKey } = body;

    const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
    const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
    const cleanQuestion =
      typeof question === 'string' && question.trim() ? question.trim().slice(0, 500) : 'استفسار عبر الشات بوت';

    if (cleanName.length < 2) {
      return jsonResponse({ success: false, error: 'يرجى كتابة الاسم الكامل.' }, 400);
    }
    if (cleanPhone.replace(/\D/g, '').length < 7) {
      return jsonResponse({ success: false, error: 'يرجى كتابة رقم هاتف صحيح للتواصل.' }, 400);
    }

    const hasKv = Boolean(env.THALASSEMIA_KV);
    if (!hasKv) {
      return jsonResponse(
        {
          success: false,
          persistedOnServer: false,
          code: 'CALLBACK_STORAGE_UNCONFIGURED',
          error:
            'تعذر حفظ بيانات التواصل لأن مساحة التخزين الآمنة (Cloudflare KV) غير مفعّلة في إعدادات الاستضافة بعد. يرجى الاتصال مباشرة على الرقم المجاني 189.'
        },
        503
      );
    }

    const effectiveKey =
      typeof idempotencyKey === 'string' && idempotencyKey.trim()
        ? idempotencyKey.trim()
        : `cb-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    const store = await readKvStore(env);
    const existing = store.chatCallbacks.find((c) => c.idempotencyKey === effectiveKey);
    if (existing) {
      return jsonResponse({
        success: true,
        duplicatePrevented: true,
        persistedOnServer: true,
        referenceCode: existing.referenceCode,
        submittedAt: existing.submittedAt
      });
    }

    const nowStr = formatPalestineTimestamp();
    const referenceCode = `CHAT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCallback: ChatCallbackRecord = {
      referenceCode,
      submittedAt: nowStr,
      fullName: cleanName,
      phone: cleanPhone,
      question: cleanQuestion,
      status: DEFAULT_CALLBACK_STATUS_AR,
      idempotencyKey: effectiveKey
    };

    store.chatCallbacks = [newCallback, ...store.chatCallbacks];
    await writeKvStore(env, store);

    return jsonResponse(
      {
        success: true,
        duplicatePrevented: false,
        persistedOnServer: true,
        referenceCode: newCallback.referenceCode,
        submittedAt: newCallback.submittedAt
      },
      201
    );
  }

  return jsonResponse({ error: 'Not found' }, 404);
};
