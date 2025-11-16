export const generateEmailTemplate = (
  name: string,
  url: string,
  type: "verify" | "reset"
) => {
  const action =
    type === "verify" ? "Verify Your Account" : "Reset Your Password";
  const message =
    type === "verify"
      ? "Please click the button below to verify your email address."
      : "Please click the button below to reset your password.";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hello ${name},</h2>
      <p>${message}</p>
      <p style="text-align: center;">
        <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          ${action}
        </a>
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br/>WanderWise Team</p>
    </div>
  `;
};
