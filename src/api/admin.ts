import { apiClient } from '@/lib/apiClient';
import type { AdminUser } from '@/store/authStore';

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface SignInResponse {
  user: AdminUser;
  accessToken: string;
}

export async function signIn(email: string, password: string): Promise<SignInResponse> {
  const res = await apiClient.post<SignInResponse>('/auth/signin', { email, password });
  return res.data;
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/signout').catch(() => undefined);
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export interface Overview {
  sinceDays: number;
  since: string;
  users: {
    total: number;
    new: number;
    verified: number;
    verifiedPct: number;
    onboarded: number;
    onboardedPct: number;
    active: number;
  };
  content: { cvs: number; analyses: number; applications: number; interviews: number };
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface AcquisitionFunnel {
  sinceDays: number;
  since: string;
  funnel: FunnelStage[];
  signupSeries: { date: string; count: number }[];
}

export interface ProductFunnelCv {
  type: 'cv';
  sinceDays: number;
  since: string;
  byStatus: Record<string, number>;
  total: number;
  successRate: number;
}

export interface ProductFunnelInterview {
  type: 'interview';
  sinceDays: number;
  since: string;
  byStatus: Record<string, number>;
  byMode: Record<string, number>;
  byEndedReason: Record<string, number>;
  total: number;
  completionRate: number;
}

export interface ProductFunnelApplication {
  type: 'application';
  sinceDays: number;
  since: string;
  byStatus: Record<string, number>;
  total: number;
  positiveOutcomeRate: number;
}

export type ProductFunnel =
  | ProductFunnelCv
  | ProductFunnelInterview
  | ProductFunnelApplication;

export type ProductFunnelType = 'cv' | 'interview' | 'application';

export interface Engagement {
  activeUsers: { dau: number; wau: number; mau: number };
  stickiness: number;
  voice: {
    windowDays: number;
    activeUsers: number;
    totalMinutes: number;
    avgMinutesPerUser: number;
  };
}

export interface Quality {
  sinceDays: number;
  since: string;
  analysis: {
    byStatus: Record<string, number>;
    total: number;
    successRate: number;
    failureRate: number;
  };
  feedback: {
    surface: string;
    up: number;
    down: number;
    total: number;
    upRate: number;
  }[];
}

export async function fetchOverview(sinceDays: number): Promise<Overview> {
  const res = await apiClient.get<Overview>('/admin/overview', { params: { sinceDays } });
  return res.data;
}

export async function fetchAcquisitionFunnel(sinceDays: number): Promise<AcquisitionFunnel> {
  const res = await apiClient.get<AcquisitionFunnel>('/admin/funnel/acquisition', {
    params: { sinceDays },
  });
  return res.data;
}

export async function fetchProductFunnel(
  type: ProductFunnelType,
  sinceDays: number,
): Promise<ProductFunnel> {
  const res = await apiClient.get<ProductFunnel>('/admin/funnel/product', {
    params: { type, sinceDays },
  });
  return res.data;
}

export async function fetchEngagement(): Promise<Engagement> {
  const res = await apiClient.get<Engagement>('/admin/engagement');
  return res.data;
}

export async function fetchQuality(sinceDays: number): Promise<Quality> {
  const res = await apiClient.get<Quality>('/admin/quality', { params: { sinceDays } });
  return res.data;
}

// ---------------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------------

export interface UserListItem {
  id: string;
  email: string;
  displayName: string | null;
  role: string | null;
  experienceLevel: string | null;
  goal: string | null;
  emailVerified: boolean;
  onboardingComplete: boolean;
  onboardingStep: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  counts: { cvs: number; analyses: number; applications: number };
}

export interface UserList {
  users: UserListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserDetail {
  id: string;
  email: string;
  displayName: string | null;
  role: string | null;
  experienceLevel: string | null;
  goal: string | null;
  emailVerified: boolean;
  onboardingComplete: boolean;
  onboardingStep: string | null;
  notifyByEmail: boolean;
  dataUsageConsentedAt: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  counts: { cvs: number; analyses: number; interviews: number };
  applications: {
    id: string;
    jobTitle: string;
    company: string;
    status: string;
    updatedAt: string;
  }[];
  recentActivity: { action: string; metadata: Record<string, unknown>; at: string }[];
}

export interface UserCv {
  id: string;
  source: string;
  filename: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  hasFile: boolean;
  createdAt: string;
}

export interface ListUsersParams {
  search?: string;
  role?: string;
  onboardingComplete?: 'true' | 'false';
  sort?: 'createdAt' | 'lastLoginAt' | 'email';
  dir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export async function fetchUsers(params: ListUsersParams): Promise<UserList> {
  const res = await apiClient.get<UserList>('/admin/users', { params });
  return res.data;
}

export async function fetchUser(id: string): Promise<UserDetail> {
  const res = await apiClient.get<UserDetail>(`/admin/users/${id}`);
  return res.data;
}

export async function fetchUserCvs(id: string): Promise<UserCv[]> {
  const res = await apiClient.get<UserCv[]>(`/admin/users/${id}/cvs`);
  return res.data;
}

/** Download a user's CV as a blob and trigger a browser save. */
export async function downloadUserCv(
  userId: string,
  cvId: string,
  fallbackName: string,
): Promise<void> {
  const res = await apiClient.get<Blob>(`/admin/users/${userId}/cvs/${cvId}/download`, {
    responseType: 'blob',
  });
  const disposition = res.headers['content-disposition'] as string | undefined;
  const match = disposition?.match(/filename="?([^"]+)"?/i);
  const filename = match?.[1] ?? fallbackName;

  const url = window.URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
