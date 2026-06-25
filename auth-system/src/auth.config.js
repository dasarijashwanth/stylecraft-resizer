export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');

      if (isOnAdmin) {
        if (!isLoggedIn) return false;
        // Require ADMIN role
        return auth.user.role === 'admin' || auth.user.role === 'ADMIN';
      }
      if (isOnProfile) {
        return isLoggedIn;
      }
      
      // If user is logged in and tries to access login/register, redirect to profile
      if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
        return Response.redirect(new URL('/profile', nextUrl));
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.loginMethod = token.loginMethod;
        session.user.avatarUrl = token.avatarUrl;
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
  providers: [], // Initialized with full adapters in auth.js
};

export default authConfig;
