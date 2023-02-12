import { computed } from 'vue';
import { calenderSize } from "@/utils/breakpoints";

interface date {
  year: string,
  month: string,
  day: string
}

export const useHorizontalCalendarDates = (date: date) => {

  return computed(() => {
    let arr = [];

    const dd = new Date(`${date.year}-${date.month + 1}-${date.day}`);
    const nextDate = new Date(dd.setDate(dd.getDate() + 1));

    for (let i = 0; i < calenderSize.value; i++) {
      const newDate = new Date(nextDate.setDate(nextDate.getDate() - 1));
      arr.unshift(
        `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
      );
    }
    return arr;
  });

}