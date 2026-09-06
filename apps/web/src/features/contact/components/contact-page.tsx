"use client";

import { ArrowUpRight, Handshake, Mail, Megaphone, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input";
import { NewsletterForm } from "@/features/episodes/components/newsletter-form";

import { businessContacts, contactSocialLinks, contactSubjectOptions, discordCommunityLink } from "../mock/contact-content.mock";
import { useContactForm } from "../hooks/use-contact-form";
import type { ContactSocialPlatform } from "../types/contact";

const socialLabels: Record<ContactSocialPlatform, string> = {
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X / Twitter",
  youtube: "YouTube"
};

function ContactSocialIcon({ platform }: { platform: ContactSocialPlatform }) {
  switch (platform) {
    case "github":
      return <svg aria-hidden viewBox="0 0 16 16"><path d="M8 0C3.6 0 0 3.7 0 8.2c0 3.6 2.3 6.6 5.5 7.7.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.9 1.2.9.7 1.2 1.8.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.2.5.7.5 1.4v2.1c0 .2.1.5.5.4A8.2 8.2 0 0 0 16 8.2C16 3.7 12.4 0 8 0Z" /></svg>;
    case "youtube":
      return <svg aria-hidden viewBox="0 0 16 16"><path d="M15.7 4.4a2 2 0 0 0-1.4-1.5C13 2.6 8 2.6 8 2.6s-5 0-6.3.3A2 2 0 0 0 .3 4.4 20.3 20.3 0 0 0 0 8a20.3 20.3 0 0 0 .3 3.6 2 2 0 0 0 1.4 1.5c1.3.3 6.3.3 6.3.3s5 0 6.3-.3a2 2 0 0 0 1.4-1.5A20.3 20.3 0 0 0 16 8a20.3 20.3 0 0 0-.3-3.6ZM6.4 10.3V5.7L10.6 8l-4.2 2.3Z" /></svg>;
    case "linkedin":
      return <svg aria-hidden viewBox="0 0 16 16"><path d="M3.6 5.3H.5V16h3.1V5.3ZM2 0C.9 0 .2.7.2 1.7c0 1 .7 1.7 1.8 1.7s1.8-.7 1.8-1.7C3.8.7 3.1 0 2 0Zm13.9 9.9c0-3.3-1.8-4.9-4.1-4.9-1.9 0-2.7 1-3.2 1.8V5.3h-3V16h3.1v-6c0-.3 0-.6.1-.9.2-.6.8-1.2 1.7-1.2 1.2 0 1.7.9 1.7 2.3V16h3.1V9.9Z" /></svg>;
    case "instagram":
      return <svg aria-hidden viewBox="0 0 16 16"><path d="M8 3.9A4.1 4.1 0 1 0 8 12a4.1 4.1 0 0 0 0-8.1Zm0 6.6A2.5 2.5 0 1 1 8 5.5a2.5 2.5 0 0 1 0 5Zm5.3-6.8a1 1 0 1 1-1.9 0 1 1 0 0 1 1.9 0Z" /><path d="M4.7 0h6.6A4.7 4.7 0 0 1 16 4.7v6.6a4.7 4.7 0 0 1-4.7 4.7H4.7A4.7 4.7 0 0 1 0 11.3V4.7A4.7 4.7 0 0 1 4.7 0Zm0 1.5a3.2 3.2 0 0 0-3.2 3.2v6.6a3.2 3.2 0 0 0 3.2 3.2h6.6a3.2 3.2 0 0 0 3.2-3.2V4.7a3.2 3.2 0 0 0-3.2-3.2H4.7Z" /></svg>;
    case "x":
      return <span aria-hidden className="font-primary text-sm font-bold leading-none">X</span>;
  }
}

function FieldError({ message, name }: { message?: string | undefined; name: string }) {
  return message ? <p className="font-secondary text-xs leading-4 text-error-foreground" id={`${name}-error`} role="alert">{message}</p> : null;
}

function ContactForm() {
  const { form, hasSubmitted, onSubmit } = useContactForm();
  const { errors, isSubmitting } = form.formState;

  return (
    <section aria-labelledby="contact-form-title" className="rounded-m border border-border bg-card p-6 text-card-foreground shadow-pencil-subtle lg:min-h-[585px] lg:p-10">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <h2 className="font-secondary text-[22px] font-bold leading-[1.2]" id="contact-form-title">Envie uma mensagem</h2>
          <p className="font-secondary text-sm leading-[1.6] text-muted-foreground">Costumamos responder em até 2 dias úteis.</p>
        </div>

        <form className="grid gap-6" noValidate onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputGroup
              autoComplete="name"
              error={errors.name?.message}
              errorId="name-error"
              id="contact-name"
              inputClassName="h-12 rounded-m px-4"
              label="Nome"
              placeholder="Seu nome completo"
              required
              {...form.register("name")}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            <InputGroup
              autoComplete="email"
              error={errors.email?.message}
              errorId="email-error"
              id="contact-email"
              inputClassName="h-12 rounded-m px-4"
              label="Email"
              placeholder="seu@email.com"
              required
              type="email"
              {...form.register("email")}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>

          <div className="grid gap-1.5">
            <label className="font-secondary text-sm font-medium leading-5" htmlFor="contact-subject">Assunto</label>
            <select
              aria-describedby={errors.subject ? "subject-error" : undefined}
              aria-invalid={Boolean(errors.subject) || undefined}
              className="h-12 w-full rounded-m border border-input bg-background px-4 font-secondary text-sm text-foreground outline-none transition-colors hover:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              id="contact-subject"
              required
              {...form.register("subject")}
            >
              {contactSubjectOptions.map((option) => <option disabled={option.value === ""} key={option.value || "placeholder"} value={option.value}>{option.label}</option>)}
            </select>
            <FieldError message={errors.subject?.message} name="subject" />
          </div>

          <div className="grid gap-1.5">
            <label className="font-secondary text-sm font-medium leading-5" htmlFor="contact-message">Mensagem</label>
            <textarea
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={Boolean(errors.message) || undefined}
              className="min-h-37.5 w-full resize-y rounded-m border border-input bg-background px-4 py-3 font-secondary text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              id="contact-message"
              placeholder="Escreva sua mensagem aqui..."
              required
              {...form.register("message")}
            />
            <FieldError message={errors.message?.message} name="message" />
          </div>

          <Button className="h-12 w-full font-secondary font-semibold" disabled={isSubmitting} type="submit">
            <Send aria-hidden size={16} />
            {isSubmitting ? "Enviando mensagem..." : "Enviar mensagem"}
          </Button>
          {hasSubmitted ? <p aria-live="polite" className="rounded-m bg-success px-4 py-3 font-secondary text-sm text-success-foreground" role="status">Mensagem enviada com sucesso.</p> : null}
        </form>
      </div>
    </section>
  );
}

function ContactSidebar() {
  return (
    <aside className="grid gap-6" aria-label="Canais da comunidade CaféDebug">
      <section aria-labelledby="discord-title" className="flex min-h-[338px] flex-col rounded-m border border-border bg-card p-6 text-card-foreground shadow-pencil-subtle lg:p-8">
        <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-m bg-secondary text-primary"><MessageCircle size={22} /></span>
        <div className="mt-6 grid gap-3">
          <h2 className="font-secondary text-[19px] font-bold leading-[1.2]" id="discord-title">Comunidade no Discord</h2>
          <p className="font-secondary text-sm leading-[1.6] text-muted-foreground">Mais de 8.200 desenvolvedores trocando ideias sobre carreira, vagas e tecnologia todos os dias. Entre e apresente-se no #boas-vindas.</p>
          <p className="font-primary text-xs font-semibold tracking-[1.5px] text-foreground"><span aria-hidden className="mr-2 inline-block size-2 rounded-pill bg-success-foreground" />1.340 membros online agora</p>
        </div>
        <a aria-label={discordCommunityLink.accessibleName} className="mt-auto inline-flex h-12 items-center justify-center gap-3 rounded-pill bg-primary px-5 font-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={discordCommunityLink.url} rel="noreferrer" target="_blank">
          Entrar no Discord
          <ArrowUpRight aria-hidden size={16} />
        </a>
      </section>

      <section aria-labelledby="social-links-title" className="rounded-m border border-border bg-card p-6 text-card-foreground shadow-pencil-subtle lg:min-h-[389px] lg:p-8">
        <h2 className="font-secondary text-[19px] font-bold leading-[1.2]" id="social-links-title">Redes sociais</h2>
        <ul className="mt-5 grid gap-2">
          {contactSocialLinks.map((social) => (
            <li key={social.platform}>
              <a aria-label={social.accessibleName} className="flex min-h-12 items-center gap-3.5 rounded-m px-3 font-secondary text-sm text-foreground transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={social.url} rel="noreferrer" target="_blank">
                <span aria-hidden className="inline-flex size-[42px] shrink-0 items-center justify-center rounded-pill bg-secondary text-secondary-foreground [&_svg]:size-4 [&_svg]:fill-current"><ContactSocialIcon platform={social.platform} /></span>
                <span className="grid min-w-0 gap-0.5"><span className="font-semibold">{socialLabels[social.platform]}</span><span className="truncate text-muted-foreground">{social.displayValue}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function BusinessContacts() {
  return (
    <section aria-labelledby="business-contact-title" className="grid gap-6">
      <div className="grid max-w-160 gap-3">
        <p className="font-primary text-[13px] font-semibold leading-[1.4] tracking-[2px] text-primary">PARA EMPRESAS</p>
        <h2 className="font-secondary text-[26px] font-bold leading-[1.2]" id="business-contact-title">Para empresas</h2>
        <p className="font-secondary text-base leading-[1.6] text-muted-foreground">Oportunidades comerciais e de mídia com o CaféDebug.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {businessContacts.map((contact) => {
          const Icon = contact.id === "partnerships" ? Handshake : Megaphone;

          return (
            <article className="flex min-h-[245px] flex-col rounded-m border border-border bg-card p-6 text-card-foreground shadow-pencil-subtle lg:p-8" key={contact.id}>
              <span aria-hidden className="inline-flex size-12 items-center justify-center rounded-m bg-secondary text-primary"><Icon size={22} /></span>
              <h3 className="mt-6 font-secondary text-lg font-semibold leading-[1.2]">{contact.title}</h3>
              <p className="mt-3 font-secondary text-sm leading-[1.6] text-muted-foreground">{contact.description}</p>
              <a className="mt-auto inline-flex min-h-10 items-center gap-2 self-start font-primary text-sm font-medium text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href={`mailto:${contact.email}`}>
                <Mail aria-hidden size={16} />
                {contact.email}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ContactNewsletter() {
  return (
    <section aria-labelledby="contact-newsletter-title" className="grid gap-8 rounded-m border border-border bg-card p-6 text-card-foreground shadow-pencil-subtle lg:min-h-[188px] lg:grid-cols-[minmax(0,640px)_416px] lg:items-center lg:justify-between lg:gap-12 lg:p-12">
      <div className="grid gap-3">
        <h2 className="font-secondary text-[28px] font-bold leading-[1.2]" id="contact-newsletter-title">Receba o melhor da semana</h2>
        <p className="font-secondary text-base leading-[1.6] text-muted-foreground">Toda sexta enviamos os destaques de episódios, vagas e artigos direto no seu email. Sem spam, cancele quando quiser.</p>
      </div>
      <NewsletterForm variant="contact" />
    </section>
  );
}

export function ContactPage() {
  return (
    <main className="min-w-0 bg-background px-4 py-14 text-foreground sm:px-6 md:px-10 md:py-[72px]">
      <div className="mx-auto grid w-full min-w-0 max-w-[1360px] gap-[72px]">
        <section aria-labelledby="contact-page-title" className="grid max-w-[820px] gap-4">
          <p className="font-primary text-[13px] font-semibold leading-[1.4] tracking-[2px] text-primary">FALE CONOSCO</p>
          <h1 className="font-secondary text-4xl font-bold leading-[1.1] sm:text-5xl md:text-[46px]" id="contact-page-title">Vamos conversar?</h1>
          <p className="max-w-[640px] font-secondary text-[17px] leading-[1.6] text-muted-foreground">Tem uma sugestão de pauta, quer ser convidado de um episódio ou apenas dar um oi? Escolha o melhor canal abaixo — adoramos ouvir a comunidade.</p>
        </section>

        <section aria-label="Formulário e canais de contato" className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,868px)_minmax(0,460px)]">
          <ContactForm />
          <ContactSidebar />
        </section>

        <BusinessContacts />
        <ContactNewsletter />
      </div>
    </main>
  );
}
