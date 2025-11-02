export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function createApiClient(baseUrl: string) {
  return async function apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Inject auth token if present
      let authHeaders: Record<string, string> = {};
      try {
        // Prefer the standard 'token' key; fall back to legacy 'auth_token'
        let token: string | null = null;
        if (typeof localStorage !== 'undefined') {
          token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        }
        if (token) authHeaders['Authorization'] = `Bearer ${token}`;
      } catch {}
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(options.headers || {}),
        },
      });

      const data = await response
        .json()
        .catch(() => null as any);

      if (!response.ok) {
        return {
          success: false,
          error:
            (data && (data.message || data.error)) ||
            response.statusText ||
            'Request failed',
        };
      }

      return {
        success: true,
        data: (data && (data.data ?? data)) as T,
        message: data?.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Network error occurred',
      };
    }
  };
}
