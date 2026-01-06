import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  const { user_id, subject_id } = await request.json();

  // 1️⃣ Validate input
  if (!user_id || !subject_id) {
    return NextResponse.json(
      { error: "user_id and subject_id are required" },
      { status: 400 }
    );
  }

  // 2️⃣ Get PRESENT count
  const { data: presentRecords, error: presentError } = await supabase
    .from("attendance")
    .select("id")
    .eq("user_id", user_id)
    .eq("subject_id", subject_id)
    .eq("present", true);

  if (presentError) {
    return NextResponse.json(
      { error: presentError.message },
      { status: 500 }
    );
  }

  // 3️⃣ Get TOTAL count
  const { data: totalRecords, error: totalError } = await supabase
    .from("attendance")
    .select("id")
    .eq("user_id", user_id)
    .eq("subject_id", subject_id);

  if (totalError) {
    return NextResponse.json(
      { error: totalError.message },
      { status: 500 }
    );
  }

  // 4️⃣ Calculate percentage
  const presentCount = presentRecords.length;
  const totalCount = totalRecords.length;

  const percentage =
    totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);

  return NextResponse.json({
    presentCount,
    totalCount,
    percentage,
  });
}
