import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';

import { apiRequest, ApiError, type ApiRequestOptions } from '@/services/api';

const REFRESH_TOKEN_KEY = 'goshop.refresh-token';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
};

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  initializationError: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authenticatedRequest: <T>(path: string, options?: ApiRequestOptions) => Promise<T>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getResponseSession(response: AuthResponse) {
  if (
    !response ||
    typeof response.access_token !== 'string' ||
    !response.access_token ||
    typeof response.refresh_token !== 'string' ||
    !response.refresh_token ||
    !response.user ||
    typeof response.user.id !== 'string' ||
    typeof response.user.name !== 'string' ||
    typeof response.user.email !== 'string'
  ) {
    throw new ApiError('The server returned an invalid authentication response.', 502, 'invalid_response');
  }

  return response;
}

async function saveRefreshToken(token: string) {
  if (Platform.OS !== 'web') {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  }
}

async function clearRefreshToken() {
  if (Platform.OS !== 'web') {
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

async function readRefreshToken() {
  if (Platform.OS === 'web') return null;
  const SecureStore = await import('expo-secure-store');
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const refreshToken = useRef<string | null>(null);
  const persistRefreshToken = useRef(false);
  const refreshInFlight = useRef<Promise<string> | null>(null);

  const applySession = useCallback((response: AuthResponse) => {
    const session = getResponseSession(response);
    refreshToken.current = session.refresh_token;
    setAccessToken(session.access_token);
    setUser(session.user);
    return session;
  }, []);

  const refreshSession = useCallback((): Promise<string> => {
    if (refreshInFlight.current) {
      return refreshInFlight.current;
    }

    const currentRefreshToken = refreshToken.current;
    if (!currentRefreshToken) {
      return Promise.reject(new ApiError('Please sign in to continue.', 401, 'unauthenticated'));
    }

    const refresh = (async () => {
      try {
        const response = await apiRequest<AuthResponse>('/auth/refresh', {
          method: 'POST',
          body: { refresh_token: currentRefreshToken },
        });
        const session = getResponseSession(response);
        refreshToken.current = session.refresh_token;
        if (persistRefreshToken.current) {
          await saveRefreshToken(session.refresh_token);
        }
        applySession(session);
        return session.access_token;
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          refreshToken.current = null;
          persistRefreshToken.current = false;
          await clearRefreshToken();
          setAccessToken(null);
          setUser(null);
        }
        throw error;
      } finally {
        refreshInFlight.current = null;
      }
    })();

    refreshInFlight.current = refresh;
    return refresh;
  }, [applySession]);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        refreshToken.current = await readRefreshToken();
        if (refreshToken.current) {
          persistRefreshToken.current = true;
          await refreshSession();
        }
      } catch (error) {
        if (active) {
          setInitializationError(messageFromError(error));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const session = getResponseSession(response);
    persistRefreshToken.current = rememberMe;
    if (rememberMe) {
      await saveRefreshToken(session.refresh_token);
    } else {
      await clearRefreshToken();
    }
    applySession(session);
    setInitializationError(null);
  }, [applySession]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    const session = getResponseSession(response);
    persistRefreshToken.current = true;
    await saveRefreshToken(session.refresh_token);
    applySession(session);
    setInitializationError(null);
  }, [applySession]);

  const logout = useCallback(async () => {
    const currentAccessToken = accessToken;
    let logoutError: unknown;

    if (currentAccessToken) {
      try {
        await apiRequest<unknown>('/auth/logout', {
          method: 'POST',
          accessToken: currentAccessToken,
          body: refreshToken.current ? { refresh_token: refreshToken.current } : {},
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          try {
            const newAccessToken = await refreshSession();
            await apiRequest<unknown>('/auth/logout', {
              method: 'POST',
              accessToken: newAccessToken,
              body: refreshToken.current ? { refresh_token: refreshToken.current } : {},
            });
          } catch (refreshError) {
            logoutError = refreshError;
          }
        } else {
          logoutError = error;
        }
      }
    }

    try {
      await clearRefreshToken();
    } catch (error) {
      logoutError ??= error;
    }
    refreshToken.current = null;
    persistRefreshToken.current = false;
    setAccessToken(null);
    setUser(null);

    if (logoutError) {
      throw logoutError;
    }
  }, [accessToken, refreshSession]);

  const authenticatedRequest = useCallback(async <T,>(
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    if (!accessToken) {
      throw new ApiError('Please sign in to continue.', 401, 'unauthenticated');
    }

    try {
      return await apiRequest<T>(path, { ...options, accessToken });
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
      const newAccessToken = await refreshSession();
      return apiRequest<T>(path, { ...options, accessToken: newAccessToken });
    }
  }, [accessToken, refreshSession]);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isLoading,
      initializationError,
      login,
      register,
      logout,
      authenticatedRequest,
    }),
    [
      accessToken,
      user,
      isLoading,
      initializationError,
      login,
      register,
      logout,
      authenticatedRequest,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
