import NextAuth from 'next-auth';
import authConfig from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Apply middleware security guards on the requested paths
  matcher: ['/admin/:path*', '/profile/:path*', '/login', '/register'],
};
