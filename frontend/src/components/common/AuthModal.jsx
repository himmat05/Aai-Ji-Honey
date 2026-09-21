import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../../api/authApi';
import { customerAuthApi } from '../../api/customerAuthApi';
import useAuth from '../../hooks/useAuth';
import AddressInputFields from './AddressInputFields';
import PasswordChecklist from './PasswordChecklist';
import { formatDeliveryAddress } from '../../utils/addressFormatter';
import { validateStrongPassword } from '../../utils/validators';

const MODES = {
  LOGIN: 'LOGIN',
  SIGNUP: 'SIGNUP',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
};

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = MODES.LOGIN, subtitle }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [signupAddress, setSignupAddress] = useState({
    house: '',
    street: '',
    area: '',
    city: '',
    state: 'Rajasthan',
    pin: '',
    country: 'India',
  });
  const [signupStep, setSignupStep] = useState(1); // 1: Form, 2: OTP
  const [signupOtp, setSignupOtp] = useState('');
  const [signupTimer, setSignupTimer] = useState(0);

  // Forgot password state
  const [forgotForm, setForgotForm] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [forgotTimer, setForgotTimer] = useState(0);

  const googleBtnRef = useRef(null);
  const googleInitializedRef = useRef(false);

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle countdown timers
  useEffect(() => {
    let interval;
    if (signupTimer > 0) {
      interval = setInterval(() => setSignupTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [signupTimer]);

  useEffect(() => {
    let interval;
    if (forgotTimer > 0) {
      interval = setInterval(() => setForgotTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [forgotTimer]);

  // Load Google Identity Services (GSI) script
  useEffect(() => {
    if (!isOpen) return;

    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '472097059152-placeholder.apps.googleusercontent.com';

    const handleGoogleResponse = async (response) => {
      try {
        setLoading(true);
        const data = await customerAuthApi.googleAuth({
          credential: response.credential,
        });

        login(data.token, data.user);
        toast.success(`🎉 Welcome back, ${data.user.name || 'User'}!`);
        if (onSuccess) onSuccess(data.user);
        onClose();
      } catch (err) {
        console.error('Google Sign-In Error:', err);
        const errMsg = err.response?.data?.message || err.message || 'Google authentication failed.';
        toast.error(errMsg);
      } finally {
        setLoading(false);
      }
    };

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          if (!googleInitializedRef.current) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleResponse,
              auto_select: false,
            });
            googleInitializedRef.current = true;
          }

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'continue_with',
              shape: 'pill',
            });
          }
        } catch (e) {
          console.warn('Google GSI initialization error:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    }
  }, [isOpen, mode, signupStep, forgotStep]);

  if (!isOpen) return null;

  // ==========================================
  // Login Handler
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email.trim() || !loginForm.password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      // Unified login endpoint handles both Admin (owners) and Customer (users)
      const data = await authApi.login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      login(data.token, data.user);
      if (data.role === 'admin' || data.user?.role === 'admin' || data.user?.role === 'owner') {
        toast.success('👑 Welcome back, Owner/Admin!');
        onClose();
        navigate('/orderDashboard', { replace: true });
      } else {
        toast.success(`🎉 Welcome back, ${data.user?.name || 'Customer'}!`);
        if (onSuccess) onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Signup Handlers
  // ==========================================
  const handleRequestSignupOtp = async (e) => {
    e.preventDefault();
    const { name, email, mobile, password, confirmPassword } = signupForm;

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in your name, email, and password.');
      return;
    }

    const pwCheck = validateStrongPassword(password);
    if (!pwCheck.isValid) {
      toast.error(pwCheck.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (mobile && !/^[0-9]{10}$/.test(mobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await customerAuthApi.sendSignupOtp({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile ? mobile.trim() : '',
        password,
      });

      toast.success(res.message || 'OTP sent to your email!');
      setSignupStep(2);
      setSignupTimer(60); // 60s countdown
    } catch (err) {
      console.error('Signup OTP error:', err);
      toast.error(err.response?.data?.message || 'Failed to send verification OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    if (!signupOtp || signupOtp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    try {
      setLoading(true);
      const formattedAddress = formatDeliveryAddress(signupAddress);
      const locationStr = signupAddress.city
        ? `${signupAddress.city}, ${signupAddress.state}`
        : '';

      const data = await customerAuthApi.verifySignupOtp({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        mobile: signupForm.mobile ? signupForm.mobile.trim() : '',
        location: locationStr,
        address: formattedAddress,
        password: signupForm.password,
        otp: signupOtp.trim(),
      });

      login(data.token, data.user);
      toast.success(`🎉 Account created successfully! Welcome, ${data.user.name}.`);
      if (onSuccess) onSuccess(data.user);
      onClose();
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast.error(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendSignupOtp = async () => {
    if (signupTimer > 0) return;
    try {
      setLoading(true);
      await customerAuthApi.sendSignupOtp({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        mobile: signupForm.mobile.trim(),
        password: signupForm.password,
      });
      toast.success('A new OTP has been sent to your email.');
      setSignupTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Forgot Password Handlers
  // ==========================================
  const handleRequestForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotForm.email.trim()) {
      toast.error('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await customerAuthApi.sendForgotPasswordOtp({
        email: forgotForm.email.trim(),
      });
      toast.success(res.message || 'Password reset OTP sent to your email!');
      setForgotStep(2);
      setForgotTimer(60);
    } catch (err) {
      console.error('Forgot password OTP error:', err);
      toast.error(err.response?.data?.message || 'No account found with this email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { email, otp, newPassword, confirmNewPassword } = forgotForm;

    if (!otp || otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit OTP.');
      return;
    }

    const pwCheck = validateStrongPassword(newPassword);
    if (!pwCheck.isValid) {
      toast.error(pwCheck.errors[0]);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await customerAuthApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      toast.success(res.message || 'Password reset successful! Please log in.');
      setMode(MODES.LOGIN);
      setLoginForm((prev) => ({ ...prev, email: email.trim(), password: '' }));
      setForgotStep(1);
      setForgotForm({ email: '', otp: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-8 overflow-hidden border border-amber-200 animate-[scaleIn_0.25s_ease-out] relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-xl transition-all"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍯</span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {mode === MODES.LOGIN && 'Welcome to Aai Ji Honey'}
                {mode === MODES.SIGNUP && 'Create Your Account'}
                {mode === MODES.FORGOT_PASSWORD && 'Reset Password'}
              </h2>
              <p className="text-amber-100 text-xs mt-0.5">
                {subtitle || 'Pure, Raw & Natural Rajasthan Honey'}
              </p>
            </div>
          </div>

          {/* Tab Switcher (Login / Signup) */}
          {mode !== MODES.FORGOT_PASSWORD && (
            <div className="flex bg-amber-700/40 p-1 rounded-xl mt-5">
              <button
                onClick={() => {
                  setMode(MODES.LOGIN);
                  setSignupStep(1);
                }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === MODES.LOGIN
                    ? 'bg-white text-amber-900 shadow-md'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode(MODES.SIGNUP);
                  setSignupStep(1);
                }}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  mode === MODES.SIGNUP
                    ? 'bg-white text-amber-900 shadow-md'
                    : 'text-amber-100 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* ========================================================= */}
          {/* LOGIN VIEW */}
          {/* ========================================================= */}
          {mode === MODES.LOGIN && (
            <div>
              {/* Google Sign-In Button */}
              <div className="mb-4">
                <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-amber-200"></div>
                <span className="px-3 text-xs text-amber-700 font-medium uppercase tracking-wider">
                  or with email
                </span>
                <div className="flex-grow border-t border-amber-200"></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm transition-all bg-amber-50/30"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-amber-900">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode(MODES.FORGOT_PASSWORD)}
                      className="text-xs text-amber-600 hover:text-amber-800 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm transition-all bg-amber-50/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-98 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    '🔐 Sign In'
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-gray-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode(MODES.SIGNUP)}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Sign Up with Email OTP
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SIGNUP VIEW */}
          {/* ========================================================= */}
          {mode === MODES.SIGNUP && (
            <div>
              {/* Step 1: User Details Form */}
              {signupStep === 1 && (
                <div>
                  {/* Google Quick Signup */}
                  <div className="mb-4">
                    <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]"></div>
                  </div>

                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-amber-200"></div>
                    <span className="px-3 text-xs text-amber-700 font-medium uppercase tracking-wider">
                      or manual registration
                    </span>
                    <div className="flex-grow border-t border-amber-200"></div>
                  </div>

                  <form onSubmit={handleRequestSignupOtp} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-900 mb-1">
                        Mobile Number (10 digits)
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={signupForm.mobile}
                        onChange={(e) =>
                          setSignupForm((prev) => ({
                            ...prev,
                            mobile: e.target.value.replace(/\D/g, ''),
                          }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                      />
                    </div>

                    {/* Structured Delivery Address (House, Street, Area, City, State, PIN, Country) */}
                    <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                      <span className="block text-xs font-bold text-amber-900 mb-2">
                        📍 Delivery Address <span className="text-gray-500 font-normal">(Optional - House, Street, Area, City, State, PIN, Country)</span>
                      </span>
                      <AddressInputFields
                        values={signupAddress}
                        onChange={setSignupAddress}
                        required={false}
                        showPreview={true}
                        compact={true}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="8-16 strong chars"
                          value={signupForm.password}
                          onChange={(e) =>
                            setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1">
                          Confirm <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Repeat password"
                          value={signupForm.confirmPassword}
                          onChange={(e) =>
                            setSignupForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                        />
                      </div>
                    </div>

                    {/* Live Strong Password Policy Checklist */}
                    <PasswordChecklist password={signupForm.password} />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-98 text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        '📩 Send Verification OTP'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: Email OTP Input */}
              {signupStep === 2 && (
                <form onSubmit={handleVerifySignupOtp} className="space-y-4 text-center">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-3xl block mb-1">📬</span>
                    <p className="text-xs text-amber-900 font-semibold">
                      We sent a 6-digit code to:
                    </p>
                    <p className="text-sm font-bold text-amber-950 mt-0.5 break-all">
                      {signupForm.email}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="text-xs text-amber-600 hover:underline mt-1 inline-block"
                    >
                      ✏️ Change email
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-2">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="••••••"
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-48 text-center text-2xl font-mono tracking-widest px-4 py-2.5 rounded-xl border-2 border-amber-400 focus:ring-2 focus:ring-amber-500 focus:outline-none mx-auto bg-amber-50/50"
                    />
                  </div>

                  <div className="text-xs text-gray-500">
                    {signupTimer > 0 ? (
                      <span>Resend OTP code in <strong>{signupTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendSignupOtp}
                        className="text-amber-700 font-bold hover:underline"
                      >
                        🔄 Resend OTP Code
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || signupOtp.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '✅ Verify & Complete Signup'
                    )}
                  </button>
                </form>
              )}

              <div className="mt-5 text-center text-xs text-gray-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode(MODES.LOGIN)}
                  className="text-amber-700 font-bold hover:underline"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FORGOT PASSWORD VIEW */}
          {/* ========================================================= */}
          {mode === MODES.FORGOT_PASSWORD && (
            <div>
              {forgotStep === 1 && (
                <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                  <p className="text-xs text-gray-600">
                    Enter the email address registered with your account and we will send you an OTP to reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Registered Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={forgotForm.email}
                      onChange={(e) =>
                        setForgotForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '📨 Send Reset OTP'
                    )}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                    <p className="text-xs text-amber-900 font-semibold">
                      OTP sent to: <strong>{forgotForm.email}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      6-Digit OTP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="••••••"
                      value={forgotForm.otp}
                      onChange={(e) =>
                        setForgotForm((prev) => ({
                          ...prev,
                          otp: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      className="w-full text-center text-lg font-mono tracking-widest px-4 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-amber-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="8-16 strong characters"
                      value={forgotForm.newPassword}
                      onChange={(e) =>
                        setForgotForm((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                      className="w-full px-4 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={forgotForm.confirmNewPassword}
                      onChange={(e) =>
                        setForgotForm((prev) => ({
                          ...prev,
                          confirmNewPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/30"
                    />
                  </div>

                  {/* Live Strong Password Policy Checklist */}
                  <PasswordChecklist password={forgotForm.newPassword} />

                  <div className="text-xs text-center text-gray-500">
                    {forgotTimer > 0 ? (
                      <span>Resend code in <strong>{forgotTimer}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestForgotOtp}
                        className="text-amber-700 font-bold hover:underline"
                      >
                        🔄 Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      '🔐 Reset Password & Log In'
                    )}
                  </button>
                </form>
              )}

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(MODES.LOGIN);
                    setForgotStep(1);
                  }}
                  className="text-xs text-amber-700 font-semibold hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
