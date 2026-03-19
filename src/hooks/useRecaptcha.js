/**
 * Custom Hook for Google reCAPTCHA v3
 * Manages reCAPTCHA token generation for form submission
 */

import { useCallback, useRef } from 'react';

export const useRecaptcha = (siteKey) => {
  const scriptLoadedRef = useRef(false);
  const recaptchaRef = useRef(null);

  /**
   * Load reCAPTCHA script dynamically
   */
  const loadRecaptchaScript = useCallback(() => {
    return new Promise((resolve) => {
      if (scriptLoadedRef.current && window.grecaptcha) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        scriptLoadedRef.current = true;
        recaptchaRef.current = window.grecaptcha;
        resolve();
      };

      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        resolve(); // Continue even if reCAPTCHA fails
      };

      document.head.appendChild(script);
    });
  }, []);

  /**
   * Execute reCAPTCHA and get token
   * @param {string} action - The action name (e.g., 'register', 'submit')
   * @returns {Promise<string>} reCAPTCHA token
   */
  const executeRecaptcha = useCallback(
    async (action = 'submit') => {
      try {
        // Load script if not already loaded
        await loadRecaptchaScript();

        if (!recaptchaRef.current || !siteKey) {
          console.warn('reCAPTCHA not available');
          return null;
        }

        const token = await recaptchaRef.current.execute(siteKey, {
          action,
        });

        return token;
      } catch (error) {
        console.error('Error executing reCAPTCHA:', error);
        return null;
      }
    },
    [siteKey, loadRecaptchaScript]
  );

  /**
   * Reset reCAPTCHA
   */
  const resetRecaptcha = useCallback(() => {
    if (recaptchaRef.current && siteKey) {
      recaptchaRef.current.reset();
    }
  }, [siteKey]);

  return {
    executeRecaptcha,
    resetRecaptcha,
    isReady: scriptLoadedRef.current,
  };
};

export default useRecaptcha;
