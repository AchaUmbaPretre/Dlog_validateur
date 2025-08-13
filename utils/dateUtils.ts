import moment from 'moment';

export const formatDateSafe = (date?: string | null, format = 'DD-MM-YYYY HH:mm') => {
  if (!date) return '—';
  return moment(date).isValid() ? moment(date).format(format) : '—';
};
