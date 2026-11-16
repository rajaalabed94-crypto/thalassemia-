import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  type AdminSupportRecord,
  type ChatCallbackRecord,
  DEFAULT_CALLBACK_STATUS_AR,
  DEFAULT_STATUS_AR,
  SITE_KNOWLEDGE_BASE,
  formatPalestineTimestamp,
  generateServerTrackingCode,
  getSupportTypeLabelAr
} from './shared/campaignEngine.ts';
import { readStore, writeStore } from './server/supportStore.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT || '3000', 10);

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const ttsAudioCache = new Map<string, { buffer: Buffer; mimeType: string }>();
const TTS_CACHE_MAX_ENTRIES = 80;

function setTtsCache(key: string, value: { buffer: Buffer; mimeType: string }) {
  if (ttsAudioCache.size >= TTS_CACHE_MAX_ENTRIES) {
    const oldestKey = ttsAudioCache.keys().next().value;
    if (oldestKey) ttsAudioCache.delete(oldestKey);
  }
  ttsAudioCache.set(key, value);
}

function generateInstitutionalGuidance(
  query: string, 
  language: string = 'ar', 
  userRole?: string, 
  governorate?: string
): string {
  const isAr = language !== 'en';
  const q = query.toLowerCase();
  const govNotice = governorate 
    ? (isAr ? `في محافظة ${governorate}` : `in ${governorate} Governorate`) 
    : (isAr ? 'في محافظتك' : 'in your governorate');

  // Check if query is unrelated to campaign services, rights, or thalassemia
  const campaignKeywords = [
    'ثلاسيميا', 'دم', 'إعفاء', 'طبي', 'صحي', 'مجاني', 'مرض', 'طفل', 'أسرة', 'علاج',
    'حماية', 'مساعدة', 'تنمية', 'جمعية', 'تمكين', 'مشروع', 'تعليم', 'مدرسة',
    'جامعة', 'وظيفة', 'عمل', 'زواج', 'فحص', 'وراث', 'أعراض', 'مستشفى',
    'مديرية', 'شؤون', 'طرد', 'حديد', 'أدوية', 'كفالة', 'استحقاق',
    'thalassemia', 'blood', 'medical', 'aid', 'health', 'support', 'exemption'
  ];
  const isRelevant = campaignKeywords.some(k => q.includes(k));

  if (!isRelevant && q.trim().length > 3) {
    return isAr
      ? `أهلاً بك الكريم.\n\nنعتذر منك، لم نتمكن من العثور على إجابة كافية لهذا السؤال ضمن الخدمات والمعلومات المتاحة في قاعدة بيانات الحملة الرسمية.\n\nيرجى تزويدنا برقم هاتفك وسيقوم الأخصائي الاجتماعي أو المرشد المختص بالتواصل معك في أقرب فرصة ممكنة لمتابعة حالتك، أو يمكنك الاتصال مباشرة عبر الرقم المجاني 189 أو مراجعة أقرب مديرية تنمية اجتماعية.`
      : `Welcome.\n\nWe apologize, but we could not find a verified answer to this question within our official campaign records. Please provide your phone number so an MoSD social caseworker can contact you as soon as possible, or call toll-free 189.`;
  }

  if (q.includes('إعفاء') || q.includes('صحي') || q.includes('مجاني') || q.includes('علاج') || q.includes('دم') || q.includes('hospital') || q.includes('medical')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `وفقاً لقانون الصحة العامة الفلسطيني والبروتوكولات الحكومية النافذة، يحظى مريض الثلاسيميا بـ **الإعفاء الطبي الشامل** وتغطية كاملة لوحدات الدم المفلترة، أدوية سحب الحديد (Desferal, Exjade)، والفحوصات الدورية المخبرية التخصصية دون أي أعباء مالية.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• مراجعة مديرية الصحة ${govNotice} ومستشفى الرعاية الحكومي مصطحباً التقرير الطبي.\n` +
        `• التنسيق مع فرع جمعية أصدقاء مرضى الثلاسيميا لتسجيل الحالة وتوفير بطاقة المتابعة الميدانية.\n` +
        `• فتح ملف إدارة حالة في مديرية التنمية الاجتماعية للاستفادة من برامج الحماية وبدل المواصلات.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• تقرير طبي رسمي معتمد صادر عن المستشفى الحكومي يثبت تشخيص ثلاسيميا بيتا الكبرى.\n` +
        `• بطاقة هوية ولي الأمر أو المريض + شهادة الميلاد.\n` +
        `• صورتان شخصيتان للمريض.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `مديرية الصحة والمستشفى الحكومي ${govNotice}، والتنسيق المباشر مع فرع جمعية أصدقاء مرضى الثلاسيميا ومديرية التنمية الاجتماعية.`
      : `### 1. Legal & Social Grounding:\n` +
        `Under Palestinian public regulations, patients living with Thalassemia receive 100% comprehensive medical exemption covering blood transfusions, iron chelation therapies, and periodic tests without financial charge.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Visit the Directorate of Health and government hospital ${govNotice}.\n` +
        `• Coordinate with the Thalassemia Patients’ Friends Society (TPFS) branch.\n` +
        `• Open a family case file at MoSD Directorate for social support.\n\n` +
        `### 3. Required Documents:\n` +
        `• Official government hospital diagnostic report.\n` +
        `• Guardian/patient ID and birth certificate.\n` +
        `• Two personal photos.\n\n` +
        `### 4. Where to Go:\n` +
        `Directorate of Health and hospital ${govNotice}, TPFS branch, and MoSD Directorate.`;
  }

  if (q.includes('تمكين') || q.includes('مشروع') || q.includes('منح') || q.includes('قرض') || q.includes('دخل') || q.includes('economic') || q.includes('grant') || q.includes('project')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `تضع وزارة التنمية الاجتماعية أسر مرضى الثلاسيميا والمرضى البالغين المؤهلين على رأس أولويات **الإدارة العامة للتمكين الاقتصادي**، لتحويل الأسر من الاعتمادية على المساعدات إلى أسر منتجة ذات دخل مستقر وكريم.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• مراجعة مرشد التمكين الاقتصادي في مديرية التنمية الاجتماعية ${govNotice}.\n` +
        `• تعبئة استمارة فكرة المشروع الإنتاجي (زراعي، تجاري، مهني، أو خدمي).\n` +
        `• إعداد دراسة الجدوى وتحديد الاحتياجات من المعدات والمواد الخام بالتعاون مع شركاء التمكين.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• بطاقة الهوية لرب الأسرة أو المريض المتقدم.\n` +
        `• إثبات السكن والوضع الاجتماعي.\n` +
        `• شهادة خبرة أو مهارة مهنية في مجال المشروع المقترح إن وجدت.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `قسم التمكين الاقتصادي في مديرية التنمية الاجتماعية ${govNotice}.`
      : `### 1. Legal & Social Grounding:\n` +
        `The Ministry of Social Development prioritizes Thalassemia households and adult patients for economic empowerment micro-grants to transition from dependency into productive, sustainable independence.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Consult the Economic Empowerment Officer at your local MoSD directorate ${govNotice}.\n` +
        `• Submit your micro-project proposal (vocational, retail, agricultural, or service).\n` +
        `• Formulate feasibility assessment and tooling procurement plan.\n\n` +
        `### 3. Required Documents:\n` +
        `• National Palestinian ID.\n` +
        `• Family registry record and residency proof.\n` +
        `• Vocational certificates or past work proof if applicable.\n\n` +
        `### 4. Where to Go:\n` +
        `Economic Empowerment Unit at MoSD Directorate ${govNotice}.`;
  }

  if (q.includes('مدرسة') || q.includes('جامعة') || q.includes('تعليم') || q.includes('غياب') || q.includes('امتحان') || q.includes('school') || q.includes('university') || q.includes('student')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `تكفل التفاهمات المبرمة بين وزارتي التربية والتعليم والتعليم العالي وجمعية الثلاسيميا حق الطالب في اعتبار أيام جلسات نقل الدم غياباً رسمياً مبرراً بعذر مرضي، وتلزم إدارات المدارس والجامعات بعدم الخصم من درجات الطالب وتوفير امتحانات إكمالية مرنة.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• تزويد الإرشاد التربوي أو عمادة شؤون الطلبة بجدول مواعيد نقل الدم الشهرية المقررة.\n` +
        `• الحصول على كتاب دعم وتوصيف لحالة الطالب من جمعية أصدقاء مرضى الثلاسيميا لتسليمه للمؤسسة التعليمية.\n` +
        `• التنسيق مع الأساتذة والمرشد لتسليم الواجبات وتقديم الامتحانات البديلة دون ضغط نفسي.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• تقرير طبي حديث يثبت دورية نقل الدم.\n` +
        `• كتاب الجمعية الموجه لمدير المدرسة أو عميد الكلية.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `إدارة المدرسة أو عمادة شؤون الطلبة بالجامعة، والتواصل مع منسق التعليم بجمعية الثلاسيميا.`
      : `### 1. Legal & Social Grounding:\n` +
        `Under ministerial understandings with TPFS, student absences on transfusion days are officially excused and legally prohibited from harming academic standing or exam qualifications.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Submit monthly transfusion schedule to school counselor or Dean of Students.\n` +
        `• Provide TPFS institutional liaison letter requesting academic accommodation.\n` +
        `• Coordinate flexible make-up exam dates.\n\n` +
        `### 3. Required Documents:\n` +
        `• Hospital transfusion attendance note.\n` +
        `• Official TPFS educational recommendation letter.\n\n` +
        `### 4. Where to Go:\n` +
        `School administration, Dean of Student Affairs, and TPFS Education coordinator.`;
  }

  if (q.includes('وظيفة') || q.includes('عمل') || q.includes('توظيف') || q.includes('حامل') || q.includes('صفة') || q.includes('work') || q.includes('job') || q.includes('carrier')) {
    return isAr
      ? `### 1. التطمين والوضع القانوني:\n` +
        `بموجب قانون رعاية وتأهيل المعوقين الفلسطيني رقم (4) لسنة 1999 وقانون العمل، يحظر أي تمييز ضد مريض الثلاسيميا القادر على العمل، كما تلتزم المؤسسات بنسبة الـ 5% للمؤهلين. أما حامل الصفة الوراثية فهو سليم 100% ويُحظر قانوناً استبعاده من أي مسابقة توظيف مدنية أو أمنية.\n\n` +
        `### 2. الخطوات العملية المحددة:\n` +
        `• التقدم للوظائف وفق الكفاءة والشهادات العلمية والمهنية.\n` +
        `• في حال طلب فحص طبي لوظيفة مدنية أو عسكرية، تمنح جمعية الثلاسيميا شهادة رسمية تؤكد أن حامل الصفة لائق طبياً بشكل كامل.\n` +
        `• في حال وجود أي عائق، يتم رفع شكوى لديوان الموظفين العام أو نقابة العمال بالتعاون مع الشؤون القانونية للجمعية.\n\n` +
        `### 3. الوثائق المطلوبة:\n` +
        `• شهادة فحص ما قبل الزواج أو فحص الهيموجلوبين الكهربائي (Hb Electrophoresis).\n` +
        `• كتاب من الجمعية يؤكد سلامة حامل الصفة الوراثية.\n\n` +
        `### 4. أين تتوجه للتنفيذ:\n` +
        `الدائرة القانونية بجمعية أصدقاء مرضى الثلاسيميا ومديرية العمل ${govNotice}.`
      : `### 1. Legal & Social Grounding:\n` +
        `Palestinian Disability Law No. 4 of 1999 guarantees non-discrimination in employment. Genetic carriers are 100% medically healthy individuals with zero legal or functional restriction for any civil or security post.\n\n` +
        `### 2. Actionable Steps:\n` +
        `• Apply normally based on qualifications.\n` +
        `• Obtain official medical fitness endorsement from TPFS for civil service or military committees.\n` +
        `• Report any unjust rejection to TPFS legal desk for immediate institutional intervention.\n\n` +
        `### 3. Required Documents:\n` +
        `• Hemoglobin Electrophoresis lab report.\n` +
        `• TPFS carrier fitness endorsement.\n\n` +
        `### 4. Where to Go:\n` +
        `TPFS Legal Affairs Unit and Ministry of Labor Directorate ${govNotice}.`;
  }

  // Default General MoSD Social Protection & Case Management Guidance
  return isAr
    ? `### 1. التطمين والوضع القانوني والاجتماعي:\n` +
      `ترحب وزارة التنمية الاجتماعية وجمعية أصدقاء مرضى الثلاسيميا بأسرتكم الكريمة. أنتم لستم وحدكم في مواجهة أعباء المرض؛ يحق لأسرتكم فتح ملف دراسة حالة رسمي عبر **السجل الوطني الاجتماعي** للاستفادة من برامج الحماية، المساعدات النقدية والطارئة، والدعم النفسي وفق معايير الاستحقاق.\n\n` +
      `### 2. الخطوات العملية المحددة:\n` +
      `• زيارة مديرية التنمية الاجتماعية ${govNotice} ومقابلة الأخصائي الاجتماعي المكلف بإدارة الحالة.\n` +
      `• تسجيل الأسرة في السجل الوطني الاجتماعي لتقييم الاحتياجات الشاملة وفق معادلة الفقر متعدد الأبعاد.\n` +
      `• التنسيق مع جمعية أصدقاء مرضى الثلاسيميا للانضمام لبرامج الإرشاد الأسري ودعم الأقران.\n\n` +
      `### 3. الوثائق المطلوبة:\n` +
      `• بطاقة الهوية لولي الأمر وشهادات ميلاد أفراد الأسرة.\n` +
      `• التقرير الطبي الحكومي الخاص بمريض الثلاسيميا.\n` +
      `• فواتير أو مستندات تثبت نفقات العلاج والتنقل أو انقطاع الدخل.\n\n` +
      `### 4. أين تتوجه للتنفيذ:\n` +
      `مديرية التنمية الاجتماعية ${govNotice}، ومقر جمعية أصدقاء مرضى الثلاسيميا.`
    : `### 1. Legal & Social Grounding:\n` +
      `Under the joint partnership of the Ministry of Social Development and TPFS, families affected by Thalassemia have full rights to social protection assessment via the National Social Registry, case management, and emergency relief based on multidimensional vulnerability.\n\n` +
      `### 2. Actionable Steps:\n` +
      `• Visit your regional MoSD Directorate ${govNotice} to open a case management file.\n` +
      `• Complete social intake assessment for cash, food, or emergency safety nets.\n` +
      `• Register with TPFS for family counseling and peer empowerment activities.\n\n` +
      `### 3. Required Documents:\n` +
      `• Guardian national ID and family registry.\n` +
      `• Government hospital diagnostic report.\n` +
      `• Transit cost records or proof of economic hardship.\n\n` +
      `### 4. Where to Go:\n` +
      `MoSD Directorate ${govNotice} and regional TPFS branch.`;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'thalassemia-portal-api' });
  });

  // Cloud Text-to-Speech availability check (never exposes keys)
  app.get('/api/tts/status', (_req, res) => {
    const hasGemini = Boolean(getGeminiClient());
    const hasGoogleCloudTts = Boolean(process.env.GOOGLE_CLOUD_TTS_API_KEY?.trim());
    const provider = hasGemini ? 'gemini-tts' : hasGoogleCloudTts ? 'google-cloud-tts' : null;
    res.json({
      cloudTtsConfigured: Boolean(provider),
      provider
    });
  });

  // Secure Backend Cloud Text-to-Speech Endpoint (Arabic & English)
  app.post('/api/tts', async (req, res) => {
    try {
      const rawText = req.body?.text;
      const requestedLang = req.body?.lang === 'en' ? 'en' : 'ar';

      if (typeof rawText !== 'string' || !rawText.trim()) {
        return res.status(400).json({
          code: 'INVALID_TEXT',
          error: 'النص المطلوب قراءته فارغ.'
        });
      }

      const cleanText = rawText.replace(/\s+/g, ' ').trim();
      if (cleanText.length > 2000) {
        return res.status(400).json({
          code: 'TEXT_TOO_LONG',
          error: 'النص المرسل أطول من الحد المسموح للطلب الواحد.'
        });
      }

      const hasArabicChars = /[\u0600-\u06FF]/.test(cleanText);
      const effectiveLang: 'ar' | 'en' = hasArabicChars ? 'ar' : requestedLang;
      const cacheKey = `${effectiveLang}:${cleanText}`;

      const cached = ttsAudioCache.get(cacheKey);
      if (cached) {
        res.setHeader('Content-Type', cached.mimeType);
        res.setHeader('Cache-Control', 'private, max-age=3600');
        res.setHeader('X-TTS-Provider', 'cache');
        return res.status(200).send(cached.buffer);
      }

      const ai = getGeminiClient();
      const gcpTtsKey = process.env.GOOGLE_CLOUD_TTS_API_KEY?.trim();

      if (!ai && !gcpTtsKey) {
        return res.status(503).json({
          code: 'CLOUD_TTS_UNCONFIGURED',
          error:
            'لا يتوفر صوت عربي محلي على جهازك حاليًا، وخدمة الصوت السحابية غير مفعّلة بعد على الخادم (مفتاح GEMINI_API_KEY أو GOOGLE_CLOUD_TTS_API_KEY غير مضاف).'
        });
      }

      let lastError: any = null;

      // Provider 1: Gemini 3.8 Flash Lite TTS (returns complete 24kHz mono WAV)
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanText,
                    speechMetadata: {
                      style:
                        effectiveLang === 'ar'
                          ? 'Clear, warm, natural Modern Standard Arabic narrator speaking calmly and articulately for accessibility.'
                          : 'Clear, warm, natural English narrator speaking calmly and articulately for accessibility.'
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
              }
            }
          });

          const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (inlineData?.data) {
            const wavBuffer = Buffer.from(inlineData.data, 'base64');
            if (wavBuffer.length > 44) {
              const mimeType = inlineData.mimeType || 'audio/wav';
              setTtsCache(cacheKey, { buffer: wavBuffer, mimeType });
              res.setHeader('Content-Type', mimeType);
              res.setHeader('Cache-Control', 'private, max-age=3600');
              res.setHeader('X-TTS-Provider', 'gemini-tts');
              return res.status(200).send(wavBuffer);
            }
          }
          lastError = new Error('Gemini TTS returned empty audio payload.');
        } catch (geminiErr: any) {
          lastError = geminiErr;
          console.error('Gemini TTS Error:', geminiErr?.message || geminiErr);
        }
      }

      // Provider 2: Google Cloud Text-to-Speech API fallback (if configured)
      if (gcpTtsKey) {
        try {
          const gcpRes = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(gcpTtsKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                input: { text: cleanText },
                voice:
                  effectiveLang === 'ar'
                    ? { languageCode: 'ar-XA', name: 'ar-XA-Wavenet-A' }
                    : { languageCode: 'en-US', name: 'en-US-Neural2-F' },
                audioConfig: {
                  audioEncoding: 'MP3',
                  speakingRate: 0.96
                }
              })
            }
          );

          if (gcpRes.ok) {
            const gcpData = await gcpRes.json();
            if (gcpData?.audioContent) {
              const mp3Buffer = Buffer.from(gcpData.audioContent, 'base64');
              if (mp3Buffer.length > 0) {
                setTtsCache(cacheKey, { buffer: mp3Buffer, mimeType: 'audio/mpeg' });
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Cache-Control', 'private, max-age=3600');
                res.setHeader('X-TTS-Provider', 'google-cloud-tts');
                return res.status(200).send(mp3Buffer);
              }
            }
          } else {
            const errText = await gcpRes.text();
            lastError = new Error(`Google Cloud TTS HTTP ${gcpRes.status}: ${errText}`);
            console.error('Google Cloud TTS Error:', lastError.message);
          }
        } catch (gcpErr: any) {
          lastError = gcpErr;
          console.error('Google Cloud TTS Request Error:', gcpErr?.message || gcpErr);
        }
      }

      const rawMsg = String(lastError?.message || lastError || '');
      const isAuthErr =
        rawMsg.includes('403') ||
        rawMsg.includes('400') ||
        rawMsg.includes('API_KEY_INVALID') ||
        rawMsg.includes('PERMISSION_DENIED');
      const isQuotaErr = rawMsg.includes('429') || rawMsg.includes('RESOURCE_EXHAUSTED');

      return res.status(isQuotaErr ? 429 : 502).json({
        code: isAuthErr
          ? 'CLOUD_TTS_AUTH_ERROR'
          : isQuotaErr
          ? 'CLOUD_TTS_QUOTA'
          : 'CLOUD_TTS_FAILED',
        error: isAuthErr
          ? 'تعذر التحقق من مفتاح خدمة الصوت السحابية على الخادم. يرجى التحقق من صلاحية المفتاح.'
          : isQuotaErr
          ? 'تم تجاوز الحد المتاح مؤقتًا لخدمة الصوت السحابية. يرجى المحاولة بعد قليل.'
          : 'تعذر توليد الصوت العربي من الخدمة السحابية حاليًا. يرجى المحاولة بعد قليل.'
      });
    } catch (error: any) {
      console.error('Unexpected /api/tts error:', error?.message || error);
      return res.status(500).json({
        code: 'CLOUD_TTS_FAILED',
        error: 'حدث خطأ غير متوقع في خدمة الصوت السحابية.'
      });
    }
  });

  // AI Family Rights & Guidance Advisor Endpoint
  app.post('/api/advisor', async (req, res) => {
    try {
      const { query, language = 'ar', category, userRole, governorate } = req.body;

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const cleanQuery = query.trim();
      const apiKey = process.env.GEMINI_API_KEY;

      // If no valid key or placeholder key, use immediate authoritative institutional guidance
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        const guidance = generateInstitutionalGuidance(cleanQuery, language, userRole, governorate);
        return res.json({ response: guidance });
      }

      // If API key is present, attempt Gemini call with timeout safety
      const ai = new GoogleGenAI({});
      const systemInstruction = `You are the official Smart Social Rights & Family Guidance Advisor for the joint campaign between the Palestinian Ministry of Social Development (وزارة التنمية الاجتماعية الفلسطينية) and the Thalassemia Patients’ Friends Society - Palestine (جمعية أصدقاء مرضى الثلاسيميا - فلسطين).
Role & Strict Boundaries:
- You provide compassionate, authoritative, clear guidance to Palestinian families, patients, and caregivers on social protection, economic empowerment programs, case management, comprehensive medical fee exemptions, schooling accommodations, and legal rights under Palestinian Law (e.g. Disability Law No. 4 of 1999, MoSD Social Safety Net, Civil Service Law).
- MANDATORY BOUNDARY: Do NOT mention or discuss 'التأمين الصحي' (health insurance). Instead, discuss full medical exemptions, free blood units and iron chelation at MoH hospitals, cash aids from MoSD, and economic empowerment. Do NOT provide clinical diagnoses or drug dosages.
- Style: Respectful, dignity-preserving, reassuring Palestinian institutional terminology (مديريات التنمية الاجتماعية, السجل الوطني الاجتماعي, إدارة الحالة, الإعفاء الطبي الشامل, جمعية أصدقاء مرضى الثلاسيميا, رام الله, نابلس, الخليل, جنين, طولكرم, قلقيلية, بيت لحم, غزة, إلخ).
- Respond in ${language === 'en' ? 'English' : 'Arabic (Clear, formal, and compassionate classical Arabic - لغة عربية فصحى)'}.
- IF UNABLE TO ANSWER OR QUESTION IS OUTSIDE CAMPAIGN SERVICES: If the user asks about an unknown topic or something outside the official services (MoSD social protection, economic empowerment, medical care exemptions, rights, TPFS), respond politely in formal Classical Arabic (فصحى):
  "أهلاً بك الكريم. نعتذر منك، لم نتمكن من العثور على إجابة كافية لهذا السؤال ضمن بيانات الحملة الرسمية المتاحة في المنصة. يرجى تزويدنا برقم هاتفك وسيقوم الأخصائي الاجتماعي أو المرشد المختص بالتواصل معك في أقرب فرصة ممكنة لمتابعة طلبك، أو يمكنك الاتصال مباشرة على الرقم المجاني 189."
- Organize your response using clear markdown headings:
  1. التطمين والوضع القانوني / الاجتماعي (Legal & Social Rights Summary)
  2. الخطوات العملية المحددة (Actionable Steps)
  3. الوثائق المطلوبة (Required Documents)
  4. أين تتوجه للتنفيذ (Where to go: MoSD Directorate / TPFS branch)
Keep your answer focused (around 150-250 words), practical, and reassuring for an anxious parent or patient.`;

      const promptContext = `User Question: "${cleanQuery}"\n` +
        (category ? `Category: ${category}\n` : '') +
        (userRole ? `User Role: ${userRole}\n` : '') +
        (governorate ? `Governorate: ${governorate}\n` : '');

      // 4-second timeout guarantee
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => resolve(null), 4000)
      );

      const result = await Promise.race([geminiPromise, timeoutPromise]);

      if (result && 'text' in result && result.text) {
        return res.json({ response: result.text });
      }

      // Fallback to high quality institutional guidance
      const guidance = generateInstitutionalGuidance(cleanQuery, language, userRole, governorate);
      return res.json({ response: guidance });
    } catch (error: any) {
      console.error('Advisor API Error (falling back to institutional rule engine):', error?.message || error);
      const guidance = generateInstitutionalGuidance(
        req.body?.query || '', 
        req.body?.language || 'ar', 
        req.body?.userRole, 
        req.body?.governorate
      );
      return res.json({ response: guidance });
    }
  });

  // Strict Site-Only Multi-Turn Chatbot Endpoint
  app.post('/api/chat', async (req, res) => {
    const cleanMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const language = req.body?.language === 'en' ? 'en' : 'ar';

    if (!cleanMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const callbackPrompt =
      language === 'en'
        ? 'Sorry, I could not find an answer to this question in the website content. Please provide your full name and phone number, and our team will contact you soon.'
        : 'عذرًا، لم أتمكن من العثور على إجابة لهذا السؤال ضمن معلومات الموقع الحالية. من فضلك أعطني اسمك الكامل ورقم هاتفك، وسيتواصل معك فريقنا المختص في أقرب وقت.';

    const tryDeterministicSiteAnswer = (qRaw: string): { answeredFromSite: boolean; reply: string } => {
      const q = qRaw.toLowerCase();
      const siteMatchers: Array<{ keywords: string[]; replyAr: string; replyEn: string }> = [
        {
          keywords: ['ما هي الثلاسيميا', 'تعريف', 'ما هو مرض', 'معني الثلاسيميا', 'أعراض', 'اعراض', 'علامات', 'معدي', 'معدية', 'what is thalassemia', 'symptoms'],
          replyAr:
            'الثلاسيميا اضطراب وراثي في خلايا الدم يؤدي إلى انخفاض مستوى الهيموجلوبين وعدد كريات الدم الحمراء عن المعدل الطبيعي، وهو غير معدي نهائيًا. من أبرز أعراضه المذكورة في الموقع: التعب والضعف العام، ضيق التنفس، شحوب البشرة، اصفرار الجلد (اليرقان)، تغيرات عظام الوجه، بطء النمو، انتفاخ البطن، وتغير لون البول إلى الداكن.',
          replyEn:
            'Thalassemia is an inherited, non-contagious blood disorder characterized by low hemoglobin and red blood cells. Symptoms listed on the site include fatigue, shortness of breath, pale skin, jaundice, facial bone changes, delayed growth, abdominal swelling, and dark urine.'
        },
        {
          keywords: ['وراث', 'تنتقل', 'فحص', 'زواج', 'حامل', 'الصفة', 'نسب', 'genetic', 'inherit', 'premarital', 'carrier'],
          replyAr:
            'تنتقل الثلاسيميا وراثيًا من الوالدين عبر الجينات. إذا كان كلا الوالدين حاملين للصفة الوراثية، فإن احتمالات كل حمل هي: 25% طفل سليم تمامًا، 50% طفل حامل للصفة (سليم 100% ولا يحتاج علاجًا)، و25% طفل مصاب. الفحص الطبي الشامل قبل الزواج يحد من انتقال المرض للأبناء.',
          replyEn:
            'When both parents carry the thalassemia trait, each pregnancy has a 25% chance of an unaffected child, 50% carrier (100% healthy), and 25% affected child. Premarital screening prevents transmission.'
        },
        {
          keywords: ['إعفاء', 'اعفاء', 'علاج', 'نقل دم', 'حديد', 'مستشفى', 'أدوية', 'ادوية', 'medical', 'exemption', 'treatment'],
          replyAr:
            'بحسب معلومات الموقع، يحصل مريض الثلاسيميا على الإعفاء الطبي الشامل للرعاية الصحية ونقل الدم المنتظم وأدوية طرد الحديد الزائد في المستشفيات الحكومية. وتجدر الإشارة إلى أن وزارة التنمية الاجتماعية لا تقدم خدمات طبية أو نقل دم أو أدوية مباشرة، بل تركز على الحماية الاجتماعية والمساعدات وإدارة الحالة والتمكين.',
          replyEn:
            'Patients receive comprehensive medical exemption for blood transfusions and iron chelation at government hospitals. Note that MoSD provides social protection, aid, and case management rather than direct clinical treatment.'
        },
        {
          keywords: ['خدم', 'مساعد', 'حماية', 'نقد', 'استحقاق', 'سجل وطني', 'تمكين', 'مشروع', 'منح', 'دعم نفسي', 'إدارة الحالة', 'services', 'empowerment', 'cash', 'protection'],
          replyAr:
            'تشمل خدمات الحملة الست الموضحة في الموقع: (1) الحماية الاجتماعية والتسجيل في السجل الوطني الاجتماعي، (2) المساعدات وفق الاستحقاق (نقدية طارئة وطرود)، (3) الدعم النفسي والاجتماعي مجانًا وبسرية في مراكز الجمعية أو عن بُعد، (4) إدارة الحالة والمتابعة عبر أخصائي اجتماعي، (5) الإحالة للخدمات المختصة، (6) التمكين الاقتصادي ومنح المشاريع الصغيرة للمؤهلين (18 عامًا فأكثر أو معيلي الأسر).',
          replyEn:
            'The campaign offers 6 services: Social Protection (National Social Registry), Eligibility-based Assistance, Free Confidential Psychosocial Support, Case Management, Referrals, and Economic Empowerment micro-grants.'
        },
        {
          keywords: ['مدرسة', 'جامعة', 'غياب', 'امتحان', 'توظيف', 'وظيفة', 'عمل', 'قانون', 'وصمة', 'school', 'university', 'job', 'employment', 'stigma'],
          replyAr:
            'وفق محتوى الموقع، أيام جلسات نقل الدم للطلاب تُعد غيابًا مبررًا بعذر طبي رسمي مع تنسيق الامتحانات الإكمالية. وفي العمل، يحظر قانون رعاية وتأهيل المعوقين رقم (4) لسنة 1999 التمييز ضد المريض القادر على العمل (بنسبة 5% للمؤهلين)، كما أن حامل الصفة سليم 100% ولا يجوز استبعاده من أي وظيفة مدنية أو أمنية.',
          replyEn:
            'Transfusion days are officially excused absences for students with exam accommodations. Under Palestinian Disability Law No. 4 (1999), workplace discrimination is prohibited and genetic carriers face zero employment restrictions.'
        },
        {
          keywords: ['أبدأ', 'ابدا', 'طلب دعم', 'مسار الدعم', 'مديرية', 'مديريات', 'رقم', '189', 'هاتف', 'سرية', 'سري', 'بيانات', 'من أنتم', 'الجمعية', 'الوزارة', 'directorate', 'request', 'confidential'],
          replyAr:
            'لتقديم طلب دعم يمكنك تعبئة نموذج «ابدأ مسار الدعم» في الموقع، أو الاتصال على الرقم المجاني 189، أو زيارة أقرب مديرية تنمية اجتماعية (الموضحة عناوينها وأرقامها في صفحة خريطة المديريات بالموقع). كافة البيانات تُعامل بسرية تامة ولا تُنشر دون موافقة مسبقة.',
          replyEn:
            'You can submit the Start Support Pathway form on this site, call toll-free 189, or visit your nearest MoSD Directorate listed on the Directorates Map page. All data is strictly confidential.'
        }
      ];

      const matched = siteMatchers.find((m) => m.keywords.some((kw) => q.includes(kw)));
      if (!matched) {
        return { answeredFromSite: false, reply: callbackPrompt };
      }
      return {
        answeredFromSite: true,
        reply: language === 'en' ? matched.replyEn : matched.replyAr
      };
    };

    try {
      const ai = getGeminiClient();

      if (!ai) {
        const localResult = tryDeterministicSiteAnswer(cleanMessage);
        return res.json({
          reply: localResult.reply,
          needsCallback: !localResult.answeredFromSite,
          unansweredQuestion: localResult.answeredFromSite ? undefined : cleanMessage
        });
      }

      const systemInstruction = `أنت شات بوت المساعدة الرسمي لحملة التوعية والدعم لمرضى الثلاسيميا وأسرهم في فلسطين.
قاعدة صارمة لا يجوز مخالفتها إطلاقًا:
1. أجب **فقط وحصرًا** باستخدام المعلومات الموجودة في «محتوى الموقع الرسمي» أدناه. يُمنع منعًا باتًا استخدام أي معلومات خارجية أو التخمين أو اختراع أرقام أو تفاصيل غير موجودة في النص أدناه.
2. إذا لم تجد إجابة واضحة ومباشرة للسؤال داخل «محتوى الموقع الرسمي» أدناه (مثل: أسئلة عامة خارج الحملة، جرعات أدوية، مواعيد أو أسعار محددة غير مذكورة، استعلام عن حالة شخصية، تفاصيل مستشفيات أو أطباء غير مذكورين، أو أي سؤال لا يغطيه محتوى الموقع صراحةً)، يجب أن تجعل قيمة الحقل answeredFromSite = false وتترك reply فارغًا أو تكتب اعتذارًا قصيرًا.
3. إذا كانت الإجابة موجودة بوضوح في «محتوى الموقع الرسمي»، اجعل answeredFromSite = true واكتب إجابة دقيقة ومباشرة وواضحة مستندة فقط إلى النص أدناه.
4. لغة الرد المطلوبة: ${language === 'en' ? 'English' : 'العربية الفصحى الواضحة والمختصرة'}.

«محتوى الموقع الرسمي»:
${SITE_KNOWLEDGE_BASE}`;

      const contents = history.map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(msg.text || '') }]
      }));

      contents.push({
        role: 'user',
        parts: [{ text: cleanMessage }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answeredFromSite: {
                type: Type.BOOLEAN,
                description:
                  'True ONLY if the user question is directly answered by the provided official website content. False if the answer is not in the website content or requires human follow-up.'
              },
              reply: {
                type: Type.STRING,
                description:
                  'The concise answer strictly based on the website content when answeredFromSite is true, or empty string when false.'
              }
            },
            required: ['answeredFromSite', 'reply']
          }
        }
      });

      const rawJson = (response.text || '').trim();
      if (rawJson) {
        try {
          const parsed = JSON.parse(rawJson) as { answeredFromSite?: boolean; reply?: string };
          if (parsed.answeredFromSite && parsed.reply && parsed.reply.trim()) {
            return res.json({
              reply: parsed.reply.trim(),
              needsCallback: false
            });
          }
          return res.json({
            reply: callbackPrompt,
            needsCallback: true,
            unansweredQuestion: cleanMessage
          });
        } catch {
          // Fall through to deterministic check
        }
      }

      const fallback = tryDeterministicSiteAnswer(cleanMessage);
      return res.json({
        reply: fallback.reply,
        needsCallback: !fallback.answeredFromSite,
        unansweredQuestion: fallback.answeredFromSite ? undefined : cleanMessage
      });
    } catch (error: any) {
      console.error('Chat API Error:', error?.message || error);
      const fallback = tryDeterministicSiteAnswer(cleanMessage);
      return res.json({
        reply: fallback.reply,
        needsCallback: !fallback.answeredFromSite,
        unansweredQuestion: fallback.answeredFromSite ? undefined : cleanMessage
      });
    }
  });

  // =========================================================================
  // CHATBOT UNANSWERED-QUESTION CALLBACK LEADS
  // Stores fullName, phone, and unanswered question locally in server store
  // =========================================================================
  app.post('/api/chat-callbacks', async (req, res) => {
    try {
      const {
        fullName,
        phone,
        question,
        idempotencyKey
      } = req.body || {};

      const cleanName = typeof fullName === 'string' ? fullName.trim() : '';
      const cleanPhone = typeof phone === 'string' ? phone.trim() : '';
      const cleanQuestion =
        typeof question === 'string' && question.trim()
          ? question.trim().slice(0, 500)
          : 'استفسار عبر الشات بوت';

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'يرجى كتابة الاسم الكامل.'
        });
      }

      if (cleanPhone.replace(/\D/g, '').length < 7) {
        return res.status(400).json({
          success: false,
          error: 'يرجى كتابة رقم هاتف صحيح للتواصل.'
        });
      }

      const effectiveKey =
        typeof idempotencyKey === 'string' && idempotencyKey.trim()
          ? idempotencyKey.trim()
          : `cb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const store = readStore();
      const callbacks = store.chatCallbacks || [];
      const existing = callbacks.find((c) => c.idempotencyKey === effectiveKey);
      if (existing) {
        return res.status(200).json({
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

      store.chatCallbacks = [newCallback, ...callbacks];
      writeStore(store);

      return res.status(201).json({
        success: true,
        duplicatePrevented: false,
        persistedOnServer: true,
        referenceCode: newCallback.referenceCode,
        submittedAt: newCallback.submittedAt
      });
    } catch (error: any) {
      console.error('Chatbot Callback Error:', error?.message || error);
      return res.status(500).json({
        success: false,
        error: 'حدث خطأ أثناء حفظ بيانات التواصل. يرجى المحاولة مرة أخرى.'
      });
    }
  });

  // =========================================================================
  // SUPPORT REQUEST SUBMISSION ENDPOINT
  // Privacy-First: Only non-sensitive administrative fields are stored.
  // =========================================================================
  app.post('/api/support-requests', async (req, res) => {
    try {
      const { primaryNeed, idempotencyKey } = req.body || {};

      if (!idempotencyKey || typeof idempotencyKey !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Missing idempotencyKey for duplicate-submission protection.'
        });
      }

      const store = readStore();

      // Prevent duplicate submissions from repeated button clicks
      const existing = store.records.find((r) => r.idempotencyKey === idempotencyKey);
      if (existing) {
        return res.status(200).json({
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
      const supportTypeCode = typeof primaryNeed === 'string' && primaryNeed.trim()
        ? primaryNeed.trim()
        : 'social_protection';
      const supportTypeLabel = getSupportTypeLabelAr(supportTypeCode);

      const newRecord: AdminSupportRecord = {
        trackingCode,
        submittedAt: nowStr,
        supportTypeCode,
        supportTypeLabel,
        status: DEFAULT_STATUS_AR,
        lastUpdated: nowStr,
        followUpNote: 'تم تسجيل الطلب إداريًا (حُجبت البيانات الشخصية والطبية تلقائيًا حمايةً للخصوصية — بانتظار المراجعة وفق الاستحقاق)',
        idempotencyKey
      };

      store.records.unshift(newRecord);
      writeStore(store);

      return res.status(201).json({
        success: true,
        duplicatePrevented: false,
        persistedOnServer: true,
        trackingCode: newRecord.trackingCode,
        submittedAt: newRecord.submittedAt,
        supportTypeLabel: newRecord.supportTypeLabel,
        status: newRecord.status
      });
    } catch (error: any) {
      console.error('Support Request Submission Error:', error?.message || error);
      return res.status(500).json({
        success: false,
        persistedOnServer: false,
        error: 'حدث خطأ تقني في الخادم أثناء حفظ الطلب. لم يتم فقدان أي بيانات، يرجى المحاولة مرة أخرى.'
      });
    }
  });

  // Vite middleware in dev or static files in prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
