import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const readSource = (file) => readFileSync(join(root, file), "utf8");

test("Contact keeps the route thin and inherits the Beta shell", () => {
  const routeSource = readSource("src/app/(beta)/contact/page.tsx");
  const footerSource = readSource("src/components/layout/footer.tsx");

  assert.match(routeSource, /import \{ ContactPage \} from "@\/features\/contact\/components\/contact-page"/);
  assert.match(routeSource, /import \{ getContactMetadata \} from "@\/features\/contact\/metadata"/);
  assert.match(routeSource, /export const metadata = getContactMetadata\(\)/);
  assert.doesNotMatch(routeSource, /fetch\(|useForm|zod|mock/);
  assert.match(footerSource, /\{ label: "Contato", href: "\/contact" \}/);
});

test("Contact fixtures preserve the approved subjects and explicitly mock external destinations", () => {
  const fixtureSource = readSource("src/features/contact/mock/contact-content.mock.ts");
  const typesSource = readSource("src/features/contact/types/contact.ts");

  assert.deepEqual(
    [...typesSource.matchAll(/^ {2}"([^"]+)",?$/gm)].map((match) => match[1]),
    [
      "Dúvidas e sugestões",
      "Parcerias",
      "Publicidade e patrocínio",
      "Quero participar do podcast",
      "Pautas e sugestões de conteúdo",
      "Outros assuntos"
    ]
  );
  assert.match(fixtureSource, /label: "Selecione um assunto", value: ""/);
  for (const platform of ["discord", "github", "x", "youtube", "linkedin", "instagram"]) {
    assert.match(fixtureSource, new RegExp(`https://example\\.com/cafedebug/${platform}`));
  }
  assert.match(fixtureSource, /parcerias@cafedebug\.com\.br/);
  assert.match(fixtureSource, /publicidade@cafedebug\.com\.br/);
});

test("Contact form uses RHF and Zod with a local mock success result, not a request", () => {
  const hookSource = readSource("src/features/contact/hooks/use-contact-form.ts");
  const schemaSource = readSource("src/features/contact/schemas/contact-form.ts");
  const mockSource = readSource("src/features/contact/mock/submit-contact-message.mock.ts");
  const pageSource = readSource("src/features/contact/components/contact-page.tsx");

  assert.match(hookSource, /import \{ zodResolver \} from "@hookform\/resolvers\/zod"/);
  assert.match(hookSource, /import \{ useForm \} from "react-hook-form"/);
  assert.match(hookSource, /resolver: zodResolver\(contactFormSchema\)/);
  assert.match(hookSource, /await submitContactMessage\(values\)/);
  assert.match(hookSource, /form\.reset\(contactFormDefaultValues\)/);
  assert.match(hookSource, /setHasSubmitted\(true\)/);
  assert.doesNotMatch(hookSource, /fetch\(/);
  assert.doesNotMatch(mockSource, /fetch\(/);
  assert.match(mockSource, /status: "mock-success"/);
  assert.match(schemaSource, /Informe seu nome\./);
  assert.match(schemaSource, /Informe um email válido\./);
  assert.match(schemaSource, /Selecione um assunto\./);
  assert.match(schemaSource, /Escreva sua mensagem\./);
  assert.match(pageSource, /<form className="grid gap-6" noValidate onSubmit=\{onSubmit\}>/);
  assert.match(pageSource, /type="email"/);
  assert.match(pageSource, /<textarea/);
  assert.match(pageSource, /aria-live="polite"/);
  assert.match(pageSource, /Mensagem enviada com sucesso\./);
});

test("Contact composes the existing UI-only newsletter owner and safe external links", () => {
  const pageSource = readSource("src/features/contact/components/contact-page.tsx");
  const newsletterSource = readSource("src/features/episodes/components/newsletter-form.tsx");

  assert.match(pageSource, /import \{ NewsletterForm \} from "@\/features\/episodes\/components\/newsletter-form"/);
  assert.match(pageSource, /<NewsletterForm variant="contact" \/>/);
  assert.match(newsletterSource, /variant\?: "contact" \| "default"/);
  assert.match(newsletterSource, /if \(variant === "contact"\)/);
  assert.match(pageSource, /rel="noreferrer" target="_blank"/);
  assert.doesNotMatch(pageSource, /fetch\(/);
  assert.doesNotMatch(newsletterSource, /fetch\(/);
});

test("Contact sidebar and business cards retain the corrected Pencil content anatomy", () => {
  const fixtureSource = readSource("src/features/contact/mock/contact-content.mock.ts");
  const pageSource = readSource("src/features/contact/components/contact-page.tsx");

  assert.match(pageSource, />Redes sociais</);
  assert.match(pageSource, /<ContactSocialIcon platform=\{social\.platform\} \/>/);
  assert.match(pageSource, /font-semibold">\{socialLabels\[social\.platform\]\}/);
  assert.match(pageSource, /text-muted-foreground">\{social\.displayValue\}/);
  assert.match(pageSource, /<ArrowUpRight aria-hidden size=\{16\} \/>/);
  assert.match(pageSource, /Mais de 8\.200 desenvolvedores trocando ideias sobre carreira, vagas e tecnologia todos os dias\. Entre e apresente-se no #boas-vindas\./);
  assert.match(pageSource, /bg-success-foreground/);
  assert.match(pageSource, /rounded-m bg-secondary text-primary/);
  assert.match(pageSource, /text-\[19px\] font-bold/);
  assert.match(pageSource, /size-\[42px\]/);
  assert.match(pageSource, /gap-3\.5 rounded-m px-3/);
  assert.match(pageSource, /text-lg font-semibold/);
  assert.match(pageSource, /className="mt-auto inline-flex min-h-10 items-center gap-2 self-start font-primary text-sm font-medium text-primary/);
  assert.doesNotMatch(pageSource, /underline decoration-primary/);
  assert.match(fixtureSource, /Quer apoiar o CaféDebug ou propor uma collab\? Fale com nosso time e receba o nosso mídia kit completo\./);
  assert.match(fixtureSource, /Spots no episódio, posts patrocinados e campanhas para alcançar milhares de devs em todo o Brasil\./);
});

test("InputGroup keeps validation feedback outside the associated label", () => {
  const inputSource = readSource("src/components/ui/input.tsx");

  assert.match(inputSource, /<div className=\{cn\("grid w-full gap-1\.5", className\)\}>/);
  assert.match(inputSource, /<label className="grid gap-1\.5" htmlFor=\{id\}>/);
  assert.match(inputSource, /<\/label>\s*\{error \? <span className="font-secondary text-xs leading-4 text-error-foreground" id=\{errorId\} role="alert">\{error\}<\/span> : null\}/);
});
