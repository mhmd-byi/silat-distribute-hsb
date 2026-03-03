import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") ?? "100")));
    const sabil = searchParams.get("sabil") ?? "";

    // If no sabil is given, return empty — dashboard starts blank
    if (!sabil.trim()) {
      return NextResponse.json({
        data: [],
        total: 0,
        page: 1,
        limit,
        totalPages: 0,
        searched: false,
      });
    }

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("mumineen");

    // Sabil can be stored as a number or string in MongoDB
    const sabilNum = parseInt(sabil);
    const filter = isNaN(sabilNum)
      ? { Sabil: { $regex: `^${sabil}$`, $options: "i" } }
      : { Sabil: { $in: [sabilNum, sabil, String(sabilNum)] } };

    const [total, docs] = await Promise.all([
      col.countDocuments(filter),
      col
        .find(filter)
        .sort({ Name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
    ]);

    return NextResponse.json({
      data: docs.map((doc) => ({
        id: doc._id.toString(),
        sector: doc["Sector"] ?? "",
        subSector: doc["Sub-Sector"] ?? "",
        masool: doc["Masool"] ?? "",
        musaeed: doc["Musaeed"] ?? "",
        sabil: doc["Sabil"] ?? "",
        itsId: doc["ITS ID"] ?? "",
        name: doc["Name"] ?? "",
        shortAddress: doc["Short Address"] ?? "",
        mobileNo: doc["Mobile No"] ?? "",
        silatGiven: doc["silat_given"] === true,
        silatGivenBy: doc["silat_given_by"] ?? null,
        silatGivenAt: doc["silat_given_at"] ?? null,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      searched: true,
    });
  } catch (err) {
    console.error("Mumineen API error:", err);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
