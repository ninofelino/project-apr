import { NextRequest, NextResponse } from 'next/server';
import { parseQueryIntent, executeQuery } from '../../../lib/db-query-tool';
import { getSchemaSummary } from '../../../lib/schema-summary';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/elephant-alpha';

export async function POST(req: NextRequest) {
  try {
    const { 
      message, 
      model = DEFAULT_MODEL, 
      conversationHistory = [], 
      responseFormat = 'natural',
      currentRtdbPath = 'messages',
      currentRtdbData = null 
    } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    // 1. Detect Intent
    const intent = parseQueryIntent(message);
    let dbResults = null;
    let queriedDatabase = false;

    if (intent.action !== 'unknown') {
      if (intent.action === 'rtdb') {
        // If user specifically asked for RTDB path, we use currentRtdbData or tell AI to use it
        dbResults = { source: 'firebase_rtdb', path: intent.path || currentRtdbPath, data: currentRtdbData };
      } else {
        dbResults = await executeQuery(intent);
      }
      queriedDatabase = true;
    }

    // 2. Prepare AI Context
    const schemaSummary = getSchemaSummary();
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'UMKM Perikanan';
    const systemPrompt = `
      You are an AI assistant for ${appName}. 
      You have access to two databases:
      1. PostgreSQL (via Neon): Main transactional data.
      2. Firebase Realtime Database (RTDB): Live sensor/message data.

      POSTGRESQL SCHEMA:
      ${schemaSummary}

      FIREBASE RTDB CONTEXT:
      Current Path: ${currentRtdbPath}
      Current Data Snapshot: ${JSON.stringify(currentRtdbData)}

      Current Intent: ${JSON.stringify(intent)}
      Database Results: ${JSON.stringify(dbResults)}
      Requested Format: ${responseFormat}

      Guidelines:
      - If the user asks about "live data", "sensors", or "messages", look at the FIREBASE RTDB CONTEXT.
      - If the user asks about "tables", "users", or "products", look at the POSTGRESQL SCHEMA.
      - FORMAT: You MUST respond in ${responseFormat.toUpperCase()} format.
      - If format is "table", use Markdown tables for data.
      - If format is "json", return valid JSON code blocks.
      - If format is "md", use rich Markdown (headers, lists, bold).
      - If format is "natural", speak like a human assistant.
      - If the database was queried, explain the results clearly.
      - Be concise and professional.
    `;

    // 3. Call OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'UMKM Perikanan',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ]
      })
    });

    const aiData = await response.json();
    const reply = aiData.choices?.[0]?.message?.content || 'I could not process your request.';

    return NextResponse.json({
      success: true,
      reply,
      model,
      queriedDatabase,
      intent
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Return available models
  const models = [
    { id: 'openrouter/elephant-alpha', name: 'Elephant Alpha' },
    { id: 'minimax/minimax-m2.5:free', name: 'MiniMax M2.5' },
    { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma 4 26B' },
    { id: 'google/gemma-4-31b-it:free', name: 'Gemma 4 31B' },
    { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron 3 120B' },
    { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 Next 80B' },
    { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B' },
    { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air' },
    { id: 'qwen/qwen3-coder:free', name: 'Qwen3 Coder' }
  ];
  return NextResponse.json({ success: true, models });
}
