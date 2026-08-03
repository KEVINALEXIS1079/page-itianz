import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Solo permitiremos acceso al email del administrador y al de pruebas.
const ADMIN_EMAILS = [process.env.ADMIN_EMAIL || "itianz.business@gmail.com", "bx57599@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        return true;
      }
      return false; // Bloquea a cualquiera que no sea el admin
    },
    async session({ session }) {
      return session;
    }
  },
  pages: {
    signIn: '/portal-secreto-itianz/login',
    error: '/portal-secreto-itianz/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
