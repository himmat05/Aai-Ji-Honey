import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import PageLoader from '../components/common/PageLoader';

// Dynamic Code-Splitting: Routes are fetched on demand
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const AboutPage = lazy(() => import('../pages/About/AboutPage'));
const ContactPage = lazy(() => import('../pages/Contact/ContactPage'));
const ProductsPage = lazy(() => import('../pages/Products/ProductsPage'));
const CartPage = lazy(() => import('../pages/Cart/CartPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const OrderDashboardPage = lazy(() => import('../pages/Admin/OrderDashboardPage'));
const ProductManagementPage = lazy(() => import('../pages/Admin/ProductManagementPage'));
const UserProfilePage = lazy(() => import('../pages/Profile/UserProfilePage'));

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'about',
        element: withSuspense(AboutPage),
      },
      {
        path: 'About',
        element: <Navigate to="/about" replace />,
      },
      {
        path: 'products',
        element: withSuspense(ProductsPage),
      },
      {
        path: 'store',
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            {withSuspense(CartPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'Cart',
        element: <Navigate to="/cart" replace />,
      },
      {
        path: 'contact',
        element: withSuspense(ContactPage),
      },
      {
        path: 'Contact',
        element: <Navigate to="/contact" replace />,
      },
      {
        path: 'login',
        element: withSuspense(LoginPage),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            {withSuspense(UserProfilePage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'orderDashboard',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(OrderDashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: <Navigate to="/orderDashboard" replace />,
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(OrderDashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(OrderDashboardPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-product',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(ProductManagementPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/edit',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(ProductManagementPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/delete',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(ProductManagementPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/add',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(ProductManagementPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/update',
        element: (
          <ProtectedRoute requiredRole="admin">
            {withSuspense(ProductManagementPage)}
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/gallery',
        element: <Navigate to="/orderDashboard?tab=gallery" replace />,
      },
      {
        path: 'admin/team',
        element: <Navigate to="/orderDashboard?tab=team" replace />,
      },
      {
        path: 'admin/coupons',
        element: <Navigate to="/orderDashboard?tab=coupons" replace />,
      },
      {
        path: 'admin/promos',
        element: <Navigate to="/orderDashboard?tab=coupons" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
