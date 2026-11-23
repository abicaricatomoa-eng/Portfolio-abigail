'use client';
import { useRef } from 'react';
import { useInView } from '@/lib/useInView';
import { PROJECT_META } from '@/content/work';
import { CoverImg } from './Cover';

const COVERS = Object.values(PROJECT_META).map((m) => m.cover);

// The disciplines run like a press sheet through the rollers, with a proof of each project between them; only while visible.
export function Marquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const run = useInView(ref);
  const row = (hidden?: boolean) => (
    <ul className="mq-row" aria-hidden={hidden || undefined}>
      {items.map((x, i) => (
        <li key={x}>
          <span>{x}</span>
          <span className="mq-pic" aria-hidden="true"><CoverImg c={COVERS[i % COVERS.length]} /></span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mq on-ink" data-hdr="ink" ref={ref} data-run={run ? '1' : undefined}>
      <div className="mq-track">{row()}{row(true)}</div>
    </div>
  );
}
