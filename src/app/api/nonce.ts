// app/api/nonce.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  cookies().set('siwe', nonce, { secure: true });
  return NextResponse.json({ nonce });
}