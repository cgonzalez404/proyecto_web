import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AppLayout from '../components/layout/AppLayout';

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AppLayout>
            <LoginPage />
          </AppLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AppLayout>
            <RegisterPage />
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
