import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type Subject = {
    id: string;
  name: string;
  code: string;
};

export async function GET() {
    const { data, error } = await supabase.from('subjects').select('*');
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const { name, code } = await request.json();
    const { error } = await supabase.from('subjects').insert([{ name, code }]);
    return NextResponse.json({ message: 'Subject added successfully' }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Subject id is required' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: 'Subject deleted successfully' },
    { status: 200 }
  );
}
