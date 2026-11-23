// Fixed (non-text) data per project: the texts live in messages/{es,en}.json (work.projects).
// bg/fg = background and ink of the project sheet; cover = image for the list and the hover preview.
export type Pair = [string, string];

export const PROJECT_META: Record<string, { bg: string; fg: string; accent: string; cover: { src: string; pos: string }; tools: string[] }> = {
  velmar: { bg: '#F4F3EF', fg: '#4A503C', accent: '#A7A19E', cover: { src: 'velmar_spray.jpg', pos: '50% 78%' }, tools: [] },
  cremabis: { bg: '#FEF8EC', fg: '#2B4D1B', accent: '#657F36', cover: { src: 'crema_jar_box.jpg', pos: '50% 50%' }, tools: [] },
  criptadulce: { bg: '#FEE7D5', fg: '#3C1A10', accent: '#710819', cover: { src: 'cripta1.jpg', pos: '70% 50%' }, tools: ['Figma'] },
  walkingtime: { bg: '#ABE6E9', fg: '#1B2B3A', accent: '#EEC30E', cover: { src: 'walk4.jpg', pos: '50% 40%' }, tools: ['Figma'] },
  juicy: { bg: '#F3C2FE', fg: '#2A1830', accent: '#DD7A96', cover: { src: 'juicy7.jpg', pos: '50% 50%' }, tools: ['Figma'] },
};

type Base = { span: 4 | 6 | 8 | 12 };
export type Block =
  | (Base & { k: 'img'; src: string; ar: string; fit: 'cover' | 'contain'; pos?: string; bg: string; pad?: string; cap: string; alt: string })
  | (Base & { k: 'logo'; src: string; bg: string; fg: string; ar: string; w: string; label: string; alt: string })
  | (Base & { k: 'pal'; layout: 'v' | 'h' })
  | (Base & { k: 'type'; bg: string; fg: string; role: string; face: string; sample?: string; samplebg?: string; sampleLabel?: string; sampleAlt?: string })
  | (Base & { k: 'phones'; bg: string; items: { src: string; cap: string }[] })
  | (Base & { k: 'text'; title: string; items: string[] });

export const FACE_CSS: Record<string, string> = {
  Poppins: 'var(--font-poppins), sans-serif',
};
