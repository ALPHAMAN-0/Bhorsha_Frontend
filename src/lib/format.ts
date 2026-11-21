/** Display helpers. The API sends money in Tk (two decimals) and times as ISO strings. */

const TIME_ZONE = 'Asia/Dhaka';

const tk = new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatTk(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : `Tk ${tk.format(value)}`;
}

export function formatKm(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} km`;
}

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: TIME_ZONE,
});

export function formatDateTime(iso: string | null | undefined): string {
  return iso ? dateTime.format(new Date(iso)) : '—';
}

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "in 5 minutes", "2 hours ago". */
export function formatRelative(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return '—';
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return relative.format(seconds, 'second');
  if (abs < 3600) return relative.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return relative.format(Math.round(seconds / 3600), 'hour');
  return relative.format(Math.round(seconds / 86400), 'day');
}

/** UNDER_REVIEW -> "Under review". */
export function humanize(value: string | null | undefined): string {
  if (!value) return '—';
  const words = value.toLowerCase().split('_');
  return [words[0].charAt(0).toUpperCase() + words[0].slice(1), ...words.slice(1)].join(' ');
}

export function formatPoint(point: { lat: number; lng: number } | null | undefined): string {
  return point ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : '—';
}
