import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { wedding } from './config/wedding';
import { MusicProvider } from './components/music/MusicContext';
import { MusicPlayer } from './components/music/MusicPlayer';
import { Card } from './components/layout/Card';
import { Divider } from './components/decor/Divider';
import { Floral } from './components/decor/Floral';
import { Cover } from './components/sections/Cover';
import { Hero } from './components/sections/Hero';
import { Couple } from './components/sections/Couple';
import { Invitation } from './components/sections/Invitation';
import { Countdown } from './components/sections/Countdown';
import { Venue } from './components/sections/Venue';
import { Rsvp } from './components/sections/Rsvp';
import { Final } from './components/sections/Final';
import styles from './App.module.css';

export default function App() {
  // `?nocover` skips the envelope (handy for previews / link sharing)
  const skipCover = !wedding.cover.enabled || window.location.search.includes('nocover');
  const [opened, setOpened] = useState(skipCover);

  // Deep links (/#rsvp) — the browser's native jump fires before React renders.
  useEffect(() => {
    if (!opened || !window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    el?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [opened]);

  return (
    <MusicProvider>
      <AnimatePresence>{!opened && <Cover key="cover" onOpen={() => setOpened(true)} />}</AnimatePresence>

      <main className="page">
        {/* 1 — the invitation card (reference) */}
        <Hero active={opened} />

        {/* 2 — the details card */}
        <Card
          id="details"
          flourishes={['tr', 'bl']}
          decor={
            <Floral
              kind="b"
              width="clamp(90px, 24vw, 190px)"
              flipX
              style={{ top: '34%', left: '-2%' }}
              parallax={26}
            />
          }
        >
          <div className={styles.stack}>
            <Couple />
            <Divider />
            <Invitation />
            <Divider />
            <Countdown />
          </div>
        </Card>

        {/* 3 — the celebration card */}
        <Card
          flourishes={['tl', 'tr']}
          decor={
            <Floral
              kind="a"
              width="clamp(120px, 34vw, 250px)"
              flipX
              flipY
              style={{ bottom: '-2%', right: '-3%' }}
              parallax={18}
            />
          }
        >
          <Venue />
        </Card>

        {/* 4 — reply card */}
        <Card flourishes={['tl', 'br']}>
          <Rsvp />
        </Card>

        {/* 6 — closing card */}
        <Final />

        <footer className={styles.footer}>
          <span className="small-caps">
            {wedding.groom.first} &amp; {wedding.bride.first} · {new Date(wedding.dateISO).getFullYear()}
          </span>
        </footer>
      </main>

      <MusicPlayer visible={opened} />
    </MusicProvider>
  );
}
