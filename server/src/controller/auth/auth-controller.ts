import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { genrateToken } from "../../utils/cryptoChanger";
import { OTPGenerator } from "../../utils/otpGenerator";
import { User } from "../../model/user.model";
import ErrorHandler from "../../utils/errorHandler";
import { OTPModel } from "../../model/otpModel";
import { sendVerificationEmail } from "../../utils/mail";
import uuidGenerator from "../../utils/uuidGenrator";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Registering user", req.body);
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return next(new ErrorHandler("All fields are required.", 400));
  }
  const isValidEmail = (email: string): boolean => /^\S+@\S+\.\S+$/.test(email);
  if (!isValidEmail(email)) {
    return next(new ErrorHandler("Invalid email format.", 400));
  }
  const isValidPhoneNumber = (phone: string): boolean => /^\d{10}$/.test(phone);
  if (!isValidPhoneNumber(phone)) {
    return next(
      new ErrorHandler("Phone number must be exactly 10 digits.", 400)
    );
  }

  const Email = email.toLowerCase();
  try {
    const existingUser = await User.findOne({ email: Email });

    const verifyToken: string = await genrateToken();
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const otp: string = await OTPGenerator(6);
    if (existingUser) {
      console.log(existingUser);
      if (existingUser.isVerified) {
        return next(new ErrorHandler("Email already exists", 400));
      } else {
        existingUser.name = name;
        existingUser.verifyToken = verifyToken!;
        existingUser.verifyTokenExpiry = verifyTokenExpiry;
        existingUser.phoneNumber = phone;
        await existingUser.save();

        await OTPModel.findOneAndUpdate(
          { userId: existingUser._id },
          { otpCode: Number(otp), token: verifyToken },
          { upsert: true }
        );

        const mailresponse = await sendVerificationEmail(email, Number(otp));
        if (!mailresponse) {
          return next(
            new ErrorHandler("Failed to send verification email", 500)
          );
        }

        res.status(200).json({
          message: "OTP has been sent.",
          success: true,
          token: verifyToken,
        });
        return;
      }
    }

    const userCount = await User.countDocuments();
    const userId: string = uuidGenerator();
    const newUserId = `user_${name.slice(0, 3)}-${userId}-${userCount}`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId: newUserId,
      name,
      phoneNumber: phone,
      email: Email,
      password: hashedPassword,
      verifyToken,
      provider: "credentials",
      verifyTokenExpiry,
      isVerified: false,
    });

    await newUser.save();
    await OTPModel.create({
      userId: newUser._id,
      email: newUser.email,
      token: verifyToken,
      otpCode: Number(otp),
    });

    const mailresponse = await sendVerificationEmail(email, Number(otp));
    if (!mailresponse) {
      return next(new ErrorHandler("Failed to send verification email", 500));
    }

    res.status(201).json({
      message: "User created successfully. Please verify your email.",
      success: true,
      token: verifyToken,
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("An unknown error occurred", 500));
  }
};
