import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

import HomePage from '../pages/Home/HomePage';
import AboutPage from '../pages/About/AboutPage';
import ContactPage from '../pages/Contact/ContactPage';
import ProductsPage from '../pages/Products/ProductsPage';
import LoginPage from '../pages/Auth/LoginPage';
import OrderDashboardPage from '../pages/Admin/OrderDashboardPage';
import ProductManagementPage from '../pages/Admin/ProductManagementPage';
import UserProfilePage from '../pages/Profile/UserProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'About',
        element: <Navigate to="/about" replace />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'store',
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'Contact',
        element: <Navigate to="/contact" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orderDashboard',
        element: (
          <ProtectedRoute>
            <OrderDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrderDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <ProtectedRoute>
            <OrderDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-product',
        element: (
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/edit',
        element: (
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/delete',
        element: (
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/add',
        element: (
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products/:id/update',
        element: (
          <ProtectedRoute>
            <ProductManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
