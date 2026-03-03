"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      login,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username/email or password. Please try again.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="login-root">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">
        {/* Logo / Brand */}
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="url(#grad)" />
              <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-name">HSB Portal</span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Login field */}
          <div className="field-group">
            <label htmlFor="login" className="field-label">
              Username or Email
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm0 2c-5 0-8 2.24-8 4v1h16v-1c0-1.76-3-4-8-4z"
                    fill="currentColor"/>
                </svg>
              </span>
              <input
                id="login"
                type="text"
                className="field-input"
                placeholder="30343404 or email@example.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="field-group">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="field-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="3" y1="3" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="none">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-alert" role="alert">
              <svg viewBox="0 0 20 20" fill="none" className="error-icon">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6v4M10 13h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            id="login-submit"
            type="submit"
            className={`login-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="login-footer">
          Silat Distribute &mdash; HSB System &copy; {new Date().getFullYear()}
        </p>
      </div>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d0d1a;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Animated background blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, #4f46e5);
          top: -150px; left: -150px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #8b5cf6, #7c3aed);
          bottom: -100px; right: -100px;
          animation-delay: -3s;
        }
        .blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #06b6d4, #0891b2);
          top: 50%; left: 55%;
          animation-delay: -6s;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 48px 44px;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 32px 64px rgba(0,0,0,0.5),
            0 8px 24px rgba(99, 102, 241, 0.15);
          animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Brand */
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .brand-icon {
          width: 40px; height: 40px;
          flex-shrink: 0;
        }
        .brand-icon svg { width: 100%; height: 100%; }
        .brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        /* Headings */
        .login-title {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .login-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0 0 32px;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.2px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          width: 18px; height: 18px;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
          display: flex; align-items: center;
        }
        .input-icon svg { width: 100%; height: 100%; }
        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 13px 44px 13px 42px;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.08);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .toggle-password {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          width: 20px; height: 20px;
          display: flex; align-items: center;
          transition: color 0.2s;
          padding: 0;
        }
        .toggle-password svg { width: 100%; height: 100%; }
        .toggle-password:hover { color: rgba(255,255,255,0.7); }

        /* Error */
        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #fca5a5;
          animation: shake 0.4s ease;
        }
        .error-icon { width: 16px; height: 16px; flex-shrink: 0; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* Button */
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          letter-spacing: 0.2px;
          margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99, 102, 241, 0.5);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn.loading { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .login-footer {
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          margin-top: 28px;
          margin-bottom: 0;
        }

        @media (max-width: 480px) {
          .login-card { padding: 36px 24px; margin: 16px; border-radius: 20px; }
          .login-title { font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
