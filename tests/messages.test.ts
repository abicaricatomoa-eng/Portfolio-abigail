import { describe, expect, it } from 'vitest';
import es from '../messages/es.json';
import en from '../messages/en.json';

// Every key, array length and project id must match across languages.
function shape(v: unknown, path = ''): string[] {
  if (Array.isArray(v)) return [`${path}[${v.length}]`, ...v.flatMap((x, i) => shape(x, `${path}[${i}]`))];
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => [`${path}.${k}`, ...shape(x, `${path}.${k}`)]);
  return [];
}

describe('messages', () => {
  it('es and en have the same keys and list lengths', () => {
    expect(shape(en)).toEqual(shape(es));
  });
  it('projects keep the same ids and palettes in both languages', () => {
    expect(en.work.projects.map((p) => p.id)).toEqual(es.work.projects.map((p) => p.id));
    expect(en.work.projects.map((p) => p.palette.map((c) => c[1]))).toEqual(es.work.projects.map((p) => p.palette.map((c) => c[1])));
  });
  it('projects use the same images and layout in both languages', () => {
    const imgs = (d: typeof es) => d.work.projects.map((p) => JSON.stringify((p.blocks as { k: string; src?: string; span: number }[]).map((b) => [b.k, b.src, b.span])));
    expect(imgs(en)).toEqual(imgs(es));
  });
  it('concept projects are labelled as such in both languages', () => {
    const tagged = (d: typeof es) => d.work.projects.map((p) => Boolean(p.tag));
    expect(tagged(en)).toEqual(tagged(es));
    expect(es.work.projects.find((p) => p.id === 'walkingtime')?.tag).toMatch(/concepto/i);
    expect(en.work.projects.find((p) => p.id === 'walkingtime')?.tag).toMatch(/concept/i);
  });
});
