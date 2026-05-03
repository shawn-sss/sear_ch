const SEARCH_REQUEST_CACHE_TTL_MS = 15_000;
const AUTOCOMPLETE_REQUEST_CACHE_TTL_MS = 5_000;
const HEALTH_REQUEST_CACHE_TTL_MS = 60_000;
const REQUEST_CACHE_MAX_ENTRIES = 60;

const requestCache = new Map();

function getRequestCacheTtl(url, method = "GET", hasSignal = false) {
  if (hasSignal || method !== "GET") {
    return 0;
  }
  if (url.startsWith("/api/health")) {
    return HEALTH_REQUEST_CACHE_TTL_MS;
  }
  if (url.startsWith("/api/autocomplete")) {
    return AUTOCOMPLETE_REQUEST_CACHE_TTL_MS;
  }
  if (url.startsWith("/api/search")) {
    return SEARCH_REQUEST_CACHE_TTL_MS;
  }
  return 0;
}

export async function fetchJson(url, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const cacheTtl = getRequestCacheTtl(url, method, Boolean(options.signal));
  const cacheKey = cacheTtl ? `${method}:${url}` : "";
  const now = Date.now();

  if (cacheKey) {
    const cachedEntry = requestCache.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp <= cacheTtl) {
      return cachedEntry.promise;
    }
    requestCache.delete(cacheKey);
  }

  const requestPromise = (async () => {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.detail || "Request failed.");
    }

    return payload;
  })();

  if (cacheKey) {
    requestCache.set(cacheKey, {
      timestamp: now,
      promise: requestPromise,
    });
    while (requestCache.size > REQUEST_CACHE_MAX_ENTRIES) {
      const oldestKey = requestCache.keys().next().value;
      if (!oldestKey) {
        break;
      }
      requestCache.delete(oldestKey);
    }
  }

  try {
    return await requestPromise;
  } catch (error) {
    if (cacheKey) {
      requestCache.delete(cacheKey);
    }
    throw error;
  }
}
