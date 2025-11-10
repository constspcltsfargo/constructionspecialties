
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { initializeFirebaseAdmin } from '@/firebase/admin-init';
import * as admin from 'firebase-admin';

// Handles POST requests to create a session cookie
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }

  try {
    const app = await initializeFirebaseAdmin();
    const auth = admin.auth(app);

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Session cookie creation error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}

// Handles GET requests to clear the session cookie (sign-out)
export async function GET() {
  cookies().delete('session');
  return NextResponse.json({ status: 'signed out' });
}
