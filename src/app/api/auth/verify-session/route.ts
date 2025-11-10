
import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import * as admin from 'firebase-admin';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header is required' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Bearer token is missing' }, { status: 401 });
  }

  try {
    const app = await initializeFirebaseAdmin();
    const auth = admin.auth(app);

    const decodedToken = await auth.verifySessionCookie(token, true);
    
    return NextResponse.json({ uid: decodedToken.uid });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
}
