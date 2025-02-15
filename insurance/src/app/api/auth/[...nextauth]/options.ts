import connectDB from "@/config/db";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/model/user.model";
import jwt from "jsonwebtoken";
import genrateUUID from "@/utils/uuidgenrator";

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
  let user = await User.findOne({ email: profile.email });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    profile.email.split("@")[0] + provider,
    salt
  );
  const totalUser = await User.countDocuments();
  const userId: string = genrateUUID();
  // New user registration flow
  if (!user) {
    const newUserId = `user_${
      profile.name || profile.email.split("@")[0].slice(0, 3)
    }-${userId}-${totalUser}`;
    user = new User({
      userId: newUserId,
      name: profile.name || profile.email.split("@")[0],
      email: profile.email,
      image: profile.picture,
      password: hashedPassword,
      provider,
      isVerified: true,
    });
    try {
      await user.save();
    } catch (error) {
      throw new Error("FailedToCreateAccount" + error);
    }
  } else {
    user.provider = provider;
    try {
      await user.save();
    } catch (error) {
      console.error("Error updating provider:", error);
    }
  }

  return user;
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

        await connectDB();
        try {
          const user = await User.findOne({
            email: credentials.email, // Using 'email' instead of 'email'
          });

          if (!user) {
            throw new Error("No user found with this email or username");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }
        
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }
          if(user.role !== "admin"){
            throw new Error("Please contact to admin");
          }
          return {
            id: user._id as string,
            name: user.name,
            email: user.email,
            image: user.image,
            password: user.password,
            provider: user.provider,
            isVerified: user.isVerified,
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
        await connectDB();

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
