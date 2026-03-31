import { Readable } from 'node:stream';
import {
  buildTargetUrl,
  getProxyConfig,
  normalizeRequestBody,
  sanitizeRequestHeaders,
} from '../proxy-core.js';

function getForwardPath(reqUrl) {
  const url = new URL(reqUrl || '/api', 'http://localhost');
  return url.pathname.replace(/^\/api\/?/, '').replace(/^\/+/, '');
}

function copyUpstreamHeaders(res, upstreamHeaders) {
  for (const [key, value] of upstreamHeaders.entries()) {
    if (key.toLowerCase() === 'transfer-encoding') continue;
    res.setHeader(key, value);
  }
}

export default async function handler(req, res) {
  const { backendUrl, backendApiPrefix } = getProxyConfig();

  if (!backendUrl) {
    return res.status(500).json({
      success: false,
      message: 'Proxy is not configured. Set BACKEND_URL in the server environment.',
    });
  }

  try {
    const targetUrl = buildTargetUrl({
      backendUrl,
      backendApiPrefix,
      reqUrl: req.url || '/api',
      queryPath: getForwardPath(req.url),
    });

    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers: sanitizeRequestHeaders(req.headers),
      body: normalizeRequestBody(req.body),
    });

    res.statusCode = upstream.status;
    copyUpstreamHeaders(res, upstream.headers);

    if (!upstream.body) {
      return res.end();
    }

    return Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error('[proxy] Upstream fetch failed:', error?.message || error);

    return res.status(502).json({
      success: false,
      message: 'Upstream service unavailable. Please try again.',
    });
  }
}
