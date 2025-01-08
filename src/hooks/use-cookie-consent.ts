// Check if a consent is given for a specific service

import {useState, useEffect} from 'react';
import type {CookieConsent} from '@/config/cookieConsent.config';
import {hasCookieConsent, onCookieConsentChange} from '@/utils/cookieConsent';

export function useCookieConsent(category: keyof CookieConsent, service?: string): boolean {
  const [consent, setConsent] = useState<boolean>(false);

  useEffect(() => {
    const initializeConsent = async () => {
      const initialConsent = await hasCookieConsent(category, service);
      // console.log(`Initial consent for category ${category} and service ${service}:`, initialConsent);
      setConsent(initialConsent);
    };
    initializeConsent();
  }, [category, service]);

  useEffect(() => {
    // console.log('Setting up cookie consent change listener');
    const unsubscribe = onCookieConsentChange(async (event) => {
      // console.log('Cookie consent change event received:', event);
      // console.log('Event services', event.services);
      const eventServices = event.services;

      // Check if the category matches and handle both service and non-service cases
      if (event.category === category) {
        let updatedConsent;
        if (!service) {
          updatedConsent = await hasCookieConsent(category);
          // console.log(`Updated consent for category ${category}:`, updatedConsent);
        } else if (eventServices && Object.hasOwn(eventServices, service)) {
          // console.log('Event service matches:', service);
          // console.log('Event value:', eventServices[service]);
          updatedConsent = await hasCookieConsent(category, service);
          // console.log(`Updated consent for category ${category} and service ${service}:`, updatedConsent);
        }
        setConsent(updatedConsent ?? false);
      }
    });

    return () => {
      // console.log('Cleaning up cookie consent change listener');
      unsubscribe();
    };
  }, [category, service]);

  return consent;
}
