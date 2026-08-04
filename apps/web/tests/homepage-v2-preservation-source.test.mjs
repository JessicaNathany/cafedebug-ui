import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const source = readFileSync(
  join(process.cwd(), "src/features/homepage/components/homepage-v2.tsx"),
  "utf8"
);

test("HomepageV2 preserves the future 2.0 homepage contract", () => {
  assert.match(source, /export async function HomepageV2\(\)/);
  assert.match(source, /import \{ HeroPlayer \} from "\.\.\/\.\.\/episodes\/components\/hero-player"/);
  assert.match(source, /import \{ NewsCard \} from "\.\.\/\.\.\/news\/components\/news-card"/);
  assert.match(source, /import \{ NewsletterForm \} from "\.\.\/\.\.\/episodes\/components\/newsletter-form"/);
  assert.match(source, /import \{ mockNewsArticles \} from "\.\.\/\.\.\/news\/mock\/news\.mock"/);
  assert.match(source, /import \{ mockHomepageEvents \} from "\.\.\/\.\.\/events\/mock\/homepage-events\.mock"/);

  for (const protectedCopy of [
    '{ label: "Episódios", value: "142" }',
    '{ label: "Ouvintes/mês", value: "85k" }',
    '{ label: "Avaliação", value: "4.9" }',
    "Dê o próximo passo",
    "na sua carreira dev",
    "Últimas Notícias",
    "Agenda de Eventos",
    "Fique por dentro do universo dev",
    "Sem spam. Cancele quando quiser."
  ]) {
    assert.ok(source.includes(protectedCopy), `missing protected 2.0 copy: ${protectedCopy}`);
  }

  assert.match(source, /<HeroPlayer episode=\{featured\} \/>/);
  assert.match(source, /<NewsCard article=\{article\} key=\{article\.slug\} \/>/);
  assert.match(source, /<NewsletterForm \/>/);
  assert.match(source, /mockNewsArticles\.map/);
  assert.match(source, /mockHomepageEvents\.map/);
  assert.match(source, /heroStats\.map/);
  assert.doesNotMatch(source, /fetch\(/, "the preserved server composition must keep using its server adapter");
});
