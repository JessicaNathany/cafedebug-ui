import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const source = readFileSync(join(root, "src/features/episodes/components/home-page.tsx"), "utf8");
const formSource = readFileSync(join(root, "src/features/episodes/components/newsletter-form.tsx"), "utf8");
const newsletterSource = source.match(/<section className="dark box-border w-full bg-background[\s\S]*?id="newsletter">[\s\S]*?<\/section>/)?.[0] ?? "";

test("G10 Newsletter matches the Pencil dark-locked card and subscription form", () => {
  assert.match(source, /import \{ NewsletterForm \} from "\.\/newsletter-form"/);
  assert.match(source, /ArrowRight, Calendar, MapPin, Mail/);
  assert.match(newsletterSource, /className="dark box-border w-full bg-background px-4 py-16 text-foreground sm:px-6 sm:py-20 md:px-10 lg:h-\[574px\] lg:px-16 lg:py-20"/);
  assert.match(newsletterSource, /mx-auto flex w-full max-w-\[1312px\] flex-col items-center gap-5 rounded-\[var\(--radius-m\)\] bg-card p-6 ring-1 ring-inset ring-border sm:p-12 lg:w-\[calc\(100vw-8rem\)\] lg:h-\[414px\] lg:p-14 lg:px-12/);
  assert.match(newsletterSource, /size-14 items-center justify-center rounded-pill bg-secondary text-primary/);
  assert.match(newsletterSource, /<Mail size=\{24\} \/>/);
  assert.match(newsletterSource, /max-w-160 text-center font-secondary text-3xl font-bold leading-\[1\.15\] text-foreground sm:text-\[34px\]/);
  assert.match(newsletterSource, /Fique por dentro do universo dev/);
  assert.match(newsletterSource, /Receba os melhores episódios, notícias e vagas direto no seu email\. Toda semana, sem ruído\./);
  assert.match(newsletterSource, /<NewsletterForm \/>/);
  assert.match(newsletterSource, /Sem spam\. Cancele quando quiser\./);
  assert.doesNotMatch(newsletterSource, /#[0-9a-fA-F]{3,8}/, "G10 should keep colors token-backed");
  assert.doesNotMatch(newsletterSource, /gradient|radial|shadow-card/, "G10 must not implement the prohibited Pencil glow");
  assert.doesNotMatch(newsletterSource, /fetch\(/, "G10 homepage composition must not fetch directly");

  assert.match(formSource, /^"use client";/);
  assert.match(formSource, /import \{ Button \} from "@\/components\/ui\/button"/);
  assert.match(formSource, /import \{ Input \} from "@\/components\/ui\/input"/);
  assert.match(formSource, /import \{ Mail \} from "lucide-react"/);
  assert.match(formSource, /function handleSubmit\(event: FormEvent<HTMLFormElement>\) \{[\s\S]*?event\.preventDefault\(\);/);
  assert.match(formSource, /<form aria-label="Inscrição na newsletter" className="grid w-full max-w-140 gap-3 pt-2 sm:grid-cols-\[minmax\(0,401px\)_147px\]" onSubmit=\{handleSubmit\}>/);
  assert.match(formSource, /<label className="sr-only" htmlFor="newsletter-email">/);
  assert.match(formSource, /autoComplete="email"/);
  assert.match(formSource, /className="h-13 border-border bg-background px-5 text-\[15px\] leading-\[19px\] hover:border-border"/);
  assert.match(formSource, /leftIcon=\{<Mail aria-hidden size=\{16\} \/>\}/);
  assert.match(formSource, /placeholder="Seu melhor email"/);
  assert.match(formSource, /required/);
  assert.match(formSource, /type="email"/);
  assert.match(formSource, /<Button className="h-13 w-full px-7 font-secondary text-\[15px\] font-semibold leading-\[19px\]" type="submit">/);
  assert.match(formSource, /Inscrever-se/);
  assert.doesNotMatch(formSource, /fetch\(/, "G10 newsletter form must remain UI-only");
});
