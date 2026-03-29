import { RECAPTCHA_CONFIG } from '../constants';

const EMPTY_STATE = {
  token: '',
  expiresAt: 0,
  isReady: false,
  isRefreshing: false,
  lastError: null,
  enabled: RECAPTCHA_CONFIG.ENABLED && Boolean(RECAPTCHA_CONFIG.SITE_KEY),
};

let bridge = {
  getToken: () => '',
  getState: () => EMPTY_STATE,
  refreshToken: async () => null,
  invalidateToken: () => {},
};

export const CAPTCHA_BODY_FIELD = 'captchaToken';
export const CAPTCHA_HEADER_NAME = 'x-captcha-token';

export const setCaptchaBridge = (nextBridge = {}) => {
  bridge = {
    ...bridge,
    ...nextBridge,
  };
};

export const getCaptchaState = () => bridge.getState?.() || EMPTY_STATE;

export const getCaptchaToken = () => {
  const state = getCaptchaState();

  if (!state.token || (state.expiresAt && Date.now() >= state.expiresAt)) {
    return '';
  }

  return bridge.getToken?.() || '';
};

export const refreshCaptchaToken = async (action = RECAPTCHA_CONFIG.DEFAULT_ACTION, options = {}) => {
  if (typeof bridge.refreshToken !== 'function') {
    return null;
  }

  return bridge.refreshToken(action, options);
};

export const invalidateCaptchaToken = () => {
  bridge.invalidateToken?.();
};

export const hasCaptchaSupport = () => EMPTY_STATE.enabled;

export const shouldRetryCaptchaRequest = (data) => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const message = String(data.message || '').toLowerCase();
  return (
    data.requireNewCaptcha === true ||
    data.captchaExpired === true ||
    message.includes('captcha') ||
    message.includes('recaptcha')
  );
};
