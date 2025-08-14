import moment from 'moment';

export const formatDateSafe = (date?: string | null, format = 'DD-MM-YYYY HH:mm') => {
  if (!date || typeof date !== 'string' || isNaN(Date.parse(date))) {
    return '—';
  }
  const m = moment(date);
  return m.isValid() ? m.format(format) : '—';
};
