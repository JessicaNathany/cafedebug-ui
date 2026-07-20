import assert from "node:assert/strict";
import test from "node:test";

import { z } from "zod";

const episodeSchema = z.object({
  slug: z.string().min(2),
  number: z.number().int().positive(),
  category: z.string().min(2),
  title: z.string().min(4),
  summary: z.string().min(10),
  publishedAt: z.iso.date(),
  dateLabel: z.string().min(4),
  durationMinutes: z.number().positive(),
  plays: z.string().min(2),
  audioUrl: z.string().min(1),
  artworkUrl: z.string().min(1),
  guestName: z.string().min(2),
  guestRole: z.string().min(2),
  showNotesHtml: z.string().min(10)
});

const fixtures = [
  {
    slug: "entrevista-tecnica-2026",
    number: 142,
    category: "CARREIRA",
    title: "Como passar numa entrevista técnica em 2026",
    summary: "Princípios práticos para preparar storytelling técnico, algoritmo e arquitetura sem decorar respostas.",
    publishedAt: "2026-06-12",
    dateLabel: "12 Jun 2026",
    durationMinutes: 48,
    plays: "8.4k reproduções",
    audioUrl: "/mock/sample-audio.mp3",
    artworkUrl: "/mock/episode-142.svg",
    guestName: "Ana Ribeiro",
    guestRole: "Engenheira de Software · Google",
    showNotesHtml: "<p>Texto válido de show notes.</p>"
  }
];

test("episode fixtures satisfy schema contract", () => {
  const parsed = fixtures.map((fixture) => episodeSchema.parse(fixture));
  assert.equal(parsed.length, fixtures.length);
});
