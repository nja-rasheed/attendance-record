import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user_id, name, code } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const { error } = await supabase.from("subjects").insert([
    { name, code, user_id },
  ]);

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Subject added" }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const user_id = searchParams.get("user_id");

  if (!id || !user_id) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id)
    .eq("user_id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Deleted" });
}
