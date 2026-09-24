import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import HoneyBeeBackground from './HoneyBeeBackground';
import CartDrawer from '../cart/CartDrawer';

const RootLayout = () => {
  const { pathname } = useLocation();

  // Ensure window always starts at the top when navigating to any page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen relative selection:bg-amber-400 selection:text-amber-950">
      <HoneyBeeBackground />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
