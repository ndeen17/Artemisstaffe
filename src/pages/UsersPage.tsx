import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            type="search"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-brand-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-greenInk focus:ring-1 focus:ring-brand-greenInk"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as NonNullable<ListUsersParams['sort']>);
            setPage(1);
          }}
          className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm outline-none focus:border-brand-greenInk"
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
          <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-surface-muted text-left text-xs text-ink-subtle">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">CVs</th>
                  <th className="px-4 py-3 font-medium">Analyses</th>
                  <th className="px-4 py-3 font-medium">Apps</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => navigate(`/users/${u.id}`)}
                    className="cursor-pointer border-b border-brand-border/50 transition-colors last:border-0 hover:bg-surface-muted"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{u.displayName ?? '—'}</div>
                      <div className="text-xs text-ink-subtle">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="inline-flex items-center gap-1">
                          {u.emailVerified ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-greenInk" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-ink-subtle" />
                          )}
                          Verified
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {u.onboardingComplete ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-greenInk" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-ink-subtle" />
                          )}
                          Onboarded
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{u.counts.cvs}</td>
                    <td className="px-4 py-3 text-ink-muted">{u.counts.analyses}</td>
                    <td className="px-4 py-3 text-ink-muted">{u.counts.applications}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-ink-muted">{formatDate(u.lastLoginAt)}</td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-ink-subtle">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-brand-border px-4 py-3 text-sm">
              <span className="text-ink-muted">
                Page {data.page} of {Math.max(data.totalPages, 1)}
                {isFetching && <span className="ml-2 text-ink-subtle">updating…</span>}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-ink-muted disabled:opacity-40 enabled:hover:bg-surface-muted"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <button
                  type="button"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 rounded-lg border border-brand-border px-3 py-1.5 text-xs font-medium text-ink-muted disabled:opacity-40 enabled:hover:bg-surface-muted"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </QueryState>
    </>
  );
}
