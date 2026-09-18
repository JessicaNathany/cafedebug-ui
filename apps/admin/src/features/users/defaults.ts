import type { UsersQueryParams } from "./types/users.types";
import type { UserEditorValues } from "./schemas/user-editor.schema";

export const usersListDefaultParams: UsersQueryParams = {
  page: 1,
  pageSize: 5,
  sortBy: "name",
  descending: false,
  search: ""
};

export const userEditorDefaultValues: UserEditorValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};
