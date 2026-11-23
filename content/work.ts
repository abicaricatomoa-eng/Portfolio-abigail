// Fixed (non-text) data per project: the texts and the brand-board blocks live in messages/{es,en}.json (work.projects).
// bg/fg = paper and ink of the project sheet; cover = small image (marquee, "next project" card);
// card = the composition shown in the work gallery, size = its place on the 12-column sheet, shift = drops it lower.
export type Pair = [string, string];

export type Cover = { src: string; pos?: string; fit?: 'cover' | 'contain'; bg?: string; pad?: string; blend?: 'multiply' };

export type Card =
  | { kind: 'photo'; src: string; pos?: string; bg?: string; blend?: 'multiply' }
  | { kind: 'browser'; src: string; bg: string }
  | { kind: 'phones'; srcs: [string, string, string]; bg: string }
  | { kind: 'device'; src: string; bg: string };

type Meta = { bg: string; fg: string; cover: Cover; card: Card; size: 'tall' | 'wide' | 'full'; shift?: boolean; tools: string[] };

export const PROJECT_META: Record<string, Meta> = {
  velmar: {
    bg: '#F4F3EF', fg: '#4A503C', tools: [],
    cover: { src: 'velmar_spray.jpg', pos: '50% 62%' },
    card: { kind: 'photo', src: 'velmar_spray.jpg', pos: '50% 58%' }, size: 'tall',
  },
  cremabis: {
    bg: '#FEF8EC', fg: '#2B4D1B', tools: [],
    cover: { src: 'crema_jar_box.jpg', pos: '42% 50%', bg: '#F7EEDB', blend: 'multiply' },
    card: { kind: 'photo', src: 'crema_jar_box.jpg', pos: '50% 50%', bg: '#F2E9D6', blend: 'multiply' }, size: 'wide', shift: true,
  },
  criptadulce: {
    bg: '#FEE7D5', fg: '#3C1A10', tools: ['Figma'],
    cover: { src: 'cripta1.jpg', pos: '70% 50%' },
    card: { kind: 'browser', src: 'cripta1.jpg', bg: 'radial-gradient(120% 100% at 50% 0%, #5E1822 0%, #3D1116 48%, #1E0E0C 100%)' }, size: 'full',
  },
  walkingtime: {
    bg: '#ABE6E9', fg: '#1B2B3A', tools: ['Figma'],
    cover: { src: 'walk4.webp', fit: 'contain', bg: 'linear-gradient(180deg, #D6E9E8, #A3CACF)', pad: '9%' },
    card: { kind: 'phones', srcs: ['walk1.webp', 'walk4.webp', 'walk5.webp'], bg: 'radial-gradient(120% 100% at 30% 0%, #E4EFEC 0%, #C6DEDD 52%, #A3CACF 100%)' }, size: 'tall',
  },
  juicy: {
    bg: '#F3C2FE', fg: '#2A1830', tools: ['Figma'],
    cover: { src: 'juicy7.jpg', pos: '50% 50%' },
    card: { kind: 'device', src: 'juicy6.webp', bg: 'radial-gradient(120% 100% at 30% 0%, #F3E5E4 0%, #E6CBD0 50%, #D2A9B5 100%)' }, size: 'wide', shift: true,
  },
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
