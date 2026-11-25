import { NextResponse } from 'next/server';
import { CVParserAgent } from '@/lib/agents/cv-parser-agent';

export async function POST(req: Request) {
  try {
    const { text, filename } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text content is required for CV parsing' }, { status: 400 });
    }

    const result = await CVParserAgent.parseCVText(text, filename || 'uploaded_cv.pdf');
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error in CV parsing route:', error);
    return NextResponse.json({ error: 'Failed to parse CV' }, { status: 500 });
  }
}
