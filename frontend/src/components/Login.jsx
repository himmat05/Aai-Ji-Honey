// import React, { useState } from "react";
// import axios from "axios";
// import Navbar from "./Navbar";
// import { useEffect } from "react";
// import { toast } from 'react-toastify';
// import HoneyBeeBackground from "./HoneyBeeBackground";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [failedAttempts, setFailedAttempts] = useState(0);
//   const [isLocked, setIsLocked] = useState(false);
//   const [lockTime, setLockTime] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (isLocked && lockTime > 0) {
//       timer = setInterval(() => {
//         setLockTime((prev) => {
//           if (prev <= 1) {
//             setIsLocked(false);
//             setFailedAttempts(0);
//             clearInterval(timer);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isLocked, lockTime]);


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isLocked) return;
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
//         email,
//         password,
//       });

//       if (res.status === 200 && res.data.token) {
//         toast.success('✅ Login successful!');
//         localStorage.setItem('token', res.data.token);
//         navigate("/add-product");
//       }

//     } catch (error) {
//       const newAttempts = failedAttempts + 1;
//       setFailedAttempts(newAttempts);
//       setEmail("");
//       setPassword("");
//       console.error("Login failed: ", error);
//       setError("Invalid email or password");
//       toast.info('🔓 Login unlocked. You can try again.');

//       if (newAttempts >= 3) {
//         setIsLocked(true);
//         setLockTime(300); // lock for 300 seconds
//         toast.warning('🚫 Too many attempts. Locked for 300 seconds.');
//       }
//     }
//   };

//   const handleerror = () => {
//     if (error) {
//       setError("wrong email or password");
//     }
//   }


//   return (
//     <div><Navbar />
//       <div className="flex items-center justify-center min-h-[82vh] bg-gradient-to-br from-yellow-100 via-white/80 to-amber-100 -mt-6">
//         <HoneyBeeBackground />

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl 
//                shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-amber-200 
//                w-full max-w-sm transition-all duration-300 
//                hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
//         >
//           <h2 className="text-3xl font-extrabold text-center text-amber-700 drop-shadow-sm mb-8">
//             🐝 Owner Login
//           </h2>

//           <div className="mb-5">
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-amber-200 rounded-lg 
//                    bg-white/70 shadow-sm
//                    focus:outline-none focus:ring-2 focus:ring-amber-400 
//                    focus:border-amber-400 transition"
//             />
//           </div>

//           <div className="mb-6">
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 border border-amber-200 rounded-lg 
//                    bg-white/70 shadow-sm
//                    focus:outline-none focus:ring-2 focus:ring-amber-400 
//                    focus:border-amber-400 transition"
//             />
//           </div>

//           <button
//             type="submit"
//             onClick={handleerror}
//             className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 
//                  hover:from-yellow-500 hover:to-amber-600 
//                  text-white font-semibold py-3 px-4 rounded-lg 
//                  shadow-md transition-all duration-300 
//                  hover:scale-105 hover:shadow-lg"
//           >
//             Login
//           </button>

//           {isLocked ? (
//             <p className="text-center text-red-500 mt-4 font-medium">
//               ⏳ Locked for {lockTime}s
//             </p>
//           ) : ''}
//         </form>
//       </div>

//     </div>
//   );
// };

// export default Login;



import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { toast } from 'react-toastify';
import HoneyBeeBackground from "./HoneyBeeBackground";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (isLocked && lockTime > 0) {
      timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.warning("🚫 Account locked. Please wait.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      if (res.status === 200 && res.data.token) {
        toast.success('✅ Login successful!');
        localStorage.setItem('token', res.data.token);
        navigate("/add-product");
      }

    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setEmail("");
      setPassword("");
      console.error("Login failed: ", error);
      setError("Invalid email or password");
      toast.error('❌ Invalid credentials');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTime(300);
        toast.warning('🚫 Too many attempts. Locked for 5 minutes.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <Navbar />
      <HoneyBeeBackground />
      
      <div className="flex items-center justify-center min-h-[82vh] px-4">
        <div className="w-full max-w-md">
          
          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-amber-200">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-3xl font-bold text-amber-900">Owner Login</h2>
              <p className="text-amber-700 mt-2">Access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">📧 Email Address</label>
                <input
                  type="email"
                  placeholder="owner@aaijihoney.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLocked}
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">🔑 Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLocked}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-700 hover:text-amber-900"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">
                  ❌ {error}
                </div>
              )}

              {/* Lock Message */}
              {isLocked && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-center font-semibold">
                  ⏱️ Locked for {Math.floor(lockTime / 60)}:{String(lockTime % 60).padStart(2, '0')}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLocked}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLocked ? `🚫 Locked` : `🔓 Login`}
              </button>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <p className="text-sm text-amber-900 font-semibold mb-2">⚠️ Admin Access Only</p>
              <p className="text-xs text-amber-700">This login is exclusively for Aai Ji Honey administrators and authorized personnel.</p>
            </div>

            {/* Failed Attempts Counter */}
            {failedAttempts > 0 && failedAttempts < 3 && (
              <div className="mt-4 text-center text-sm text-orange-600 font-semibold">
                ⚠️ {3 - failedAttempts} attempt{3 - failedAttempts !== 1 ? 's' : ''} remaining
              </div>
            )}
          </div>

          {/* Footer Text */}
          <p className="text-center text-amber-700 mt-6 text-sm">
            Having trouble? Contact support at <span className="font-semibold">aaijihoney24@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;