import { auth } from '@@/auth';
import { db } from '@@/utils/db';
import { NextResponse } from 'next/server';

// 1. GET: Fetch all users list (Admin Only)
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || (session.user.role?.toLowerCase() !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        lastLogin: true,
        loginMethod: true,
        avatarUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error('Admin GET users error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 2. PATCH: Update user configuration (role / verification status)
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || (session.user.role?.toLowerCase() !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, role, isVerified } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Security guard: Admin cannot demote themselves
    if (userId === session.user.id && role && role.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'You cannot demote your own account role.' }, { status: 400 });
    }

    const updatePayload = {};
    if (role) {
      const normalizedRole = role.toLowerCase();
      if (normalizedRole === 'admin' || normalizedRole === 'user') {
        updatePayload.role = normalizedRole;
      }
    }
    if (isVerified !== undefined) {
      updatePayload.isVerified = !!isVerified;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
      }
    });
  } catch (err) {
    console.error('Admin PATCH user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 3. DELETE: Remove user account
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session || (session.user.role?.toLowerCase() !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Security guard: Admin cannot delete their own account
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
    }

    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin DELETE user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
