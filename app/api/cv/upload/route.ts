import { NextResponse } from 'next/server';
import { CVParserAgent } from '@/lib/agents/cv-parser-agent';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = file.name || 'uploaded_resume.pdf';
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (extension === 'pdf') {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text || '';
    } else if (extension === 'docx' || extension === 'doc') {
      const mammothResult = await mammoth.extractRawText({ buffer });
      extractedText = mammothResult.value || '';
    } else {
      // Treat as plain text
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'Could not extract readable text from the uploaded file. Please ensure the file contains searchable text or paste text manually.' },
        { status: 400 }
      );
    }

    const parseResult = await CVParserAgent.parseCVText(extractedText, filename);

    return NextResponse.json({
      success: true,
      filename,
      rawText: extractedText,
      result: parseResult,
    });
  } catch (error) {
    console.error('Error processing CV file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process and parse uploaded CV file' },
      { status: 500 }
    );
  }
}
