'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { asset } from '@/lib/site';
import { FACE_CSS, rgb, type Block, type Pair } from '@/content/work';

const src = (n: string) => asset(`/trabajo/${n}`);
const nn = (n: number) => String(n).padStart(2, '0');
const ALPHA = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890 @#$%&*()'];

export type BoardLabels = { palette: string; type: string; screens: string; copy: string; copied: string };
type Props = { name: string; blocks: Block[]; palette: Pair[]; t: BoardLabels };

// One project as a brand board: a 12-column sheet of figures (numbered like plates) and spec panels (palette, type, flow).
export function Brandboard({ name, blocks, palette, t }: Props) {
  const [copied, setCopied] = useState('');
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); } catch { return; }
    setCopied(hex);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(''), 1800);
  };

  let fig = 0;
  return (
    <div className="bb">
      {blocks.map((b, i) => {
        const span = `bb-c${b.span}`;
        switch (b.k) {
          case 'img': {
            const auto = b.ar === 'auto';
            return (
              <figure key={i} className={`bb-fig ${span}`}>
                <div className={`bb-media${b.frame ? ' is-browser' : ''}`} style={{ background: b.frame ? undefined : b.bg }}>
                  {b.frame && <span className="bb-bar" aria-hidden="true"><i /><i /><i /><span className="bb-url" /></span>}
                  <div className={`bb-shot${auto ? ' is-auto' : ''}`} style={{ aspectRatio: auto ? undefined : b.ar, padding: b.pad, background: b.frame ? b.bg : undefined }}>
                    <img src={src(b.src)} alt={b.alt} loading="lazy" decoding="async" style={{ objectFit: b.fit, objectPosition: b.pos ?? '50% 50%', mixBlendMode: b.blend }} />
                  </div>
                </div>
                <figcaption className="bb-cap"><span>{nn(++fig)}</span>{b.cap}</figcaption>
              </figure>
            );
          }
          case 'logo':
            return (
              <figure key={i} className={`bb-fig ${span}`}>
                <div className="bb-media bb-logo" style={{ background: b.bg, color: b.fg, ['--ar' as string]: b.ar } as CSSProperties}>
                  <img src={src(b.src)} alt={b.alt} loading="lazy" decoding="async" style={{ width: b.w }} />
                </div>
                <figcaption className="bb-cap"><span>{nn(++fig)}</span>{b.label}</figcaption>
              </figure>
            );
          case 'pal':
            return (
              <div key={i} className={`bb-spec bb-pal is-${b.layout} ${span}`}>
                <h4 className="bb-lbl">{t.palette}</h4>
                <ul style={{ ['--n' as string]: palette.length } as CSSProperties}>
                  {palette.map(([n, hex]) => (
                    <li key={hex}>
                      <button type="button" className={`bb-chip${copied === hex ? ' is-copied' : ''}`} onClick={() => copy(hex)}>
                        <span className="bb-sw" style={{ background: hex }} aria-hidden="true" />
                        <span className="bb-chip-txt">
                          <span className="sr-only">{t.copy} </span>
                          <b>{n}</b>
                          <code className="bb-hex"><span>{hex}</span><span aria-hidden="true">{t.copied}</span></code>
                          <code>RGB {rgb(hex)}</code>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="sr-only" aria-live="polite">{copied ? `${t.copied}: ${copied}` : ''}</p>
              </div>
            );
          case 'type': {
            const css = FACE_CSS[b.face] ?? 'inherit';
            return (
              <div key={i} className={`bb-spec bb-type ${span}`} style={{ background: b.bg, color: b.fg }}>
                <h4 className="bb-lbl">{t.type}</h4>
                <div className="bb-face" style={{ fontFamily: css }}>
                  <p className="bb-aa" aria-hidden="true">Aa</p>
                  <p className="bb-face-name">{b.face}</p>
                  <p className="bb-alpha">{ALPHA.map((l) => <span key={l}>{l}</span>)}</p>
                  <p className="bb-note">{b.role}</p>
                </div>
                {b.sample && (
                  <div className="bb-sample">
                    <img src={src(b.sample)} alt={b.sampleAlt ?? ''} loading="lazy" decoding="async" style={{ background: b.samplebg }} />
                    <p className="bb-note">{b.sampleLabel}</p>
                  </div>
                )}
              </div>
            );
          }
          case 'phones':
            return (
              // scrolls sideways on narrow screens, so it takes focus for keyboards
              <div key={i} className={`bb-phones ${span}`} style={{ background: b.bg }} role="region" aria-label={`${name} · ${t.screens}`} tabIndex={0}>
                <ul>
                  {b.items.map((it, j) => (
                    <li key={it.src}>
                      <figure>
                        <img src={src(it.src)} alt={`${name}: ${it.cap}`} loading="lazy" decoding="async" />
                        <figcaption className="bb-cap"><span>{nn(j + 1)}</span>{it.cap}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case 'text':
            return (
              <div key={i} className={`bb-spec bb-flow ${span}`}>
                <h4 className="bb-lbl">{b.title}</h4>
                <ol>{b.items.map((x, j) => <li key={x}><span aria-hidden="true">{nn(j + 1)}</span>{x}</li>)}</ol>
              </div>
            );
        }
      })}
    </div>
  );
}
