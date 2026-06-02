import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { signIn } from '@/api/admin';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, accessToken } = await signIn(email.trim(), password);
      setAuth({ user, accessToken });
      navigate('/', { replace: true });
    } catch (err) {
      const status = err instanceof AxiosError ? err.response?.status : undefined;
      setError(
        status === 401 || status === 403
          ? 'Invalid credentials or insufficient access.'
          : 'Sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-greenInk text-base font-bold text-white">
            A
          </div>
          <span className="text-lg font-bold text-brand-navy">Artemis Staff</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
        >
          <div>
            <h1 className="text-base font-semibold text-brand-navy">Admin sign in</h1>
            <p className="mt-0.5 text-xs text-ink-muted">
              Staff access only. Your account must be an authorized admin.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-greenInk focus:ring-1 focus:ring-brand-greenInk"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-greenInk focus:ring-1 focus:ring-brand-greenInk"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-greenInk px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-greenInk/90 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
