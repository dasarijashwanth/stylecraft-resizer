import { NextResponse } from 'next/server';
import { db } from '@@/utils/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/login?verified=false&error=invalid_token', req.url));
    }

    // 1. Find token and associated user
    const dbToken = await db.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!dbToken) {
      return NextResponse.redirect(new URL('/login?verified=false&error=token_not_found', req.url));
    }

    // 2. Check if token expired
    if (dbToken.expiresAt < new Date()) {
      // Remove the expired token
      await db.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(new URL('/login?verified=false&error=token_expired', req.url));
    }

    // 3. Update user verified status
    await db.user.update({
      where: { id: dbToken.userId },
      data: { isVerified: true },
    });

    // 4. Delete the used token
    await db.verificationToken.delete({ where: { token } });

    // 5. Redirect to login with success parameters
    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (err) {
    console.error('Verification Error:', err);
    return NextResponse.redirect(new URL('/login?verified=false&error=server_error', req.url));
  }
}
