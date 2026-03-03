// NextAuth has been removed. Auth is now handled by:
// - POST /api/auth/login  → sets HttpOnly JWT cookie
// - POST /api/auth/logout → clears cookie
// - GET  /api/auth/session → returns current user
// - proxy.ts → reads cookie with jose to protect routes
// - lib/auth-helpers.ts → JWT utilities
