/**
 * Custom Hook for Google reCAPTCHA v3
 * Manages reCAPTCHA token generation for form submission
 */

import { useCallback, useRef } from 'react';

export const useRecaptcha = (siteKey) => {
  const scriptLoadedRef = useRef(false);
  const scriptPromiseRef = useRef(null);

  /**
   * Load reCAPTCHA script dynamically
   */
  const loadRecaptchaScript = useCallback(() => {
    if (!siteKey) {
      return Promise.resolve(null);
    }

    if (scriptLoadedRef.current && window.grecaptcha) {
      return Promise.resolve(window.grecaptcha);
    }

    if (scriptPromiseRef.current) {
      return scriptPromiseRef.current;
    }

    scriptPromiseRef.current = new Promise((resolve) => {
      const existingScript = document.querySelector(`script[data-recaptcha-key="${siteKey}"]`);

      const onReady = () => {
        if (!window.grecaptcha?.ready) {
          console.error('reCAPTCHA API not available after script load');
          resolve(null);
          return;
        }

        window.grecaptcha.ready(() => {
          scriptLoadedRef.current = true;
          resolve(window.grecaptcha);
        });
      };

      if (existingScript) {
        onReady();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.dataset.recaptchaKey = siteKey;
      script.onload = onReady;
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        resolve(null);
      };

      document.head.appendChild(script);
    });

    return scriptPromiseRef.current;
  }, [siteKey]);

  /**
   * Execute reCAPTCHA and get token
   * @param {string} action - The action name (e.g., 'register', 'submit')
   * @returns {Promise<string>} reCAPTCHA token
   */
  const executeRecaptcha = useCallback(
    async (action = 'submit') => {
      try {
        const grecaptcha = await loadRecaptchaScript();

        if (!grecaptcha || !siteKey) {
          console.warn('reCAPTCHA not available');
          return null;
        }

        const token = await grecaptcha.execute(siteKey, {
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
    scriptLoadedRef.current = false;
    scriptPromiseRef.current = null;
  }, [siteKey]);

  return {
    executeRecaptcha,
    resetRecaptcha,
    isReady: scriptLoadedRef.current,
  };
};

export default useRecaptcha;
