import dbConnect from '@/lib/dbConnect';
import { TempData } from '@/model/ttl.model';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const { message, type } = await request.json();

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  await dbConnect();

  await TempData.create({
    key : roomId,
    type : type,
    value : JSON.stringify(message)
  })
  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const type = searchParams.get('type');

  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const message = await TempData.findOne({
      key : roomId,
      type : type
    })

    if(!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    return NextResponse.json(JSON.parse(message.value));
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}