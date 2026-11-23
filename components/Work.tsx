'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { gsap, reducedMotion } from '@/lib/gsap';
import type { Dict } from '@/lib/i18n';
import { PROJECT_META, type Block, type Pair } from '@/content/work';
import { Brandboard } from './Brandboard';
import { CardArt, CoverImg } from './Cover';
import { Lines, RegMark, SectionLabel } from './print';
import './work.css';

const nn = (n: number) => String(n).padStart(2, '0');

export function Work({ t }: { t: Dict['work'] }) {
  const list = t.projects;
  const gallery = useRef<HTMLOListElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(0);

  // depth: inside each card the layers drift at their own speed while it crosses the screen (motion allowed only)
  useEffect(() => {
    const root = gallery.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('.wk-media').forEach((m) => {
        m.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
          const d = parseFloat(el.dataset.depth || '1');
          gsap.fromTo(el, { yPercent: -5 * d }, { yPercent: 5 * d, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });
    });
    return () => mm.revert();
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
          <div>
            <SectionLabel n="01" text={t.label} />
            <Lines text={t.title} className="display h-sec" after={<> <sup className="work-count" aria-hidden="true">({nn(list.length)})</sup></>} />
          </div>
          <p className="lead" data-reveal>{t.lead}</p>
        </header>

        <ol className="wk-grid" ref={gallery}>
          {list.map((w, i) => {
            const m = PROJECT_META[w.id];
            return (
              <li key={w.id} className={`wk-card is-${m.size}${m.shift ? ' is-shift' : ''}`}>
                <button type="button" className="wk-link" data-cursor="view" aria-haspopup="dialog" onClick={(e) => show(i, e.currentTarget, e)}>
                  <span className="wk-media" data-reveal="clip" aria-hidden="true">
                    <span className="wk-zoom"><CardArt c={m.card} /></span>
                  </span>
                  <span className="wk-info" data-reveal>
                    <span className="wk-i">{nn(i + 1)}</span>
                    <span className="wk-name display">{w.name}</span>
                    <span className="wk-meta">
                      <span>{w.discipline}</span>
                      <span aria-hidden="true">·</span>
                      <span>{w.client}</span>
                      {w.tag && <span className="wk-tag">{w.tag}</span>}
                    </span>
                    <span className="wk-sw" aria-hidden="true">{w.palette.map(([, hex]) => <i key={hex} style={{ background: hex }} />)}</span>
                    <span className="wk-go"><span className="sr-only">{t.open}</span><span aria-hidden="true">→</span></span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
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
