'use client';
import { useEffect, useRef } from 'react';
import { gsap, finePointer, reducedMotion } from '@/lib/gsap';

// A registration-mark cursor for mice and trackpads. Grows on links; on a project it reads «Ver».
export function Cursor({ view }: { view: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;
    document.documentElement.classList.add('has-cursor');
    const dot = el.querySelector<HTMLElement>('.cursor-dot')!, ring = el.querySelector<HTMLElement>('.cursor-ring')!;
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'expo.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'expo.out' });
    let px = -1, py = -1, raf = 0;
    const read = (t: Element | null) => {
      el.classList.toggle('is-view', !!t?.closest('[data-cursor="view"]'));
      el.classList.toggle('is-link', !!t?.closest('a, button, [role="button"], label'));
    };
    const move = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY;
      dx(px); dy(py); rx(px); ry(py);
      read(e.target as Element | null);
      el.classList.remove('is-hidden');
    };
    // the page can slide under a still pointer: read what is under it again
    const scroll = () => {
      if (raf || px < 0) return;
      raf = requestAnimationFrame(() => { raf = 0; read(document.elementFromPoint(px, py)); });
    };
    const leave = () => el.classList.add('is-hidden');
    addEventListener('pointermove', move, { passive: true });
    addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      removeEventListener('pointermove', move);
      removeEventListener('scroll', scroll);
      cancelAnimationFrame(raf);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return (
    <div className="cursor is-hidden" ref={ref} aria-hidden="true">
      <div className="cursor-dot" />
      <div className="cursor-ring"><span>{view}</span></div>
    </div>
  );
}
