import { getAccessToken } from './tokenStorage';

// The only place that knows the base URL, attaches the auth token, and reads the
// backend's `{ error: CODE }` shape. Feature api.ts files call this — never fetch directly.
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Thrown when the backend responds with a non-2xx and an `{ error: CODE }` body.
// `code` is the raw backend code; the UI maps it to a friendly message.
export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

// Thrown when the request never reached the server (offline, DNS, timeout).
// Mobile connectivity drops far more often than a browser tab, so it gets its own type.
export class NetworkError extends Error {
  constructor() {
    super('NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }
  if (body instanceof FormData) {
    return body;
  }
  return JSON.stringify(body);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is not set');
  }

  const token = await getAccessToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const isFormData = options.body instanceof FormData;
  if (options.body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body: serializeBody(options.body),
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    let code = 'INTERNAL_ERROR';
    try {
      const data = await response.json();
      if (typeof data?.error === 'string') {
        code = data.error;
      }
    } catch {
      // Non-JSON error body — keep the generic code.
    }
    throw new ApiError(code, response.status);
  }

  // 204 No Content has an empty body; anything else is JSON.
  const result = response.status === 204 ? undefined : await response.json();
  return result;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
