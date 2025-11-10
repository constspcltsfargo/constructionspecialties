import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { initializeFirebase } from "@/firebase/server-init";
import { collection, query, where, getDocs } from "firebase/firestore";
import * as bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { firestore } = initializeFirebase();
        const usersCollection = collection(firestore, 'users');
        const q = query(usersCollection, where('email', '==', credentials.email));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("No user found with this email.");
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordsMatch) {
          throw new Error("Incorrect password.");
        }

        return {
          id: userDoc.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
