import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthModal from '../common/AuthModal';
import { messageApi } from '../../api/messageApi';
import CartBadge from '../cart/CartBadge';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({ adminUnread: 0, userUnread: 0 });
  const { isAuthenticated, isOwner, isAdmin, isCustomer, user, logout } = useAuth();
  const isUserAdmin = isOwner || isAdmin || user?.role === 'admin' || user?.role === 'owner';

  // Fetch live unread message counts for badges
  const fetchUnreadCounts = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await messageApi.getUnreadCounts();
      if (data) {
        setUnreadCounts(data);
      }
    } catch (e) {}
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 20000);
    const handleCustomUpdate = () => fetchUnreadCounts();
    window.addEventListener('unreadCountsUpdated', handleCustomUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('unreadCountsUpdated', handleCustomUpdate);
    };
  }, [fetchUnreadCounts, location.pathname]);

  // Handle subtle shadow & blur change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🍯' },
    { name: 'Our Honey', path: '/products', icon: '🛍️' },
    { name: 'Our Story', path: '/about', icon: '🐝' },
    { name: 'Contact & Apiary', path: '/contact', icon: '📍' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-amber-200/80 shadow-lg shadow-amber-900/5 py-2.5'
          : 'bg-amber-50/80 backdrop-blur-md border-b border-amber-200/50 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group no-underline"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <img
                className="relative w-12 h-12 md:w-14 md:h-14 p-1.5 rounded-full bg-white shadow-md border border-amber-200 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300"
                src="/favicon.ico"
                alt="Aai Ji Honey Logo"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-amber-950 font-heading">
                  Aai Ji <span className="honey-gradient-text">Honey</span>
                </span>
                <span className="text-sm">✨</span>
              </div>
              <p className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase hidden sm:block">
                100% Pure • Rajasthan Apiaries
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-amber-100/60 backdrop-blur-md rounded-full border border-amber-200/70 shadow-inner">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 no-underline ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 scale-102'
                      : 'text-amber-900 hover:text-amber-700 hover:bg-amber-200/50'
                  }`
                }
              >
                <span className="text-xs">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop Auth & Cart Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <CartBadge />
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                {isUserAdmin ? (
                  <Link
                    to={unreadCounts.adminUnread > 0 ? "/orderDashboard?tab=messages&filter=unread" : "/orderDashboard"}
                    className="relative px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-xs tracking-wide flex items-center gap-1.5 uppercase no-underline"
                  >
                    <span>📊</span>
                    <span>Admin Dashboard</span>
                    {unreadCounts.adminUnread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse flex items-center gap-0.5">
                        <span>💬</span>
                        <span>{unreadCounts.adminUnread}</span>
                      </span>
                    )}
                  </Link>
                ) : (
                  <Link
                    to={unreadCounts.userUnread > 0 ? "/profile?tab=messages&filter=unread" : "/profile"}
                    title="View My Profile & Inquiries"
                    className="relative flex items-center gap-2 bg-white/90 hover:bg-amber-50 border border-amber-300/80 px-3.5 py-1.5 rounded-full shadow-sm transition-all group no-underline"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs font-black shadow group-hover:scale-105 transition-transform">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="text-xs font-bold text-amber-950 max-w-[120px] truncate">
                      {user?.name || 'My Account'}
                    </span>
                    {unreadCounts.userUnread > 0 ? (
                      <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-sm animate-pulse flex items-center gap-0.5">
                        <span>💬</span>
                        <span>{unreadCounts.userUnread}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-medium">📦 Orders</span>
                    )}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-bold text-red-700 hover:text-white hover:bg-red-500 border border-red-200 rounded-full transition-all duration-300 flex items-center gap-1"
                  title="Sign Out"
                >
                  <span>🚪</span>
                  <span>Exit</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-honey-primary px-5 py-2.5 text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 no-underline"
              >
                <span>🔐</span>
                <span>Sign In / Register</span>
              </Link>
            )}
          </div>

          {/* Mobile Cart & Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <CartBadge isMobile={true} />
            {!isAuthenticated && (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow no-underline"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xl hover:bg-amber-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-amber-200 px-5 py-5 space-y-3 animate-[fadeIn_0.2s_ease-out] shadow-2xl">
          <div className="space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors no-underline flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-amber-950 hover:bg-amber-100/70'
                  }`
                }
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-amber-200 space-y-2">
              {isUserAdmin ? (
                <Link
                  to={unreadCounts.adminUnread > 0 ? "/orderDashboard?tab=messages&filter=unread" : "/orderDashboard"}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-center text-sm no-underline shadow"
                >
                  <span>📊 Admin Dashboard</span>
                  {unreadCounts.adminUnread > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      💬 {unreadCounts.adminUnread}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  to={unreadCounts.userUnread > 0 ? "/profile?tab=messages&filter=unread" : "/profile"}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 text-amber-950 font-bold rounded-xl text-center text-sm no-underline border border-amber-300 shadow-sm"
                >
                  <span>👤 My Profile & Orders</span>
                  {unreadCounts.userUnread > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      💬 {unreadCounts.userUnread}
                    </span>
                  )}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-center text-sm border border-red-200 hover:bg-red-500 hover:text-white transition-colors"
              >
                🚪 Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-amber-200">
              <Link
                to="/login"
                className="btn-honey-primary w-full block py-3 text-center text-sm font-bold uppercase no-underline shadow-lg"
              >
                🔐 Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Auth Modal for Contextual Triggers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
