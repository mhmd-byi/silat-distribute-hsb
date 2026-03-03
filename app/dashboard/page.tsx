"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="dash-loading">
        <div className="pulse-ring" />
        <span>Loading...</span>
        <style jsx>{`
          .dash-loading {
            min-height: 100vh;
            background: #0d0d1a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.5);
            gap: 16px;
            font-family: system-ui, sans-serif;
          }
          .pulse-ring {
            width: 40px; height: 40px;
            border: 3px solid rgba(99, 102, 241, 0.3);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="dash-root">
      <div className="dash-bg-blob b1" />
      <div className="dash-bg-blob b2" />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="url(#g1)" />
              <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-text">HSB Portal</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M3 10L10 3l7 7v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Profile
          </a>
          <a href="#" className="nav-item">
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Modules
          </a>
          <a href="#" className="nav-item">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 2a6 6 0 016 6v2l1.5 3h-15L4 10V8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 15a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Notifications
          </a>
        </nav>

        <button
          id="signout-btn"
          className="signout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M13 7l3 3m0 0l-3 3m3-3H7m4-6H5a2 2 0 00-2 2v8a2 2 0 002 2h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-greeting">
              Welcome back, <span className="highlight">{session.user?.name}</span> 👋
            </h1>
            <p className="dash-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </p>
          </div>
          <div className="user-chip">
            <div className="user-avatar">
              {(session.user?.name ?? "U")[0].toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{session.user?.name}</span>
              <span className="user-email">{session.user?.email}</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: "Account Status", value: "Active", sub: "Verified member", color: "#22c55e" },
            { label: "Username", value: session.user?.name, sub: "Member ID", color: "#6366f1" },
            { label: "Email", value: "Linked", sub: session.user?.email, color: "#8b5cf6" },
            { label: "Session", value: "JWT", sub: "Secure token", color: "#06b6d4" },
          ].map((stat, i) => (
            <div className="stat-card" key={i} style={{ "--accent": stat.color } as React.CSSProperties}>
              <div className="stat-dot" />
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sub">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="info-panel">
          <h2 className="panel-title">Session Details</h2>
          <div className="info-grid">
            <div className="info-row">
              <span className="info-key">Username</span>
              <span className="info-val">{session.user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Email</span>
              <span className="info-val">{session.user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-key">User ID</span>
              <span className="info-val mono">{session.user?.id ?? "—"}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Authentication</span>
              <span className="info-val">
                <span className="badge">Credentials</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dash-root {
          min-height: 100vh;
          background: #0d0d1a;
          display: flex;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow: hidden;
        }
        .dash-bg-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
          pointer-events: none;
        }
        .b1 { width: 600px; height: 600px; background: #6366f1; top: -200px; left: 200px; }
        .b2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -100px; right: 100px; }

        /* Sidebar */
        .sidebar {
          width: 240px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          padding: 28px 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 10;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 8px 28px;
        }
        .brand-icon { width: 36px; height: 36px; }
        .brand-icon svg { width: 100%; height: 100%; }
        .brand-text { font-size: 16px; font-weight: 700; color: #fff; }

        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s, color 0.2s;
        }
        .nav-item svg { width: 18px; height: 18px; }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.8); }
        .nav-item.active {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
        }

        .signout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: none;
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: rgba(239, 68, 68, 0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .signout-btn svg { width: 18px; height: 18px; }
        .signout-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.4);
          color: #f87171;
        }

        /* Main */
        .dash-main {
          flex: 1;
          padding: 36px 40px;
          overflow-y: auto;
        }

        .dash-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 36px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .dash-greeting {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .highlight { color: #818cf8; }
        .dash-date { font-size: 14px; color: rgba(255,255,255,0.35); margin: 0; }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 10px 16px;
        }
        .user-avatar {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 700; color: #fff;
        }
        .user-info { display: flex; flex-direction: column; }
        .user-name { font-size: 14px; font-weight: 600; color: #fff; }
        .user-email { font-size: 12px; color: rgba(255,255,255,0.35); }

        /* Stats */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .stat-dot {
          position: absolute;
          top: 16px; right: 16px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
        }
        .stat-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          margin-top: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Info panel */
        .info-panel {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 24px;
        }
        .panel-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 20px;
        }
        .info-grid { display: flex; flex-direction: column; gap: 0; }
        .info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .info-row:last-child { border-bottom: none; }
        .info-key { font-size: 13px; color: rgba(255,255,255,0.4); }
        .info-val { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.85); }
        .mono { font-family: monospace; font-size: 12px; color: rgba(255,255,255,0.5); }
        .badge {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .sidebar { display: none; }
          .dash-main { padding: 24px 20px; }
          .dash-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
