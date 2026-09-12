import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Stagger, Item } from '../motion/Reveal';
import { Button } from '../ui/Button';
import styles from './Rsvp.module.css';

type Attendance = 'yes' | 'no' | null;
type Status = 'idle' | 'sending' | 'done' | 'error';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Rsvp() {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState<Attendance>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim().length < 2;
  const attendError = touched && attending === null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (name.trim().length < 2 || attending === null) return;

    setStatus('sending');
    const payload = { name: name.trim(), attending, guests: attending === 'yes' ? guests : 0, message: message.trim() };

    try {
      if (wedding.rsvp.endpoint) {
        const res = await fetch(wedding.rsvp.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.ok === false) throw new Error(data.error || String(res.status));
      } else {
        // Demo mode — no endpoint configured yet.
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section id="rsvp" eyebrow={wedding.text.rsvpEyebrow} title={wedding.text.rsvpTitle}>
      <div className={styles.frame}>
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div
              key="done"
              className={styles.done}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              role="status"
            >
              <svg viewBox="0 0 64 64" className={styles.check} aria-hidden="true">
                <motion.circle
                  cx="32"
                  cy="32"
                  r="29"
                  fill="none"
                  stroke="var(--blush-deep)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: EASE }}
                />
                <motion.path
                  d="M20 33.5 28.5 42 45 24"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                />
              </svg>
              <p className={`script ${styles.doneTitle}`}>
                {wedding.rsvpCopy.thanks}, {name.trim().split(' ')[0]}
              </p>
              <p className={styles.doneText}>
                {attending === 'yes'
                  ? guests > 1
                    ? wedding.rsvpCopy.yesMany(guests)
                    : wedding.rsvpCopy.yesOne
                  : wedding.rsvpCopy.decline}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className={styles.form}
              onSubmit={submit}
              noValidate
              exit={{ opacity: 0, y: -10, transition: { duration: 0.35 } }}
            >
              <Stagger stagger={0.1} amount={0.2} className={styles.fields}>
                <Item className={styles.field}>
                  <label className={`small-caps ${styles.label}`} htmlFor="rsvp-name">
                    {wedding.rsvpCopy.name}
                  </label>
                  <input
                    id="rsvp-name"
                    className={`${styles.input} ${nameError ? styles.invalid : ''}`}
                    type="text"
                    autoComplete="name"
                    placeholder={wedding.rsvpCopy.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={nameError}
                    aria-describedby={nameError ? 'rsvp-name-err' : undefined}
                    required
                  />
                  {nameError && (
                    <span id="rsvp-name-err" className={styles.error}>
                      {wedding.rsvpCopy.nameError}
                    </span>
                  )}
                </Item>

                <Item className={styles.field}>
                  <span className={`small-caps ${styles.label}`} id="rsvp-attend-label">
                    {wedding.rsvpCopy.attend}
                  </span>
                  <div className={styles.choices} role="radiogroup" aria-labelledby="rsvp-attend-label">
                    <Choice
                      checked={attending === 'yes'}
                      onSelect={() => setAttending('yes')}
                      title={wedding.rsvpCopy.yesTitle}
                      sub={wedding.rsvpCopy.yesSub}
                    />
                    <Choice
                      checked={attending === 'no'}
                      onSelect={() => setAttending('no')}
                      title={wedding.rsvpCopy.noTitle}
                      sub={wedding.rsvpCopy.noSub}
                    />
                  </div>
                  {attendError && <span className={styles.error}>{wedding.rsvpCopy.attendError}</span>}
                </Item>

                <AnimatePresence initial={false}>
                  {attending === 'yes' && (
                    <motion.div
                      key="guests"
                      className={styles.field}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className={`small-caps ${styles.label}`} id="rsvp-guests-label">
                        {wedding.rsvpCopy.guests}
                      </span>
                      <div className={styles.stepper} role="group" aria-labelledby="rsvp-guests-label">
                        <button
                          type="button"
                          className={styles.step}
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          disabled={guests <= 1}
                          aria-label={wedding.rsvpCopy.fewer}
                        >
                          −
                        </button>
                        <span className={styles.count} aria-live="polite">
                          {guests}
                        </span>
                        <button
                          type="button"
                          className={styles.step}
                          onClick={() => setGuests((g) => Math.min(wedding.rsvp.maxGuests, g + 1))}
                          disabled={guests >= wedding.rsvp.maxGuests}
                          aria-label={wedding.rsvpCopy.more}
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Item className={styles.field}>
                  <label className={`small-caps ${styles.label}`} htmlFor="rsvp-msg">
                    {wedding.rsvpCopy.note} <span className={styles.optional}>{wedding.rsvpCopy.optional}</span>
                  </label>
                  <textarea
                    id="rsvp-msg"
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    placeholder={wedding.rsvpCopy.notePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Item>

                <Item className={styles.submitRow}>
                  <Button type="submit" disabled={status === 'sending'} className={styles.submit}>
                    {status === 'sending' ? wedding.rsvpCopy.sending : wedding.rsvpCopy.send}
                  </Button>
                  {status === 'error' && (
                    <span className={styles.error} role="alert">
                      {wedding.rsvpCopy.error}
                    </span>
                  )}
                </Item>
              </Stagger>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

function Choice({ checked, onSelect, title, sub }: { checked: boolean; onSelect: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      className={`${styles.choice} ${checked ? styles.choiceOn : ''}`}
      onClick={onSelect}
    >
      <span className={styles.radio} aria-hidden="true" />
      <span className={styles.choiceText}>
        <span className={styles.choiceTitle}>{title}</span>
        <span className={styles.choiceSub}>{sub}</span>
      </span>
    </button>
  );
}
