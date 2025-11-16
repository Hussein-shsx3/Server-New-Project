import crypto from "crypto";

export const generateToken = (length = 32, expireHours = 24) => {
  const token = crypto.randomBytes(length).toString("hex");
  const expires = new Date(Date.now() + expireHours * 60 * 60 * 1000); // now + 24h
  return { token, expires };
};
