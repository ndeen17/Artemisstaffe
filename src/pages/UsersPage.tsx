import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CircleIcon,
} from '@/components/icons';
import { fetchUsers, type ListUsersParams } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { QueryState } from '@/components/QueryState';
import { formatDate, formatNumber } from '@/lib/format';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const SORTS: { value: NonNullable<ListUsersParams['sort']>; label: string }[] = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'lastLoginAt', label: 'Last active' },
  { value: 'email', label: 'Email A–Z' },
];

export function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<NonNullable<ListUsersParams['sort']>>('createdAt');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['users', debouncedSearch, sort, page],
    queryFn: () =>
      fetchUsers({
        search: debouncedSearch || undefined,
        sort,
        dir: sort === 'email' ? 'asc' : 'desc',
        page,
        limit: 25,
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      <PageHeader
        title="Users"
        description="Browse, search, and inspect user accounts."
        actions={
          data ? (
            <span className="text-sm text-ink-muted">
              {formatNumber(data.total)} total
            </span>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-shadow focus:border-brand-green focus:ring-2 focus:ring-[#dcfce7]"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as NonNullable<ListUsersParams['sort']>);
            setPage(1);
          }}
          className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-shadow focus:border-brand-green focus:ring-2 focus:ring-[#dcfce7]"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <QueryState isLoading={isLoading} isError={isError} height={320}>
        {data && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#fafafa] text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">CVs</th>
                  <th className="px-4 py-3">Analyses</th>
                  <th className="px-4 py-3">Apps</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Last active</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navigate(`/users/${u.id}`)}
                    className="cursor-pointer border-b border-gray-100 transition-colors last:border-0 hover:bg-[#fafafa]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#111827]">{u.displayName ?? '—'}</div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          {u.emailVerified ? (
                            <CheckCircleIcon className="h-3.5 w-3.5 text-[#15803d]" />
                          ) : (
                            <CircleIcon className="h-3.5 w-3.5 text-gray-300" />
                          )}
                          Verified
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {u.onboardingComplete ? (
                            <CheckCircleIcon className="h-3.5 w-3.5 text-[#15803d]" />
                          ) : (
                            <CircleIcon className="h-3.5 w-3.5 text-gray-300" />
                          )}
                          Onboarded
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.counts.cvs}</td>
                    <td className="px-4 py-3 text-gray-600">{u.counts.analyses}</td>
                    <td className="px-4 py-3 text-gray-600">{u.counts.applications}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(u.lastLoginAt)}</td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm">
              <span className="text-gray-500">
                Page {data.page} of {Math.max(data.totalPages, 1)}
                {isFetching && <span className="ml-2 text-gray-400">updating…</span>}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 enabled:hover:bg-[#fafafa]"
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  type="button"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 enabled:hover:bg-[#fafafa]"
                >
                  Next <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </QueryState>
    </>
  );
}
