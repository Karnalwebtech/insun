import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/mail";
import { OTPGenerator } from "@/utils/otpGenerator";
import connectDB from "@/config/db";
import { OTPModel } from "@/model/otpModel";
import { User } from "@/model/user.model";
import { generateToken } from "@/lib/tokens";
import genrateUUID from "@/utils/uuidgenrator";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();
    // Connect to database
    await connectDB();
    // User exists but is not verified
    const verifyToken = generateToken();
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const otp: string = await OTPGenerator(6);
    // Check if user already exists
    const existingUser = await User.findOne({email});

    if (existingUser) {
      if (existingUser.email === email && existingUser.isVerified) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 400 }
        );
      } else {
        // Update the user with a new verification token
        existingUser.name = name;
        existingUser.verifyToken = verifyToken;
        existingUser.verifyTokenExpiry = verifyTokenExpiry;
        await existingUser.save();

        // Update or create a new OTP entry
        await OTPModel.findOneAndUpdate(
          { userId: existingUser._id },
          { otpCode: Number(otp), token: verifyToken },
          { upsert: true } // Creates if not exists
        );

        // Resend OTP email
        await sendVerificationEmail(email, Number(otp));

        return NextResponse.json({
          message: "OTP has been sent.",
          success: true,
          token: verifyToken,
        });
      }
    }
    const user = await User.countDocuments();
    const userId: string = genrateUUID();
    // New user registration flow
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUserId = `user_${name.slice(0, 3)}-${userId}-${user}`;
    const newUser = new User({
      userId: newUserId,
      name,
      email,
      role: role ? "agent" : "user",
      password: hashedPassword,
      verifyToken,
      provider: "credentials",
      verifyTokenExpiry,
      isVerified: false, // Ensure this field exists in your model
    });

    await newUser.save();
    await OTPModel.create({
      userId: newUser._id,
      email: email,
      token: verifyToken,
      otpCode: Number(otp),
    });

    await sendVerificationEmail(email, Number(otp));

    return NextResponse.json({
      message: "User created successfully. Please verify your email.",
      success: true,
      token: verifyToken,
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
