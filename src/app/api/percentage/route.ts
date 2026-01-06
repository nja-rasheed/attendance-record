import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
export async function POST(request: Request) {
    const { subject_id } = await request.json();
    const { data: attendanceRecords_present, error } = await supabase.from('attendance').select('*').eq('present', true).eq('subject_id', subject_id);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const {data: attendanceRecords_total, error: total_error } = await supabase.from('attendance').select('*').eq('subject_id', subject_id);
    if (total_error) {
        return NextResponse.json({ error: total_error.message }, { status: 500 });
    }
    const present_count = attendanceRecords_present.length;
    const total_count = attendanceRecords_total.length;
    const percentage = total_count === 0 ? 0 : (present_count / total_count) * 100;
    console.log({ present_count, total_count, percentage });
    return NextResponse.json({ percentage });
}