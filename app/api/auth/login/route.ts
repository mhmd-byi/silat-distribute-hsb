import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();

    if (!login?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({
      $or: [{ username: login.trim() }, { email: login.trim().toLowerCase() }],
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({
      id: user._id.toString(),
      username: user.username as string,
      email: user.email as string,
      role: (user.role as string) ?? "user",
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
