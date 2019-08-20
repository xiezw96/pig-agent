import { format } from 'date-fns';

export function date(v: string) {
  if (!v) return '';
  return format(v, 'YYYY-MM-DD');
}
