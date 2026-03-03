import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/auth-helpers";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const client = await clientPromise;
  const col = client.db().collection("mumineen");

  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        silat_given: true,
        silat_given_at: new Date(),
        silat_given_by: session.username,
        silat_given_by_email: session.email,
        silat_given_by_id: session.id,
      },
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, id, markedBy: session.username });
}
