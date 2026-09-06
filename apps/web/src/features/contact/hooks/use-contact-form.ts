"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitContactMessage } from "../mock/submit-contact-message.mock";
import { contactFormDefaultValues, contactFormSchema, type ContactFormValues } from "../schemas/contact-form";

export function useContactForm() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const form = useForm<ContactFormValues>({
    defaultValues: contactFormDefaultValues,
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setHasSubmitted(false);
    await submitContactMessage(values);
    form.reset(contactFormDefaultValues);
    setHasSubmitted(true);
  });

  return { form, hasSubmitted, onSubmit };
}
