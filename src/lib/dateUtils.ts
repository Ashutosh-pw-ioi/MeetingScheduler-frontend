export const formatDateKey = (date: Date): string => {
  // Use UTC methods to match calendar's UTC dates
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const createISODateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  
  // Create datetime in UTC
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    hours,
    minutes,
    0
  )).toISOString();
};

export const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  // Create date in UTC to match calendar
  return new Date(Date.UTC(year, month - 1, day));
};