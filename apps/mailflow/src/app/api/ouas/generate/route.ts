import { NextResponse } from 'next/server';
import { validate } from '@ouas/validator';
import Anthropic from '@anthropic-ai/sdk';
import { callAgent } from '@/lib/agent/prompt';
// We'll import the generated manifest
import manifestData from '@/data/manifest.ouas.json';
import { saveConfig } from '@/lib/store';
import type { Manifest } from '@ouas/validator';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

const manifest = manifestData as unknown as Manifest;

// In-memory rate limit store (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

const RATE_LIMITS = {
  TRANSFORMS_PER_MINUTE: 10,
  TRANSFORMS_PER_HOUR: 50,
} as const;

function checkRateLimit(userId: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const entry = rateLimitStore.get(userId);

  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitStore.set(userId, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMITS.TRANSFORMS_PER_MINUTE) {
    const retryAfter = Math.ceil((windowMs - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json({ error: 'Missing prompt or userId' }, { status: 400 });
    }

    // Fix 3: Rate Limiting
    const { allowed, retryAfterSeconds } = checkRateLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many layout changes. Please wait before trying again.",
          retryAfterSeconds
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) }
        }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return a simulated error or fallback if no API key is provided
      console.warn('No ANTHROPIC_API_KEY provided. Agent chat will fail.');
      return NextResponse.json({ error: 'Agent API key not configured' }, { status: 500 });
    }

    // Call the agent pipeline
    const { config, message } = await callAgent(
      anthropic,
      { prompt, userId, manifest },
      2, // Max retries
      (cfg) => validate(cfg, manifest)
    );

    // Save the config to our mock store
    saveConfig(userId, config);

    return NextResponse.json({ config, message });
  } catch (error) {
    console.error('Agent Generate Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
