import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { wedding } from '../../config/wedding';

interface MusicState {
  playing: boolean;
  /** false when the audio file is missing / unsupported */
  available: boolean;
  toggle: () => void;
  /** Start playback from a user gesture (cover tap). Silently no-ops if blocked. */
  start: () => void;
}

const Ctx = createContext<MusicState | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(wedding.music.enabled);

  useEffect(() => {
    if (!wedding.music.enabled) return;
    const audio = new Audio(wedding.music.src);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
    audioRef.current = audio;

    const onError = () => setAvailable(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Pause when the tab is hidden — polite on mobile.
    const onVis = () => {
      if (document.hidden && !audio.paused) audio.pause();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      audio.pause();
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVis);
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((target: number, ms = 900) => {
    const audio = audioRef.current;
    if (!audio) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const from = audio.volume;
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / ms);
        audio.volume = from + (target - from) * p;
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }, []);

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    audio.volume = 0;
    audio
      .play()
      .then(() => fadeTo(0.55, 1800))
      .catch(() => {
        /* autoplay blocked or file missing — user can use the player */
      });
  }, [available, fadeTo]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (audio.paused) {
      audio.volume = 0;
      audio
        .play()
        .then(() => fadeTo(0.55, 700))
        .catch(() => setAvailable(false));
    } else {
      fadeTo(0, 400).then(() => audio.pause());
    }
  }, [available, fadeTo]);

  const value = useMemo(() => ({ playing, available, toggle, start }), [playing, available, toggle, start]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMusic(): MusicState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMusic must be used inside <MusicProvider>');
  return v;
}
