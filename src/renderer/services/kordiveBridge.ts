/**
 * Security-Hardened Bridge & Fetcher (OWASP Desktop A01, A03, A05 Compliant)
 * - Enforces x-kordive-token authentication on all local loopback stream requests
 * - Validates external URLs against strict allowlist before ingestion
 * - Blocks SSRF attempts to non-loopback private network ranges
 */

const ALLOWED_INGESTION_HOSTS = new Set([
  'open.spotify.com',
  'spotify.link',
  'www.youtube.com',
  'youtube.com',
  'music.youtube.com',
  'youtu.be',
  'soundcloud.com',
  'www.soundcloud.com',
  'on.soundcloud.com',
]);

let cachedSessionToken: string | null = null;

/**
 * Retrieves the ephemeral session token provided by Electron Main process via contextBridge.
 */
export async function getKordiveSessionToken(): Promise<string> {
  if (cachedSessionToken) return cachedSessionToken;
  if (typeof window !== 'undefined' && window.kordiveAPI?.getServerToken) {
    cachedSessionToken = await window.kordiveAPI.getServerToken();
    return cachedSessionToken;
  }
  // Fallback ephemeral token for standalone Vite dev preview
  cachedSessionToken = 'kordive-dev-loopback-token-2026';
  return cachedSessionToken;
}

/**
 * Validates whether a user-pasted string is a safe, supported music platform URL.
 * Protects against javascript:, file:, data:, or internal LAN SSRF URLs.
 */
export function validateIngestionUrl(input: string): {
  isValidUrl: boolean;
  platform: 'spotify' | 'youtube' | 'soundcloud' | null;
  sanitizedUrl: string | null;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { isValidUrl: false, platform: null, sanitizedUrl: null };
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        isValidUrl: false,
        platform: null,
        sanitizedUrl: null,
        error: 'Protokol URL tidak diizinkan.',
      };
    }

    const host = parsed.hostname.toLowerCase();
    if (!ALLOWED_INGESTION_HOSTS.has(host)) {
      return {
        isValidUrl: false,
        platform: null,
        sanitizedUrl: null,
        error: `Domain ${host} tidak termasuk dalam whitelist ingestion (Spotify, YouTube, SoundCloud).`,
      };
    }

    let platform: 'spotify' | 'youtube' | 'soundcloud' = 'youtube';
    if (host.includes('spotify')) platform = 'spotify';
    else if (host.includes('soundcloud')) platform = 'soundcloud';

    return {
      isValidUrl: true,
      platform,
      sanitizedUrl: parsed.toString(),
    };
  } catch {
    return { isValidUrl: false, platform: null, sanitizedUrl: null };
  }
}

/**
 * Wrapped fetch exclusively for communicating with Hermes Local Stream Server (127.0.0.1).
 * Automatically attaches `x-kordive-token` header.
 */
export async function kordiveLocalFetch(
  endpointPath: string,
  options: RequestInit = {},
  port = 45120
): Promise<Response> {
  if (!endpointPath.startsWith('/')) {
    throw new Error('Endpoint path harus diawali dengan "/"');
  }

  const token = await getKordiveSessionToken();
  const url = `http://127.0.0.1:${port}${endpointPath}`;

  const headers = new Headers(options.headers);
  headers.set('x-kordive-token', token);
  headers.set('X-Requested-With', 'KordiveRenderer');

  return fetch(url, {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'omit',
  });
}
