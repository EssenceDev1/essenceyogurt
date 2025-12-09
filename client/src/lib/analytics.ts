// Essence Yogurt - Google Analytics Integration
// Tracks page views and custom events across the luxury platform

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('[Analytics] Missing VITE_GA_MEASUREMENT_ID');
    return;
  }

  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_title: 'Essence Yogurt',
      send_page_view: true
    });
  `;
  document.head.appendChild(script2);

  console.log('[Analytics] Google Analytics initialized');
};

export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title || document.title
  });
};

export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackLoyaltyEvent = (action: string, memberId?: string, details?: Record<string, any>) => {
  trackEvent(action, 'loyalty', memberId, details?.points);
};

export const trackPurchaseEvent = (transactionId: string, value: number, currency: string = 'USD') => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: []
  });
};

export const trackLocationEvent = (action: string, locationId: string, locationName?: string) => {
  trackEvent(action, 'location', locationName || locationId);
};
