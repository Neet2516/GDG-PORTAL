import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { RECAPTCHA_CONFIG } from '../constants';
import { setCaptchaBridge } from '../services/captchaBridge';
import { useRecaptcha } from '../hooks/useRecaptcha';

const initialState = {
  token: '',
  expiresAt: 0,
  isReady: false,
  isRefreshing: false,
  lastError: null,
  enabled: RECAPTCHA_CONFIG.ENABLED && Boolean(RECAPTCHA_CONFIG.SITE_KEY),
};

export const CaptchaContext = createContext(null);

export const CaptchaProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  const tokenRef = useRef('');
  const expiresAtRef = useRef(0);
  const refreshPromiseRef = useRef(null);
  const { executeRecaptcha } = useRecaptcha(RECAPTCHA_CONFIG.SITE_KEY);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const invalidateToken = useCallback(() => {
    tokenRef.current = '';
    expiresAtRef.current = 0;
    setState((current) => ({
      ...current,
      token: '',
      expiresAt: 0,
      isReady: false,
    }));
  }, []);

  const refreshCaptcha = useCallback(
    async (action = RECAPTCHA_CONFIG.DEFAULT_ACTION, options = {}) => {
      if (!RECAPTCHA_CONFIG.ENABLED || !RECAPTCHA_CONFIG.SITE_KEY) {
        setState((current) => ({
          ...current,
          enabled: false,
          isReady: false,
          isRefreshing: false,
          token: '',
          expiresAt: 0,
          lastError: null,
        }));
        return null;
      }

      if (refreshPromiseRef.current && !options.force) {
        return refreshPromiseRef.current;
      }

      const nextAction = action || RECAPTCHA_CONFIG.DEFAULT_ACTION;

      refreshPromiseRef.current = (async () => {
        setState((current) => ({
          ...current,
          enabled: true,
          isRefreshing: true,
          lastError: null,
        }));

        try {
          const token = await executeRecaptcha(nextAction);

          if (!token) {
            throw new Error('Unable to generate CAPTCHA token');
          }

          const expiresAt = Date.now() + RECAPTCHA_CONFIG.TOKEN_TTL_MS;
          tokenRef.current = token;
          expiresAtRef.current = expiresAt;

          setState((current) => ({
            ...current,
            token,
            expiresAt,
            isReady: true,
            isRefreshing: false,
            lastError: null,
          }));

          return token;
        } catch (error) {
          invalidateToken();
          setState((current) => ({
            ...current,
            isRefreshing: false,
            lastError: error?.message || 'CAPTCHA refresh failed',
          }));
          return null;
        } finally {
          refreshPromiseRef.current = null;
        }
      })();

      return refreshPromiseRef.current;
    },
    [executeRecaptcha, invalidateToken]
  );

  useEffect(() => {
    setCaptchaBridge({
      getToken: () => tokenRef.current,
      getState: () => stateRef.current,
      refreshToken: refreshCaptcha,
      invalidateToken,
    });

    return () => {
      setCaptchaBridge({
        getToken: () => '',
        getState: () => initialState,
        refreshToken: async () => null,
        invalidateToken: () => {},
      });
    };
  }, [invalidateToken, refreshCaptcha]);

  useEffect(() => {
    if (!state.enabled) {
      return undefined;
    }

    let cancelled = false;

    const warmStart = async () => {
      await refreshCaptcha(RECAPTCHA_CONFIG.DEFAULT_ACTION);
    };

    void warmStart();

    const intervalId = window.setInterval(() => {
      if (!cancelled) {
        void refreshCaptcha(RECAPTCHA_CONFIG.DEFAULT_ACTION, { silent: true });
      }
    }, RECAPTCHA_CONFIG.REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [refreshCaptcha, state.enabled]);

  const value = useMemo(
    () => ({
      ...state,
      refreshCaptcha,
      invalidateCaptchaToken: invalidateToken,
    }),
    [invalidateToken, refreshCaptcha, state]
  );

  return <CaptchaContext.Provider value={value}>{children}</CaptchaContext.Provider>;
};

export default CaptchaProvider;
