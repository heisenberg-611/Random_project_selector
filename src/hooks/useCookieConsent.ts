'use client';

import { useState, useEffect } from 'react';

const CONSENT_STORAGE_KEY = 'random_project_selector_cookie_consent_v1';

export type ConsentStatus = 'undecided' | 'accepted' | 'declined';

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentStatus>('undecided');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved === 'accepted' || saved === 'declined') {
        setConsent(saved);
      } else {
        setConsent('undecided');
      }
    } catch (e) {
      console.warn('Cookie consent check failed:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const acceptConsent = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    } catch (e) {
      console.warn('Failed to save consent:', e);
    }
    setConsent('accepted');
  };

  const declineConsent = () => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'declined');
    } catch (e) {
      console.warn('Failed to save consent:', e);
    }
    setConsent('declined');
  };

  const resetConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to reset consent:', e);
    }
    setConsent('undecided');
  };

  return {
    consent,
    isInitialized,
    isAccepted: consent === 'accepted',
    isBannerVisible: isInitialized && consent === 'undecided',
    acceptConsent,
    declineConsent,
    resetConsent,
  };
}
