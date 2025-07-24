import { DateTime } from 'luxon';

export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}




export function createISODateTime(date: Date, time: string): string | null{
  const [hours, minutes] = time.split(":").map(Number);

  // Treat this as Asia/Kolkata time
  const dt = DateTime.fromObject(
    {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: hours,
      minute: minutes,
    },
    { zone: 'Asia/Kolkata' }
  );

  return dt.toUTC().toISO(); // Return ISO string in UTC
}


export const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  // Create date in UTC to match calendar
  return new Date(Date.UTC(year, month - 1, day));
};