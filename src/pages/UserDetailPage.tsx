import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, DownloadIcon, FileIcon, SpinnerIcon } from '@/components/icons';
import { fetchUser, fetchUserCvs, downloadUserCv, type UserCv } from '@/api/admin';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { KPICard } from '@/components/KPICard';
import { QueryState } from '@/components/QueryState';
import { formatBytes, formatDate, formatDateTime } from '@/lib/format';

export function UserDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const userQuery = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
  const cvsQuery = useQuery({
    queryKey: ['user-cvs', id],
    queryFn: () => fetchUserCvs(id),
    enabled: !!id,
  });

  return (
    <>
      <button
        type="button"
        onClick={() => navigate('/users')}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-[#111827]"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Back to users
      </button>

      <QueryState isLoading={userQuery.isLoading} isError={userQuery.isError} height={400}>
        {userQuery.data && (
          <>
            <PageHeader
              title={userQuery.data.displayName ?? userQuery.data.email}
              description={userQuery.data.email}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <KPICard label="CVs" value={userQuery.data.counts.cvs} />
                  <KPICard label="Analyses" value={userQuery.data.counts.analyses} />
                  <KPICard label="Interviews" value={userQuery.data.counts.interviews} />
                </div>

                <Card title="Resumes" description="Download stored or generated CVs.">
                  <QueryState
                    isLoading={cvsQuery.isLoading}
                    isError={cvsQuery.isError}
                    height={120}
                  >
                    {cvsQuery.data && cvsQuery.data.length === 0 && (
                      <p className="py-6 text-center text-sm text-gray-400">
                        This user has no CVs.
                      </p>
                    )}
                    {cvsQuery.data && cvsQuery.data.length > 0 && (
                      <ul className="divide-y divide-gray-100">
                        {cvsQuery.data.map((cv) => (
                          <CvRow key={cv.id} userId={id} cv={cv} />
                        ))}
                      </ul>
                    )}
                  </QueryState>
                </Card>

                <Card title="Recent applications">
                  {userQuery.data.applications.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">No applications.</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {userQuery.data.applications.map((a) => (
                        <li key={a.id} className="flex items-center justify-between py-2.5">
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{a.jobTitle}</p>
                            <p className="text-xs text-gray-400">{a.company}</p>
                          </div>
                          <div className="text-right">
                            <span className="inline-block rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-semibold text-[#15803d]">
                              {a.status}
                            </span>
                            <p className="mt-0.5 text-xs text-gray-400">
                              {formatDate(a.updatedAt)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </div>

              <div className="space-y-6">
                <Card title="Profile">
                  <dl className="space-y-2.5 text-sm">
                    <Field label="Role" value={userQuery.data.role ?? '—'} />
                    <Field label="Experience" value={userQuery.data.experienceLevel ?? '—'} />
                    <Field label="Goal" value={userQuery.data.goal ?? '—'} />
                    <Field
                      label="Email verified"
                      value={userQuery.data.emailVerified ? 'Yes' : 'No'}
                    />
                    <Field
                      label="Onboarded"
                      value={userQuery.data.onboardingComplete ? 'Yes' : 'No'}
                    />
                    <Field
                      label="Notifications"
                      value={userQuery.data.notifyByEmail ? 'On' : 'Off'}
                    />
                    <Field label="Joined" value={formatDate(userQuery.data.createdAt)} />
                    <Field label="Last active" value={formatDate(userQuery.data.lastLoginAt)} />
                  </dl>
                </Card>

                <Card title="Recent activity">
                  {userQuery.data.recentActivity.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">No activity.</p>
                  ) : (
                    <ol className="space-y-3">
                      {userQuery.data.recentActivity.map((e, i) => (
                        <li key={i} className="flex gap-3">
                          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-green" />
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{e.action}</p>
                            <p className="text-xs text-gray-400">{formatDateTime(e.at)}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </Card>
              </div>
            </div>
          </>
        )}
      </QueryState>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-gray-400">{label}</dt>
      <dd className="font-semibold text-[#111827]">{value}</dd>
    </div>
  );
}

function CvRow({ userId, cv }: { userId: string; cv: UserCv }) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadUserCv(userId, cv.id, cv.filename ?? `cv-${cv.id}`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <li className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <FileIcon className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm font-semibold text-[#111827]">{cv.filename ?? `CV ${cv.id.slice(-6)}`}</p>
          <p className="text-xs text-gray-400">
            {cv.source}
            {cv.sizeBytes ? ` · ${formatBytes(cv.sizeBytes)}` : ''} · {formatDate(cv.createdAt)}
            {!cv.hasFile && ' · generated (text)'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-[#fafafa] disabled:opacity-50"
      >
        {downloading ? (
          <SpinnerIcon className="h-3.5 w-3.5" />
        ) : (
          <DownloadIcon className="h-3.5 w-3.5" />
        )}
        Download
      </button>
    </li>
  );
}
