import { NextResponse } from "next/server";
import { OTPGenerator } from "@/utils/otpGenerator";
import { sendVerificationEmail } from "@/lib/mail";
import connectDB from "@/config/db";
import { OTP, OTPModel } from "@/model/otpModel";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token } = await req.json();
    const OtpToken = await OTPModel.findOne({ token: token }).sort({
      updated_at: -1,
    });
    if (!OtpToken || !OtpToken.email) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 } // Bad Request
      );
    }
    const otp: string = await OTPGenerator(6);
    const otpdata: OTP = {
      userId: OtpToken?.userId,
      email: OtpToken.email as string,
      token: token,
      otpCode: Number(otp),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await OTPModel.create(otpdata);
    // Resend OTP email
    await sendVerificationEmail(OtpToken.email, Number(otp));
    return NextResponse.json(
      { message: "OTP resend successfully." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: err || "An error occurred during OTP verification." },
      { status: 500 } // Internal Server Error
    );
  }
}
