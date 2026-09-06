import { z } from "zod";

import { contactSubjectValues } from "../types/contact";

export const contactFormDefaultValues = {
  email: "",
  message: "",
  name: "",
  subject: ""
} as const;

const selectedSubjects = new Set<string>(contactSubjectValues);

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome."),
  email: z.string().trim().min(1, "Informe seu email.").email("Informe um email válido."),
  subject: z.string().refine((subject) => selectedSubjects.has(subject), "Selecione um assunto."),
  message: z.string().trim().min(1, "Escreva sua mensagem.")
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
