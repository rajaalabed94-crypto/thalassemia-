/**
 * Privacy-Conscious Campaign Analytics Utility
 * Compatible with Google Analytics 4 (GA4) / Tag Manager.
 * Does NOT collect or transmit sensitive medical data or PII.
 */

export type AnalyticsEvent = 
  | 'page_view'
  | 'hero_cta_click'
  | 'support_pathway_start'
  | 'support_pathway_step'
  | 'support_pathway_complete'
  | 'audio_speech_play'
  | 'audio_speech_stop'
  | 'audio_sequence_listen'
  | 'myth_fact_answered'
  | 'myth_fact_completed'
  | 'directorate_call_click'
  | 'hotline_189_click'
  | 'language_switch'
  | 'accessibility_tool_toggle'
  | 'game_launch';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, eventParams?: EventParams) => void;
    dataLayer?: unknown[];
  }
}

class CampaignAnalytics {
  private isDevelopment = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('ai.studio') ||
    window.location.hostname.includes('run.app')
  );

  /**
   * Log an anonymous, privacy-safe campaign interaction event
   */
  public logEvent(eventName: AnalyticsEvent, params: EventParams = {}): void {
    const timestamp = new Date().toISOString();
    const eventPayload = {
      ...params,
      timestamp,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
      language: typeof document !== 'undefined' ? document.documentElement.lang || 'ar' : 'ar'
    };

    // Forward to GA4 if initialized on the host
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, eventPayload);
      } catch (err) {
        // Silent catch to prevent UI interruption
      }
    }

    // In dev / AI Studio preview, log clean scannable feedback in console
    if (this.isDevelopment) {
      console.log(`[Analytics Event: ${eventName}]`, eventPayload);
    }
  }
}

export const analytics = new CampaignAnalytics();
