export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar?: string;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}
