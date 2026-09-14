import type { UserEditorValues } from "./schemas/user-editor.schema";
import type { UserMutationPayload, UserRecord } from "./types/users.types";

export const toUserEditorDefaults = (record: UserRecord): UserEditorValues => ({
  name: record.name,
  email: record.email,
  password: "",
  confirmPassword: ""
});

export const toUserMutationPayload = ({
  values,
  mode
}: {
  values: UserEditorValues;
  mode: "new" | "edit";
}): UserMutationPayload => {
  const name = values.name.trim();
  const email = values.email.trim();
  const password = values.password.trim();

  if (mode === "new") {
    return {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
  }

  return {
    name,
    email,
    ...(password ? { password } : {})
  };
};
