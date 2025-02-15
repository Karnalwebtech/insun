import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_MAIL_HOST,
  //   port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL_USER,
    pass: process.env.SMTP_MAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, otp: number) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verify your email address",
      html: `
        <div>
          <h1>Verify your email address</h1>
          <p>Click the link below to verify your email address:</p>
          <p>${otp}</p>
        </div>
      `,
    });
  } catch (error) {
    throw new Error(
      "Failed to send verification email: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function sendNewPassword(email: string, password: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your New Password",
      text: `Hello,\n\nYour new password is: ${password}\n\nPlease change it after logging in.\n\nBest Regards,\nYour Company`,
    });
  } catch (error) {
    throw new Error(
      "Failed to send verification email: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}
