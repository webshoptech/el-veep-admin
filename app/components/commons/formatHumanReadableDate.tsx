import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export function formatHumanReadableDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today, ${format(date, 'h:mma')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mma')}`;
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return `${format(date, 'EEEE')} ${format(date, 'h:mma')}`; // e.g. Friday 12:12am
  }

  return format(date, 'EEEE do, MMMM yyyy'); // e.g. Monday 12th, September 2025
}
