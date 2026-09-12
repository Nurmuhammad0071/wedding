import { wedding } from '../config/wedding';

function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Builds and downloads an .ics file so guests can save the date. */
export function downloadICS() {
  const start = new Date(wedding.dateISO);
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);
  const title = `${wedding.groom.first} & ${wedding.bride.first} — To‘y`;
  const location = `${wedding.venue.name}, ${wedding.venue.address}`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}@wedding-invitation`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${wedding.text.reception}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${wedding.groom.first}-${wedding.bride.first}-toy.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
