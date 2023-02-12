export const generateUniqueId = () => (new Date()).getTime();

export const formatDate = (year: number, month: number, day: number) => `${year}-${month}-${day}`;

export const dayOfWeekOffset = (year: number, month: number) => new Date(year, month, 1).getDay();

export const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const getDayString = (year: number, month: number, day: number) => info.days[new Date(year, month, day).getDay() + 1];


export const isToday = (date: Date) => {
  const today = new Date();
  return today.getFullYear() == date.getFullYear() &&
    today.getMonth() == date.getMonth() &&
    today.getDate() == date.getDate();
}

export const isWeekend = (day: string) => {
  const dayOfWeek = new Date(day).getDay();
  return dayOfWeek == 6 || dayOfWeek == 0
}
export const isFuture = (date: string) => new Date().getTime() < new Date(date).getTime()