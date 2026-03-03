import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { auth } from "@/auth";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Get current session to record who is marking
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection("mumineen");

  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        silat_given: true,
        silat_given_at: new Date(),
        silat_given_by: session.user.name,          // username
        silat_given_by_email: session.user.email,   // email
        silat_given_by_id: session.user.id,         // user id
      },
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    id,
    markedBy: session.user.name,
  });
}
