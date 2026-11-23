import type { ReactNode } from 'react';
import { C, INK, M, Y, alpha } from '@/lib/palette';

// Print marks shared by every section: registration target, crop marks, CMYK colour bar.

export function RegMark({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}

export function CropMarks() {
  return (
    <span className="crop" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

// C, M, Y, K, then the same at half, and two tints of K: a press sheet's control strip
const bar = (k: string) => [C, M, Y, k, alpha(C, 0.5), alpha(M, 0.5), alpha(Y, 0.5), alpha(k, 0.5), alpha(k, 0.25), alpha(k, 0.1)];
const BAR = bar(INK);
const BAR_DARK = bar('#EEE8DE');

export function ColorBar({ className, dark }: { className?: string; dark?: boolean }) {
  return (
    <span className={`colorbar ${className ?? ''}`} aria-hidden="true">
      {(dark ? BAR_DARK : BAR).map((c, i) => <span key={i} style={{ background: c }} />)}
    </span>
  );
}

// "02 — Historia" with the registration target
export function SectionLabel({ n, text }: { n: string; text: string }) {
  return (
    <p className="label">
      <RegMark />
      <span className="n">{n}</span>
      <span>{text}</span>
    </p>
  );
}

// Big titles that rise line by line (split on \n); `after` rides at the end of the last line (a count, a mark)
export function Lines({ text, as: Tag = 'h2', className, after }: { text: string; as?: 'h1' | 'h2' | 'p'; className?: string; after?: ReactNode }) {
  const lines = text.split('\n');
  return (
    <Tag className={`lines ${className ?? ''}`} data-lines>
      {lines.map((l, i) => (
        <span className="ln" key={i} style={{ ['--i' as string]: i }}>
          <span>{l}{i === lines.length - 1 && after}</span>
        </span>
      ))}
    </Tag>
  );
}
