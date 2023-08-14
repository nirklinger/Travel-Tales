import NextAuth, { NextAuthOptions } from 'next-auth';
import CognitoProvider from 'next-auth/providers/cognito';
import { logger } from '../../../utils/server-logger';
import { insertUserOnFirstSignIn } from '../../../server/services/users';

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
  callbacks: {
    // Persist the OAuth access_token to the token right after signin
    async jwt({ token, account, profile, isNewUser, user }) {
      /*console.group('jwt');
      console.log('token:', token);
      console.log('account:', account);
      console.log('profile:', profile);
      console.log('isNewUser:', isNewUser);
      console.log('user:', user);
      console.groupEnd();*/
     
      if (account) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        token.profile = profile;
      }

      return token;
    },

    // Send properties to the client, like an access_token from a provider.
    async session({ session, token, user }) {
      if (token) {
        try {
          const partsOfName = token.name.trim().split(' ');
          const signedInUser = {
            external_id: token.sub,
            email: token.email,
            first_name: partsOfName[0],
            last_name: partsOfName.slice(1).join(' ')
          }
          const userId = await insertUserOnFirstSignIn(signedInUser);
          token.profile.userId = userId;
        } catch (err) {
          logger.error({err}, 'Error inserting user on first sign in');
        }
      }

      /*console.group('session');
      console.log('session:', session);
      console.log('token:', token);
      console.log('user:', user);
      console.groupEnd();*/

      session.accessToken = token.accessToken;
      session.profile = token.profile;

       

      return session;
    },
  },
};

export default NextAuth(authOptions);
