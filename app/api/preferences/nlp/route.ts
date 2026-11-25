import { NextResponse } from 'next/server';
import { ProfileAgent } from '@/lib/agents/profile-agent';

export async function POST(req: Request) {
  try {
    const { goalText } = await req.json();
    if (!goalText || typeof goalText !== 'string') {
      return NextResponse.json({ error: 'goalText is required' }, { status: 400 });
    }

    const structuredPreferences = await ProfileAgent.parseNaturalLanguageGoal(goalText);
    return NextResponse.json({ preferences: structuredPreferences });
  } catch (error) {
    console.error('Error parsing natural language goal:', error);
    return NextResponse.json({ error: 'Failed to parse career goal' }, { status: 500 });
  }
}
