import { createBrowserRouter, Navigate } from 'react-router';
import { AuthLayout } from './components/layouts/AuthLayout';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Learning } from './pages/Learning';
import { CourseDetail } from './pages/CourseDetail';
import { StockPlayground } from './pages/StockPlayground';
import { NewsIntelligence } from './pages/NewsIntelligence';
import { Portfolio } from './pages/Portfolio';
import { Chatbot } from './pages/Chatbot';
import { Profile } from './pages/Profile';
import { Diagnostic } from './pages/Diagnostic';
import { TestPage } from './pages/TestPage';

export const router = createBrowserRouter([
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/diagnostic',
    element: <Diagnostic />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'learning', element: <Learning /> },
      { path: 'learning/:courseId', element: <CourseDetail /> },
      { path: 'playground', element: <StockPlayground /> },
      { path: 'news', element: <NewsIntelligence /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'advisor', element: <Chatbot /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);