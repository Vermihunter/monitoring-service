import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

/*
export const {
  auth,
  handlers: { GET, POST },
} = NextAuth(authConfig);
*/
