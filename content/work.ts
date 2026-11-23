// Fixed (non-text) data per project: the texts and the brand-board blocks live in messages/{es,en}.json (work.projects).
// bg/fg = paper and ink of the project sheet; cover = image for the list, the hover preview and the "next project" card.
export type Pair = [string, string];

export type Cover = { src: string; pos?: string; fit?: 'cover' | 'contain'; bg?: string; pad?: string; blend?: 'multiply' };

export const PROJECT_META: Record<string, { bg: string; fg: string; cover: Cover; tools: string[] }> = {
  velmar: { bg: '#F4F3EF', fg: '#4A503C', cover: { src: 'velmar_spray.jpg', pos: '50% 62%' }, tools: [] },
  cremabis: { bg: '#FEF8EC', fg: '#2B4D1B', cover: { src: 'crema_jar_box.jpg', pos: '42% 50%', bg: '#F7EEDB', blend: 'multiply' }, tools: [] },
  criptadulce: { bg: '#FEE7D5', fg: '#3C1A10', cover: { src: 'cripta1.jpg', pos: '70% 50%' }, tools: ['Figma'] },
  walkingtime: { bg: '#ABE6E9', fg: '#1B2B3A', cover: { src: 'walk4.webp', fit: 'contain', bg: 'linear-gradient(180deg, #ABE6E9, #72D7FF)', pad: '9%' }, tools: ['Figma'] },
  juicy: { bg: '#F3C2FE', fg: '#2A1830', cover: { src: 'juicy7.jpg', pos: '50% 50%' }, tools: ['Figma'] },
};

type Base = { span: 4 | 6 | 8 | 12 };
export type Block =
  // frame: draws a browser window around a website capture; blend: multiply melts a white studio backdrop into the panel
  | (Base & { k: 'img'; src: string; ar: string; fit: 'cover' | 'contain'; pos?: string; bg: string; pad?: string; frame?: 'browser'; blend?: 'multiply'; cap: string; alt: string })
  | (Base & { k: 'logo'; src: string; bg: string; fg: string; ar: string; w: string; label: string; alt: string })
  | (Base & { k: 'pal'; layout: 'v' | 'h' })
  | (Base & { k: 'type'; bg: string; fg: string; role: string; face: string; sample?: string; samplebg?: string; sampleLabel?: string; sampleAlt?: string })
  | (Base & { k: 'phones'; bg: string; items: { src: string; cap: string }[] })
  | (Base & { k: 'text'; title: string; items: string[] });

export const FACE_CSS: Record<string, string> = {
  Poppins: 'var(--font-poppins), sans-serif',
};

// "#4A503C" → "74 80 60"
export const rgb = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(' ');
};
