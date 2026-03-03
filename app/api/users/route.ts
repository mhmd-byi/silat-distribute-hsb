import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

// ── GET /api/users — list all users (admin only) ──────────────────────────────
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const client = await clientPromise;
  const db = client.db();

  const users = await db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    data: users.map((u) => ({
      id: u._id.toString(),
      username: u.username ?? "",
      email: u.email ?? "",
      role: u.role ?? "user",
      createdAt: u.createdAt ?? null,
    })),
  });
}

// ── POST /api/users — create a new user (admin only) ─────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { username, email, password, role } = body as {
    username: string;
    email: string;
    password: string;
    role: string;
  };

  if (!username?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
  }

  const allowedRoles = ["admin", "user"];
  const assignedRole = allowedRoles.includes(role) ? role : "user";

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("users");

  // Check for duplicates
  const existing = await col.findOne({
    $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
  });
  if (existing) {
    return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await col.insertOne({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: assignedRole,
    createdAt: new Date(),
    createdBy: session.user.name,
  });

  return NextResponse.json({
    success: true,
    id: result.insertedId.toString(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    role: assignedRole,
  });
}
