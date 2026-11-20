import {
  contactSubjectValues,
  type BusinessContact,
  type ContactSocialLink,
  type ContactSubjectOption
} from "../types/contact";

export const contactSubjectOptions = [
  { label: "Selecione um assunto", value: "" },
  ...contactSubjectValues.map((subject) => ({ label: subject, value: subject }))
] as const satisfies readonly ContactSubjectOption[];

export const contactSocialLinks = [
  {
    accessibleName: "GitHub do Café Debug",
    displayValue: "@cafedebug",
    platform: "github",
    url: "https://example.com/cafedebug/github"
  },
  {
    accessibleName: "X do Café Debug",
    displayValue: "@cafedebugcast",
    platform: "x",
    url: "https://example.com/cafedebug/x"
  },
  {
    accessibleName: "YouTube do Café Debug",
    displayValue: "/cafedebug",
    platform: "youtube",
    url: "https://example.com/cafedebug/youtube"
  },
  {
    accessibleName: "LinkedIn do Café Debug",
    displayValue: "/company/cafedebug",
    platform: "linkedin",
    url: "https://example.com/cafedebug/linkedin"
  },
  {
    accessibleName: "Instagram do Café Debug",
    displayValue: "@cafedebug",
    platform: "instagram",
    url: "https://example.com/cafedebug/instagram"
  }
] as const satisfies readonly ContactSocialLink[];

export const discordCommunityLink = {
  accessibleName: "Entrar no Discord do Café Debug",
  url: "https://example.com/cafedebug/discord"
} as const;

export const businessContacts = [
  {
    description: "Quer apoiar o Café Debug ou propor uma collab? Fale com nosso time e receba o nosso mídia kit completo.",
    email: "parcerias@cafedebug.com.br",
    id: "partnerships",
    title: "Parcerias & Patrocínios"
  },
  {
    description: "Spots no episódio, posts patrocinados e campanhas para alcançar milhares de devs em todo o Brasil.",
    email: "publicidade@cafedebug.com.br",
    id: "advertising",
    title: "Publicidade"
  }
] as const satisfies readonly BusinessContact[];
