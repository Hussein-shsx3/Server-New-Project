import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/user.type";

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUserDocument>("User", userSchema);
