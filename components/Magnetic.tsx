'use client';
import { useEffect } from 'react';
import { gsap, finePointer, reducedMotion } from '@/lib/gsap';

// Controls marked data-magnetic lean toward a mouse or trackpad pointer and settle back when it leaves.
export function Magnetic() {
  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const offs = [...document.querySelectorAll<HTMLElement>('[data-magnetic]')].map((el) => {
      const qx = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'expo.out' });
      const qy = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'expo.out' });
      const k = parseFloat(el.dataset.magnetic || '') || 0.3;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const ox = Number(gsap.getProperty(el, 'x')), oy = Number(gsap.getProperty(el, 'y'));
        qx((e.clientX - (r.left - ox + r.width / 2)) * k);
        qy((e.clientY - (r.top - oy + r.height / 2)) * k);
      };
      const leave = () => { qx(0); qy(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.set(el, { clearProps: 'transform' });
      };
    });
    return () => offs.forEach((off) => off());
  }, []);
  return null;
}
