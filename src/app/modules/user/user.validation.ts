import { z } from "zod";

const createUser = z.object({
  body: z
    .object({
      email: z.string().email("Invalid email address").trim().toLowerCase(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password is too long")
        .trim(),
      role: z.enum(["ADMIN", "BUYER", "SELLER"]).default("BUYER"),
      fcmToken: z.string().optional(),
      login_provider: z
        .enum(["GOOGLE", "APPLE", "EMAIL"])
        .default("EMAIL")
        .optional(),
    })
    .strict(),
});

const updateUser = z.object({
  body: z
    .object({
      email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase()
        .optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password is too long")
        .trim()
        .optional(),
      role: z.enum(["ADMIN", "BUYER", "SELLER"]).optional(),
      status: z.enum(["ACTIVE", "DELETED", "INACTIVE"]).optional(),
      verified: z.boolean().optional(),
      fcmToken: z.string().nullable().optional(),
      login_provider: z.enum(["GOOGLE", "APPLE", "EMAIL"]).optional(),
    })
    .strict(),
});

const updateUserActivationStatus = z.object({
  body: z
    .object({
      status: z.enum(["ACTIVE", "DELETED", "INACTIVE"]),
    })
    .strict(),
});

const updateUserRole = z.object({
  body: z
    .object({
      role: z.enum(["ADMIN", "BUYER", "SELLER"]),
    })
    .strict(),
});

export const UserValidation = {
  createUser,
  updateUser,
  updateUserActivationStatus,
  updateUserRole,
};
