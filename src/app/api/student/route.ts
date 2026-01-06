import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
type AttendanceRecord = {
  subject_id: string;
  date: string;
  present: boolean;
};


export async function GET() {
    const { data: attendanceRecords, error } = await supabase.from('attendance').select('*');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(attendanceRecords);
}

export async function POST(request: Request) {
    const {subject_id, date, present} = await request.json();
    const newRecord: AttendanceRecord = { subject_id, date, present };
    const { error } = await supabase.from('attendance').insert([newRecord]);
    if (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Attendance recorded successfully', record: newRecord }, { status: 201 });
}