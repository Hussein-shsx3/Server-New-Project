import nodemailer from "nodemailer";
import chalk from "chalk";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"WanderWise" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(chalk.green(`Email sent to ${to}: ${info.messageId}`));
  } catch (error: any) {
    console.error(chalk.red(`Error sending email: ${error.message}`));
    throw error;
  }
};
