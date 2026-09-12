import { useEffect, useState } from 'react';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function compute(target: number): Countdown {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff <= 0,
  };
}

/** Real-time countdown to an ISO date. Ticks once a second, aligned to the clock. */
export function useCountdown(targetISO: string): Countdown {
  const target = new Date(targetISO).getTime();
  const [state, setState] = useState(() => compute(target));

  useEffect(() => {
    let id: number;
    const tick = () => {
      const next = compute(target);
      setState(next);
      if (!next.done) id = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    return () => window.clearTimeout(id);
  }, [target]);

  return state;
}
