"use client";

import type { FormEvent } from "react";

import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form aria-label="Inscrição na newsletter" className="grid w-full max-w-140 gap-3 pt-2 sm:grid-cols-[minmax(0,401px)_147px]" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="newsletter-email">
        Seu melhor email
      </label>
      <Input
        autoComplete="email"
        className="h-13 border-border bg-background px-5 text-[15px] leading-[19px] hover:border-border"
        id="newsletter-email"
        leftIcon={<Mail aria-hidden size={16} />}
        name="email"
        placeholder="Seu melhor email"
        required
        type="email"
      />
      <Button className="h-13 w-full px-7 font-secondary text-[15px] font-semibold leading-[19px]" type="submit">
        Inscrever-se
      </Button>
    </form>
  );
}
