import { NextResponse } from 'next/server';
import { db } from '@@/utils/db';
import { verifyRecaptcha } from '@@/utils/recaptcha';
import { sendVerificationEmail } from '@@/utils/mailer';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, recaptchaToken } = await req.json();

    // 1. Validate fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
    }

    const emailClean = email.trim().toLowerCase();
    const nameClean = name.trim();

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // 2. Validate Google reCAPTCHA
    const isCaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json({ error: 'reCAPTCHA bot protection check failed. Try again.' }, { status: 400 });
    }

    // 3. Check duplicate email
    const existingUser = await db.user.findUnique({
      where: { email: emailClean },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'This email is already registered' }, { status: 400 });
    }

    // 4. Hash password (12 salt rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Automatic role checking: first user OR admin email config = admin
    const userCount = await db.user.count();
    const role = (userCount === 0 || emailClean === process.env.ADMIN_EMAIL?.toLowerCase()) ? 'admin' : 'user';

    // 6. Create User
    const user = await db.user.create({
      data: {
        name: nameClean,
        email: emailClean,
        passwordHash,
        role,
        isVerified: false,
        loginMethod: 'email',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(nameClean)}`, // Nice default robot avatar!
      },
    });

    // 7. Generate Verification Token (24h expiry)
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // 8. Build verification URL
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const verificationUrl = `${protocol}://${host}/api/auth/verify?token=${token}`;

    // 9. Trigger Mailer
    await sendVerificationEmail(emailClean, nameClean, verificationUrl);

    return NextResponse.json({
      message: 'Registration successful! A verification link has been sent to your email.',
      userId: user.id,
    });
  } catch (err) {
    console.error('Registration API Error:', err);
    return NextResponse.json({ error: 'An internal server error occurred during registration' }, { status: 500 });
  }
}
