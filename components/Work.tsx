'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { gsap, finePointer, reducedMotion } from '@/lib/gsap';
import type { Dict } from '@/lib/i18n';
import { asset } from '@/lib/site';
import { PROJECT_META, type Block, type Cover, type Pair } from '@/content/work';
import { Brandboard } from './Brandboard';
import { Lines, RegMark, SectionLabel } from './print';
import './work.css';

const nn = (n: number) => String(n).padStart(2, '0');

function CoverImg({ c, lazy = true }: { c: Cover; lazy?: boolean }) {
  return (
    <span className="cover" style={{ background: c.bg, padding: c.pad }}>
      <img src={asset(`/trabajo/${c.src}`)} alt="" loading={lazy ? 'lazy' : undefined} decoding="async" style={{ objectFit: c.fit ?? 'cover', objectPosition: c.pos ?? '50% 50%', mixBlendMode: c.blend }} />
    </span>
  );
}

export function Work({ t }: { t: Dict['work'] }) {
  const list = t.projects;
  const preview = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(0);

  // the preview card follows the pointer and leans with its speed
  useEffect(() => {
    const el = preview.current;
    if (!el || !finePointer()) return;
    const qx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'expo.out' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'expo.out' });
    const qr = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'expo.out' });
    let lx = 0;
    const move = (e: PointerEvent) => {
      qx(e.clientX + 32); qy(e.clientY - 180);
      if (!reducedMotion()) qr(gsap.utils.clamp(-7, 7, (e.clientX - lx) * 0.4));
      lx = e.clientX;
    };
    addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);

  const enter = (d: HTMLDialogElement, delay = 0) =>
    gsap.fromTo(d.querySelectorAll('[data-case]'), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay });

  const show = (i: number, from: HTMLButtonElement, e?: React.MouseEvent) => {
    const d = dlg.current;
    if (!d) return;
    opener.current = from;
    flushSync(() => setOpen(i));
    d.showModal();
    d.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    if (reducedMotion()) return;
    const r = from.getBoundingClientRect();
    const x = e?.clientX || r.left + r.width / 2, y = e?.clientY || r.top + r.height / 2;
    gsap.fromTo(d, { clipPath: `circle(0% at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 1.1, ease: 'expo.inOut', clearProps: 'clipPath' });
    enter(d, 0.45);
  };

  const hide = () => {
    const d = dlg.current;
    if (!d) return;
    tl.current?.kill();
    tl.current = null;
    const done = () => {
      d.close();
      gsap.set(d, { clearProps: 'clipPath' });
      if (wipe.current) gsap.set(wipe.current, { clearProps: 'clipPath' });
      document.documentElement.style.overflow = '';
      opener.current?.focus();
    };
    if (reducedMotion()) return done();
    gsap.to(d, { clipPath: 'circle(0% at 50% 50%)', duration: 0.8, ease: 'expo.inOut', onComplete: done });
  };

  // next / previous: a sheet in the next project's colour wipes across, the new sheet is printed under it
  const step = (dir: 1 | -1) => {
    const next = (open + dir + list.length) % list.length;
    const d = dlg.current, w = wipe.current;
    const land = () => {
      flushSync(() => setOpen(next));
      if (d) d.scrollTop = 0;
      title.current?.focus({ preventScroll: true });
    };
    if (!d || !w || reducedMotion()) return land();
    if (tl.current?.isActive()) return;
    const [from, to] = dir > 0 ? ['inset(100% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'] : ['inset(0% 0% 100% 0%)', 'inset(100% 0% 0% 0%)'];
    w.style.background = PROJECT_META[list[next].id].bg;
    tl.current = gsap.timeline()
      .fromTo(w, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
      .add(() => { land(); enter(d, 0.3); })
      .to(w, { clipPath: to, duration: 0.85, ease: 'expo.inOut' });
  };

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const cancel = (e: Event) => { e.preventDefault(); hide(); };
    d.addEventListener('cancel', cancel);
    return () => d.removeEventListener('cancel', cancel);
  });

  const p = list[open];
  const meta = PROJECT_META[p.id];
  const prev = list[(open - 1 + list.length) % list.length];
  const nxt = list[(open + 1) % list.length];
  const nmeta = PROJECT_META[nxt.id];

  return (
    <section id="trabajo" className="work sec on-paper" data-hdr="paper">
      <div className="wrap">
        <header className="work-head">
          <SectionLabel n="02" text={t.label} />
          <Lines text={t.title} className="display h-sec" />
          <p className="lead" data-reveal>{t.lead}</p>
        </header>

        <ol className="wk-list" onMouseLeave={() => setHover(-1)}>
          {list.map((w, i) => (
            <li key={w.id} data-reveal style={{ ['--d' as string]: `${i * 0.05}s` }}>
              <button
                type="button" className="wk-row" data-cursor="view" aria-haspopup="dialog"
                onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)}
                onClick={(e) => show(i, e.currentTarget, e)}
              >
                <span className="wk-i">{nn(i + 1)}</span>
                <span className="wk-thumb" aria-hidden="true"><CoverImg c={PROJECT_META[w.id].cover} /></span>
                <span className="wk-name display">{w.name}</span>
                <span className="wk-meta">
                  <span>{w.discipline}</span>
                  <span>{w.client}</span>
                  {w.tag && <span className="wk-tag">{w.tag}</span>}
                  <span className="wk-sw" aria-hidden="true">{w.palette.map(([, hex]) => <i key={hex} style={{ background: hex }} />)}</span>
                </span>
                <span className="wk-go"><span className="sr-only">{t.open}</span><span aria-hidden="true">→</span></span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className={`wk-preview${hover >= 0 ? ' is-on' : ''}`} ref={preview} aria-hidden="true">
        {list.map((w, i) => (
          <div key={w.id} className={`wk-pv${i === hover ? ' is-active' : ''}`}><CoverImg c={PROJECT_META[w.id].cover} /></div>
        ))}
      </div>

      <dialog ref={dlg} className="case" aria-labelledby="case-title" style={{ ['--cbg' as string]: meta.bg, ['--cfg' as string]: meta.fg } as CSSProperties}>
        <div className="case-bar">
          <p className="case-count">
            <RegMark size={16} />
            <span className="case-sec">{t.label}</span>
            <span>{nn(open + 1)} <span className="case-of">/ {nn(list.length)}</span></span>
          </p>
          <span className="case-swatches" aria-hidden="true">{p.palette.map(([, hex]) => <i key={hex} style={{ background: hex }} />)}</span>
          <button type="button" className="case-close" onClick={hide}>{t.close} <span aria-hidden="true">✕</span></button>
          <span className="case-progress" aria-hidden="true" />
        </div>

        <div className="case-in">
          <header className="case-head">
            <p className="case-kicker" data-case>
              <span>{p.discipline}</span><span aria-hidden="true">—</span><span>{p.client}</span>
              {p.tag && <span className="case-badge">{p.tag}</span>}
            </p>
            <h3 id="case-title" ref={title} tabIndex={-1} className="case-name display" data-case>{p.name}</h3>
          </header>

          <div className="case-intro" data-case>
            <dl className="case-story">
              <div><dt>{t.fields.brief}</dt><dd className="case-brief">{p.brief}</dd></div>
              <div><dt>{t.fields.idea}</dt><dd className="case-idea">{p.idea}</dd></div>
            </dl>
            <dl className="case-meta">
              <div><dt>{t.fields.deliverables}</dt><dd><ul>{p.deliverables.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
              {meta.tools.length > 0 && <div><dt>{t.fields.tools}</dt><dd><ul>{meta.tools.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>}
              {p.note && <div><dt>{t.fields.note}</dt><dd>{p.note}</dd></div>}
            </dl>
          </div>

          <div className="case-board" data-case>
            <Brandboard name={p.name} blocks={p.blocks as unknown as Block[]} palette={p.palette as Pair[]} t={t} />
          </div>

          <nav className="case-nav" aria-label={t.label}>
            <button
              type="button" className="case-next" data-cursor="view" onClick={() => step(1)}
              style={{ ['--nbg' as string]: nmeta.bg, ['--nfg' as string]: nmeta.fg } as CSSProperties}
            >
              <span className="case-next-txt">
                <span className="case-next-lbl">{t.nextProject} <span aria-hidden="true">→</span></span>
                <b className="display">{nxt.name}</b>
                <span className="case-next-sub">{nxt.discipline}</span>
              </span>
              <span className="case-next-img" aria-hidden="true"><CoverImg c={nmeta.cover} /></span>
            </button>
            <button type="button" className="case-prev" onClick={() => step(-1)}>
              <span aria-hidden="true">←</span> {t.prev} <b>{prev.name}</b>
            </button>
          </nav>
        </div>
        <div className="case-wipe" ref={wipe} aria-hidden="true" />
      </dialog>
    </section>
  );
}
