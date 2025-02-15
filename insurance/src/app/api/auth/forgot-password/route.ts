import { sendNewPassword } from "@/lib/mail";
import { generatePassword } from "@/utils/generatePassword";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/config/db";
import { User } from "@/model/user.model";
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found with this email." },
        { status: 404 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password = await generatePassword();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    await sendNewPassword(email, password);

    return NextResponse.json(
      { message: "New password sent successfully." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
