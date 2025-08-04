import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, id } = body;
  if (
    typeof username === "string" &&
    username === "Nguyen Tien Dat" &&
    typeof id === "string" &&
    id === "DT177013"
  ) {
    return NextResponse.json({
      id: "DT177013",
      username: "Nguyen Tien Dat",
      role: "Doctor",
    });
  } else {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
}
