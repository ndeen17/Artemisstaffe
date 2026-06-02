import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Activity,
  Workflow,
  ShieldCheck,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/api/admin';
import { cn } from '@/lib/cn';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/acquisition', label: 'Acquisition', icon: TrendingUp, end: false },
  { to: '/engagement', label: 'Engagement', icon: Activity, end: false },
  { to: '/product', label: 'Product', icon: Workflow, end: false },
  { to: '/quality', label: 'Quality', icon: ShieldCheck, end: false },
  { to: '/users', label: 'Users', icon: Users, end: false },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-brand-border bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-brand-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-greenInk text-sm font-bold text-white">
            A
          </div>
          <span className="text-sm font-bold text-brand-navy">Artemis Staff</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-greenSoft text-brand-greenInk'
                    : 'text-ink-muted hover:bg-surface-muted hover:text-ink',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-brand-border p-3">
          <div className="mb-2 px-2">
            <p className="truncate text-xs font-semibold text-ink">{user?.displayName ?? 'Admin'}</p>
            <p className="truncate text-xs text-ink-subtle">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-surface-muted">
        <div className="mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
