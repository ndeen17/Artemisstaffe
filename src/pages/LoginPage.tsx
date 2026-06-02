import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { SpinnerIcon } from '@/components/icons';
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
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center">
          <img src="/assets/logo.png" alt="Artemis" className="h-9 w-auto object-contain" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-card"
        >
          <div>
            <h1 className="text-[18px] font-extrabold tracking-tight text-[#111827]">Admin sign in</h1>
            <p className="mt-0.5 text-[12px] text-gray-500">
              Staff access only. Your account must be an authorized admin.
            </p>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-[12px] font-semibold text-[#111827]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-shadow focus:border-brand-green focus:ring-2 focus:ring-[#dcfce7]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-[12px] font-semibold text-[#111827]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition-shadow focus:border-brand-green focus:ring-2 focus:ring-[#dcfce7]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-4 py-3 text-[15px] font-semibold text-[#111827] ring-[2px] ring-[#dcfce7] shadow-sm transition-all hover:shadow-md hover:brightness-105 active:brightness-95 disabled:opacity-60"
          >
            {loading && <SpinnerIcon className="h-4 w-4" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
