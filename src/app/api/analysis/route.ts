import { FSDB } from "file-system-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = new FSDB();
    const analyses = db.get("analyses");
    return NextResponse.json(analyses);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        predictions: [],
      },
      { status: 500 },
    );
  }
}
