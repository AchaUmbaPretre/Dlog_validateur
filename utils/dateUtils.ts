import moment from 'moment';

export const formatDateSafe = (date?: string | null, format = 'DD-MM-YYYY HH:mm') => {
  if (!date) return '—';

  // Supprimer le Z si présent pour forcer local
  const dateLocal = date.endsWith('Z') ? date.slice(0, -1) : date;
  const m = moment(dateLocal, moment.ISO_8601, true);
  return m.isValid() ? m.format(format) : '—';
};
