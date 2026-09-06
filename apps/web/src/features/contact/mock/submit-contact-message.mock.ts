import type { ContactFormValues } from "../schemas/contact-form";

export type MockContactSubmissionResult = {
  status: "mock-success";
};

/**
 * Deliberately local fixture adapter. It models a successful submission without
 * creating a network request, route handler, or persistence boundary.
 */
export async function submitContactMessage(message: ContactFormValues): Promise<MockContactSubmissionResult> {
  void message;
  return { status: "mock-success" };
}
