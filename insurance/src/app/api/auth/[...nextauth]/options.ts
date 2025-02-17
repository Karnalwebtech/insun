import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { encryptValue } from "@/utils/crypto";

interface UserType {
  id: string;
  name: string;
  email: string;
  image?: string;
  password: string;
  provider: string;
  isVerified: boolean;
}

interface SocialProfile {
  name?: string;
  email: string;
  picture?: string;
}

async function findOrCreateUser(profile: SocialProfile, provider: string) {
  const data = {
    name: profile.name || profile.email.split("@")[0],
    email: profile.email,
    image: profile.picture,
    provider: provider,
    password: profile.name || profile.email.split("@")[0],
  };
  try {
    const apiKey = await encryptValue(process.env.NEXT_PUBLIC_API_KEY!);
    const res: Response = await fetch(
      `https://insurance-backend-3qao.onrender.com/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create or find user");
    }
    const response = await res.json();
    return {
      id: response.user._id,
      name: response.user.name,
      email: response.user.email,
      image: response.user.image,
      isVerified: response.user.isVerified,
    };
  } catch (error) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Username",
          type: "text",
          placeholder: "email@example.com or username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<UserType | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or username and password are required");
        }
        // await connectDB();
        try {
          const apiKey: string = await encryptValue(
            process.env.NEXT_PUBLIC_API_KEY!
          );
          const response = await fetch(
            `https://insurance-backend-3qao.onrender.com/api/v1/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
              },
              body: JSON.stringify(credentials),
            }
          );
          const res = await response.json();

          if (!response.ok) {
            throw new Error(res.message || "Something went wrong!");
          }

          return {
            id: res?.user._id as string,
            name: res?.user.name,
            email: res?.user.email,
            image: res?.user.image,
            password: res?.user.password,
            provider: res?.user.provider,
            isVerified: res?.user.isVerified,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const decodedToken = jwt.decode(account.id_token!) as SocialProfile;
          const existingUser = await findOrCreateUser(decodedToken, "google");
          Object.assign(user, existingUser);
          return true;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id as string;
        token.isVerified = user.isVerified;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
