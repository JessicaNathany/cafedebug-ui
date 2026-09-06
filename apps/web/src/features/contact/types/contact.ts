export const contactSubjectValues = [
  "Dúvidas e sugestões",
  "Parcerias",
  "Publicidade e patrocínio",
  "Quero participar do podcast",
  "Pautas e sugestões de conteúdo",
  "Outros assuntos"
] as const;

export type ContactSubject = (typeof contactSubjectValues)[number];

export type ContactSubjectOption = {
  label: ContactSubject | "Selecione um assunto";
  value: ContactSubject | "";
};

export type ContactSocialPlatform = "github" | "x" | "youtube" | "linkedin" | "instagram";

export type ContactSocialLink = {
  accessibleName: string;
  displayValue: string;
  platform: ContactSocialPlatform;
  url: string;
};

export type BusinessContact = {
  description: string;
  email: string;
  id: "partnerships" | "advertising";
  title: string;
};
