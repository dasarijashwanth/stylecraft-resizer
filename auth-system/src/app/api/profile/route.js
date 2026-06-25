import { auth } from '@@/auth';
import { db } from '@@/utils/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatarUrl, currentPassword, newPassword } = body;
    const userId = session.user.id;

    // Fetch user from DB
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatePayload = {};

    // 1. Handle name update
    if (name !== undefined) {
      const cleanName = name.trim();
      if (!cleanName) {
        return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      }
      updatePayload.name = cleanName;
    }

    // 2. Handle avatarUrl update
    if (avatarUrl !== undefined) {
      updatePayload.avatarUrl = avatarUrl.trim();
    }

    // 3. Handle password change (if provided)
    if (currentPassword || newPassword) {
      if (user.loginMethod !== 'email') {
        return NextResponse.json({ error: 'Google accounts cannot change passwords here' }, { status: 400 });
      }

      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Both current password and new password are required' }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
      }

      // Check current password
      const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }

      // Hash new password (12 salt rounds)
      updatePayload.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    // Perform database update
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        loginMethod: updatedUser.loginMethod,
      },
    });
  } catch (err) {
    console.error('PATCH profile error:', err);
    return NextResponse.json({ error: 'An internal server error occurred while updating profile' }, { status: 500 });
  }
}
