import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {data: { user } } = await supabase.auth.getUser();
  const user_id = user?.id;

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { subject_id, date, present } = await request.json();

  const {data: { user } } = await supabase.auth.getUser();
  const user_id = user?.id;

  if (!user_id || !subject_id || !date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("attendance").insert([
    {
      user_id,
      subject_id,
      date,
      present,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Attendance recorded" }, { status: 201 });
}
