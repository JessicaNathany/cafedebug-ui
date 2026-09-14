import { z } from "zod";

export type UserEditorMode = "new" | "edit";

const baseUserEditorSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string(),
    confirmPassword: z.string()
  });

export const createUserEditorSchema = (mode: UserEditorMode) =>
  baseUserEditorSchema.superRefine((values, context) => {
    const password = values.password.trim();
    const confirmPassword = values.confirmPassword.trim();

    const requiresPassword = mode === "new";

    if (requiresPassword && !password) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password is required."
      });
    }

    if (requiresPassword && !confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Confirm password is required."
      });
    }

    if (!requiresPassword && !password && !confirmPassword) {
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match."
      });
    }
  });

export type UserEditorValues = z.output<typeof baseUserEditorSchema>;
