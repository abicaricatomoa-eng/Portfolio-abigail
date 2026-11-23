import type { CSSProperties } from 'react';
import { asset } from '@/lib/site';
import { FACE_CSS, type Block, type Pair } from '@/content/work';

const src = (n: string) => asset(`/trabajo/${n}`);
const ALPHA = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890 @#$%&*()'];

type Props = { name: string; blocks: Block[]; palette: Pair[]; paletteLabel: string; typeLabel: string };

// One project as a brand board: a 12-column grid of images, palette, type and logo panels.
export function Brandboard({ name, blocks, palette, paletteLabel, typeLabel }: Props) {
  return (
    <div className="bb" role="group" aria-label={name}>
      <div className="bb-strip" aria-hidden="true">{[0, 1, 2, 3].map((i) => <span key={i}>{name}</span>)}</div>
      {blocks.map((b, i) => {
        const span = `bb-c${b.span}`;
        switch (b.k) {
          case 'img':
            return (
              <figure key={i} className={`bb-cell ${span}`} style={{ aspectRatio: b.ar === 'auto' ? undefined : b.ar, background: b.bg, padding: b.pad }}>
                <img src={src(b.src)} alt={b.alt} loading="lazy" decoding="async" style={{ objectFit: b.fit, objectPosition: b.pos ?? '50% 50%' }} />
                <figcaption className="bb-cap">{b.cap}</figcaption>
              </figure>
            );
          case 'logo':
            return (
              <div key={i} className={`bb-panel ${span}`} style={{ background: b.bg, color: b.fg }}>
                <h3 className="bb-lbl">{b.label}</h3>
                <img className="bb-logo-img" src={src(b.src)} alt={b.alt} loading="lazy" decoding="async" style={{ width: b.w }} />
              </div>
            );
          case 'pal':
            return (
              <div key={i} className={`bb-panel bb-pal bb-pal-${b.layout} ${span}`}>
                <h3 className="bb-lbl">{paletteLabel}</h3>
                <ul style={{ ['--n' as string]: palette.length } as CSSProperties}>
                  {palette.map(([n, hex]) => (
                    <li key={hex}><i className="bb-chip" style={{ background: hex }} /><span><b>{n}</b><code>{hex}</code></span></li>
                  ))}
                </ul>
              </div>
            );
          case 'type': {
            const css = FACE_CSS[b.face] ?? 'inherit';
            return (
              <div key={i} className={`bb-panel ${span}`} style={{ background: b.bg, color: b.fg }}>
                <h3 className="bb-lbl">{typeLabel}</h3>
                {b.sample && (
                  <>
                    <img className="bb-sample" src={src(b.sample)} alt={b.sampleAlt ?? ''} loading="lazy" decoding="async" style={{ background: b.samplebg }} />
                    <p className="bb-note">{b.sampleLabel}</p>
                  </>
                )}
                <div className="bb-face">
                  <div className="bb-aa" style={{ fontFamily: css }} aria-hidden="true">Aa</div>
                  <h4 style={{ fontFamily: css }}>{b.face}</h4>
                  <p style={{ fontFamily: css }}>{ALPHA.map((l) => <span key={l}>{l}</span>)}</p>
                  <p className="bb-note">{b.role}</p>
                </div>
              </div>
            );
          }
          case 'phones':
            return (
              <div key={i} className={`bb-panel bb-phones-wrap ${span}`} style={{ background: b.bg }}>
                <ul className="bb-phones">
                  {b.items.map((it) => (
                    <li key={it.src}>
                      <figure>
                        <img src={src(it.src)} alt={`${name}: ${it.cap}`} loading="lazy" decoding="async" />
                        <figcaption>{it.cap}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case 'text':
            return (
              <div key={i} className={`bb-panel bb-text ${span}`}>
                <h3 className="bb-lbl">{b.title}</h3>
                <ul>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            );
        }
      })}
    </div>
  );
}
