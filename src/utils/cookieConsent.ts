// Display cookie consent banner and manage cookie consent
'use client';

import {getCookie, setCookie, deleteCookie} from 'cookies-next';
import {EventEmitter} from 'events';
import {Categories, categories, CookieConsent, defaultConsent} from '@/config/cookieConsent.config';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const cookieConsentEmitter = new EventEmitter();

/**
 * Validate if at least one service is enabled
 */
export function validateServiceConsent(services: Record<string, boolean>): boolean {
  return Object.values(services).some((value) => value === true);
}

// Helper to validate cookie consent structure
function isValidCookieConsent(consent: unknown): consent is CookieConsent {
  if (!consent || typeof consent !== 'object') {
    // console.log('Validation failed: consent is not an object');
    return false;
  }

  // Check for unknown categories in consent
  const unknownCategories = Object.keys(consent).filter((cat) => !categories.includes(cat as Categories));
  if (unknownCategories.length > 0) {
    return false;
  }

  // Validate each category and its services
  const isValid = categories.every((category) => {
    const consentCategory = (consent as CookieConsent)[category];
    const defaultCategory = defaultConsent[category];

    if (!consentCategory) {
      return false;
    }

    if (typeof consentCategory.enabled !== 'boolean') {
      return false;
    }

    const consentServices = consentCategory.services || {};
    const defaultServices = defaultCategory.services || {};

    // Check for unknown services in consent
    const unknownServices = Object.keys(consentServices).filter((service) => !(service in defaultServices));
    if (unknownServices.length > 0) {
      return false;
    }

    // Validate each service
    const servicesValid = Object.keys(defaultServices).every((service) => {
      if (!(service in consentServices)) {
        return false;
      }
      if (typeof consentServices[service] !== 'boolean') {
        return false;
      }
      return true;
    });

    if (!servicesValid) {
      return false;
    }

    return true;
  });

  // console.log('Validation result:', isValid);
  return isValid;
}

export function deleteCookieConsent(): void {
  // console.log('Deleting cookie consent');
  deleteCookie(COOKIE_CONSENT_KEY);
}

export async function getCookieConsent(): Promise<CookieConsent> {
  try {
    const cookieValue = await getCookie(COOKIE_CONSENT_KEY);
    if (!cookieValue) {
      // Set default cookie if none exists
      setCookie(COOKIE_CONSENT_KEY, JSON.stringify(defaultConsent), {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        path: '/',
      });
      return defaultConsent;
    }

    const parsedConsent = JSON.parse(cookieValue);

    // Return default consent if validation fails
    if (!isValidCookieConsent(parsedConsent)) {
      console.warn('Invalid cookie consent structure found, using default');
      return defaultConsent;
    }

    return parsedConsent;
  } catch (error) {
    console.warn('Error parsing cookie consent, using default:', error);
    // Also overwrite cookie on parse error
    setCookie(COOKIE_CONSENT_KEY, JSON.stringify(defaultConsent), {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      path: '/',
    });
    return defaultConsent;
  }
}

export function setCookieConsent(consent: CookieConsent, category: keyof CookieConsent, service?: string, value?: boolean): void {
  // create a copy of the consent object paased into as a parameter
  const updatedConsent = {...consent};
  // console.log('updatededConsent', updatedConsent, 'category', category, 'service', service, 'value', value);

  // get details of the category
  if (category === 'necessary') return;
  const categoryConsent = updatedConsent[category as Categories];

  // look up services connected to category
  const services = defaultConsent[category as Categories]?.services;

  // Update entire category
  if (service === undefined && value === undefined && categoryConsent) {
    {
      // If category disabled, disable all services
      if (!categoryConsent.enabled && categoryConsent.services && Object.keys(categoryConsent.services).length !== 0) {
        Object.keys(categoryConsent.services).forEach((key) => {
          if (categoryConsent.services) {
            categoryConsent.services[key] = false;
          }
        });
      }
      // If category enabled, enable all services
      else {
        if (categoryConsent.services && Object.keys(categoryConsent.services).length !== 0) {
          Object.keys(categoryConsent.services).forEach((key) => {
            if (categoryConsent.services) {
              categoryConsent.services[key] = true;
            }
          });
        }
      }
    }
  }

  // if all services are disabled, disable category
  if (categoryConsent && categoryConsent.services && Object.keys(categoryConsent.services).length !== 0) {
    categoryConsent.enabled = validateServiceConsent(categoryConsent.services);
  }

  // Set cookie with 1 year expiration
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  setCookie(COOKIE_CONSENT_KEY, JSON.stringify(updatedConsent), {
    expires: oneYearFromNow,
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    path: '/', // Assuming you want the cookie available across the site
  });

  // Emit with structured event object
  cookieConsentEmitter.emit('cookieConsentChange', {
    category,
    services,
    value,
  });
}

export async function hasCookieConsent(category: keyof CookieConsent, service?: string): Promise<boolean> {
  const consent = await getCookieConsent();
  if (category === 'necessary') return true;

  const categoryConsent = consent[category as Categories];

  if (!categoryConsent) return false;

  if (service) {
    return categoryConsent.services?.[service] ?? false;
  }

  return categoryConsent.enabled;
}

export type CookieConsentEvent = {
  category: keyof CookieConsent;
  services: Record<string, boolean> | undefined;
  value: boolean;
};

export function onCookieConsentChange(callback: (event: CookieConsentEvent) => void): () => void {
  if (!callback) {
    throw new Error('Callback is required for onCookieConsentChange');
  }

  cookieConsentEmitter.on('cookieConsentChange', callback);

  // Return cleanup function
  return () => {
    cookieConsentEmitter.off('cookieConsentChange', callback);
  };
}
