import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { User } from "../../model/user.model";
import ErrorHandler from "../../utils/errorHandler";
import { generatePassword } from "../../utils/generatePassword";
import { sendNewPassword } from "../../utils/mail";

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found with this email.", 404));
    }

    const salt = await bcrypt.genSalt(10);
    const password = await generatePassword();
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    
    const mailResponse = await sendNewPassword(email, password);
    if (!mailResponse) {
      return next(new ErrorHandler("Failed to send password", 500));
    }

    res.status(201).json({ success: true, message: "New password sent successfully." });
  } catch (err) {
    return next(new ErrorHandler("An unknown error occurred", 500));
  }
};
