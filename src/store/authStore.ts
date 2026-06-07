import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  lastLoginAt?: string | null;
}

interface AuthState {
  user: AdminUser | null;
  /** Access token lives only in memory — never persisted. Refresh token is in an httpOnly cookie. */
  accessToken: string | null;
  isAuthenticated: boolean;
  sessionExpired: boolean;
  setAuth: (data: { user: AdminUser; accessToken: string }) => void;
  setUser: (user: AdminUser) => void;
  clearAuth: () => void;
  expireSession: () => void;
  acknowledgeExpired: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      sessionExpired: false,

      setAuth({ user, accessToken }) {
        set({ user, accessToken, isAuthenticated: true, sessionExpired: false });
      },
      setUser(user) {
        set((s) => ({ ...s, user }));
      },
      clearAuth() {
        set({ user: null, accessToken: null, isAuthenticated: false, sessionExpired: false });
      },
      expireSession() {
        set({ user: null, accessToken: null, isAuthenticated: false, sessionExpired: true });
      },
      acknowledgeExpired() {
        set({ sessionExpired: false });
      },
    }),
    {
      name: 'artemis.staff.auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
