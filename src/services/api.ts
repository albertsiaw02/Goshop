export type ApiRequestOptions = {
  accessToken?: string;
  body?: unknown;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  signal?: AbortSignal;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (!configuredUrl) {
    throw new ApiError('Set EXPO_PUBLIC_API_URL to connect to GoShop.', 0, 'missing_api_url');
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new ApiError('EXPO_PUBLIC_API_URL must be a valid absolute URL.', 0, 'invalid_api_url');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new ApiError('EXPO_PUBLIC_API_URL must use HTTP or HTTPS.', 0, 'invalid_api_url');
  }

  return configuredUrl.replace(/\/+$/, '');
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers({ Accept: 'application/json' });
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener('abort', abortFromCaller);
  if (options.signal?.aborted) {
    controller.abort();
  }

  let response: Response;
  let responseText: string;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });
    responseText = await response.text();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (options.signal?.aborted) {
      throw new ApiError('The request was cancelled.', 0, 'request_cancelled');
    }
    if (controller.signal.aborted) {
      throw new ApiError('The request timed out. Please try again.', 0, 'request_timeout');
    }
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0, 'network_error');
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      throw new ApiError('The server returned an invalid response.', response.status, 'invalid_response');
    }
  }

  if (!response.ok) {
    const error = payload && typeof payload === 'object' && 'error' in payload
      ? payload.error
      : undefined;
    const message = error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
      ? error.message
      : 'The request could not be completed.';
    const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
      ? error.code
      : undefined;
    throw new ApiError(message, response.status, code);
  }

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new ApiError('The server returned an invalid response.', response.status, 'invalid_response');
  }

  return payload.data as T;
}
