import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import type { ComponentType, SVGProps } from 'react';
import {
  OverviewIcon,
  AcquisitionIcon,
  EngagementIcon,
  ProductIcon,
  QualityIcon,
  UsersIcon,
  LogoutIcon,
} from '@/components/icons';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/api/admin';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Overview', icon: OverviewIcon, end: true },
  { to: '/acquisition', label: 'Acquisition', icon: AcquisitionIcon },
  { to: '/engagement', label: 'Engagement', icon: EngagementIcon },
  { to: '/product', label: 'Product', icon: ProductIcon },
  { to: '/quality', label: 'Quality', icon: QualityIcon },
  { to: '/users', label: 'Users', icon: UsersIcon },
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
    <div className="h-screen overflow-hidden bg-[#fafafa] flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-100 bg-white">
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <Link to="/" className="inline-flex items-center" aria-label="Artemis admin">
            <img src="/assets/logo.png" alt="Artemis" className="h-8 w-auto object-contain" />
          </Link>
          <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#15803d]">
            Staff
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium transition-colors',
                  isActive
                    ? 'bg-[#dcfce7] text-[#15803d]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#111827]',
                )
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-100 px-3 py-4">
          <div className="mb-2 px-3">
            <p className="truncate text-[13px] font-semibold text-[#111827]">
              {user?.displayName ?? 'Admin'}
            </p>
            <p className="truncate text-[12px] text-gray-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#111827]"
          >
            <LogoutIcon className="w-[18px] h-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
