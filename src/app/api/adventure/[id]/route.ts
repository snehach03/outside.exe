import { NextRequest, NextResponse } from 'next/server';
import { AdventureRepo } from '@/core/game-logic/adventure-repo';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adventure = await AdventureRepo.getById(id);
    if (!adventure) return NextResponse.json({ error: 'Adventure not found' }, { status: 404 });
    return NextResponse.json(adventure);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
