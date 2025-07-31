import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import HoneyBeeBackground from "./HoneyBeeBackground";

const Login = () => {
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
      // const res = await axios.post("http://localhost:5000/login", {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      if (res.status === 200 && res.data.token) {
        toast.success('✅ Login successful!');
        localStorage.setItem('token', res.data.token);
        window.location.href = "/add-product";
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-white/80 to-amber-100 mt-[-25px]">
        <HoneyBeeBackground/>
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-amber-200 w-full max-w-sm transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"

        >
          <h2 className="text-3xl font-bold text-center text-yellow-700 mb-6">Owner Login</h2>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            onClick={handleerror}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 hover:cursor-pointer"
          >
            Login
          </button>
          {isLocked ? `Locked for (${lockTime}s)` : ''}
        </form>
      </div>
    </div>
  );
};

export default Login;
