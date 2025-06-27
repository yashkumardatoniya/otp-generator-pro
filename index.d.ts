export interface OTPOptions {
  length?: number;
  digits?: boolean;
  lowerCase?: boolean;
  upperCase?: boolean;
  specialChars?: boolean;
  customChars?: string;
  expiresIn?: number | string;
}

export interface OTPWithExpiration {
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  expiresIn: number;
}

export function generateOTP(options?: OTPOptions): string | OTPWithExpiration;

export function generateNumericOTP(
  length?: number,
  expiresIn?: number | string
): String | OTPWithExpiration;

export function generateAlphaNumericOTP(
  length?: number,
  expiresIn?: number | string
): string | OTPWithExpiration;

export function generateComplexOTP(
  length?: number,
  expiresIn?: number | string
): string | OTPWithExpiration;
