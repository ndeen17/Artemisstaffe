import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { AdminLayout } from '@/components/AdminLayout';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/OverviewPage';
import { AcquisitionPage } from '@/pages/AcquisitionPage';
import { EngagementPage } from '@/pages/EngagementPage';
import { ProductPage } from '@/pages/ProductPage';
import { QualityPage } from '@/pages/QualityPage';
import { UsersPage } from '@/pages/UsersPage';
import { UserDetailPage } from '@/pages/UserDetailPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<OverviewPage />} />
        <Route path="/acquisition" element={<AcquisitionPage />} />
        <Route path="/engagement" element={<EngagementPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/quality" element={<QualityPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
