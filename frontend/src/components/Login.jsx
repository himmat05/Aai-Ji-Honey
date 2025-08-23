import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useEffect } from "react";
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
    if (isLocked) return;
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
      toast.info('🔓 Login unlocked. You can try again.');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTime(300); // lock for 300 seconds
        toast.warning('🚫 Too many attempts. Locked for 300 seconds.');
      }
    }
  };

  const handleerror = () => {
    if (error) {
      setError("wrong email or password");
    }
  }


  return (
    <div><Navbar />
      <div className="flex items-center justify-center min-h-[82vh] bg-gradient-to-br from-yellow-100 via-white/80 to-amber-100 -mt-6">
        <HoneyBeeBackground />

        <form
          onSubmit={handleSubmit}
          className="bg-white/40 backdrop-blur-xl p-8 rounded-2xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-amber-200 
               w-full max-w-sm transition-all duration-300 
               hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
        >
          <h2 className="text-3xl font-extrabold text-center text-amber-700 drop-shadow-sm mb-8">
            🐝 Owner Login
          </h2>

          <div className="mb-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg 
                   bg-white/70 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-400 
                   focus:border-amber-400 transition"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-amber-200 rounded-lg 
                   bg-white/70 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-amber-400 
                   focus:border-amber-400 transition"
            />
          </div>

          <button
            type="submit"
            onClick={handleerror}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 
                 hover:from-yellow-500 hover:to-amber-600 
                 text-white font-semibold py-3 px-4 rounded-lg 
                 shadow-md transition-all duration-300 
                 hover:scale-105 hover:shadow-lg"
          >
            Login
          </button>

          {isLocked ? (
            <p className="text-center text-red-500 mt-4 font-medium">
              ⏳ Locked for {lockTime}s
            </p>
          ) : ''}
        </form>
      </div>

    </div>
  );
};

export default Login;
