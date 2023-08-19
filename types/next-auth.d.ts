import NextAuth, { JWT, DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    profile: {
      avatar_photo: string;
      user_id: number;
      sub: string;
      first_name: string;
      last_name: string;
    };
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    profile: any;
  }
}
