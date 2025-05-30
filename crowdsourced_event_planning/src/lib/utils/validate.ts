import { z } from "zod";

export const emailSchema = z.string().email("Email tidak valid");

export const passwordSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(64, "Password maksimal 64 karakter");

export const nameSchema = z
  .string()
  .min(3, "Nama minimal 3 karakter")
  .max(50, "Nama maksimal 50 karakter");

export const fundingAmountSchema = z
  .number()
  .min(1000, "Minimal funding Rp 1.000")
  .max(100000000, "Maksimal funding Rp 100.000.000");

export const ratingSchema = z
  .number()
  .min(1, "Rating minimal 1")
  .max(5, "Rating maksimal 5");

export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): boolean {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
}

export function validateFundingAmount(amount: number): boolean {
  try {
    fundingAmountSchema.parse(amount);
    return true;
  } catch {
    return false;
  }
}

export function validateRating(rating: number): boolean {
  try {
    ratingSchema.parse(rating);
    return true;
  } catch {
    return false;
  }
}
