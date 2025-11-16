export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface VerifyEmailDTO {
  token: string;
}

export interface ResendVerificationDTO {
  email: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}
