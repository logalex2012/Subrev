import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from '@heroui/react';
import App from './App.jsx';
import { SplashScreen } from './home.jsx';
import { Forbidden, NotFound, Unavailable } from './pages/ErrorPage.jsx';
import Feed from './pages/Feed.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Posts from './pages/admin/Posts.jsx';
import Moderation from './pages/admin/Moderation.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import Changelog from './pages/admin/Changelog.jsx';
import Logs from './pages/admin/Logs.jsx';
import Roles from './pages/admin/Roles.jsx';
import Messages from './pages/Messages.jsx';
import Communities from './pages/Communities.jsx';
import Community from './pages/Community.jsx';
import { isMaintenance } from './siteConfig.js';

/** Redirects to /503 when maintenance mode is on. Admin panel stays accessible. */
function MaintenanceGuard({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(isMaintenance());

  useEffect(() => {
    function sync() { setMaintenance(isMaintenance()); }
    window.addEventListener('siteconfig:change', sync);
    return () => window.removeEventListener('siteconfig:change', sync);
  }, []);

  useEffect(() => {
    const isAdminRoute = pathname.startsWith('/admin');
    const isMaintenancePage = pathname === '/503';

    if (maintenance && !isAdminRoute && !isMaintenancePage) {
      // Включили — уходим на страницу обслуживания
      navigate('/503', { replace: true });
    } else if (!maintenance && isMaintenancePage) {
      // Выключили — возвращаем на главную
      navigate('/', { replace: true });
    }
  }, [pathname, maintenance, navigate]);

  return children;
}

export default function Root() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider placement="bottom-end" />

      <MaintenanceGuard>
        <Routes>
          {/* Main app */}
          <Route path="/"              element={<App />} />
          <Route path="/feed"          element={<Feed />} />
          <Route path="/profile"       element={<Profile />} />
          <Route path="/settings"      element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages"      element={<Messages />} />
          <Route path="/communities"   element={<Communities />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/403"           element={<Forbidden />} />
          <Route path="/503"           element={<Unavailable />} />

          {/* Admin panel */}
          <Route path="/admin/login"       element={<AdminLogin />} />
          <Route path="/admin"             element={<Dashboard />} />
          <Route path="/admin/users"       element={<Users />} />
          <Route path="/admin/posts"       element={<Posts />} />
          <Route path="/admin/moderation"  element={<Moderation />} />
          <Route path="/admin/analytics"   element={<Analytics />} />
          <Route path="/admin/settings"    element={<AdminSettings />} />
          <Route path="/admin/changelog"   element={<Changelog />} />
          <Route path="/admin/logs"        element={<Logs />} />
          <Route path="/admin/roles"       element={<Roles />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </MaintenanceGuard>

      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
    </BrowserRouter>
  );
}
