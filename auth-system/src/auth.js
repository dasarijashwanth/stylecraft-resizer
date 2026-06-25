import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import authConfig from './auth.config';
import { db } from './utils/db';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing email or password');
        }

        const email = credentials.email.toLowerCase();

        // 1. Rate Limiting Check: max 5 attempts in 15 mins
        const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
        const failedAttempts = await db.loginAttempt.count({
          where: {
            email,
            timestamp: { gte: fifteenMinsAgo },
          },
        });

        if (failedAttempts >= 5) {
          throw new Error('Too many failed attempts. Account locked for 15 minutes.');
        }

        // 2. Fetch User
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          // Log failed attempt
          await db.loginAttempt.create({
            data: { email, ipAddress: 'client-ip' },
          });
          throw new Error('Invalid email or password');
        }

        // 3. Match password
        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatch) {
          // Log failed attempt
          await db.loginAttempt.create({
            data: { email, ipAddress: 'client-ip' },
          });
          throw new Error('Invalid email or password');
        }

        // 4. Verify Email Status
        if (!user.isVerified) {
          throw new Error('Email verification required before login');
        }

        // 5. Clean up failed attempts on success
        await db.loginAttempt.deleteMany({
          where: { email },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          loginMethod: user.loginMethod,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email.toLowerCase();
        
        let existingUser = await db.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          // Auto-promote first user to ADMIN
          const userCount = await db.user.count();
          const role = (userCount === 0 || email === process.env.ADMIN_EMAIL?.toLowerCase()) ? 'admin' : 'user';

          existingUser = await db.user.create({
            data: {
              name: user.name || 'Google User',
              email,
              googleUid: account.providerAccountId,
              avatarUrl: user.image || '',
              role,
              isVerified: true, // Google accounts auto-verified
              loginMethod: 'google',
              lastLogin: new Date(),
            },
          });
        } else {
          // Update last login
          await db.user.update({
            where: { email },
            data: {
              lastLogin: new Date(),
              avatarUrl: existingUser.avatarUrl || user.image || '',
            },
          });
        }

        user.role = existingUser.role;
        user.id = existingUser.id;
        user.loginMethod = 'google';
        user.avatarUrl = existingUser.avatarUrl;
      } else if (account?.provider === 'credentials') {
        await db.user.update({
          where: { email: user.email },
          data: { lastLogin: new Date() },
        });
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.loginMethod = user.loginMethod;
        token.avatarUrl = user.avatarUrl;
      }
      if (trigger === 'update' && session) {
        token.name = session.name || token.name;
        token.avatarUrl = session.avatarUrl || token.avatarUrl;
        token.role = session.role || token.role;
      }
      return token;
    },
  },
});
