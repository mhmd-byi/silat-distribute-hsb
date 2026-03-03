import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("mumineen");

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: { silat_given: true, silat_given_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("PATCH mumineen error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
