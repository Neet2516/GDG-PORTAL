const stripTrailingSlashes = (value) => String(value || '').replace(/\/+$/, '');

const normalizeLeadingSlash = (value) => {
  const cleaned = String(value || '').trim();
  if (!cleaned) return '';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
};

export function getProxyConfig() {
  return {
    backendUrl: stripTrailingSlashes(process.env.BACKEND_URL),
    backendApiPrefix: normalizeLeadingSlash(process.env.BACKEND_API_PREFIX || '/api/v1'),
  };
}

export function buildTargetUrl({ backendUrl, backendApiPrefix, reqUrl, queryPath }) {
  const incoming = new URL(reqUrl || '/api', 'http://localhost');
  const baseUrl = new URL(stripTrailingSlashes(backendUrl) + '/');
  const prefix = normalizeLeadingSlash(backendApiPrefix || '/api/v1');
  const safePath = String(queryPath || '').replace(/^\/+|\/+$/g, '');
  const pathname = [prefix, safePath].filter(Boolean).join('/').replace(/\/+/g, '/');

  baseUrl.pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  baseUrl.search = incoming.search;

  return baseUrl.toString();
}

export function sanitizeRequestHeaders(headers = {}) {
  const blocked = new Set([
    'host',
    'content-length',
    'connection',
    'transfer-encoding',
    'accept-encoding',
  ]);

  const forwarded = {};
  for (const [key, value] of Object.entries(headers)) {
    if (blocked.has(key.toLowerCase())) continue;
    if (value === undefined || value === null) continue;
    forwarded[key] = value;
  }

  return forwarded;
}

export function normalizeRequestBody(body) {
  if (body === undefined || body === null) return undefined;
  if (typeof body === 'string') return body;
  if (Buffer.isBuffer?.(body)) return body;
  if (body instanceof Uint8Array) return body;
  if (typeof body === 'object') return JSON.stringify(body);
  return String(body);
}
