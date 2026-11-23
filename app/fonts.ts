import { Bodoni_Moda, DM_Mono, Hanken_Grotesk, Poppins } from 'next/font/google';

// Self-hosted at build time by next/font: the visitor's browser never asks Google.
export const fontDisplay = Bodoni_Moda({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['opsz'], variable: '--font-display', display: 'swap' });
export const fontSans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
export const fontMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
// Poppins is only the typeface of two projects' interfaces (Cripta Dulce, Juicy): it shows in their type panel.
export const fontPoppins = Poppins({ subsets: ['latin'], weight: ['600'], variable: '--font-poppins', display: 'swap' });
