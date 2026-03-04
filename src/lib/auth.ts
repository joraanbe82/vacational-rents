import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import { CustomUser } from '@/types/auth.types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const adminEmail = process.env.ADMIN_EMAIL || "admin@vacational-rents.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return {
            id: "1",
            email: adminEmail,
            name: "Admin",
            role: "admin"
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as unknown as CustomUser
        token.role = customUser.role
      }
      return token as JWT
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      return session as Session
    }
  }
})
