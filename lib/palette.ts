// The site's inks, for drawings and inline styles. app/globals.css repeats them as CSS tokens: keep both in step.
// Warm black and warm paper (a print shop, not a screen), process CMY tuned to sit on that paper,
// one magenta as the light: deep on paper, soft on ink.
export const INK = '#13110F';
export const INK_2 = '#1C1916';
export const PAPER = '#EDE8DF';
export const C = '#1A9BD7';
export const M = '#D10A6E';
export const Y = '#F7D417';
export const M_DEEP = '#A0065A';
export const M_LIGHT = '#EE7FA8';

// "#RRGGBB" + alpha → "rgb(r g b / a)"
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${a})`;
};
