import { Mail } from "lucide-react";

import { NewsletterForm } from "@/features/episodes/components/newsletter-form";

export function NewsletterSection() {
  return (
    <section className="box-border w-full bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:px-10 lg:h-[574px] lg:px-16 lg:py-20" id="newsletter">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col items-center gap-5 rounded-[var(--radius-m)] bg-card p-6 ring-1 ring-inset ring-border sm:p-12 lg:h-[414px] lg:w-[calc(100vw-8rem)] lg:px-12 lg:py-14">
        <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-pill bg-secondary text-primary">
          <Mail size={24} />
        </span>
        <h2 className="w-full max-w-160 text-center font-secondary text-3xl font-bold leading-[1.15] text-foreground sm:text-[34px]">Fique por dentro do universo dev</h2>
        <p className="w-full max-w-140 text-center font-secondary text-base leading-[1.55] text-muted-foreground">
          Receba os melhores episódios, notícias e vagas direto no seu email. Toda semana, sem ruído.
        </p>
        <NewsletterForm />
        <p className="text-center font-secondary text-[13px] leading-[17px] text-muted-foreground">Sem spam. Cancele quando quiser.</p>
      </div>
    </section>
  );
}
