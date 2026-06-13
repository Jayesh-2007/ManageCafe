import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { setAuthToken } from '../utils/api';

const tokenStoreKey = 'managecafe.jwt';

function readStoredJwt() {
  try {
    return window.sessionStorage.getItem(tokenStoreKey);
  } catch {
    return null;
  }
}

function storeJwt(token) {
  try {
    window.sessionStorage.setItem(tokenStoreKey, token);
  } catch {
    // In-memory auth still works when browser storage is unavailable.
  }
}

function removeStoredJwt() {
  try {
    window.sessionStorage.removeItem(tokenStoreKey);
  } catch {
    // In-memory auth still works when browser storage is unavailable.
  }
}

let inMemoryJwt = readStoredJwt();
setAuthToken(inMemoryJwt);

const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='));

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

function createAuthState(token) {
  const payload = decodeJwtPayload(token);
  const role = typeof payload?.role === 'string' ? payload.role.toLowerCase() : null;

  return {
    token,
    payload,
    role,
    isAuthenticated: Boolean(token),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => createAuthState(inMemoryJwt));

  const setJwt = useCallback((token) => {
    inMemoryJwt = token || null;
    if (inMemoryJwt) {
      storeJwt(inMemoryJwt);
    } else {
      removeStoredJwt();
    }
    setAuthToken(inMemoryJwt);
    setAuthState(createAuthState(inMemoryJwt));
  }, []);

  const clearJwt = useCallback(() => {
    inMemoryJwt = null;
    removeStoredJwt();
    setAuthToken(null);
    setAuthState(createAuthState(null));
  }, []);

  const hasRole = useCallback(
    (allowedRoles = []) => {
      if (!authState.isAuthenticated) {
        return false;
      }

      if (allowedRoles.length === 0) {
        return true;
      }

      return allowedRoles.map((role) => role.toLowerCase()).includes(authState.role);
    },
    [authState.isAuthenticated, authState.role],
  );

  const value = useMemo(
    () => ({
      ...authState,
      setJwt,
      clearJwt,
      hasRole,
    }),
    [authState, clearJwt, hasRole, setJwt],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}

export function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasRole(allowedRoles)) {
    return null;
  }

  return children ?? <Outlet />;
}
