import { asset } from '@/lib/site';
import type { Card, Cover } from '@/content/work';

const src = (n: string) => asset(`/trabajo/${n}`);

// A small cover: marquee pills and the "next project" card.
export function CoverImg({ c, lazy = true }: { c: Cover; lazy?: boolean }) {
  return (
    <span className="cover" style={{ background: c.bg, padding: c.pad }}>
      <img src={src(c.src)} alt="" loading={lazy ? 'lazy' : undefined} decoding="async" style={{ objectFit: c.fit ?? 'cover', objectPosition: c.pos ?? '50% 50%', mixBlendMode: c.blend }} />
    </span>
  );
}

// The gallery composition of a project. Layers marked data-depth drift at their own speed while the card scrolls past.
export function CardArt({ c }: { c: Card }) {
  switch (c.kind) {
    case 'photo':
      return (
        <span className="ca ca-photo" style={{ background: c.bg }}>
          <img data-depth="1" src={src(c.src)} alt="" loading="lazy" decoding="async" style={{ objectPosition: c.pos ?? '50% 50%', mixBlendMode: c.blend }} />
        </span>
      );
    case 'browser':
      return (
        <span className="ca ca-browser" style={{ background: c.bg }}>
          <span className="ca-win" data-depth="1.4">
            <span className="ca-bar"><i /><i /><i /><b /></span>
            <img src={src(c.src)} alt="" loading="lazy" decoding="async" />
          </span>
        </span>
      );
    case 'phones':
      return (
        <span className="ca ca-phones" style={{ background: c.bg }}>
          {c.srcs.map((s, i) => (
            <span key={s} className={`ca-phone ca-phone-${i}`}>
              <img data-depth={[0.8, 2.4, 1.4][i]} src={src(s)} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </span>
      );
    case 'device':
      return (
        <span className="ca ca-device" style={{ background: c.bg }}>
          <img data-depth="1.4" src={src(c.src)} alt="" loading="lazy" decoding="async" />
        </span>
      );
  }
}
