import { notFound } from 'next/navigation';
import { getDict, isLocale, locales } from '@/lib/i18n';
import { Chrome } from '@/components/Chrome';
import { Loader } from '@/components/Loader';
import { Cursor } from '@/components/Cursor';
import { Reveals } from '@/components/Reveals';
import { Magnetic } from '@/components/Magnetic';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { Story } from '@/components/Story';
import { Work } from '@/components/Work';
import { Tools } from '@/components/Tools';
import { Contact, Footer, Manifesto, Process } from '@/components/Sections';
import '@/components/sections.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  return (
    <>
      <Loader label={t.loader.label} ready={t.loader.ready} />
      <Chrome t={t.nav} locale={locale} />
      <main id="contenido">
        <Hero t={t.hero} />
        <Marquee items={t.marquee} />
        <Work t={t.work} />
        <Story t={t.story} demo={t.tools.demo} />
        <Process t={t.process} />
        <Tools t={t.tools} />
        <Manifesto t={t.manifesto} />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} name={[t.hero.first, t.hero.last]} />
      <Cursor view={t.work.open.split(' ')[0]} />
      <Magnetic />
      <Reveals />
    </>
  );
}
